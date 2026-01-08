import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/ui/Navbar'
import ParticlesBackground from '@/components/ui/ParticlesBackground'
import { createClient } from '@/lib/supabase/server'
import { Toaster } from 'react-hot-toast'
import RouteGuard from '@/components/auth/RouteGuard'


export const metadata: Metadata = {
  title: 'Registro Mi Patio 🐓 | Gestión Avícola',
  description: 'Sistema moderno para el registro y gestión de gallos y encastes',
  keywords: ['gallos', 'encastes', 'registro', 'avícola', 'gestión'],
  authors: [{ name: 'Registro Mi Patio' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#3b82f6',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 feather-pattern">
        <ParticlesBackground />
        
        {/* Fondo decorativo */}
        <div className="fixed inset-0 z-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-500/10 to-purple-500/10 rounded-full blur-3xl" />
        </div>

        {/* Logo flotante decorativo removido - Ahora está en el Navbar */}
        
                <div className="relative z-10">
          <RouteGuard>
            <Navbar session={session} />

            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              {/* Elemento decorativo superior */}
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
                <div className="flex justify-center items-center gap-4 opacity-30">
                  <div className="w-12 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                  <div className="text-3xl chicken-icon animate-chicken-walk">🐓</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
                </div>
              </div>

              {children}
            </main>

            <footer className="relative z-10 bg-gradient-to-t from-slate-900 to-slate-800 text-white py-12">
              {/* footer completo sin cambios */}
            </footer>
          </RouteGuard>
        </div>


        {/* Notificaciones */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}