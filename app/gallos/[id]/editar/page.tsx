'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import GalloForm from '@/components/gallos/GalloForm'
import { ArrowLeft, Lock } from 'lucide-react'
import Link from 'next/link'

export default function EditarGalloPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(true)
  const [gallo, setGallo] = useState<any>(null)
  const [error, setError] = useState('')

  const id = params.id as string

  useEffect(() => {
    loadGallo()
  }, [id])

  const loadGallo = async () => {
    const { data, error } = await supabase
      .from('gallos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error cargando gallo:', error)
      setError('No se pudo cargar el gallo')
    } else {
      setGallo(data)
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
        const filePath = `${user.id}/${fileName}`

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
        foto_gallo,
        foto_padre,
        foto_madre,
        foto_abuelo,
        foto_abuela
      ] = await Promise.all([
        uploadImage(formData.foto_gallo, gallo.foto_gallo),
        uploadImage(formData.foto_padre, gallo.foto_padre),
        uploadImage(formData.foto_madre, gallo.foto_madre),
        uploadImage(formData.foto_abuelo, gallo.foto_abuelo),
        uploadImage(formData.foto_abuela, gallo.foto_abuela)
      ])

      // Actualizar datos
      const galloData = {
        nombre: formData.nombre || gallo.nombre,
        padre: formData.padre || gallo.padre,
        madre: formData.madre || gallo.madre,
        abuelo: formData.abuelo || gallo.abuelo,
        abuela: formData.abuela || gallo.abuela,
        placa_gallo: formData.placa_gallo || gallo.placa_gallo,
        placa_padre: formData.placa_padre || gallo.placa_padre,
        placa_madre: formData.placa_madre || gallo.placa_madre,
        placa_abuelo: formData.placa_abuelo || gallo.placa_abuelo,
        placa_abuela: formData.placa_abuela || gallo.placa_abuela,
        fecha_marcado: formData.fecha_marcado || gallo.fecha_marcado,
        color_general: formData.color_general || gallo.color_general,
        color_patas: formData.color_patas || gallo.color_patas,
        tipo_cresta: formData.tipo_cresta || gallo.tipo_cresta,
        descripcion: formData.descripcion || gallo.descripcion,
        tipo_brida: formData.tipo_brida || gallo.tipo_brida,
        numero_brida: formData.numero_brida || gallo.numero_brida,
        color_brida: formData.color_brida || gallo.color_brida,
        ubicacion_brida: formData.ubicacion_brida || gallo.ubicacion_brida,
        foto_gallo,
        foto_padre,
        foto_madre,
        foto_abuelo,
        foto_abuela,
        updated_at: new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('gallos')
        .update(galloData)
        .eq('id', id)

      if (updateError) throw updateError

      router.push(`/gallos/${id}`)
      router.refresh()

    } catch (error: any) {
      console.error('Error actualizando gallo:', error)
      setError(error.message || 'Error al actualizar el gallo')
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
              Ingresa la contraseña de edición para modificar este gallo
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
              href={`/gallos/${id}`}
              className="flex items-center justify-center text-gray-600 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al detalle del gallo
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
          href={`/gallos/${id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al detalle
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Editar Gallo</h1>
        <p className="text-gray-600 mt-2">
          Modifica los campos que desees actualizar.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {gallo && (
        <GalloForm
          onSubmit={handleSubmit}
          loading={loading}
          submitText="Actualizar Gallo"
          initialData={gallo}
        />
      )}
    </div>
  )
}