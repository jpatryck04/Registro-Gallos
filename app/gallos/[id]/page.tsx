'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  Tag, 
  Users, 
  Palette,
  Feather,
  MapPin,
  Trash2
} from 'lucide-react'
import Image from 'next/image'
import DeleteModal from '@/components/ui/DeleteModal'

interface PageProps {
  params: {
    id: string
  }
}

export default function GalloDetailPage({ params }: PageProps) {
  const router = useRouter()
  const [gallo, setGallo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadGallo()
  }, [params.id])

  const loadGallo = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('gallos')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', session.user.id)
        .single()

      if (error || !data) {
        notFound()
      }

      setGallo(data)
    } catch (error) {
      console.error('Error cargando gallo:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (password: string) => {
    try {
      // Verificar contraseña
      const { data: config } = await supabase
        .from('configuracion')
        .select('clave_edicion')
        .single()

      if (!config || config.clave_edicion !== password) {
        throw new Error('Contraseña incorrecta')
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (user && gallo) {
        // Eliminar imágenes del storage
        const imagesToDelete = [
          gallo.foto_gallo,
          gallo.foto_padre,
          gallo.foto_madre,
          gallo.foto_abuelo,
          gallo.foto_abuela
        ].filter(url => url)

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
          .from('gallos')
          .delete()
          .eq('id', params.id)

        if (deleteError) throw deleteError

        router.push('/gallos')
        router.refresh()
      }
    } catch (error: any) {
      console.error('Error eliminando gallo:', error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="loader-chicken mx-auto mb-4" />
          <p className="text-slate-600">Cargando información del gallo...</p>
        </div>
      </div>
    )
  }

  if (!gallo) {
    notFound()
  }

  const DetailItem = ({ 
    icon: Icon, 
    label, 
    value 
  }: { 
    icon: any, 
    label: string, 
    value: string 
  }) => (
    <div className="flex items-start space-x-3">
      <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-gray-900">{value || 'No especificado'}</p>
      </div>
    </div>
  )

  const ImageSection = ({ 
    title, 
    url, 
    alt 
  }: { 
    title: string, 
    url?: string, 
    alt: string 
  }) => (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-medium text-gray-900 mb-3">{title}</h3>
      {url ? (
        <div className="relative h-48 rounded-md overflow-hidden">
          <Image
            src={url}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
          <Feather className="w-12 h-12 text-gray-400" />
        </div>
      )}
    </div>
  )

  return (
    <>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Eliminar Gallo"
        description="Acción permanente e irreversible"
        itemName={gallo.nombre}
        itemType="gallo"
      />

      <div className="space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              href="/gallos"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la lista
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{gallo.nombre}</h1>
              {gallo.placa_gallo && (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {gallo.placa_gallo}
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-2">
              Registrado el {new Date(gallo.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/gallos/${gallo.id}/editar`}
              className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-glow-green transition-all duration-300"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Gallo
            </Link>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:shadow-glow transition-all duration-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Imagen principal */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-64">
                {gallo.foto_gallo ? (
                  <Image
                    src={gallo.foto_gallo}
                    alt={gallo.nombre}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Feather className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <DetailItem
                    icon={Calendar}
                    label="Fecha de Marcado"
                    value={gallo.fecha_marcado ? new Date(gallo.fecha_marcado).toLocaleDateString() : 'No especificada'}
                  />
                  
                  <DetailItem
                    icon={Palette}
                    label="Color General"
                    value={gallo.color_general}
                  />
                  
                  <DetailItem
                    icon={Palette}
                    label="Color de Patas"
                    value={gallo.color_patas}
                  />
                  
                  <DetailItem
                    icon={Feather}
                    label="Tipo de Cresta"
                    value={gallo.tipo_cresta}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Columna central - Información detallada */}
          <div className="lg:col-span-2 space-y-6">
            {/* Genealogía */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Genealogía
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Ascendencia</h3>
                  <div className="space-y-2">
                    <DetailItem
                      icon={Users}
                      label="Padre"
                      value={gallo.padre}
                    />
                    <DetailItem
                      icon={Users}
                      label="Madre"
                      value={gallo.madre}
                    />
                    <DetailItem
                      icon={Users}
                      label="Abuelo"
                      value={gallo.abuelo}
                    />
                    <DetailItem
                      icon={Users}
                      label="Abuela"
                      value={gallo.abuela}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Placas</h3>
                  <div className="space-y-2">
                    <DetailItem
                      icon={Tag}
                      label="Placa del Gallo"
                      value={gallo.placa_gallo}
                    />
                    <DetailItem
                      icon={Tag}
                      label="Placa del Padre"
                      value={gallo.placa_padre}
                    />
                    <DetailItem
                      icon={Tag}
                      label="Placa de la Madre"
                      value={gallo.placa_madre}
                    />
                    <DetailItem
                      icon={Tag}
                      label="Placa del Abuelo"
                      value={gallo.placa_abuelo}
                    />
                    <DetailItem
                      icon={Tag}
                      label="Placa de la Abuela"
                      value={gallo.placa_abuela}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Brida/Tairra */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Brida / Tairra</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <DetailItem
                    icon={Tag}
                    label="Tipo"
                    value={gallo.tipo_brida === 'brida' ? 'Brida de Nylon' : gallo.tipo_brida === 'tairra' ? 'Tairra' : 'No especificado'}
                  />
                  <DetailItem
                    icon={Tag}
                    label="Numeración"
                    value={gallo.numero_brida}
                  />
                </div>
                <div className="space-y-3">
                  <DetailItem
                    icon={Palette}
                    label="Color"
                    value={gallo.color_brida}
                  />
                  <DetailItem
                    icon={MapPin}
                    label="Ubicación"
                    value={gallo.ubicacion_brida}
                  />
                </div>
              </div>
            </div>

            {/* Descripción */}
            {gallo.descripcion && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h2>
                <p className="text-gray-700 whitespace-pre-line">{gallo.descripcion}</p>
              </div>
            )}
          </div>
        </div>

        {/* Imágenes de la genealogía */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Imágenes Genealógicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ImageSection
              title="Padre"
              url={gallo.foto_padre}
              alt={`Padre de ${gallo.nombre}`}
            />
            <ImageSection
              title="Madre"
              url={gallo.foto_madre}
              alt={`Madre de ${gallo.nombre}`}
            />
            <ImageSection
              title="Abuelo"
              url={gallo.foto_abuelo}
              alt={`Abuelo de ${gallo.nombre}`}
            />
            <ImageSection
              title="Abuela"
              url={gallo.foto_abuela}
              alt={`Abuela de ${gallo.nombre}`}
            />
          </div>
        </div>

        {/* Información de registro */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <p>
            <span className="font-medium">ID del registro:</span> {gallo.id}
          </p>
          <p>
            <span className="font-medium">Última actualización:</span> {new Date(gallo.updated_at).toLocaleString('es-ES')}
          </p>
        </div>
      </div>
    </>
  )
}