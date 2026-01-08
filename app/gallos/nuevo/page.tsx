'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import GalloForm from '@/components/gallos/GalloForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NuevoGalloPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (formData: any) => {
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('No hay usuario autenticado')
      }

      // Subir imágenes si existen
      const uploadImage = async (file: File | null) => {
        if (!file) return null
        
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

      // Subir todas las imágenes
      const [
        foto_gallo,
        foto_padre,
        foto_madre,
        foto_abuelo,
        foto_abuela
      ] = await Promise.all([
        uploadImage(formData.foto_gallo),
        uploadImage(formData.foto_padre),
        uploadImage(formData.foto_madre),
        uploadImage(formData.foto_abuelo),
        uploadImage(formData.foto_abuela)
      ])

      // Preparar datos para insertar
      const galloData = {
        user_id: user.id,
        nombre: formData.nombre,
        padre: formData.padre || null,
        madre: formData.madre || null,
        abuelo: formData.abuelo || null,
        abuela: formData.abuela || null,
        placa_gallo: formData.placa_gallo || null,
        placa_padre: formData.placa_padre || null,
        placa_madre: formData.placa_madre || null,
        placa_abuelo: formData.placa_abuelo || null,
        placa_abuela: formData.placa_abuela || null,
        fecha_marcado: formData.fecha_marcado || null,
        color_general: formData.color_general || null,
        color_patas: formData.color_patas || null,
        tipo_cresta: formData.tipo_cresta || null,
        descripcion: formData.descripcion || null,
        tipo_brida: formData.tipo_brida || null,
        numero_brida: formData.numero_brida || null,
        color_brida: formData.color_brida || null,
        ubicacion_brida: formData.ubicacion_brida || null,
        foto_gallo,
        foto_padre,
        foto_madre,
        foto_abuelo,
        foto_abuela
      }

      const { error: insertError } = await supabase
        .from('gallos')
        .insert([galloData])

      if (insertError) throw insertError

      router.push('/gallos')
      router.refresh()

    } catch (error: any) {
      console.error('Error registrando gallo:', error)
      setError(error.message || 'Error al registrar el gallo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/gallos"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la lista
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Registrar Nuevo Gallo</h1>
        <p className="text-gray-600 mt-2">
          Completa todos los campos para registrar un nuevo gallo en el sistema.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <GalloForm
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Registrar Gallo"
      />
    </div>
  )
}