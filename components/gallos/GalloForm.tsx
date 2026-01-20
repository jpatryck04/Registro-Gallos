'use client'

import { useState } from 'react'
import { Camera, Image as ImageIcon } from 'lucide-react'

interface GalloFormProps {
  onSubmit: (data: any) => void
  loading: boolean
  submitText: string
  initialData?: any
}

export default function GalloForm({ 
  onSubmit, 
  loading, 
  submitText, 
  initialData 
}: GalloFormProps) {
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    padre: initialData?.padre || '',
    madre: initialData?.madre || '',
    abuelo: initialData?.abuelo || '',
    abuela: initialData?.abuela || '',
    placa_gallo: initialData?.placa_gallo || '',
    placa_padre: initialData?.placa_padre || '',
    placa_madre: initialData?.placa_madre || '',
    placa_abuelo: initialData?.placa_abuelo || '',
    placa_abuela: initialData?.placa_abuela || '',
    fecha_marcado: initialData?.fecha_marcado?.split('T')[0] || '',
    color_general: initialData?.color_general || '',
    color_patas: initialData?.color_patas || '',
    tipo_cresta: initialData?.tipo_cresta || '',
    descripcion: initialData?.descripcion || '',
    tipo_brida: initialData?.tipo_brida || '',
    numero_brida: initialData?.numero_brida || '',
    color_brida: initialData?.color_brida || '',
    ubicacion_brida: initialData?.ubicacion_brida || '',
  })

  const [images, setImages] = useState({
    foto_gallo: null as File | null,
    foto_padre: null as File | null,
    foto_madre: null as File | null,
    foto_abuelo: null as File | null,
    foto_abuela: null as File | null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0] || null
    setImages(prev => ({ ...prev, [field]: file }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, ...images })
  }

  const ImageUpload = ({ field, label, currentImage }: { field: string, label: string, currentImage?: string }) => (
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
        {/* Sección 1: Datos básicos */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
            1. Datos Básicos del Gallo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Gallo *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Marcado
              </label>
              <input
                type="date"
                name="fecha_marcado"
                value={formData.fecha_marcado}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Sección 2: Genealogía */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
            2. Genealogía
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Ascendencia</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Padre
                  </label>
                  <input
                    type="text"
                    name="padre"
                    value={formData.padre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Madre
                  </label>
                  <input
                    type="text"
                    name="madre"
                    value={formData.madre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Abuelo
                  </label>
                  <input
                    type="text"
                    name="abuelo"
                    value={formData.abuelo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Abuela
                  </label>
                  <input
                    type="text"
                    name="abuela"
                    value={formData.abuela}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Placas</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Placa del Padre
                  </label>
                  <input
                    type="text"
                    name="placa_padre"
                    value={formData.placa_padre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Placa de la Madre
                  </label>
                  <input
                    type="text"
                    name="placa_madre"
                    value={formData.placa_madre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Placa del Abuelo
                  </label>
                  <input
                    type="text"
                    name="placa_abuelo"
                    value={formData.placa_abuelo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Placa de la Abuela
                  </label>
                  <input
                    type="text"
                    name="placa_abuela"
                    value={formData.placa_abuela}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Placa del Gallo centrada */}
  <div className="col-span-full max-w-md mx-auto">
    <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
      Placa del Gallo
    </label>
    <input
      type="text"
      name="placa_gallo"
      value={formData.placa_gallo}
      onChange={handleInputChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Número + Color"
    />
  </div>
        </div>

        {/* Sección 3: Rasgos físicos */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
            3. Rasgos Físicos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color General
              </label>
              <input
                type="text"
                name="color_general"
                value={formData.color_general}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Colorado, Negro, Blanco"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color de Patas
              </label>
              <input
                type="text"
                name="color_patas"
                value={formData.color_patas}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Amarillas, Verdes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Cresta
              </label>
              <select
                name="tipo_cresta"
                value={formData.tipo_cresta}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar</option>
                <option value="Peine">Peine</option>
                <option value="Rosa">Rosa</option>
                <option value="Motón">Motón</option>
                <option value="Nula">Nula</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción General
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción adicional del gallo..."
            />
          </div>
        </div>

        {/* Sección 4: Brida/Tairra */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
            4. Brida / Tairra
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  name="tipo_brida"
                  value={formData.tipo_brida}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar</option>
                  <option value="Brida-Tairra">Brida de Nylon - Tairra</option>
                  <option value="Alambre">Alambre</option>
                  <option value="Hilo">Hilo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numeración
                </label>
                <input
                  type="text"
                  name="numero_brida"
                  value={formData.numero_brida}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  name="color_brida"
                  value={formData.color_brida}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Rojo, Azul, Verde"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  name="ubicacion_brida"
                  value={formData.ubicacion_brida}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Ala derecha, Pata izquierda"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sección 5: Imágenes */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
            5. Imágenes
          </h2>
          <div className="space-y-6">
            <ImageUpload
              field="foto_gallo"
              label="Foto del Gallo"
              currentImage={initialData?.foto_gallo}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUpload
                field="foto_padre"
                label="Foto del Padre"
                currentImage={initialData?.foto_padre}
              />
              <ImageUpload
                field="foto_madre"
                label="Foto de la Madre"
                currentImage={initialData?.foto_madre}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUpload
                field="foto_abuelo"
                label="Foto del Abuelo"
                currentImage={initialData?.foto_abuelo}
              />
              <ImageUpload
                field="foto_abuela"
                label="Foto de la Abuela"
                currentImage={initialData?.foto_abuela}
              />
            </div>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Procesando...' : submitText}
          </button>
        </div>
      </div>
    </form>
  )
}