import Link from 'next/link'
import { 
  ArrowLeft, 
  Camera, 
  FileText, 
  Search, 
  Tag, 
  Zap,
  CheckCircle,
  BarChart,
  Shield
} from 'lucide-react'

export default function RegistroInteligentePage() {
  const features = [
    {
      icon: <Camera className="w-8 h-8 text-blue-500" />,
      title: 'Captura de Imágenes',
      description: 'Sube fotos de alta calidad de tus gallos desde cualquier dispositivo.',
      image: '/images/captura-imagenes.jpg',
      alt: 'Captura de imágenes de gallos'
    },
    {
      icon: <FileText className="w-8 h-8 text-green-500" />,
      title: 'Formularios Inteligentes',
      description: 'Campos organizados por categorías para un registro completo y sin errores.',
      image: '/images/formularios-inteligentes.jpg',
      alt: 'Formularios de registro'
    },
    {
      icon: <Search className="w-8 h-8 text-purple-500" />,
      title: 'Búsqueda Avanzada',
      description: 'Encuentra rápidamente cualquier gallo por características específicas.',
      image: '/images/busqueda-avanzada.jpg',
      alt: 'Búsqueda de gallos'
    },
    {
      icon: <Tag className="w-8 h-8 text-yellow-500" />,
      title: 'Gestión de Placas',
      description: 'Registro detallado de placas y bridas para identificación precisa.',
      image: '/images/gestion-placas.jpg',
      alt: 'Gestión de placas'
    },
  ]

  const steps = [
    {
      number: '01',
      title: 'Completa el Formulario',
      description: 'Llena todos los campos del formulario inteligente organizado por categorías.',
      icon: <FileText className="w-6 h-6" />
    },
    {
      number: '02',
      title: 'Sube las Imágenes',
      description: 'Adjunta fotos del gallo y su genealogía para un registro visual completo.',
      icon: <Camera className="w-6 h-6" />
    },
    {
      number: '03',
      title: 'Revisa y Confirma',
      description: 'Verifica toda la información antes de guardar el registro permanentemente.',
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      number: '04',
      title: 'Accede Rápidamente',
      description: 'Encuentra tu gallo registrado en segundos con nuestro sistema de búsqueda.',
      icon: <Search className="w-6 h-6" />
    },
  ]

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-purple-900 text-white p-8 md:p-12 mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/30 to-purple-500/30 rounded-full blur-3xl" />
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center text-blue-200 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Registro Inteligente</h1>
              <p className="text-xl text-blue-200">Captura todos los detalles de tus gallos con formularios intuitivos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="card-modern mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Registro Completo y Sin Esfuerzo</h2>
            <p className="text-slate-600 mb-6">
              Nuestro sistema de registro inteligente te permite capturar todos los detalles importantes 
              de tus gallos de manera organizada y eficiente. Diseñado pensando en los criadores, cada 
              campo tiene un propósito específico para garantizar un registro completo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/gallos/nuevo"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300"
              >
                Probar Ahora
              </Link>
              <Link
                href="/gallos"
                className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-300"
              >
                Ver Ejemplos
              </Link>
            </div>
          </div>
          <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden">
            {/* Imagen de ejemplo - puedes reemplazar con una real */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-white text-lg font-semibold">Formulario Inteligente</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">Características Principales</h2>
        <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
          Todo lo que necesitas para un registro profesional de tus gallos
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="card-modern group hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.description}</p>
                </div>
              </div>
              
              <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 flex items-center justify-center">
                  <div className="text-4xl">
                    {index === 0 ? '📸' : index === 1 ? '📋' : index === 2 ? '🔍' : '🏷️'}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={index === 0 ? "/gallos/nuevo" : index === 1 ? "/gallos" : "/"}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Ver más detalles
                  <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">Cómo Funciona</h2>
        <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
          Sigue estos simples pasos para registrar tus gallos de manera profesional
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative bg-white rounded-xl p-6 shadow-sm border border-slate-200"
            >
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {step.number}
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card-modern">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
            <BarChart className="w-6 h-6 mr-2 text-green-500" />
            Beneficios del Registro Inteligente
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">Reduce errores en el registro de información</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">Ahorra tiempo con formularios organizados</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">Mejora la trazabilidad de tu crianza</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">Facilita la toma de decisiones informadas</span>
            </li>
          </ul>
        </div>
        
        <div className="card-modern">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-blue-500" />
            Datos Siempre Seguros
          </h3>
          <p className="text-slate-600 mb-4">
            Tu información está protegida con encriptación de última generación y 
            respaldada automáticamente en nuestra infraestructura segura.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-700">Encriptación AES-256</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-green-700">Backup Automático</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-purple-700">Acceso Controlado</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-yellow-700">SSL/TLS Seguro</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">¿Listo para comenzar?</h2>
        <p className="text-blue-100 mb-6 max-w-md mx-auto">
          Registra tu primer gallo en menos de 5 minutos y descubre la diferencia
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/gallos/nuevo"
            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300"
          >
            Comenzar Ahora
          </Link>
          <Link
            href="/gallos"
            className="px-8 py-3 bg-blue-600/20 text-white font-semibold rounded-xl hover:bg-blue-600/30 transition-all duration-300"
          >
            Ver Ejemplos
          </Link>
        </div>
      </div>
    </div>
  )
}