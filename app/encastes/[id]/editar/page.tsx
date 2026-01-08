'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import EncastesForm from '@/components/encastes/EncastesForm'
import { ArrowLeft, Lock } from 'lucide-react'
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

  const id = params.id as string

  useEffect(() => {
    loadEncastes()
  }, [id])

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

  const verifyPassword = async () => {
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase
        .from('configuracion')
        .select('clave_edicion')
        .single()

      if (error) throw error

      if (data.clave_edicion === password) {
        setShowPasswordForm(false)
      } else {
        setError('Contraseña incorrecta')
      }
    } catch (error: any) {
      setError('Error verificando contraseña')
    } finally {
      setLoading(false)
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
              Ingresa la contraseña de edición para modificar este encaste
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); verifyPassword(); }}>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña de Edición
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verificando...' : 'Verificar y Continuar'}
            </button>
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
    <div>
      <div className="mb-6">
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {encaste && (
        <EncastesForm
          onSubmit={handleSubmit}
          loading={loading}
          submitText="Actualizar Encastes"
          initialData={encaste}
        />
      )}
    </div>
  )
}