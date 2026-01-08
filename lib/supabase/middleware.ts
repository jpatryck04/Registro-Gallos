import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value)
            })

            supabaseResponse = NextResponse.next({ request })

            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options)
            })
          } catch (error) {
            console.error('Cookie error:', error)
          }
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const currentPath = request.nextUrl.pathname

  // Rutas públicas
  const publicPaths = [
    '/login',
    '/register',
    '/auth/callback',
    '/api/auth/callback'
  ]

  // Rutas protegidas
  const protectedPaths = [
    '/',
    '/gallos',
    '/encastes',
    '/explorar',
    '/perfil'
  ]

  const isPublicPath = publicPaths.some(
    path => currentPath === path || currentPath.startsWith(`${path}/`)
  )

  const isProtectedPath = protectedPaths.some(
    path =>
      currentPath === path ||
      currentPath.startsWith(`${path}/`) ||
      currentPath.includes('/nuevo') ||
      currentPath.includes('/editar')
  )

  // No autenticado → ruta protegida
  if (!session && isProtectedPath && !isPublicPath) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', currentPath)
    return NextResponse.redirect(loginUrl)
  }

  // Autenticado → login / register
  if (session && (currentPath === '/login' || currentPath === '/register')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
