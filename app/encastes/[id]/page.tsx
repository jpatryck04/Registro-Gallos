import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  Clock, 
  Egg, 
  Users,
  Feather,
  Hash,
  Baby,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Image from 'next/image'
import { formatDate, formatDateTime } from '@/lib/utils'

interface PageProps {
  params: {
    id: string
  }
}

export default async function EncastesDetailPage({ params }: PageProps) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    notFound()
  }

  const { data: encaste, error } = await supabase
    .from('encastes')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single()

  if (error || !encaste) {
    notFound()
  }

  const DetailItem = ({ 
    icon: Icon, 
    label, 
    value,
    highlight = false
  }: { 
    icon: any, 
    label: string, 
    value: string | number,
    highlight?: boolean
  }) => (
    <div className={`flex items-start space-x-3 p-3 rounded-lg ${highlight ? 'bg-blue-50 border border-blue-100' : ''}`}>
      <Icon className={`w-5 h-5 mt-0.5 ${highlight ? 'text-blue-600' : 'text-gray-400'}`} />
      <div className="flex-1">
        <p className={`text-sm font-medium ${highlight ? 'text-blue-700' : 'text-gray-500'}`}>{label}</p>
        <p className={`${highlight ? 'text-blue-900 font-semibold' : 'text-gray-900'}`}>
          {value || 'No especificado'}
        </p>
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
    <div className="bg-white rounded-lg shadow-sm border p-4">
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
        <div className="h-48 bg-gray-50 rounded-md flex flex-col items-center justify-center text-gray-400">
          <Feather className="w-12 h-12 mb-2" />
          <p className="text-sm">Sin imagen</p>
        </div>
      )}
    </div>
  )

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusConfig = (status: string) => {
      switch (status) {
        case 'completado':
          return { color: 'bg-green-100 text-green-800', icon: CheckCircle }
        case 'incubando':
          return { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle }
        case 'pendiente':
          return { color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
        default:
          return { color: 'bg-blue-100 text-blue-800', icon: AlertCircle }
      }
    }

    const config = getStatusConfig(status)
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  // Determinar el estado del encaste
  const getEncastesStatus = () => {
    if (encaste.cantidad_pollos_nacidos > 0) return 'completado'
    if (encaste.fecha_inicio_incubacion) return 'incubando'
    return 'pendiente'
  }

  const status = getEncastesStatus()

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/encastes"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la lista
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              Encastes #{encaste.id.slice(0, 8).toUpperCase()}
            </h1>
            <StatusBadge status={status} />
          </div>
          <p className="text-gray-600 mt-2">
            Registrado el {formatDateTime(encaste.created_at)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/encastes/${encaste.id}/editar`}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Encastes
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Información principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información básica */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Información del Encastes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem
                icon={Calendar}
                label="Fecha del Encastes"
                value={formatDate(encaste.fecha_encaste)}
                highlight
              />
              
              {encaste.hora_encaste && (
                <DetailItem
                  icon={Clock}
                  label="Hora del Encastes"
                  value={encaste.hora_encaste}
                />
              )}
              
              <DetailItem
                icon={Hash}
                label="Placa del Padrote"
                value={encaste.placa_padrote}
              />
              
              <DetailItem
                icon={Hash}
                label="Placa de la Gallina"
                value={encaste.placa_gallina}
              />
              
              {encaste.descripcion_brida && (
                <DetailItem
                  icon={Feather}
                  label="Brida/Tairra"
                  value={encaste.descripcion_brida}
                />
              )}
            </div>
          </div>

          {/* Producción de huevos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Egg className="w-5 h-5 mr-2" />
              Producción de Huevos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {encaste.fecha_primer_huevo && (
                <DetailItem
                  icon={Calendar}
                  label="Fecha Primer Huevo"
                  value={formatDate(encaste.fecha_primer_huevo)}
                />
              )}
              
              {encaste.fecha_ultimo_huevo && (
                <DetailItem
                  icon={Calendar}
                  label="Fecha Último Huevo"
                  value={formatDate(encaste.fecha_ultimo_huevo)}
                />
              )}
              
              <DetailItem
                icon={Egg}
                label="Total de Huevos"
                value={encaste.total_huevos}
                highlight={encaste.total_huevos > 0}
              />
            </div>
            
            {/* Imagen del nido */}
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Imagen del Nido</h3>
              {encaste.imagen_nido ? (
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={encaste.imagen_nido}
                    alt="Nido de huevos"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="h-64 bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-400">
                  <Egg className="w-12 h-12 mb-2" />
                  <p className="text-sm">No hay imagen del nido</p>
                </div>
              )}
            </div>
          </div>

          {/* Incubación */}
          {encaste.fecha_inicio_incubacion && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Baby className="w-5 h-5 mr-2" />
                Incubación
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DetailItem
                  icon={Calendar}
                  label="Fecha Inicio Incubación"
                  value={formatDate(encaste.fecha_inicio_incubacion)}
                  highlight
                />
                
                <DetailItem
                  icon={Baby}
                  label="Pollos Nacidos"
                  value={encaste.cantidad_pollos_nacidos}
                  highlight={encaste.cantidad_pollos_nacidos > 0}
                />
                
                {encaste.fecha_nacimiento && (
                  <DetailItem
                    icon={Calendar}
                    label="Fecha de Nacimiento"
                    value={formatDate(encaste.fecha_nacimiento)}
                  />
                )}
              </div>
              
              {/* Notas de incubación */}
              {encaste.cantidad_pollos_nacidos > 0 && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-medium text-green-800">¡Encastes Exitoso!</h3>
                  </div>
                  <p className="text-green-700 mt-2 text-sm">
                    Nacieron {encaste.cantidad_pollos_nacidos} pollo{encaste.cantidad_pollos_nacidos > 1 ? 's' : ''} el {formatDate(encaste.fecha_nacimiento || '')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Columna derecha - Imágenes y estadísticas */}
        <div className="space-y-6">
          {/* Estadísticas rápidas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Estadísticas</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-700">Huevos Producidos</p>
                  <p className="text-2xl font-bold text-blue-900">{encaste.total_huevos}</p>
                </div>
                <Egg className="w-8 h-8 text-blue-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-700">Pollos Nacidos</p>
                  <p className="text-2xl font-bold text-green-900">{encaste.cantidad_pollos_nacidos}</p>
                </div>
                <Baby className="w-8 h-8 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-purple-700">Días desde encaste</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {Math.floor((new Date().getTime() - new Date(encaste.fecha_encaste).getTime()) / (1000 * 3600 * 24))}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Imágenes de los padres */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Imágenes de los Padres</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Padrote: {encaste.placa_padrote}</h3>
                <ImageSection
                  title=""
                  url={encaste.imagen_padrote}
                  alt={`Padrote ${encaste.placa_padrote}`}
                />
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Gallina: {encaste.placa_gallina}</h3>
                <ImageSection
                  title=""
                  url={encaste.imagen_gallina}
                  alt={`Gallina ${encaste.placa_gallina}`}
                />
              </div>
            </div>
          </div>

          {/* Notas importantes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <h3 className="font-medium text-yellow-800">Notas</h3>
            </div>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Este registro es editable en cualquier momento</li>
              <li>• Actualiza la información según avance el proceso</li>
              <li>• Las imágenes se pueden cambiar cuando sea necesario</li>
              <li>• Mantén un seguimiento regular de los cambios</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Información de registro */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="font-medium">ID del registro:</p>
            <p className="font-mono text-xs break-all">{encaste.id}</p>
          </div>
          <div>
            <p className="font-medium">Fecha de creación:</p>
            <p>{formatDateTime(encaste.created_at)}</p>
          </div>
          <div>
            <p className="font-medium">Última actualización:</p>
            <p>{formatDateTime(encaste.updated_at)}</p>
          </div>
        </div>
      </div>

      {/* Timeline del proceso */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Progreso del Encastes</h2>
        
        <div className="relative">
          {/* Línea de tiempo */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-8">
            {/* Paso 1: Encastes */}
            <div className="relative flex items-start">
              <div className="absolute left-6 top-0 -ml-4">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="ml-16">
                <h3 className="font-semibold text-gray-900">Encastes Realizado</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {formatDate(encaste.fecha_encaste)} {encaste.hora_encaste && `a las ${encaste.hora_encaste}`}
                </p>
                <p className="text-gray-600 text-sm">
                  Padrote: {encaste.placa_padrote} • Gallina: {encaste.placa_gallina}
                </p>
              </div>
            </div>

            {/* Paso 2: Producción de huevos */}
            {encaste.fecha_primer_huevo && (
              <div className="relative flex items-start">
                <div className="absolute left-6 top-0 -ml-4">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    encaste.total_huevos > 0 ? 'bg-green-600' : 'bg-gray-300'
                  }`}>
                    <Egg className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="ml-16">
                  <h3 className="font-semibold text-gray-900">Producción de Huevos</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Primer huevo: {formatDate(encaste.fecha_primer_huevo)}
                    {encaste.fecha_ultimo_huevo && ` • Último huevo: ${formatDate(encaste.fecha_ultimo_huevo)}`}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Total: {encaste.total_huevos} huevo{encaste.total_huevos !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}

            {/* Paso 3: Incubación */}
            {encaste.fecha_inicio_incubacion && (
              <div className="relative flex items-start">
                <div className="absolute left-6 top-0 -ml-4">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    encaste.cantidad_pollos_nacidos > 0 ? 'bg-green-600' : 'bg-yellow-600'
                  }`}>
                    <Baby className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="ml-16">
                  <h3 className="font-semibold text-gray-900">Incubación</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Iniciada el {formatDate(encaste.fecha_inicio_incubacion)}
                  </p>
                  {encaste.cantidad_pollos_nacidos > 0 ? (
                    <p className="text-green-700 text-sm font-medium">
                      ¡Nacieron {encaste.cantidad_pollos_nacidos} pollo{encaste.cantidad_pollos_nacidos > 1 ? 's' : ''}!
                    </p>
                  ) : (
                    <p className="text-yellow-700 text-sm">En proceso de incubación</p>
                  )}
                </div>
              </div>
            )}

            {/* Paso 4: Completado */}
            {encaste.cantidad_pollos_nacidos > 0 && (
              <div className="relative flex items-start">
                <div className="absolute left-6 top-0 -ml-4">
                  <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="ml-16">
                  <h3 className="font-semibold text-gray-900">Encastes Completado</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Nacimiento: {formatDate(encaste.fecha_nacimiento || '')}
                  </p>
                  <p className="text-green-700 text-sm font-medium">
                    Proceso completado exitosamente
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}