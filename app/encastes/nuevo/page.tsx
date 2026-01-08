'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import EncastesForm from '@/components/encastes/EncastesForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NuevoEncastesPage() {
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

      // Subir imágenes
      const [
        imagen_padrote,
        imagen_gallina,
        imagen_nido
      ] = await Promise.all([
        uploadImage(formData.imagen_padrote),
        uploadImage(formData.imagen_gallina),
        uploadImage(formData.imagen_nido)
      ])

      // Preparar datos para insertar
      const encasteData = {
        user_id: user.id,
        fecha_encaste: formData.fecha_encaste,
        hora_encaste: formData.hora_encaste || null,
        placa_padrote: formData.placa_padrote,
        placa_gallina: formData.placa_gallina,
        descripcion_brida: formData.descripcion_brida || null,
        imagen_padrote,
        imagen_gallina,
        fecha_primer_huevo: formData.fecha_primer_huevo || null,
        fecha_ultimo_huevo: formData.fecha_ultimo_huevo || null,
        total_huevos: formData.total_huevos || 0,
        imagen_nido,
        fecha_inicio_incubacion: formData.fecha_inicio_incubacion || null,
        cantidad_pollos_nacidos: formData.cantidad_pollos_nacidos || 0,
        fecha_nacimiento: formData.fecha_nacimiento || null,
      }

      const { error: insertError } = await supabase
        .from('encastes')
        .insert([encasteData])

      if (insertError) throw insertError

      router.push('/encastes')
      router.refresh()

    } catch (error: any) {
      console.error('Error registrando encaste:', error)
      setError(error.message || 'Error al registrar el encaste')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/encastes"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la lista
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Registrar Nuevo Encastes</h1>
        <p className="text-gray-600 mt-2">
          Completa todos los campos para registrar un nuevo encaste en el sistema.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <EncastesForm
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Registrar Encastes"
      />
    </div>
  )
}