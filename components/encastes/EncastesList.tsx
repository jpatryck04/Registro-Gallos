'use client'

import Link from 'next/link'
import { Encastes } from '@/lib/types'
import { Eye, Edit, Calendar, Egg } from 'lucide-react'

interface EncastesListProps {
  encastes: Encastes[]
}

export default function EncastesList({ encastes }: EncastesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {encastes.map((encaste) => (
        <div
          key={encaste.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Encastes #{encaste.id.slice(0, 8)}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(encaste.fecha_encaste).toLocaleDateString()}</span>
                </div>
              </div>
              
              {encaste.total_huevos > 0 && (
                <div className="flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                  <Egg className="w-4 h-4 mr-1" />
                  {encaste.total_huevos} huevos
                </div>
              )}
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Padrote</p>
                  <p className="font-medium">{encaste.placa_padrote}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gallina</p>
                  <p className="font-medium">{encaste.placa_gallina}</p>
                </div>
              </div>
              
              {encaste.descripcion_brida && (
                <div>
                  <p className="text-sm text-gray-500">Brida/Tairra</p>
                  <p className="font-medium">{encaste.descripcion_brida}</p>
                </div>
              )}
              
              {encaste.cantidad_pollos_nacidos > 0 && (
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm text-green-800">
                    Nacieron {encaste.cantidad_pollos_nacidos} pollos
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between pt-4 border-t border-gray-100">
              <Link
                href={`/encastes/${encaste.id}`}
                className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <Eye className="w-4 h-4 mr-1" />
                Ver Detalles
              </Link>
              
              <Link
                href={`/encastes/${encaste.id}`}
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