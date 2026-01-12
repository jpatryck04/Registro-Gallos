'use client'

import { AlertTriangle, X, Lock } from 'lucide-react'
import { useState } from 'react'

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (password: string) => Promise<void>
  title: string
  description: string
  itemName: string
  itemType: 'gallo' | 'encaste'
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  itemType
}: DeleteModalProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      await onConfirm(password)
      onClose()
      setPassword('')
    } catch (err: any) {
      setError(err.message || 'Error al eliminar. Verifica la contraseña.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setPassword('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center p-4 bg-red-50 border border-red-100 rounded-xl mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-700">
                Estás a punto de eliminar {itemType === 'gallo' ? 'el gallo' : 'el encaste'}{' '}
                <span className="font-bold">{itemName}</span>. Esta acción no se puede deshacer.
              </p>
            </div>

            {itemType === 'gallo' && (
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-4">
                <p className="text-sm text-yellow-700">
                  <span className="font-semibold">⚠️ Advertencia:</span> También se eliminarán todas las imágenes asociadas a este gallo.
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-gray-500" />
                  Contraseña de confirmación
                </div>
              </label>
              <input
                id="deletePassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                required
                placeholder="Ingresa la contraseña de seguridad"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Requerida para confirmar la eliminación permanente
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !password}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-medium rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {loading ? 'Eliminando...' : 'Eliminar Permanentemente'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            <Lock className="w-3 h-3 inline mr-1" />
            Esta acción está protegida para prevenir eliminaciones accidentales
          </p>
        </div>
      </div>
    </div>
  )
}