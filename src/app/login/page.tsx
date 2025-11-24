'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, Loader2, AlertTriangle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        })

        if (error) throw error

        // Aguardar um momento antes de redirecionar
        setTimeout(() => {
          router.push('/')
        }, 500)
      } else {
        // Cadastro
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: {
            data: {
              nome: nome,
            },
          },
        })

        if (error) throw error

        // Criar perfil
        if (data.user) {
          try {
            await supabase.from('profiles').insert({
              id: data.user.id,
              nome: nome,
              imagem_perfil: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            })
          } catch (profileError) {
            console.error('Erro ao criar perfil:', profileError)
          }
        }

        setError('Cadastro realizado! Verifique seu email para confirmar.')
        setTimeout(() => {
          setIsLogin(true)
          setError('')
        }, 3000)
      }
    } catch (error: any) {
      console.error('Erro de autenticação:', error)
      
      if (error.message?.includes('fetch')) {
        setError('Erro de conexão. Verifique se as variáveis do Supabase estão configuradas.')
      } else {
        setError(error.message || 'Ocorreu um erro. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      {/* Imagem de fundo decorativa */}
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80)' }}
      />

      <div className="relative w-full max-w-md">
        {/* Card de Login */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header com imagem */}
          <div 
            className="h-48 bg-cover bg-center relative"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=400&fit=crop)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
            <div className="absolute bottom-4 left-6">
              <h1 className="text-3xl font-bold text-gray-800">
                {isLogin ? 'Bem-vindo!' : 'Criar Conta'}
              </h1>
              <p className="text-gray-600">
                {isLogin ? 'Entre para continuar' : 'Junte-se a nós'}
              </p>
            </div>
          </div>

          {/* Formulário */}
          <div className="p-8">
            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Seu nome"
                      required={!isLogin}
                    />
                    <UserPlus className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="seu@email.com"
                    required
                  />
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className={`p-4 rounded-xl flex items-start space-x-3 ${error.includes('realizado') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {!error.includes('realizado') && <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Carregando...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>{isLogin ? 'Entrar' : 'Cadastrar'}</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
              </button>
            </div>
          </div>
        </div>

        {/* Imagens decorativas flutuantes */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full opacity-20 blur-xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full opacity-20 blur-xl" />
      </div>
    </div>
  )
}
