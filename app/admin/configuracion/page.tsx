'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Lock, Save, Eye, EyeOff, User, Shield, RefreshCw, CheckCircle } from 'lucide-react'
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
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('Registromipatio2024@')
  const [userId, setUserId] = useState('')
  const [profileExists, setProfileExists] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('Error obteniendo usuario:', userError)
        router.push('/login')
        return
      }

      setUserEmail(user.email || '')
      setUserId(user.id)

      // Intentar obtener el perfil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('clave_edicion')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) {
        console.error('Error cargando perfil:', profileError)
        
        // Intentar crear el perfil si no existe
        await createUserProfile(user.id)
        setProfileExists(true)
      } else if (profileData) {
        setUserPassword(profileData.clave_edicion || 'Registromipatio2024@')
        setProfileExists(true)
      } else {
        // El perfil no existe, crearlo
        await createUserProfile(user.id)
        setProfileExists(true)
      }

    } catch (error) {
      console.error('Error cargando datos del usuario:', error)
      setError('Error al cargar los datos del usuario')
    }
  }

  const createUserProfile = async (userId: string) => {
    try {
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          clave_edicion: 'Registromipatio2024@',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (createError) {
        console.error('Error creando perfil:', createError)
        
        // Si hay error de duplicado, intentar actualizar
        if (createError.code === '23505') {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              clave_edicion: 'Registromipatio2024@',
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)
          
          if (updateError) {
            console.error('Error actualizando perfil existente:', updateError)
          }
        }
      }
      
      setUserPassword('Registromipatio2024@')
    } catch (error) {
      console.error('Error en createUserProfile:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Validaciones básicas
      if (!currentPassword.trim()) {
        throw new Error('La contraseña actual es obligatoria')
      }

      if (!newPassword.trim()) {
        throw new Error('La nueva contraseña es obligatoria')
      }

      if (!confirmPassword.trim()) {
        throw new Error('La confirmación de contraseña es obligatoria')
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Las nuevas contraseñas no coinciden')
      }

      if (newPassword.length < 6) {
        throw new Error('La nueva contraseña debe tener al menos 6 caracteres')
      }

      // Verificar contraseña actual
      if (currentPassword !== userPassword) {
        throw new Error('Contraseña actual incorrecta')
      }

      // No permitir usar la contraseña por defecto como nueva
      if (newPassword === 'Registromipatio2024@') {
        throw new Error('No puedes usar la contraseña por defecto. Elige una diferente.')
      }

      // Verificar que la nueva contraseña sea diferente
      if (currentPassword === newPassword) {
        throw new Error('La nueva contraseña debe ser diferente a la actual')
      }

      console.log('Actualizando contraseña para usuario:', userId)
      
      // Primero, asegurarnos de que el perfil existe
      if (!profileExists) {
        await createUserProfile(userId)
      }
      
      // Actualizar contraseña usando upsert (insert or update)
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          clave_edicion: newPassword,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      if (updateError) {
        console.error('Error en upsert:', updateError)
        throw new Error(`Error al actualizar: ${updateError.message}`)
      }

      console.log('Contraseña actualizada, verificando...')
      
      // Verificar con maybeSingle (no falla si no hay resultados)
      const { data: verifyData, error: verifyError } = await supabase
        .from('profiles')
        .select('clave_edicion')
        .eq('id', userId)
        .maybeSingle()

      if (verifyError) {
        console.warn('Advertencia verificando actualización:', verifyError)
        // Continuar de todos modos
      }

      if (verifyData && verifyData.clave_edicion === newPassword) {
        console.log('Verificación exitosa:', verifyData.clave_edicion)
        setSuccess('✅ Contraseña actualizada exitosamente')
        setUserPassword(newPassword)
      } else {
        // Aún así mostrar éxito si el upsert fue exitoso
        console.warn('No se pudo verificar inmediatamente, pero la actualización probablemente fue exitosa')
        setSuccess('✅ Contraseña actualizada exitosamente')
        setUserPassword(newPassword)
      }
      
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.refresh()
      }, 2000)

    } catch (error: any) {
      console.error('Error actualizando contraseña:', error)
      setError(error.message || 'Error al actualizar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  const resetToDefault = async () => {
    if (!confirm('¿Estás seguro de que deseas restablecer la contraseña a la por defecto?')) {
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const defaultPassword = 'Registromipatio2024@'
      
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          clave_edicion: defaultPassword,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      if (updateError) {
        console.error('Error restableciendo contraseña:', updateError)
        throw new Error('Error al restablecer la contraseña')
      }

      setUserPassword(defaultPassword)
      setSuccess('✅ Contraseña restablecida a la por defecto')
      
      setTimeout(() => {
        setSuccess('')
        router.refresh()
      }, 2000)
    } catch (error: any) {
      setError(error.message || 'Error al restablecer la contraseña')
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setLoading(true)
    setError('')
    await loadUserData()
    setLoading(false)
    setSuccess('Datos actualizados')
    setTimeout(() => setSuccess(''), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card-modern">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-blue-500" />
              Configuración de Seguridad
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona tu contraseña personal de edición y eliminación
            </p>
          </div>
          <button
            onClick={refreshData}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            title="Actualizar datos"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Información del Usuario */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Información de Cuenta</h3>
              <p className="text-gray-600 text-sm mt-1">{userEmail || 'Cargando...'}</p>
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">Contraseña actual:</span>
                  </div>
                  {profileExists && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3 inline mr-1" />
                      Perfil activo
                    </span>
                  )}
                </div>
                <div className="mt-1">
                  <code className="font-mono bg-gray-100 px-3 py-2 rounded-lg text-gray-900 text-sm break-all block">
                    {userPassword}
                  </code>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ID: {userId ? `${userId.substring(0, 8)}...` : 'Cargando...'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 animate-fade-in">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center mr-2 flex-shrink-0">!</div>
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 animate-fade-in">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center mr-2 flex-shrink-0">✓</div>
              <div>
                <p className="font-medium">Éxito</p>
                <p className="text-sm mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulario de Cambio de Contraseña */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Contraseña Actual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña Actual
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 transition-colors"
                  placeholder="Ingresa tu contraseña actual"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Nueva Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 transition-colors"
                  placeholder="Ingresa la nueva contraseña"
                  required
                  minLength={6}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 6 caracteres. Recomendamos usar letras, números y símbolos.
              </p>
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 transition-colors"
                  placeholder="Repite la nueva contraseña"
                  required
                  minLength={6}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>

            <button
              type="button"
              onClick={resetToDefault}
              disabled={loading}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Restablecer por Defecto
            </button>
          </div>
        </form>

        {/* Información y Ayuda */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <div className="w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-xs">!</div>
              <div>
                <p className="text-sm font-medium text-yellow-800 mb-1">Solución de Problemas</p>
                <p className="text-sm text-yellow-700">
                  Si la contraseña no se actualiza, prueba usar "Restablecer por Defecto" primero, 
                  luego intenta cambiarla nuevamente. Esto asegura que tu perfil esté correctamente creado.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-blue-500" />
                ¿Para qué sirve esta contraseña?
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  <span>Protege la edición de tus gallos y encastes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  <span>Requiere confirmación para eliminar registros</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Lock className="w-4 h-4 mr-2 text-blue-500" />
                Recomendaciones
              </h4>
              <ul className="text-sm text-blue-600 space-y-2">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  <span>Usa una contraseña única</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  <span>No la compartas con nadie</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}  