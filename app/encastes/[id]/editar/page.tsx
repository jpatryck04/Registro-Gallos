'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import EncastesForm from '@/components/encastes/EncastesForm'
import { ArrowLeft, Lock, Trash2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function EditarEncastesPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(true)
  const [encaste, setEncastes] = useState<any>(null)
  const [error, setError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const id = params.id as string

  useEffect(() => {
    loadCurrentUser()
    loadEncastes()
  }, [id])

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setCurrentUser(user)
    }
  }

  const loadEncastes = async () => {
    const { data, error } = await supabase
      .from('encastes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error cargando encaste:', error)
      setError('No se pudo cargar el encaste')
    } else {
      setEncastes(data)
    }
  }

  const verifyPassword = async (passwordToVerify: string, action: 'edit' | 'delete') => {
    setError('')

    try {
      if (!currentUser) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          throw new Error('Usuario no autenticado')
        }
        setCurrentUser(user)
      }

      // Obtener contraseña del perfil del usuario
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('clave_edicion')
        .eq('id', currentUser.id)
        .single()

      if (profileError) {
        console.error('Error obteniendo perfil:', profileError)
        // Si no existe perfil, usar contraseña por defecto
        if (passwordToVerify === 'Registromipatio2024@') {
          if (action === 'edit') {
            setShowPasswordForm(false)
          } else if (action === 'delete') {
            await handleDeleteEncastes()
          }
          return true
        } else {
          setError('Contraseña incorrecta')
          return false
        }
      }

      if (profileData.clave_edicion === passwordToVerify) {
        if (action === 'edit') {
          setShowPasswordForm(false)
        } else if (action === 'delete') {
          await handleDeleteEncastes()
        }
        return true
      } else {
        setError('Contraseña incorrecta')
        return false
      }
    } catch (error: any) {
      console.error('Error verificando contraseña:', error)
      setError('Error verificando contraseña: ' + error.message)
      return false
    }
  }

  const handleDeleteEncastes = async () => {
    setDeleteLoading(true)
    try {
      // Eliminar imágenes del storage primero
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user && encaste) {
        const imagesToDelete = [
          encaste.imagen_padrote,
          encaste.imagen_gallina,
          encaste.imagen_nido
        ].filter(url => url)

        // Eliminar cada imagen del storage
        for (const imageUrl of imagesToDelete) {
          if (imageUrl) {
            const path = imageUrl.split('/storage/v1/object/public/gallos-imagenes/')[1]
            if (path) {
              await supabase.storage
                .from('gallos-imagenes')
                .remove([path])
            }
          }
        }

        // Eliminar el registro de la base de datos
        const { error: deleteError } = await supabase
          .from('encastes')
          .delete()
          .eq('id', id)

        if (deleteError) throw deleteError

        router.push('/encastes')
        router.refresh()
      }
    } catch (error: any) {
      console.error('Error eliminando encaste:', error)
      setError('Error al eliminar el encaste: ' + error.message)
    } finally {
      setDeleteLoading(false)
      setShowDeleteModal(false)
    }
  }

  const handleSubmit = async (formData: any) => {
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('No hay usuario autenticado')
      }

      // Subir nuevas imágenes si existen
      const uploadImage = async (file: File | null, currentUrl: string | null) => {
        if (!file) return currentUrl
        
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user.id}/encastes/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('gallos-imagenes')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('gallos-imagenes')
          .getPublicUrl(filePath)

        return publicUrl
      }

      // Subir imágenes si hay nuevas
      const [
        imagen_padrote,
        imagen_gallina,
        imagen_nido
      ] = await Promise.all([
        uploadImage(formData.imagen_padrote, encaste.imagen_padrote),
        uploadImage(formData.imagen_gallina, encaste.imagen_gallina),
        uploadImage(formData.imagen_nido, encaste.imagen_nido)
      ])

      // Preparar datos para actualizar
      const encasteData = {
        fecha_encaste: formData.fecha_encaste || encaste.fecha_encaste,
        hora_encaste: formData.hora_encaste || encaste.hora_encaste,
        placa_padrote: formData.placa_padrote || encaste.placa_padrote,
        placa_gallina: formData.placa_gallina || encaste.placa_gallina,
        descripcion_brida: formData.descripcion_brida || encaste.descripcion_brida,
        fecha_primer_huevo: formData.fecha_primer_huevo || encaste.fecha_primer_huevo,
        fecha_ultimo_huevo: formData.fecha_ultimo_huevo || encaste.fecha_ultimo_huevo,
        total_huevos: formData.total_huevos || encaste.total_huevos,
        fecha_inicio_incubacion: formData.fecha_inicio_incubacion || encaste.fecha_inicio_incubacion,
        cantidad_pollos_nacidos: formData.cantidad_pollos_nacidos || encaste.cantidad_pollos_nacidos,
        fecha_nacimiento: formData.fecha_nacimiento || encaste.fecha_nacimiento,
        imagen_padrote,
        imagen_gallina,
        imagen_nido,
        updated_at: new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('encastes')
        .update(encasteData)
        .eq('id', id)

      if (updateError) throw updateError

      router.push(`/encastes/${id}`)
      router.refresh()

    } catch (error: any) {
      console.error('Error actualizando encaste:', error)
      setError(error.message || 'Error al actualizar el encaste')
    } finally {
      setLoading(false)
    }
  }

  if (showPasswordForm) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Lock className="w-12 h-12 text-gray-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Verificación Requerida</h1>
            <p className="text-gray-600 mt-2">
              Ingresa tu contraseña personal de edición para modificar este encaste
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); verifyPassword(password, 'edit'); }}>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Tu Contraseña de Edición
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Ingresa tu contraseña personal"
              />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verificando...' : 'Verificar y Continuar'}
              </button>
              
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  ¿Olvidaste tu contraseña? 
                  <Link href="/configuracion" className="text-blue-600 hover:text-blue-700 ml-1">
                    Configuración
                  </Link>
                </p>
              </div>
            </div>
          </form>

          <div className="mt-6">
            <Link
              href={`/encastes/${id}`}
              className="flex items-center justify-center text-gray-600 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al detalle del encaste
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Eliminar Encastes</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Esta acción eliminará permanentemente el encaste <strong>#{encaste?.id.slice(0, 8).toUpperCase()}</strong> y todas sus imágenes. 
              Esta acción no se puede deshacer.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-700 mb-1">
                Ingresa tu contraseña para confirmar eliminación:
              </label>
              <input
                id="deletePassword"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                placeholder="Tu contraseña personal"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletePassword('')
                  setError('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={deleteLoading}
              >
                Cancelar
              </button>
              <button
                onClick={() => verifyPassword(deletePassword, 'delete')}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? 'Eliminando...' : 'Eliminar Permanentemente'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Encabezado con Botón de Eliminar */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href={`/encastes/${id}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al detalle
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Editar Encastes</h1>
            <p className="text-gray-600 mt-2">
              Modifica los campos que desees actualizar.
            </p>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors self-start"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar Encastes
          </button>
        </div>
      </div>

      {error && !showDeleteModal && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {encaste && (
        <>
          <EncastesForm
            onSubmit={handleSubmit}
            loading={loading}
            submitText="Actualizar Encastes"
            initialData={encaste}
          />

          {/* Sección de Eliminación */}
          <div className="card-modern border-l-4 border-l-red-500">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Zona de Peligro</h3>
                <p className="text-gray-600 mb-4">
                  La eliminación de un encaste borrará toda la información de apareamiento, producción 
                  e incubación. Esta acción es permanente.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar este Encastes
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}