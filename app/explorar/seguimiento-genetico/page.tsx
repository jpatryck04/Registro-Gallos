import Link from 'next/link'
import { 
  ArrowLeft, 
  Users, 
  GitBranch, 
  LineChart,
  Dna,
  TreePine,
  Shield,
  BookOpen,
  Target
} from 'lucide-react'

export default function SeguimientoGeneticoPage() {
  const genealogicalFeatures = [
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: 'Árbol Genealógico Completo',
      description: 'Visualiza hasta 4 generaciones de ascendencia de cada gallo.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Dna className="w-8 h-8 text-blue-500" />,
      title: 'Rasgos Hereditarios',
      description: 'Registro detallado de características físicas heredadas.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <LineChart className="w-8 h-8 text-purple-500" />,
      title: 'Análisis de Linajes',
      description: 'Identifica patrones y tendencias en tus líneas de crianza.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Target className="w-8 h-8 text-yellow-500" />,
      title: 'Mejora Genética',
      description: 'Toma decisiones informadas para mejorar tu cría.',
      color: 'from-yellow-500 to-orange-500'
    },
  ]

  const genealogyLevels = [
    {
      level: 'Gallo Principal',
      description: 'El individuo registrado con todos sus detalles',
      icon: '🐓',
      color: 'bg-gradient-to-r from-blue-500 to-purple-500'
    },
    {
      level: 'Padres',
      description: 'Información completa del padre y la madre',
      icon: '👥',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      level: 'Abuelos',
      description: 'Datos genealógicos de segunda generación',
      icon: '🌳',
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500'
    },
    {
      level: 'Bisabuelos',
      description: 'Información histórica de la línea familiar',
      icon: '📜',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
  ]

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 to-green-900 text-white p-8 md:p-12 mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/30 to-green-500/30 rounded-full blur-3xl" />
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center text-emerald-200 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
              <Dna className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Seguimiento Genético</h1>
              <p className="text-xl text-emerald-200">Control completo de la genealogía y linajes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="card-modern mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">La Ciencia Detrás de tu Cría</h2>
            <p className="text-slate-600 mb-6">
              Nuestro sistema de seguimiento genético te permite mantener un registro detallado 
              de la genealogía completa de cada gallo. Entiende la herencia de rasgos, mejora tus 
              líneas de crianza y toma decisiones basadas en datos precisos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/gallos/nuevo"
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:shadow-glow-green transition-all duration-300"
              >
                Registrar Genealogía
              </Link>
              <Link
                href="/gallos"
                className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-300"
              >
                Ver Árboles Genealógicos
              </Link>
            </div>
          </div>
          <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🌳</div>
                <p className="text-white text-lg font-semibold">Árbol Genealógico Interactivo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Genealogy Tree Visualization */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">Árbol Genealógico de 4 Niveles</h2>
        <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
          Visualiza la ascendencia completa de cada gallo en nuestro sistema interactivo
        </p>
        
        <div className="relative bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8">
          {/* Genealogy Tree Visualization */}
          <div className="flex flex-col items-center">
            {/* Level 4 - Great Grandparents */}
            <div className="flex justify-center gap-8 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl mb-2">
                    📜
                  </div>
                  <p className="text-xs text-slate-600">Bisabuelo {i}</p>
                </div>
              ))}
            </div>
            
            {/* Connector Lines */}
            <div className="h-8 w-0.5 bg-slate-300 mb-2" />
            
            {/* Level 3 - Grandparents */}
            <div className="flex justify-center gap-12 mb-8">
              {[1, 2].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl mb-2">
                    🌳
                  </div>
                  <p className="text-sm font-medium text-slate-700">Abuelo {i}</p>
                </div>
              ))}
            </div>
            
            {/* Connector Lines */}
            <div className="h-8 w-0.5 bg-slate-300 mb-2" />
            
            {/* Level 2 - Parents */}
            <div className="flex justify-center gap-16 mb-8">
              {['Padre', 'Madre'].map((parent, i) => (
                <div key={parent} className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-3xl mb-2">
                    👥
                  </div>
                  <p className="text-base font-semibold text-slate-900">{parent}</p>
                </div>
              ))}
            </div>
            
            {/* Connector Lines */}
            <div className="h-8 w-0.5 bg-slate-300 mb-2" />
            
            {/* Level 1 - Main Gallo */}
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl mb-2">
                🐓
              </div>
              <p className="text-lg font-bold text-slate-900">Gallo Principal</p>
              <p className="text-sm text-slate-600">Tu gallo registrado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {genealogicalFeatures.map((feature, index) => (
          <div 
            key={index}
            className="card-modern group hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color}/10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 text-sm mt-1">{feature.description}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link
                href="/gallos/nuevo"
                className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                Aplicar a mi cría
                <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Genealogy Levels */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Niveles de Información Genealógica</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {genealogyLevels.map((level, index) => (
            <div 
              key={index}
              className="relative bg-white rounded-xl p-6 shadow-sm border border-slate-200"
            >
              <div className={`w-12 h-12 ${level.color} rounded-lg flex items-center justify-center text-white text-xl mb-4`}>
                {level.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{level.level}</h3>
              <p className="text-slate-600 text-sm">{level.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card-modern">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-emerald-500" />
            Beneficios del Seguimiento Genético
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">✓</div>
              <span className="text-slate-700">Mejora la calidad genética de tu cría</span>
            </li>
            <li className="flex items-start">
              <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">✓</div>
              <span className="text-slate-700">Evita consanguinidad no deseada</span>
            </li>
            <li className="flex items-start">
              <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">✓</div>
              <span className="text-slate-700">Identifica líneas con mejores características</span>
            </li>
            <li className="flex items-start">
              <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">✓</div>
              <span className="text-slate-700">Documenta la historia de tu crianza</span>
            </li>
          </ul>
        </div>
        
        <div className="card-modern">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-blue-500" />
            Datos Genéticos Protegidos
          </h3>
          <p className="text-slate-600 mb-4">
            Tu información genética es valiosa. La protegemos con múltiples capas de seguridad 
            y solo tú tienes acceso completo a estos datos sensibles.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 p-3 rounded-lg">
              <p className="text-xs font-medium text-emerald-700">Encriptación de Datos</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs font-medium text-blue-700">Acceso Exclusivo</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-xs font-medium text-purple-700">Backup Automático</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-xs font-medium text-yellow-700">Sin Compartir Datos</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Comienza tu Historia Genética</h2>
        <p className="text-emerald-100 mb-6 max-w-md mx-auto">
          Registra la genealogía de tus gallos y construye un legado genético documentado
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/gallos/nuevo"
            className="px-8 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all duration-300"
          >
            Registrar Primera Genealogía
          </Link>
          <Link
            href="/gallos"
            className="px-8 py-3 bg-emerald-600/20 text-white font-semibold rounded-xl hover:bg-emerald-600/30 transition-all duration-300"
          >
            Ver Ejemplos Completo
          </Link>
        </div>
      </div>
    </div>
  )
}