export interface Gallo {
  id: string
  user_id: string
  nombre: string
  padre?: string
  madre?: string
  abuelo?: string
  abuela?: string
  placa_gallo?: string
  placa_padre?: string
  placa_madre?: string
  placa_abuelo?: string
  placa_abuela?: string
  fecha_marcado?: string
  fecha_registro: string
  color_general?: string
  color_patas?: string
  tipo_cresta?: string
  descripcion?: string
  tipo_brida?: 'brida' | 'tairra'
  numero_brida?: string
  color_brida?: string
  ubicacion_brida?: string
  foto_gallo?: string
  foto_padre?: string
  foto_madre?: string
  foto_abuelo?: string
  foto_abuela?: string
  created_at: string
  updated_at: string
}

export interface Encastes {
  id: string
  user_id: string
  fecha_encaste: string
  hora_encaste?: string
  placa_padrote: string
  placa_gallina: string
  descripcion_brida?: string
  imagen_padrote?: string
  imagen_gallina?: string
  fecha_primer_huevo?: string
  fecha_ultimo_huevo?: string
  total_huevos: number
  imagen_nido?: string
  fecha_inicio_incubacion?: string
  cantidad_pollos_nacidos: number
  fecha_nacimiento?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  username?: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Configuracion {
  id: string
  clave_edicion: string
  created_at: string
}

export interface EncastesStatus {
  encastes: 'pendiente' | 'incubando' | 'completado'
  huevos: 'sin_huevos' | 'con_huevos' | 'incubando'
  pollos: 'sin_nacimientos' | 'con_nacimientos'
}

export interface DashboardStats {
  total_gallos: number
  total_encastes: number
  total_huevos: number
  total_pollos: number
  encastes_activos: number
  encastes_completados: number
}

export interface CookieData {
  name: string
  value: string
  options: {
    path: string
    maxAge?: number
    domain?: string
    secure?: boolean
    httpOnly?: boolean
    sameSite?: 'lax' | 'strict' | 'none'
  }
}

interface StatItem {
  title: string
  value: string  // Siempre string para consistencia
  icon: any
  color: string
  trend: string
  link: string
}