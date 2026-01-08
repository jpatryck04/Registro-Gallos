import { createClient } from '@/lib/supabase/server'
import GallosList from '@/components/gallos/GallosList'
import { redirect } from 'next/navigation'
import { 
  TrendingUp, 
  Users, 
  Egg, 
  Award,
  ChevronRight,
  Zap,
  Shield,
  BarChart,
  PlusCircle,
  Activity
} from 'lucide-react'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Obtener datos reales de la base de datos
  const { data: gallos, error: gallosError } = await supabase
    .from('gallos')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(6)

  const { data: encastes, error: encastesError } = await supabase
    .from('encastes')
    .select('*')
    .eq('user_id', session.user.id)
    .order('fecha_encaste', { ascending: false })
    .limit(4)

  // Estadísticas reales
  const { count: totalGallos } = await supabase
    .from('gallos')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id)

  const { count: totalEncastes } = await supabase
    .from('encastes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id)

  // Calcular tasa de éxito de encastes
  const { data: encastesCompletos } = await supabase
    .from('encastes')
    .select('cantidad_pollos_nacidos')
    .eq('user_id', session.user.id)
    .gt('cantidad_pollos_nacidos', 0)

  const tasaExito = (totalEncastes || 0) > 0 
    ? Math.round((encastesCompletos?.length || 0) / (totalEncastes || 1) * 100)
    : 0

  // Calcular actividad total (registros en los últimos 30 días)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { count: actividadReciente } = await supabase
    .from('gallos')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id)
    .gte('created_at', thirtyDaysAgo.toISOString())

  const { count: encastesRecientes } = await supabase
    .from('encastes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id)
    .gte('created_at', thirtyDaysAgo.toISOString())

  const actividadTotal = (actividadReciente || 0) + (encastesRecientes || 0)

  // Calcular tendencias (comparación con período anterior)
  const sixtyDaysAgo = new Date()
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

  const { count: actividadPasada } = await supabase
    .from('gallos')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id)
    .gte('created_at', sixtyDaysAgo.toISOString())
    .lt('created_at', thirtyDaysAgo.toISOString())

  const { count: encastesPasados } = await supabase
    .from('encastes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id)
    .gte('created_at', sixtyDaysAgo.toISOString())
    .lt('created_at', thirtyDaysAgo.toISOString())

  const actividadTotalPasada = (actividadPasada || 0) + (encastesPasados || 0)
  
  // Calcular porcentaje de cambio
  const calcularTendencia = (actual: number, pasado: number) => {
    if (pasado === 0) return actual > 0 ? '+100%' : '0%'
    const cambio = ((actual - pasado) / pasado) * 100
    return `${cambio >= 0 ? '+' : ''}${Math.round(cambio)}%`
  }

  const stats = [
    {
      title: 'Gallos Registrados',
      value: (totalGallos || 0).toString(),
      icon: Users,
      color: 'from-blue-500 to-purple-500',
      trend: calcularTendencia(totalGallos || 0, actividadPasada || 0),
      link: '/gallos'
    },
    {
      title: 'Encastes Activos',
      value: (totalEncastes || 0).toString(),
      icon: Egg,
      color: 'from-green-500 to-emerald-500',
      trend: calcularTendencia(totalEncastes || 0, encastesPasados || 0),
      link: '/encastes'
    },
    {
      title: 'Tasa de Éxito',
      value: `${tasaExito}%`,
      icon: Award,
      color: 'from-yellow-500 to-orange-500',
      trend: tasaExito >= 80 ? '+5%' : tasaExito >= 60 ? '+2%' : '-3%',
      link: '/encastes'
    },
    {
      title: 'Actividad Total',
      value: actividadTotal.toString(),
      icon: Activity,
      color: 'from-pink-500 to-rose-500',
      trend: calcularTendencia(actividadTotal, actividadTotalPasada),
      link: '/gallos'
    },
  ]

  const features = [
    {
      title: 'Registro Inteligente',
      description: 'Captura todos los detalles de tus gallos con formularios intuitivos.',
      icon: Zap,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      link: '/explorar/registro-inteligente'
    },
    {
      title: 'Seguimiento Genético',
      description: 'Mantén el control completo de la genealogía y linajes.',
      icon: Users,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      link: '/explorar/seguimiento-genetico'
    },
    {
      title: 'Gestión de Encastes',
      description: 'Administra todo el proceso de apareamiento y producción.',
      icon: Egg,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      link: '/encastes'
    },
    {
      title: 'Seguridad Avanzada',
      description: 'Tus datos protegidos con encriptación de última generación.',
      icon: Shield,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      link: '/explorar/seguridad'
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-2xl">🐓</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              ¡Bienvenido a <span className="gradient-text">Registro Mi Patio</span>!
            </h1>
          </div>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl">
            Gestiona tu crianza avícola de manera profesional. Registra gallos, controla encastes 
            y optimiza tu producción con nuestra plataforma inteligente.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/gallos/nuevo"
              className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center space-x-2 relative z-10">
                <PlusCircle className="w-5 h-5" />
                <span>Registrar Gallo</span>
              </div>
            </Link>
            <Link
              href="/encastes/nuevo"
              className="group relative px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-glow-green transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center space-x-2 relative z-10">
                <Egg className="w-5 h-5" />
                <span>Nuevo Encastes</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link
            key={index}
            href={stat.link}
            className="block"
          >
            <div 
              className="card-modern group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  stat.trend.startsWith('+') 
                    ? 'text-green-500 bg-green-500/10' 
                    : stat.trend.startsWith('-')
                    ? 'text-red-500 bg-red-500/10'
                    : 'text-slate-500 bg-slate-500/10'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-slate-600 text-sm">{stat.title}</p>
              <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
                  style={{ 
                    width: stat.title === 'Tasa de Éxito'
                      ? `${tasaExito}%` 
                      : stat.title === 'Actividad Total'
                      ? `${Math.min(actividadTotal * 5, 100)}%`
                      : stat.title === 'Gallos Registrados'
                      ? `${Math.min((totalGallos || 0) * 20, 100)}%`
                      : stat.title === 'Encastes Activos'
                      ? `${Math.min((totalEncastes || 0) * 25, 100)}%`
                      : '50%'
                  }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="card-modern group hover:scale-[1.02] transition-all duration-300"
          >
            <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <feature.icon className={`w-6 h-6 ${feature.color}`} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
            <p className="text-slate-600 text-sm">{feature.description}</p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link
                href={feature.link}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Explorar
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Gallos */}
      <div className="card-modern">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Gallos Recientes
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Últimos gallos registrados en tu sistema
            </p>
          </div>
          <Link
            href="/gallos"
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Ver todos
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {gallos && gallos.length > 0 ? (
          <GallosList gallos={gallos} />
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay gallos registrados</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Comienza registrando tu primer gallo para llevar un control profesional de tu crianza.
            </p>
            <Link
              href="/gallos/nuevo"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Registrar Primer Gallo
            </Link>
          </div>
        )}
      </div>

      {/* Recent Encastes & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Encastes */}
        <div className="lg:col-span-2 card-modern">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <Egg className="w-5 h-5 mr-2 text-green-500" />
                Encastes Recientes
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Últimos procesos de apareamiento registrados
              </p>
            </div>
            <Link
              href="/encastes"
              className="flex items-center text-sm font-medium text-green-600 hover:text-green-700"
            >
              Ver todos
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {encastes && encastes.length > 0 ? (
            <div className="space-y-4">
              {encastes.map((encaste) => (
                <Link
                  key={encaste.id}
                  href={`/encastes/${encaste.id}`}
                  className="block group"
                >
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:border-green-200 transition-all duration-300 group-hover:scale-[1.01]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          Encastes #{encaste.id.slice(0, 8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {new Date(encaste.fecha_encaste).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {encaste.total_huevos} huevos
                        </div>
                        <div className="text-sm text-slate-500">
                          {encaste.cantidad_pollos_nacidos} pollos nacidos
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Egg className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-slate-600">No hay encastes registrados aún</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card-modern">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Acciones Rápidas
          </h2>
          
          <div className="space-y-4">
            <Link
              href="/gallos/nuevo"
              className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <PlusCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Nuevo Gallo</h3>
                  <p className="text-sm text-slate-600">Registrar un nuevo gallo</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/encastes/nuevo"
              className="group flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:border-green-200 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Egg className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Nuevo Encastes</h3>
                  <p className="text-sm text-slate-600">Registrar nuevo apareamiento</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/gallos"
              className="group flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:border-purple-200 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <BarChart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Estadísticas</h3>
                  <p className="text-sm text-slate-600">Ver análisis y métricas</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl">📊</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Estadísticas del Día
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Registros este mes</p>
                <p className="text-lg font-bold text-slate-900">{actividadTotal}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Éxito en encastes</p>
                <p className="text-lg font-bold text-slate-900">{tasaExito}%</p>
              </div>
            </div>
            <p className="text-slate-700 mt-4 text-sm">
              Tu actividad está {actividadTotal > actividadTotalPasada ? 'aumentando' : 'estable'}. 
              {actividadTotal > actividadTotalPasada ? ' ¡Sigue así!' : ' ¡Anímate a registrar más!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}