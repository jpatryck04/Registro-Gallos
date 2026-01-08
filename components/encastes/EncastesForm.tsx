'use client'

import { useState } from 'react'
import { Egg, Calendar, Clock, Image as ImageIcon } from 'lucide-react'

interface EncastesFormProps {
  onSubmit: (data: any) => void
  loading: boolean
  submitText: string
  initialData?: any
}

export default function EncastesForm({ 
  onSubmit, 
  loading, 
  submitText, 
  initialData 
}: EncastesFormProps) {
  const [formData, setFormData] = useState({
    fecha_encaste: initialData?.fecha_encaste?.split('T')[0] || '',
    hora_encaste: initialData?.hora_encaste || '',
    placa_padrote: initialData?.placa_padrote || '',
    placa_gallina: initialData?.placa_gallina || '',
    descripcion_brida: initialData?.descripcion_brida || '',
    fecha_primer_huevo: initialData?.fecha_primer_huevo?.split('T')[0] || '',
    fecha_ultimo_huevo: initialData?.fecha_ultimo_huevo?.split('T')[0] || '',
    total_huevos: initialData?.total_huevos || 0,
    fecha_inicio_incubacion: initialData?.fecha_inicio_incubacion?.split('T')[0] || '',
    cantidad_pollos_nacidos: initialData?.cantidad_pollos_nacidos || 0,
    fecha_nacimiento: initialData?.fecha_nacimiento?.split('T')[0] || '',
  })

  const [images, setImages] = useState({
    imagen_padrote: null as File | null,
    imagen_gallina: null as File | null,
    imagen_nido: null as File | null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseInt(value) || 0 : value 
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0] || null
    setImages(prev => ({ ...prev, [field]: file }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, ...images })
  }

  const ImageUpload = ({ 
    field, 
    label, 
    currentImage 
  }: { 
    field: string, 
    label: string, 
    currentImage?: string 
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, field)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        {currentImage && (
          <div className="relative w-16 h-16">
            <img
              src={currentImage}
              alt={label}
              className="w-16 h-16 object-cover rounded-md border"
            />
          </div>
        )}
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-8">
        {/* Sección 1: Datos del encaste */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center">
            <Egg className="w-5 h-5 mr-2" />
            1. Datos del Encastes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha del Encastes *
              </label>
              <input
                type="date"
                name="fecha_encaste"
                value={formData.fecha_encaste}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora del Encastes
              </label>
              <input
                type="time"
                name="hora_encaste"
                value={formData.hora_encaste}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placa del Padrote *
              </label>
              <input
                type="text"
                name="placa_padrote"
                value={formData.placa_padrote}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Número + Color"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placa de la Gallina *
              </label>
              <input
                type="text"
                name="placa_gallina"
                value={formData.placa_gallina}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Número + Color"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción de Brida/Tairra
            </label>
            <input
              type="text"
              name="descripcion_brida"
              value={formData.descripcion_brida}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Brida roja en ala derecha"
            />
          </div>
        </div>

        {/* Sección 2: Imágenes */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
            2. Imágenes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              field="imagen_padrote"
              label="Imagen del Padrote"
              currentImage={initialData?.imagen_padrote}
            />
            <ImageUpload
              field="imagen_gallina"
              label="Imagen de la Gallina"
              currentImage={initialData?.imagen_gallina}
            />
          </div>
        </div>

        {/* Sección 3: Producción de huevos */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center">
            <Egg className="w-5 h-5 mr-2" />
            3. Producción de Huevos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Primer Huevo
              </label>
              <input
                type="date"
                name="fecha_primer_huevo"
                value={formData.fecha_primer_huevo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Último Huevo
              </label>
              <input
                type="date"
                name="fecha_ultimo_huevo"
                value={formData.fecha_ultimo_huevo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total de Huevos
              </label>
              <input
                type="number"
                name="total_huevos"
                value={formData.total_huevos}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <ImageUpload
              field="imagen_nido"
              label="Imagen del Nido de Huevos"
              currentImage={initialData?.imagen_nido}
            />
          </div>
        </div>

        {/* Sección 4: Incubación */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
            4. Incubación
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio Incubación
              </label>
              <input
                type="date"
                name="fecha_inicio_incubacion"
                value={formData.fecha_inicio_incubacion}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad Pollos Nacidos
              </label>
              <input
                type="number"
                name="cantidad_pollos_nacidos"
                value={formData.cantidad_pollos_nacidos}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Procesando...' : submitText}
          </button>
        </div>
      </div>
    </form>
  )
}