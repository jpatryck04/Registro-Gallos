import { createClient } from '@/lib/supabase/server'
import EncastesList from '@/components/encastes/EncastesList'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function EncastesPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: encastes, error } = await supabase
    .from('encastes')
    .select('*')
    .eq('user_id', session.user.id)
    .order('fecha_encaste', { ascending: false })

  if (error) {
    console.error('Error cargando encastes:', error)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registro de Encastes</h1>
          <p className="text-gray-600">
            Gestiona y visualiza todos tus encastes registrados.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link
            href="/encastes/nuevo"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Nuevo Encastes
          </Link>
        </div>
      </div>

      {encastes && encastes.length > 0 ? (
        <EncastesList encastes={encastes} />
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay encastes registrados</h3>
          <p className="text-gray-600 mb-4">
            Comienza registrando tu primer encaste en el sistema.
          </p>
          <Link
            href="/encastes/nuevo"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Registrar Primer Encastes
          </Link>
        </div>
      )}
    </div>
  )
}