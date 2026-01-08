import Link from 'next/link'
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  Key,
  Database,
  Globe,
  Server,
  ShieldCheck,
  Cpu
} from 'lucide-react'

export default function SeguridadPage() {
  const securityFeatures = [
    {
      icon: <Lock className="w-8 h-8 text-blue-500" />,
      title: 'Autenticación de Dos Factores',
      description: 'Protección adicional para tu cuenta con verificación en dos pasos.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Database className="w-8 h-8 text-green-500" />,
      title: 'Encriptación AES-256',
      description: 'Todos tus datos encriptados con el estándar militar más avanzado.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-500" />,
      title: 'Conexiones SSL/TLS',
      description: 'Comunicación segura entre tu dispositivo y nuestros servidores.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Server className="w-8 h-8 text-yellow-500" />,
      title: 'Backup Automático',
      description: 'Tus datos respaldados diariamente en múltiples ubicaciones.',
      color: 'from-yellow-500 to-orange-500'
    },
  ]

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-blue-900 text-white p-8 md:p-12 mb-8">
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Seguridad Avanzada</h1>
              <p className="text-xl text-blue-200">Tus datos protegidos con encriptación de última generación</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Layers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card-modern">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Autenticación Segura</h3>
          <p className="text-slate-600 mb-4">
            Acceso protegido con contraseñas encriptadas y autenticación de dos factores opcional.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-slate-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Contraseñas encriptadas con bcrypt
            </li>
            <li className="flex items-center text-sm text-slate-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Sesiones temporales con expiración
            </li>
            <li className="flex items-center text-sm text-slate-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              2FA opcional para mayor seguridad
            </li>
          </ul>
        </div>

        <div className="card-modern">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Encriptación de Datos</h3>
          <p className="text-slate-600 mb-4">
            Toda tu información está protegida con el estándar de encriptación más avanzado.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-slate-700">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              AES-256 para datos en reposo
            </li>
            <li className="flex items-center text-sm text-slate-700">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              TLS 1.3 para datos en tránsito
            </li>
            <li className="flex items-center text-sm text-slate-700">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Claves de encriptación únicas por usuario
            </li>
          </ul>
        </div>

        <div className="card-modern">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
            <Database className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Infraestructura Segura</h3>
          <p className="text-slate-600 mb-4">
            Alojamiento en plataformas de confianza con medidas de seguridad de nivel empresarial.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-slate-700">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Servidores en la nube de AWS/Supabase
            </li>
            <li className="flex items-center text-sm text-slate-700">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Firewalls y protección DDoS
            </li>
            <li className="flex items-center text-sm text-slate-700">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Monitoreo 24/7 de seguridad
            </li>
          </ul>
        </div>
      </div>

      {/* Security Features Grid */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">Características de Seguridad</h2>
        <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
          Múltiples capas de protección para garantizar la seguridad de tus datos
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityFeatures.map((feature, index) => (
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
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Cumplimiento y Privacidad</h2>
            <p className="text-slate-600 mb-6">
              Nos comprometemos con la protección de tus datos y cumplimos con los estándares 
              de privacidad más exigentes a nivel internacional.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm font-semibold text-slate-900">GDPR Compliant</p>
                <p className="text-xs text-slate-600">Regulación Europea</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Privacidad por Diseño</p>
                <p className="text-xs text-slate-600">Desde el desarrollo</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Sin Venta de Datos</p>
                <p className="text-xs text-slate-600">Compromiso firme</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Acceso Controlado</p>
                <p className="text-xs text-slate-600">Solo tú decides</p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
              <ShieldCheck className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Backup Info */}
      <div className="card-modern mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
          <Database className="w-6 h-6 mr-2 text-green-500" />
          Sistema de Backup y Recuperación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-green-800 mb-1">Backup Diario</p>
            <p className="text-xs text-green-600">Todos tus datos respaldados automáticamente cada 24 horas</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-blue-800 mb-1">Múltiples Ubicaciones</p>
            <p className="text-xs text-blue-600">Copias de seguridad en diferentes centros de datos</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-purple-800 mb-1">Recuperación Rápida</p>
            <p className="text-xs text-purple-600">Restauración de datos en menos de 24 horas si es necesario</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Tu Información en Buenas Manos</h2>
        <p className="text-blue-100 mb-6 max-w-md mx-auto">
          Confía en nuestra plataforma para proteger lo más valioso: tus datos y tu trabajo
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300"
          >
            Crear Cuenta Segura
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600/20 text-white font-semibold rounded-xl hover:bg-blue-600/30 transition-all duration-300"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  )
}