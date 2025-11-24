import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validação das variáveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis do Supabase não configuradas. Configure em Settings > Environment Variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'x-application-name': 'nutriapp',
    },
  },
})

// Helper para verificar conexão
export const checkConnection = async () => {
  try {
    const { error } = await supabase.from('modulos').select('count').limit(1)
    return !error
  } catch {
    return false
  }
}

// Types
export type Profile = {
  id: string
  nome: string | null
  imagem_perfil: string | null
  created_at: string
  updated_at: string
}

export type Modulo = {
  id: string
  nome: string
  descricao: string | null
  imagem: string | null
  created_at: string
  updated_at: string
}

export type Message = {
  id: number
  content: string
  user: string
  created_at: string
}

export type Imagem = {
  id: string
  usuario_id: string | null
  modulo_id: string | null
  url: string
  descricao: string | null
  created_at: string
}
