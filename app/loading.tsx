export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="relative">
        {/* Logo animado */}
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center animate-pulse mb-6">
          <div className="text-3xl text-white">🐓</div>
        </div>
        
        {/* Puntos animados */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Cargando Registro Mi Patio</h2>
        <p className="text-slate-600">Preparando tu experiencia de gestión avícola...</p>
      </div>
    </div>
  )
}