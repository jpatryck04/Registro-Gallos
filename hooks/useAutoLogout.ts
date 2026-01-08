'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutos

export function useAutoLogout() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const resetTimer = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleLogout, INACTIVITY_TIMEOUT)
    }

    const handleLogout = async () => {
      await supabase.auth.signOut()
      router.push('/login?message=Sesión cerrada por inactividad')
    }

    // Eventos que reinician el timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    events.forEach(event => {
      window.addEventListener(event, resetTimer)
    })

    resetTimer()

    return () => {
      clearTimeout(timeoutId)
      events.forEach(event => {
        window.removeEventListener(event, resetTimer)
      })
    }
  }, [router, supabase])
}