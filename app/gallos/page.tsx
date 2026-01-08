import { createClient } from '@/lib/supabase/server'
import GallosList from '@/components/gallos/GallosList'
import Link from 'next/link'
import { PlusCircle, Users, Search, Filter } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function GallosPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: gallos, error } = await supabase
    .from('gallos')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error cargando gallos:', error)
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center">
            <Users className="w-8 h-8 mr-3 text-blue-500" />
            Mis Gallos Registrados
          </h1>
          <p className="text-slate-600">
            Gestiona y visualiza todos tus gallos registrados en el sistema.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <Link
            href="/gallos/nuevo"
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300 overflow-hidden flex items-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <PlusCircle className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10">Nuevo Gallo</span>
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Gallos</p>
              <p className="text-2xl font-bold text-slate-900">{gallos?.length || 0}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Activos</p>
              <p className="text-2xl font-bold text-slate-900">{gallos?.length || 0}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-lg">🐓</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Último Registro</p>
              <p className="text-lg font-bold text-slate-900">
                {gallos && gallos.length > 0 
                  ? new Date(gallos[0].created_at).toLocaleDateString('es-ES')
                  : 'N/A'
                }
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-lg">📅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar gallos por nombre, placa o características..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </button>
          </div>
        </div>
      </div>

      {/* Gallos List */}
      {gallos && gallos.length > 0 ? (
        <GallosList gallos={gallos} />
      ) : (
        <div className="card-modern text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-12 h-12 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">No hay gallos registrados</h3>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Comienza registrando tu primer gallo para llevar un control profesional de tu crianza avícola.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/gallos/nuevo"
              className="group relative px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center justify-center relative z-10">
                <PlusCircle className="w-5 h-5 mr-2" />
                <span>Registrar Primer Gallo</span>
              </div>
            </Link>
            <Link
              href="/encastes/nuevo"
              className="group relative px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-glow-green transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center justify-center relative z-10">
                <span>Registrar Encastes</span>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl">💡</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Consejos para un buen registro
            </h3>
            <ul className="text-slate-700 space-y-2">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Sube fotos claras de cada gallo para una fácil identificación</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Registra todas las placas y bridas con precisión</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Actualiza la información genealógica regularmente</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Mantén un seguimiento de las características físicas</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}