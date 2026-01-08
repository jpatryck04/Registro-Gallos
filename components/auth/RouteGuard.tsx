'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface RouteGuardProps {
  children: React.ReactNode
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true)
      
      const { data: { session } } = await supabase.auth.getSession()
      
      // Rutas públicas que no requieren autenticación
      const publicPaths = ['/login', '/register', '/auth/callback']
      const isPublicPath = publicPaths.includes(pathname)
      
      if (!session && !isPublicPath) {
        // No autenticado y no es ruta pública → redirigir a login
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
        return
      }
      
      if (session && isPublicPath) {
        // Ya autenticado y está en login/register → redirigir a home
        router.push('/')
        return
      }
      
      setAuthorized(true)
      setLoading(false)
    }
    
    checkAuth()
    
    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login')
      }
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [router, pathname, supabase])

  if (loading) {
    return <LoadingSpinner fullScreen message="Verificando autenticación..." />
  }

  return authorized ? <>{children}</> : null
}