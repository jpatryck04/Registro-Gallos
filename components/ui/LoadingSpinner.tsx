'use client'

interface LoadingSpinnerProps {
  message?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({ message = 'Cargando...', fullScreen = false }: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/80 to-slate-900/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <div className="loader-chicken" />
          <div className="absolute -top-4 -right-4 w-4 h-4 bg-gradient-to-br from-yellow-500 to-red-500 rounded-full animate-ping" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-white mb-2">{message}</p>
          <p className="text-slate-300 text-sm">Registro Mi Patio</p>
          <div className="mt-4 flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-4">
        <div className="loader-chicken" />
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-br from-yellow-500 to-red-500 rounded-full animate-ping" />
      </div>
      <p className="text-slate-600 font-medium">{message}</p>
    </div>
  )
}