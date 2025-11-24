'use client'

import { useEffect, useState } from 'react'
import { Camera, Heart, Apple, Users, Calculator, Moon, AlertTriangle, LogOut, User, Loader2 } from 'lucide-react'
import { supabase, Modulo } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Erro ao verificar autenticação:', error)
        router.push('/login')
        return
      }

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)
      await loadModulos()
    } catch (err: any) {
      console.error('Erro ao verificar autenticação:', err)
      setError('Erro ao conectar. Verifique suas configurações do Supabase.')
      setLoading(false)
    }
  }

  const loadModulos = async () => {
    try {
      const { data, error } = await supabase
        .from('modulos')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Erro ao carregar módulos:', error)
        setError('Não foi possível carregar os módulos.')
        setModulos([])
      } else {
        setModulos(data || [])
        setError(null)
      }
    } catch (err: any) {
      console.error('Erro ao carregar módulos:', err)
      setError('Erro ao conectar com o banco de dados.')
      setModulos([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const iconMap: { [key: string]: any } = {
    'Dashboard': Calculator,
    'Galeria': Camera,
    'Perfil': User,
    'Configurações': AlertTriangle,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-200 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Configuração Necessária</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            Clique no banner laranja acima para configurar suas variáveis do Supabase.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-200 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header com perfil */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
              alt="Avatar"
              className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Olá, {user?.user_metadata?.nome || user?.email?.split('@')[0]}!
              </h2>
              <p className="text-sm text-gray-600">Bem-vindo de volta</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-white bg-opacity-50 hover:bg-opacity-70 px-4 py-2 rounded-xl transition-all shadow-md"
          >
            <LogOut className="w-5 h-5 text-gray-700" />
            <span className="text-gray-700 font-medium">Sair</span>
          </button>
        </div>

        {/* Imagem de cabeçalho */}
        <div 
          className="w-full h-48 sm:h-64 bg-cover bg-center rounded-2xl shadow-lg mb-8 sm:mb-12 relative overflow-hidden"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
            <h1 className="text-3xl sm:text-5xl font-bold text-white drop-shadow-lg">
              NutriApp - Sua Saúde em Primeiro Lugar
            </h1>
          </div>
        </div>
        
        {/* Grid de módulos */}
        {modulos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {modulos.map((modulo) => {
              const IconComponent = iconMap[modulo.nome] || Heart
              return (
                <div
                  key={modulo.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer group"
                >
                  {/* Imagem do módulo */}
                  {modulo.imagem && (
                    <div 
                      className="h-40 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${modulo.imagem})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 group-hover:to-black/50 transition-all" />
                      <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-3 group-hover:bg-opacity-100 transition-all">
                        <IconComponent className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {modulo.nome}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {modulo.descricao}
                    </p>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-6 rounded-xl transition-all transform hover:scale-105">
                      Explorar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">Nenhum módulo disponível no momento</p>
          </div>
        )}
        
        {/* Call to action */}
        <div className="mt-12 sm:mt-16">
          <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  Comece Sua Jornada Saudável Hoje!
                </h2>
                <p className="text-gray-600 text-base sm:text-lg">
                  Descubra ferramentas poderosas para melhorar sua alimentação e qualidade de vida.
                </p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=200&h=200&fit=crop"
                alt="Alimentação saudável"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg border-4 border-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
