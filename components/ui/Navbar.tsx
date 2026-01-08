'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { 
  Home, 
  LogIn, 
  LogOut, 
  PlusCircle, 
  Users, 
  Egg, 
  Menu, 
  X,
  UserCircle,
  Zap,
  ChevronRight,
  ChevronDown
} from 'lucide-react'
import Image from 'next/image'

export default function Navbar({ session }: { session: Session | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExploreOpen, setIsExploreOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const exploreItems = [
    { 
      href: '/explorar/registro-inteligente', 
      label: 'Registro Inteligente', 
      icon: <Zap className="w-4 h-4" />,
      description: 'Formularios intuitivos'
    },
    { 
      href: '/explorar/seguimiento-genetico', 
      label: 'Seguimiento Genético', 
      icon: <Users className="w-4 h-4" />,
      description: 'Control de genealogía'
    },
    { 
      href: '/explorar/seguridad', 
      label: 'Seguridad Avanzada', 
      icon: <div className="w-4 h-4 flex items-center justify-center">🔒</div>,
      description: 'Protección de datos'
    },
  ]

  const navItems = [
    { 
      href: '/', 
      label: 'Inicio', 
      icon: <Home className="w-4 h-4" />,
      badge: null
    },
    { 
      href: '/gallos', 
      label: 'Gallos', 
      icon: <Users className="w-4 h-4" />,
      badge: session ? '🐓' : null
    },
    { 
      href: '/gallos/nuevo', 
      label: 'Registrar Gallo', 
      icon: <PlusCircle className="w-4 h-4" />,
      badge: 'Nuevo'
    },
    { 
      href: '/encastes', 
      label: 'Encastes', 
      icon: <Egg className="w-4 h-4" />,
      badge: session ? '🥚' : null
    },
    { 
      href: '/encastes/nuevo', 
      label: 'Nuevo Encastes', 
      icon: <PlusCircle className="w-4 h-4" />,
      badge: 'Nuevo'
    },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'navbar-gradient shadow-lg py-2' 
          : 'bg-gradient-to-b from-slate-900/95 to-slate-900/80 backdrop-blur-sm py-3'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo - Izquierda (más pequeño) */}
            <div className="flex items-center flex-shrink-0">
              <Link 
                href="/" 
                className="flex items-center space-x-2 md:space-x-3 group"
                onClick={() => setIsOpen(false)}
              >
                {/* Logo para Mobile - Solo icono */}
                <div className="md:hidden">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/20">
                    <Image
                      src="/logo/logo-icon.jpg"
                      alt="Registro Mi Patio"
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>
                </div>

                {/* Logo para Desktop - Versión reducida */}
                <div className="hidden md:block">
                  <div className="relative">
                    <Image
                      src="/logo/logo-full.jpg"
                      alt="Registro Mi Patio - Sistema de Gestión Avícola"
                      width={100}  // Reducido a 100px
                      height={30}  // Mantiene proporción
                      className="object-contain transition-all duration-300 group-hover:opacity-90"
                      priority
                      sizes="(max-width: 768px) 40px, 100px"
                    />
                  </div>
                </div>

                {/* Texto del logo para Mobile */}
                <div className="md:hidden flex flex-col ml-2">
                  <span className="text-sm font-bold text-white leading-tight">Registro Mi Patio</span>
                  <span className="text-xs text-slate-300 leading-tight">Gestión Avícola</span>
                </div>
              </Link>
            </div>

            {/* Navegación Desktop - Centrada con más espacio */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-2 lg:space-x-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative group px-3 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                      pathname === item.href
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-glow'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
                    
                    {item.badge && (
                      <span className={`absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full ${
                        pathname === item.href
                          ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white'
                          : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}

                {/* Menú desplegable de Explorar */}
                <div className="relative">
                  <button
                    onClick={() => setIsExploreOpen(!isExploreOpen)}
                    className={`relative group px-3 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                      pathname.includes('/explorar')
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-glow'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span className="font-medium text-sm">Explorar</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                      isExploreOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Submenú de Explorar */}
                  {isExploreOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-lg shadow-xl z-50">
                      <div className="p-2">
                        {exploreItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                              setIsExploreOpen(false)
                              setIsOpen(false)
                            }}
                            className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 ${
                              pathname === item.href
                                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              pathname === item.href 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                                : 'bg-slate-700'
                            }`}>
                              {item.icon}
                            </div>
                            <div className="flex-1">
                              <span className="font-medium block text-sm">{item.label}</span>
                              <span className="text-xs text-slate-400">{item.description}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Auth Section - Derecha (más compacto) */}
            <div className="hidden md:flex items-center space-x-3">
              {session ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <UserCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden lg:flex flex-col">
                      <span className="text-xs font-medium text-white truncate max-w-[100px]">
                        {session.user.email?.split('@')[0]}
                      </span>
                      <span className="text-[10px] text-slate-300">Usuario</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="group relative px-3 py-1.5 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 rounded-lg text-white font-medium transition-all duration-300 overflow-hidden text-sm whitespace-nowrap"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    <div className="flex items-center space-x-1 relative z-10">
                      <LogOut className="w-3 h-3" />
                      <span>Salir</span>
                    </div>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="group relative px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-glow transition-all duration-300 overflow-hidden text-sm whitespace-nowrap"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-center space-x-2 relative z-10">
                    <LogIn className="w-3 h-3" />
                    <span>Iniciar Sesión</span>
                  </div>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center bg-slate-800/50 rounded-lg text-white hover:bg-slate-700/50 transition-colors"
              aria-label="Menú de navegación"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-slate-900 to-slate-800 border-t border-slate-700 shadow-xl animate-fade-in-up max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-4">
              {/* Logo en menú móvil */}
              <div className="flex items-center justify-center mb-6 p-4 border-b border-slate-700">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/30 mx-auto mb-3">
                    <Image
                      src="/logo/logo-icon.jpg"
                      alt="Registro Mi Patio"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-white">Registro Mi Patio</h2>
                  <p className="text-slate-300 text-sm">Gestión Avícola Profesional</p>
                </div>
              </div>

              {/* Navegación móvil principal */}
              <div className="space-y-1 mb-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                      pathname === item.href
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        pathname === item.href 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                          : 'bg-slate-800'
                      }`}>
                        {item.icon}
                      </div>
                      <div>
                        <span className="font-medium block text-sm">{item.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {item.badge && (
                        <span className={`px-2 py-1 text-xs rounded-full mr-2 ${
                          pathname === item.href
                            ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white'
                            : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Sección Explorar en móvil */}
              <div className="mb-4">
                <div className="px-3 py-2">
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">EXPLORAR CARACTERÍSTICAS</h3>
                </div>
                <div className="space-y-1">
                  {exploreItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        pathname === item.href
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          pathname === item.href 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                            : 'bg-slate-800'
                        }`}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium block text-sm">{item.label}</span>
                          <span className="text-xs text-slate-400">{item.description}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sección de usuario en móvil */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                {session ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <UserCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white truncate">
                            {session.user.email}
                          </p>
                          <p className="text-xs text-slate-300">Sesión activa</p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-red-500/20 to-red-600/20 text-white rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium text-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Espacio para el contenido debajo del navbar */}
      <div className="h-16 md:h-20"></div>
    </>
  )
}