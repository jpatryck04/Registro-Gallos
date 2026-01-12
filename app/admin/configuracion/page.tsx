'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Lock, Save, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ConfiguracionPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [configPassword, setConfigPassword] = useState('')

  useEffect(() => {
    loadConfigPassword()
  }, [])

const loadConfigPassword = async () => {
  try {
    // Agrega limit(1) para obtener solo un registro
    
    const { data, error } = await supabase
      .from('configuracion')
      .select('clave_edicion')
      .limit(1)  // Limita a un solo resultado
      .single(); // Asegura que sea un solo objeto

      if (error) throw error
      
      if (data) {
        setConfigPassword(data.clave_edicion)
      }
    } catch (error) {
      console.error('Error cargando configuración:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Validaciones
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error('Todos los campos son obligatorios')
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Las nuevas contraseñas no coinciden')
      }

      if (newPassword.length < 6) {
        throw new Error('La nueva contraseña debe tener al menos 6 caracteres')
      }

      // Verificar contraseña actual
      if (currentPassword !== configPassword) {
        throw new Error('Contraseña actual incorrecta')
      }

      // Actualizar contraseña
      const { error: updateError } = await supabase
        .from('configuracion')
        .update({ clave_edicion: newPassword })
        .eq('id', (await supabase.from('configuracion').select('id').single()).data?.id)

      if (updateError) throw updateError

      setSuccess('Contraseña actualizada exitosamente')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      await loadConfigPassword()
      
      setTimeout(() => {
        router.push('/')
      }, 2000)

    } catch (error: any) {
      setError(error.message || 'Error al actualizar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card-modern">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración de Seguridad</h1>
          <p className="text-gray-600 mt-2">
            Cambia la contraseña de edición y eliminación
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Contraseña actual:</strong> {configPassword || 'Cargando...'}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Usa esta contraseña para editar o eliminar gallos y encastes
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Contraseña Actual */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña Actual
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder="Ingresa la contraseña actual"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Nueva Contraseña */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder="Ingresa la nueva contraseña"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Mínimo 6 caracteres
            </p>
          </div>

          {/* Confirmar Nueva Contraseña */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder="Confirma la nueva contraseña"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>Nota:</strong> Esta contraseña se requiere para editar o eliminar cualquier gallo o encaste en el sistema.
          </p>
        </div>
      </div>
    </div>
  )
}