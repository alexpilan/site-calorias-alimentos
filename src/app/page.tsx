'use client';

import { Camera, Heart, Apple, Users, Calculator, Moon, AlertTriangle } from 'lucide-react';

export default function Home() {
  const funcionalidades = [
    {
      titulo: "Análise de Alimentos por Foto",
      descricao: "Envie uma foto do seu alimento e descubra calorias, presença de glúten e adequação para diabéticos ou hipertensos",
      link: "/calorias-foto",
      icone: Camera,
      cor: "bg-blue-500"
    },
    {
      titulo: "Controle da Pressão Arterial",
      descricao: "Dicas e receitas específicas para controlar a pressão alta através da alimentação",
      link: "/pressao",
      icone: Heart,
      cor: "bg-red-500"
    },
    {
      titulo: "Emagrecimento Saudável",
      descricao: "Receitas e dicas para perder peso de forma saudável e sustentável",
      link: "/emagrecer",
      icone: Apple,
      cor: "bg-green-500"
    },
    {
      titulo: "Alimentação Infantil",
      descricao: "Os melhores alimentos e receitas para o crescimento saudável das crianças",
      link: "/criancas",
      icone: Users,
      cor: "bg-purple-500"
    },
    {
      titulo: "Contador de Calorias",
      descricao: "Monitore calorias ingeridas e queimadas, calcule seu balanço calórico diário",
      link: "/contador",
      icone: Calculator,
      cor: "bg-orange-500"
    },
    {
      titulo: "Melhor Horário para Dormir",
      descricao: "Descubra o horário ideal de sono para sua idade e melhore sua qualidade de vida",
      link: "/sono",
      icone: Moon,
      cor: "bg-indigo-500"
    },
    {
      titulo: "Restrições Alimentares",
      descricao: "Informações sobre glúten, diabetes e outras restrições, com receitas adaptadas",
      link: "/restricoes",
      icone: AlertTriangle,
      cor: "bg-yellow-500"
    },
    {
      titulo: "Chat Comunitário",
      descricao: "Converse com outros usuários sobre alimentação saudável, dicas e experiências",
      link: "/chat",
      icone: Users,
      cor: "bg-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-200 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Imagem de cabeçalho */}
        <div 
          className="w-full h-64 bg-cover bg-center rounded-2xl shadow-lg mb-12"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80)' }}
        ></div>
        
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          NutriApp - Sua Saúde em Primeiro Lugar
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {funcionalidades.map((func, index) => {
            const IconComponent = func.icone;
            return (
              <div
                key={func.link}
                className={`${func.cor} rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer group`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white bg-opacity-20 rounded-full p-4 mb-4 group-hover:bg-opacity-30 transition-all">
                    <IconComponent className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-200 transition-colors">
                    {func.titulo}
                  </h3>
                  <p className="text-white text-sm leading-relaxed opacity-90 group-hover:opacity-100">
                    {func.descricao}
                  </p>
                  <button className="mt-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-2 px-6 rounded-full transition-all">
                    Explorar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Comece Sua Jornada Saudável Hoje!</h2>
            <p className="text-gray-600 text-lg mb-6">
              Descubra ferramentas poderosas para melhorar sua alimentação e qualidade de vida.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                Começar Agora
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}