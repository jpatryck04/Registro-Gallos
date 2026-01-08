'use client'

import Link from 'next/link'
import { Gallo } from '@/lib/types'
import { Eye, Edit, Calendar, Tag } from 'lucide-react'

interface GallosListProps {
  gallos: Gallo[]
}

export default function GallosList({ gallos }: GallosListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gallos.map((gallo) => (
        <div
          key={gallo.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          {gallo.foto_gallo ? (
            <img
              src={gallo.foto_gallo}
              alt={gallo.nombre}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <Tag className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {gallo.nombre}
              </h3>
              {gallo.placa_gallo && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                  {gallo.placa_gallo}
                </span>
              )}
            </div>
            
            <div className="space-y-2 mb-4">
              {gallo.color_general && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Color:</span>
                  <span>{gallo.color_general}</span>
                </div>
              )}
              
              {gallo.fecha_marcado && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Marcado: {new Date(gallo.fecha_marcado).toLocaleDateString()}</span>
                </div>
              )}
              
              {gallo.padre && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Padre:</span> {gallo.padre}
                </div>
              )}
            </div>
            
            <div className="flex justify-between pt-4 border-t border-gray-100">
              <Link
                href={`/gallos/${gallo.id}`}
                className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <Eye className="w-4 h-4 mr-1" />
                Ver Detalles
              </Link>
              
              <Link
                href={`/gallos/${gallo.id}/editar`}
                className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}