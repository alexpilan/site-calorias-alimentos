'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase, checkConnection } from '@/lib/supabase';
import { Camera, Heart, Apple, Users, Calculator, Moon, AlertTriangle, MessageCircle, Loader2, LogOut, Upload, Send, Plus, Trash2, Image as ImageIcon, ChefHat, Salad, Type } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Modulo {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
}

interface Profile {
  nome: string;
  imagem_perfil: string;
}

interface Message {
  id: number;
  content: string;
  user: string;
  created_at: string;
}

interface Receita {
  nome: string;
  ingredientes: string[];
  modoPreparo: string;
  tempoPreparo: string;
  porcoes: number;
  calorias: number;
  categoria: string;
}

const MODULOS_PADRAO: Modulo[] = [
  {
    id: '1',
    nome: 'Análise de Alimentos por Foto',
    descricao: 'Tire uma foto e descubra informações nutricionais com 99% de precisão',
    imagem: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    nome: 'Contador de Calorias',
    descricao: 'Monitore suas calorias diárias',
    imagem: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    nome: 'Controle da Pressão Arterial',
    descricao: 'Acompanhe sua pressão arterial',
    imagem: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    nome: 'Receitas Saudáveis para Crianças',
    descricao: 'Receitas nutritivas e deliciosas para os pequenos',
    imagem: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    nome: 'Receitas para Emagrecimento',
    descricao: '100+ receitas saudáveis para perder peso',
    imagem: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'
  },
  {
    id: '6',
    nome: 'Chat Comunitário',
    descricao: 'Converse com outros usuários',
    imagem: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop'
  }
];

const RECEITAS_CRIANCAS: Receita[] = [
  {
    nome: "Panqueca de Banana e Aveia",
    ingredientes: [
      "2 bananas maduras",
      "1 xícara de aveia em flocos",
      "2 ovos",
      "1 colher de chá de canela",
      "Mel a gosto (opcional)"
    ],
    modoPreparo: "1. Amasse as bananas em uma tigela. 2. Adicione os ovos e misture bem. 3. Acrescente a aveia e a canela, mexendo até formar uma massa homogênea. 4. Aqueça uma frigideira antiaderente e despeje pequenas porções da massa. 5. Cozinhe por 2-3 minutos de cada lado até dourar. 6. Sirva com mel se desejar.",
    tempoPreparo: "15 minutos",
    porcoes: 4,
    calorias: 180,
    categoria: "Café da manhã"
  },
  {
    nome: "Nuggets de Frango Caseiros",
    ingredientes: [
      "500g de peito de frango",
      "1 xícara de farinha de rosca integral",
      "2 ovos batidos",
      "Temperos a gosto (alho, cebola em pó, sal)",
      "Azeite para untar"
    ],
    modoPreparo: "1. Corte o frango em pedaços pequenos. 2. Tempere com alho, cebola em pó e sal. 3. Passe os pedaços no ovo batido e depois na farinha de rosca. 4. Coloque em uma assadeira untada com azeite. 5. Asse em forno pré-aquecido a 200°C por 20-25 minutos, virando na metade do tempo.",
    tempoPreparo: "35 minutos",
    porcoes: 4,
    calorias: 220,
    categoria: "Almoço/Jantar"
  },
  {
    nome: "Smoothie de Frutas Colorido",
    ingredientes: [
      "1 banana congelada",
      "1/2 xícara de morangos",
      "1/2 xícara de manga",
      "1 xícara de leite (ou leite vegetal)",
      "1 colher de sopa de mel"
    ],
    modoPreparo: "1. Coloque todos os ingredientes no liquidificador. 2. Bata até ficar cremoso e homogêneo. 3. Sirva imediatamente em copos coloridos. 4. Decore com frutas frescas se desejar.",
    tempoPreparo: "5 minutos",
    porcoes: 2,
    calorias: 150,
    categoria: "Lanche"
  },
  {
    nome: "Bolinho de Cenoura com Aveia",
    ingredientes: [
      "2 cenouras médias raladas",
      "1 xícara de aveia em flocos",
      "2 ovos",
      "1/4 xícara de mel",
      "1 colher de chá de fermento em pó",
      "Canela a gosto"
    ],
    modoPreparo: "1. Misture todos os ingredientes em uma tigela até formar uma massa homogênea. 2. Coloque em forminhas de cupcake untadas. 3. Asse em forno pré-aquecido a 180°C por 20-25 minutos. 4. Deixe esfriar antes de servir.",
    tempoPreparo: "35 minutos",
    porcoes: 12,
    calorias: 95,
    categoria: "Lanche"
  },
  {
    nome: "Espaguete de Abobrinha com Molho de Tomate",
    ingredientes: [
      "2 abobrinhas médias",
      "2 xícaras de molho de tomate caseiro",
      "1 dente de alho picado",
      "Queijo ralado a gosto",
      "Manjericão fresco"
    ],
    modoPreparo: "1. Use um espiralizador para transformar as abobrinhas em 'espaguete'. 2. Refogue o alho em um fio de azeite. 3. Adicione o molho de tomate e deixe aquecer. 4. Acrescente o espaguete de abobrinha e cozinhe por 2-3 minutos. 5. Sirva com queijo ralado e manjericão fresco.",
    tempoPreparo: "20 minutos",
    porcoes: 3,
    calorias: 120,
    categoria: "Almoço/Jantar"
  },
  {
    nome: "Picolé de Iogurte com Frutas",
    ingredientes: [
      "2 xícaras de iogurte natural",
      "1 xícara de frutas picadas (morango, kiwi, manga)",
      "2 colheres de sopa de mel",
      "Forminhas de picolé"
    ],
    modoPreparo: "1. Misture o iogurte com o mel. 2. Distribua as frutas picadas nas forminhas. 3. Despeje o iogurte sobre as frutas. 4. Insira os palitos e leve ao freezer por pelo menos 4 horas. 5. Para desenformar, passe água morna na parte externa da forminha.",
    tempoPreparo: "10 minutos + 4h congelamento",
    porcoes: 6,
    calorias: 80,
    categoria: "Sobremesa"
  }
];

const RECEITAS_EMAGRECIMENTO: Receita[] = [
  // Café da Manhã (20 receitas)
  { nome: "Omelete de Claras com Espinafre", ingredientes: ["4 claras de ovo", "1 xícara de espinafre", "Tomate cereja", "Sal e pimenta"], modoPreparo: "Bata as claras, adicione o espinafre picado e temperos. Cozinhe em frigideira antiaderente até firmar. Sirva com tomates.", tempoPreparo: "10 min", porcoes: 1, calorias: 120, categoria: "Café da manhã" },
  { nome: "Mingau de Aveia com Canela", ingredientes: ["1/2 xícara de aveia", "1 xícara de leite desnatado", "Canela em pó", "Stevia"], modoPreparo: "Cozinhe a aveia no leite até engrossar. Adicione canela e stevia a gosto.", tempoPreparo: "8 min", porcoes: 1, calorias: 180, categoria: "Café da manhã" },
  { nome: "Iogurte Grego com Frutas Vermelhas", ingredientes: ["1 pote de iogurte grego 0%", "1/2 xícara de frutas vermelhas", "1 colher de chia"], modoPreparo: "Misture todos os ingredientes e sirva gelado.", tempoPreparo: "3 min", porcoes: 1, calorias: 150, categoria: "Café da manhã" },
  { nome: "Panqueca de Banana Fit", ingredientes: ["1 banana", "2 ovos", "Canela"], modoPreparo: "Amasse a banana, misture com ovos e canela. Cozinhe em frigideira antiaderente.", tempoPreparo: "10 min", porcoes: 1, calorias: 200, categoria: "Café da manhã" },
  { nome: "Smoothie Verde Detox", ingredientes: ["1 folha de couve", "1/2 maçã verde", "Suco de 1 limão", "Gengibre", "Água"], modoPreparo: "Bata todos os ingredientes no liquidificador até ficar homogêneo.", tempoPreparo: "5 min", porcoes: 1, calorias: 80, categoria: "Café da manhã" },
  { nome: "Tapioca com Queijo Branco", ingredientes: ["3 colheres de tapioca", "2 fatias de queijo branco light"], modoPreparo: "Hidrate a tapioca, espalhe na frigideira quente, adicione queijo e dobre.", tempoPreparo: "7 min", porcoes: 1, calorias: 160, categoria: "Café da manhã" },
  { nome: "Vitamina de Abacate Light", ingredientes: ["1/2 abacate", "1 xícara de leite desnatado", "Stevia", "Gelo"], modoPreparo: "Bata todos os ingredientes no liquidificador.", tempoPreparo: "5 min", porcoes: 1, calorias: 190, categoria: "Café da manhã" },
  { nome: "Pão Integral com Pasta de Amendoim", ingredientes: ["2 fatias de pão integral", "1 colher de pasta de amendoim natural", "Banana fatiada"], modoPreparo: "Passe a pasta no pão e adicione rodelas de banana.", tempoPreparo: "3 min", porcoes: 1, calorias: 220, categoria: "Café da manhã" },
  { nome: "Crepioca Simples", ingredientes: ["1 ovo", "2 colheres de tapioca", "Sal"], modoPreparo: "Misture ovo batido com tapioca e sal. Cozinhe em frigideira antiaderente.", tempoPreparo: "8 min", porcoes: 1, calorias: 140, categoria: "Café da manhã" },
  { nome: "Salada de Frutas com Chia", ingredientes: ["Mamão", "Melão", "Morango", "1 colher de chia", "Hortelã"], modoPreparo: "Corte as frutas, misture com chia e decore com hortelã.", tempoPreparo: "10 min", porcoes: 1, calorias: 130, categoria: "Café da manhã" },
  { nome: "Wrap de Ovo com Vegetais", ingredientes: ["2 ovos", "Alface", "Tomate", "Cenoura ralada"], modoPreparo: "Faça um omelete fino, recheie com vegetais e enrole.", tempoPreparo: "12 min", porcoes: 1, calorias: 170, categoria: "Café da manhã" },
  { nome: "Overnight Oats", ingredientes: ["1/2 xícara de aveia", "1 xícara de leite vegetal", "Frutas", "Canela"], modoPreparo: "Misture aveia com leite, deixe na geladeira overnight. Sirva com frutas.", tempoPreparo: "5 min + overnight", porcoes: 1, calorias: 200, categoria: "Café da manhã" },
  { nome: "Queijo Cottage com Tomate", ingredientes: ["1/2 xícara de cottage", "Tomate cereja", "Manjericão", "Azeite"], modoPreparo: "Sirva o cottage com tomates cortados, manjericão e fio de azeite.", tempoPreparo: "5 min", porcoes: 1, calorias: 110, categoria: "Café da manhã" },
  { nome: "Smoothie de Mamão com Aveia", ingredientes: ["1 fatia de mamão", "1 colher de aveia", "Leite desnatado", "Canela"], modoPreparo: "Bata todos os ingredientes no liquidificador.", tempoPreparo: "5 min", porcoes: 1, calorias: 160, categoria: "Café da manhã" },
  { nome: "Torrada Integral com Abacate", ingredientes: ["2 fatias de pão integral", "1/2 abacate", "Limão", "Pimenta"], modoPreparo: "Amasse o abacate, tempere com limão e pimenta. Espalhe no pão torrado.", tempoPreparo: "7 min", porcoes: 1, calorias: 210, categoria: "Café da manhã" },
  { nome: "Vitamina de Morango Fit", ingredientes: ["1 xícara de morangos", "Leite desnatado", "Aveia", "Stevia"], modoPreparo: "Bata todos os ingredientes no liquidificador.", tempoPreparo: "5 min", porcoes: 1, calorias: 140, categoria: "Café da manhã" },
  { nome: "Ovo Mexido com Tomate", ingredientes: ["2 ovos", "1 tomate picado", "Cebola", "Sal e pimenta"], modoPreparo: "Refogue a cebola e tomate, adicione os ovos batidos e mexa até cozinhar.", tempoPreparo: "10 min", porcoes: 1, calorias: 160, categoria: "Café da manhã" },
  { nome: "Panqueca de Aveia com Mel", ingredientes: ["1/2 xícara de aveia", "1 ovo", "Leite", "Mel"], modoPreparo: "Bata aveia, ovo e leite. Cozinhe em frigideira. Sirva com mel.", tempoPreparo: "12 min", porcoes: 1, calorias: 190, categoria: "Café da manhã" },
  { nome: "Iogurte com Granola Light", ingredientes: ["1 pote de iogurte natural", "2 colheres de granola light", "Frutas"], modoPreparo: "Monte em camadas: iogurte, granola e frutas.", tempoPreparo: "5 min", porcoes: 1, calorias: 180, categoria: "Café da manhã" },
  { nome: "Smoothie Bowl de Açaí Light", ingredientes: ["1 pacote de açaí sem açúcar", "Banana", "Granola", "Frutas"], modoPreparo: "Bata o açaí com banana. Sirva em bowl com granola e frutas.", tempoPreparo: "8 min", porcoes: 1, calorias: 220, categoria: "Café da manhã" },

  // Almoço (30 receitas)
  { nome: "Frango Grelhado com Legumes", ingredientes: ["150g de peito de frango", "Brócolis", "Cenoura", "Abobrinha", "Temperos"], modoPreparo: "Tempere e grelhe o frango. Cozinhe os legumes no vapor. Sirva junto.", tempoPreparo: "25 min", porcoes: 1, calorias: 280, categoria: "Almoço" },
  { nome: "Salada Caesar Light", ingredientes: ["Alface romana", "Frango grelhado", "Parmesão light", "Molho caesar light"], modoPreparo: "Monte a salada com alface, frango em tiras e parmesão. Regue com molho.", tempoPreparo: "15 min", porcoes: 1, calorias: 250, categoria: "Almoço" },
  { nome: "Peixe Assado com Batata Doce", ingredientes: ["150g de tilápia", "1 batata doce média", "Limão", "Ervas"], modoPreparo: "Tempere o peixe com limão e ervas. Asse junto com a batata doce em rodelas.", tempoPreparo: "30 min", porcoes: 1, calorias: 320, categoria: "Almoço" },
  { nome: "Arroz Integral com Lentilha", ingredientes: ["1/2 xícara de arroz integral", "1/2 xícara de lentilha", "Cebola", "Alho"], modoPreparo: "Cozinhe o arroz e a lentilha separadamente. Refogue com cebola e alho.", tempoPreparo: "35 min", porcoes: 1, calorias: 290, categoria: "Almoço" },
  { nome: "Omelete de Forno com Vegetais", ingredientes: ["3 ovos", "Brócolis", "Tomate", "Queijo light"], modoPreparo: "Bata os ovos, adicione vegetais picados. Asse em forma untada por 20 min.", tempoPreparo: "25 min", porcoes: 1, calorias: 240, categoria: "Almoço" },
  { nome: "Salada de Atum", ingredientes: ["1 lata de atum", "Alface", "Tomate", "Pepino", "Azeite"], modoPreparo: "Misture o atum com vegetais picados. Tempere com azeite e limão.", tempoPreparo: "10 min", porcoes: 1, calorias: 220, categoria: "Almoço" },
  { nome: "Espaguete de Abobrinha ao Pesto", ingredientes: ["2 abobrinhas", "Manjericão", "Alho", "Azeite", "Castanhas"], modoPreparo: "Faça espaguete de abobrinha. Prepare pesto batendo manjericão, alho, azeite e castanhas.", tempoPreparo: "20 min", porcoes: 1, calorias: 200, categoria: "Almoço" },
  { nome: "Peito de Peru com Quinoa", ingredientes: ["150g de peito de peru", "1/2 xícara de quinoa", "Vegetais"], modoPreparo: "Grelhe o peru. Cozinhe a quinoa. Sirva com vegetais refogados.", tempoPreparo: "25 min", porcoes: 1, calorias: 310, categoria: "Almoço" },
  { nome: "Sopa de Legumes", ingredientes: ["Cenoura", "Abobrinha", "Batata", "Cebola", "Alho"], modoPreparo: "Refogue cebola e alho. Adicione legumes picados e água. Cozinhe até amolecer.", tempoPreparo: "30 min", porcoes: 2, calorias: 150, categoria: "Almoço" },
  { nome: "Hambúrguer de Grão-de-Bico", ingredientes: ["1 xícara de grão-de-bico", "Cebola", "Alho", "Temperos"], modoPreparo: "Processe o grão-de-bico com temperos. Modele hambúrgueres e asse.", tempoPreparo: "25 min", porcoes: 2, calorias: 180, categoria: "Almoço" },
  { nome: "Wrap de Frango Light", ingredientes: ["Tortilha integral", "Frango desfiado", "Alface", "Tomate"], modoPreparo: "Recheie a tortilha com frango e vegetais. Enrole e sirva.", tempoPreparo: "15 min", porcoes: 1, calorias: 270, categoria: "Almoço" },
  { nome: "Risoto de Cogumelos Light", ingredientes: ["Arroz arbóreo", "Cogumelos", "Caldo de legumes", "Queijo light"], modoPreparo: "Refogue cogumelos. Adicione arroz e vá acrescentando caldo aos poucos.", tempoPreparo: "35 min", porcoes: 2, calorias: 260, categoria: "Almoço" },
  { nome: "Berinjela Recheada", ingredientes: ["1 berinjela", "Carne moída magra", "Tomate", "Queijo light"], modoPreparo: "Corte berinjela ao meio, retire polpa. Refogue carne com tomate, recheie e asse.", tempoPreparo: "40 min", porcoes: 2, calorias: 230, categoria: "Almoço" },
  { nome: "Salada Completa com Grão-de-Bico", ingredientes: ["Alface", "Grão-de-bico", "Tomate", "Pepino", "Azeite"], modoPreparo: "Monte a salada com todos os ingredientes. Tempere com azeite e limão.", tempoPreparo: "10 min", porcoes: 1, calorias: 240, categoria: "Almoço" },
  { nome: "Frango ao Curry Light", ingredientes: ["150g de frango", "Leite de coco light", "Curry", "Vegetais"], modoPreparo: "Refogue frango com curry. Adicione leite de coco e vegetais. Cozinhe até apurar.", tempoPreparo: "30 min", porcoes: 1, calorias: 290, categoria: "Almoço" },
  { nome: "Atum Selado com Salada", ingredientes: ["150g de atum fresco", "Mix de folhas", "Tomate", "Gergelim"], modoPreparo: "Sele o atum rapidamente. Sirva sobre salada com gergelim.", tempoPreparo: "15 min", porcoes: 1, calorias: 260, categoria: "Almoço" },
  { nome: "Lasanha de Berinjela", ingredientes: ["Berinjela", "Molho de tomate", "Ricota", "Queijo light"], modoPreparo: "Fatie berinjela, grelhe. Monte camadas com molho e ricota. Asse.", tempoPreparo: "45 min", porcoes: 3, calorias: 210, categoria: "Almoço" },
  { nome: "Carne Magra com Purê de Couve-flor", ingredientes: ["150g de carne magra", "1 couve-flor", "Alho", "Azeite"], modoPreparo: "Grelhe a carne. Cozinhe couve-flor e processe com alho e azeite.", tempoPreparo: "30 min", porcoes: 1, calorias: 300, categoria: "Almoço" },
  { nome: "Salada de Quinoa", ingredientes: ["Quinoa", "Tomate", "Pepino", "Hortelã", "Limão"], modoPreparo: "Cozinhe quinoa. Misture com vegetais picados e tempere.", tempoPreparo: "20 min", porcoes: 2, calorias: 200, categoria: "Almoço" },
  { nome: "Peixe ao Molho de Limão", ingredientes: ["150g de peixe branco", "Limão", "Ervas", "Azeite"], modoPreparo: "Tempere peixe com limão e ervas. Grelhe ou asse.", tempoPreparo: "20 min", porcoes: 1, calorias: 230, categoria: "Almoço" },
  { nome: "Bowl de Salmão", ingredientes: ["100g de salmão", "Arroz integral", "Abacate", "Edamame"], modoPreparo: "Grelhe salmão. Monte bowl com arroz, salmão, abacate e edamame.", tempoPreparo: "25 min", porcoes: 1, calorias: 380, categoria: "Almoço" },
  { nome: "Strogonoff de Frango Light", ingredientes: ["Frango", "Champignon", "Iogurte grego", "Mostarda"], modoPreparo: "Refogue frango e champignon. Adicione iogurte e mostarda.", tempoPreparo: "25 min", porcoes: 2, calorias: 270, categoria: "Almoço" },
  { nome: "Salada Caprese", ingredientes: ["Tomate", "Mussarela de búfala light", "Manjericão", "Azeite"], modoPreparo: "Fatie tomate e queijo. Intercale com manjericão. Regue com azeite.", tempoPreparo: "10 min", porcoes: 1, calorias: 190, categoria: "Almoço" },
  { nome: "Frango Xadrez Light", ingredientes: ["Frango", "Pimentão", "Cebola", "Shoyu light"], modoPreparo: "Refogue frango com vegetais. Tempere com shoyu.", tempoPreparo: "20 min", porcoes: 2, calorias: 250, categoria: "Almoço" },
  { nome: "Sopa de Abóbora", ingredientes: ["Abóbora", "Cebola", "Alho", "Gengibre"], modoPreparo: "Refogue cebola e alho. Adicione abóbora e água. Cozinhe e bata.", tempoPreparo: "30 min", porcoes: 3, calorias: 120, categoria: "Almoço" },
  { nome: "Tabule Light", ingredientes: ["Trigo para quibe", "Tomate", "Pepino", "Hortelã", "Limão"], modoPreparo: "Hidrate o trigo. Misture com vegetais picados e tempere.", tempoPreparo: "20 min", porcoes: 2, calorias: 160, categoria: "Almoço" },
  { nome: "Peito de Frango Recheado", ingredientes: ["Peito de frango", "Espinafre", "Ricota", "Tomate seco"], modoPreparo: "Abra o frango, recheie com espinafre e ricota. Enrole e asse.", tempoPreparo: "35 min", porcoes: 1, calorias: 290, categoria: "Almoço" },
  { nome: "Salada de Lentilha", ingredientes: ["Lentilha", "Cenoura", "Cebola roxa", "Vinagre"], modoPreparo: "Cozinhe lentilha. Misture com vegetais picados e tempere.", tempoPreparo: "25 min", porcoes: 2, calorias: 180, categoria: "Almoço" },
  { nome: "Omelete de Forno Proteico", ingredientes: ["4 claras", "2 ovos", "Brócolis", "Queijo cottage"], modoPreparo: "Bata ovos com vegetais. Asse em forma untada.", tempoPreparo: "25 min", porcoes: 2, calorias: 200, categoria: "Almoço" },
  { nome: "Cuscuz Marroquino com Vegetais", ingredientes: ["Cuscuz marroquino", "Abobrinha", "Berinjela", "Pimentão"], modoPreparo: "Hidrate cuscuz. Grelhe vegetais. Misture tudo.", tempoPreparo: "20 min", porcoes: 2, calorias: 210, categoria: "Almoço" },

  // Jantar (30 receitas)
  { nome: "Sopa Detox de Couve", ingredientes: ["Couve", "Batata", "Cebola", "Alho"], modoPreparo: "Refogue cebola e alho. Adicione couve e batata. Cozinhe e bata.", tempoPreparo: "25 min", porcoes: 2, calorias: 110, categoria: "Jantar" },
  { nome: "Omelete Light de Claras", ingredientes: ["4 claras", "Tomate", "Cebola", "Orégano"], modoPreparo: "Bata claras com vegetais picados. Cozinhe em frigideira.", tempoPreparo: "10 min", porcoes: 1, calorias: 90, categoria: "Jantar" },
  { nome: "Salada Verde com Atum", ingredientes: ["Mix de folhas", "Atum", "Tomate cereja", "Azeite"], modoPreparo: "Monte salada com folhas, atum e tomates. Tempere.", tempoPreparo: "8 min", porcoes: 1, calorias: 180, categoria: "Jantar" },
  { nome: "Caldo Verde Light", ingredientes: ["Couve", "Batata", "Cebola", "Alho"], modoPreparo: "Cozinhe batata com cebola e alho. Adicione couve fatiada.", tempoPreparo: "20 min", porcoes: 2, calorias: 130, categoria: "Jantar" },
  { nome: "Peixe ao Vapor", ingredientes: ["150g de peixe", "Limão", "Ervas", "Legumes"], modoPreparo: "Tempere peixe e cozinhe no vapor com legumes.", tempoPreparo: "20 min", porcoes: 1, calorias: 200, categoria: "Jantar" },
  { nome: "Salada de Frango Desfiado", ingredientes: ["Frango desfiado", "Alface", "Cenoura", "Repolho"], modoPreparo: "Misture frango com vegetais ralados. Tempere levemente.", tempoPreparo: "15 min", porcoes: 1, calorias: 220, categoria: "Jantar" },
  { nome: "Sopa de Tomate", ingredientes: ["Tomate", "Cebola", "Alho", "Manjericão"], modoPreparo: "Refogue cebola e alho. Adicione tomates e cozinhe. Bata.", tempoPreparo: "25 min", porcoes: 2, calorias: 100, categoria: "Jantar" },
  { nome: "Wrap de Alface com Peru", ingredientes: ["Folhas de alface", "Peito de peru", "Tomate", "Mostarda"], modoPreparo: "Use alface como wrap. Recheie com peru e vegetais.", tempoPreparo: "10 min", porcoes: 1, calorias: 150, categoria: "Jantar" },
  { nome: "Creme de Espinafre", ingredientes: ["Espinafre", "Cebola", "Alho", "Leite desnatado"], modoPreparo: "Refogue espinafre com cebola e alho. Adicione leite e bata.", tempoPreparo: "20 min", porcoes: 2, calorias: 120, categoria: "Jantar" },
  { nome: "Salada de Grão-de-Bico", ingredientes: ["Grão-de-bico", "Tomate", "Pepino", "Limão"], modoPreparo: "Misture grão-de-bico com vegetais. Tempere com limão.", tempoPreparo: "10 min", porcoes: 1, calorias: 190, categoria: "Jantar" },
  { nome: "Omelete de Cogumelos", ingredientes: ["2 ovos", "Cogumelos", "Cebola", "Salsa"], modoPreparo: "Refogue cogumelos. Adicione ovos batidos e finalize.", tempoPreparo: "12 min", porcoes: 1, calorias: 160, categoria: "Jantar" },
  { nome: "Sopa de Legumes com Frango", ingredientes: ["Frango desfiado", "Cenoura", "Abobrinha", "Cebola"], modoPreparo: "Cozinhe legumes com frango. Tempere a gosto.", tempoPreparo: "30 min", porcoes: 2, calorias: 180, categoria: "Jantar" },
  { nome: "Salada de Rúcula com Tomate Seco", ingredientes: ["Rúcula", "Tomate seco", "Queijo branco", "Azeite"], modoPreparo: "Monte salada com todos ingredientes. Regue com azeite.", tempoPreparo: "8 min", porcoes: 1, calorias: 140, categoria: "Jantar" },
  { nome: "Creme de Abobrinha", ingredientes: ["Abobrinha", "Cebola", "Alho", "Caldo de legumes"], modoPreparo: "Refogue abobrinha com temperos. Adicione caldo e bata.", tempoPreparo: "20 min", porcoes: 2, calorias: 90, categoria: "Jantar" },
  { nome: "Atum com Salada", ingredientes: ["1 lata de atum", "Alface", "Tomate", "Cebola"], modoPreparo: "Escorra atum e misture com salada. Tempere.", tempoPreparo: "8 min", porcoes: 1, calorias: 170, categoria: "Jantar" },
  { nome: "Sopa de Mandioquinha", ingredientes: ["Mandioquinha", "Cebola", "Alho", "Salsinha"], modoPreparo: "Cozinhe mandioquinha com temperos. Bata até cremoso.", tempoPreparo: "25 min", porcoes: 2, calorias: 140, categoria: "Jantar" },
  { nome: "Salada Tropical", ingredientes: ["Alface", "Manga", "Frango grelhado", "Castanhas"], modoPreparo: "Monte salada com folhas, manga e frango. Adicione castanhas.", tempoPreparo: "15 min", porcoes: 1, calorias: 240, categoria: "Jantar" },
  { nome: "Creme de Brócolis", ingredientes: ["Brócolis", "Cebola", "Alho", "Leite desnatado"], modoPreparo: "Cozinhe brócolis com temperos. Bata com leite.", tempoPreparo: "20 min", porcoes: 2, calorias: 110, categoria: "Jantar" },
  { nome: "Omelete de Tomate", ingredientes: ["2 ovos", "Tomate", "Cebola", "Manjericão"], modoPreparo: "Bata ovos com tomate picado. Cozinhe em frigideira.", tempoPreparo: "10 min", porcoes: 1, calorias: 140, categoria: "Jantar" },
  { nome: "Salada de Pepino com Iogurte", ingredientes: ["Pepino", "Iogurte natural", "Hortelã", "Limão"], modoPreparo: "Fatie pepino. Misture com iogurte, hortelã e limão.", tempoPreparo: "10 min", porcoes: 1, calorias: 80, categoria: "Jantar" },
  { nome: "Sopa de Cenoura com Gengibre", ingredientes: ["Cenoura", "Gengibre", "Cebola", "Caldo de legumes"], modoPreparo: "Refogue cenoura com gengibre. Adicione caldo e bata.", tempoPreparo: "25 min", porcoes: 2, calorias: 100, categoria: "Jantar" },
  { nome: "Wrap de Vegetais", ingredientes: ["Tortilha integral", "Alface", "Cenoura", "Pepino", "Homus"], modoPreparo: "Espalhe homus na tortilha. Adicione vegetais e enrole.", tempoPreparo: "10 min", porcoes: 1, calorias: 180, categoria: "Jantar" },
  { nome: "Creme de Couve-flor", ingredientes: ["Couve-flor", "Cebola", "Alho", "Leite desnatado"], modoPreparo: "Cozinhe couve-flor com temperos. Bata com leite.", tempoPreparo: "20 min", porcoes: 2, calorias: 95, categoria: "Jantar" },
  { nome: "Salada de Beterraba", ingredientes: ["Beterraba", "Rúcula", "Queijo feta light", "Nozes"], modoPreparo: "Cozinhe e fatie beterraba. Monte salada com rúcula e queijo.", tempoPreparo: "30 min", porcoes: 1, calorias: 160, categoria: "Jantar" },
  { nome: "Omelete de Espinafre", ingredientes: ["2 ovos", "Espinafre", "Queijo cottage", "Tomate"], modoPreparo: "Refogue espinafre. Adicione ovos batidos e cottage.", tempoPreparo: "12 min", porcoes: 1, calorias: 170, categoria: "Jantar" },
  { nome: "Sopa de Ervilha", ingredientes: ["Ervilha", "Cebola", "Alho", "Hortelã"], modoPreparo: "Cozinhe ervilha com temperos. Bata até cremoso.", tempoPreparo: "25 min", porcoes: 2, calorias: 130, categoria: "Jantar" },
  { nome: "Salada de Quinoa com Vegetais", ingredientes: ["Quinoa", "Tomate", "Pepino", "Pimentão", "Limão"], modoPreparo: "Cozinhe quinoa. Misture com vegetais picados e tempere.", tempoPreparo: "20 min", porcoes: 1, calorias: 200, categoria: "Jantar" },
  { nome: "Creme de Abóbora com Gengibre", ingredientes: ["Abóbora", "Gengibre", "Cebola", "Leite de coco light"], modoPreparo: "Cozinhe abóbora com gengibre. Bata com leite de coco.", tempoPreparo: "30 min", porcoes: 2, calorias: 120, categoria: "Jantar" },
  { nome: "Salada de Ovo", ingredientes: ["2 ovos cozidos", "Alface", "Tomate", "Pepino"], modoPreparo: "Corte ovos e misture com salada. Tempere levemente.", tempoPreparo: "10 min", porcoes: 1, calorias: 150, categoria: "Jantar" },
  { nome: "Sopa de Cebola Light", ingredientes: ["Cebola", "Alho", "Caldo de legumes", "Tomilho"], modoPreparo: "Caramelize cebola. Adicione caldo e cozinhe.", tempoPreparo: "30 min", porcoes: 2, calorias: 110, categoria: "Jantar" },

  // Lanches (20 receitas)
  { nome: "Palitos de Cenoura com Homus", ingredientes: ["Cenoura", "Grão-de-bico", "Tahine", "Limão"], modoPreparo: "Corte cenoura em palitos. Prepare homus batendo grão-de-bico com tahine e limão.", tempoPreparo: "15 min", porcoes: 1, calorias: 120, categoria: "Lanche" },
  { nome: "Iogurte com Granola", ingredientes: ["Iogurte natural", "Granola light", "Frutas vermelhas"], modoPreparo: "Monte em camadas: iogurte, granola e frutas.", tempoPreparo: "5 min", porcoes: 1, calorias: 160, categoria: "Lanche" },
  { nome: "Mix de Castanhas", ingredientes: ["Amêndoas", "Castanha de caju", "Nozes", "Damasco seco"], modoPreparo: "Misture as castanhas e frutas secas. Porção de 30g.", tempoPreparo: "2 min", porcoes: 1, calorias: 180, categoria: "Lanche" },
  { nome: "Maçã com Pasta de Amendoim", ingredientes: ["1 maçã", "1 colher de pasta de amendoim natural"], modoPreparo: "Fatie a maçã e sirva com pasta de amendoim.", tempoPreparo: "3 min", porcoes: 1, calorias: 170, categoria: "Lanche" },
  { nome: "Queijo Branco com Tomate", ingredientes: ["2 fatias de queijo branco", "Tomate cereja", "Orégano"], modoPreparo: "Sirva queijo com tomates e orégano.", tempoPreparo: "3 min", porcoes: 1, calorias: 100, categoria: "Lanche" },
  { nome: "Smoothie de Frutas", ingredientes: ["Banana", "Morango", "Leite desnatado", "Aveia"], modoPreparo: "Bata todos os ingredientes no liquidificador.", tempoPreparo: "5 min", porcoes: 1, calorias: 150, categoria: "Lanche" },
  { nome: "Biscoito de Aveia Caseiro", ingredientes: ["Aveia", "Banana", "Canela", "Passas"], modoPreparo: "Amasse banana, misture com aveia e canela. Modele e asse.", tempoPreparo: "20 min", porcoes: 6, calorias: 80, categoria: "Lanche" },
  { nome: "Pepino com Cream Cheese Light", ingredientes: ["Pepino", "Cream cheese light", "Cebolinha"], modoPreparo: "Fatie pepino e sirva com cream cheese e cebolinha.", tempoPreparo: "5 min", porcoes: 1, calorias: 90, categoria: "Lanche" },
  { nome: "Gelatina com Frutas", ingredientes: ["Gelatina diet", "Frutas picadas"], modoPreparo: "Prepare gelatina conforme embalagem. Adicione frutas.", tempoPreparo: "10 min + gelar", porcoes: 2, calorias: 60, categoria: "Lanche" },
  { nome: "Chips de Batata Doce", ingredientes: ["1 batata doce", "Azeite", "Sal"], modoPreparo: "Fatie batata finamente. Pincele com azeite e asse até crocante.", tempoPreparo: "25 min", porcoes: 1, calorias: 130, categoria: "Lanche" },
  { nome: "Vitamina de Abacate", ingredientes: ["1/2 abacate", "Leite desnatado", "Cacau em pó", "Stevia"], modoPreparo: "Bata todos os ingredientes no liquidificador.", tempoPreparo: "5 min", porcoes: 1, calorias: 180, categoria: "Lanche" },
  { nome: "Torrada com Ricota", ingredientes: ["2 torradas integrais", "Ricota", "Tomate", "Manjericão"], modoPreparo: "Espalhe ricota nas torradas. Adicione tomate e manjericão.", tempoPreparo: "5 min", porcoes: 1, calorias: 140, categoria: "Lanche" },
  { nome: "Bolinha de Tâmara com Coco", ingredientes: ["Tâmaras", "Coco ralado", "Cacau"], modoPreparo: "Processe tâmaras. Modele bolinhas e passe no coco.", tempoPreparo: "15 min", porcoes: 8, calorias: 70, categoria: "Lanche" },
  { nome: "Chá Verde com Limão", ingredientes: ["Chá verde", "Limão", "Gengibre"], modoPreparo: "Prepare chá verde. Adicione limão e gengibre.", tempoPreparo: "5 min", porcoes: 1, calorias: 5, categoria: "Lanche" },
  { nome: "Ovo Cozido", ingredientes: ["2 ovos"], modoPreparo: "Cozinhe ovos por 10 minutos. Descasque e sirva.", tempoPreparo: "12 min", porcoes: 1, calorias: 140, categoria: "Lanche" },
  { nome: "Frutas com Iogurte", ingredientes: ["Frutas variadas", "Iogurte natural", "Mel"], modoPreparo: "Corte frutas e sirva com iogurte e mel.", tempoPreparo: "8 min", porcoes: 1, calorias: 130, categoria: "Lanche" },
  { nome: "Pipoca Caseira", ingredientes: ["Milho para pipoca", "Azeite", "Sal"], modoPreparo: "Estoure milho em panela com azeite. Tempere com sal.", tempoPreparo: "10 min", porcoes: 2, calorias: 100, categoria: "Lanche" },
  { nome: "Wrap de Alface com Atum", ingredientes: ["Folhas de alface", "Atum", "Tomate"], modoPreparo: "Use alface como wrap. Recheie com atum e tomate.", tempoPreparo: "8 min", porcoes: 1, calorias: 110, categoria: "Lanche" },
  { nome: "Mousse de Chocolate Fit", ingredientes: ["Abacate", "Cacau em pó", "Mel", "Leite"], modoPreparo: "Bata abacate com cacau, mel e leite até cremoso.", tempoPreparo: "10 min", porcoes: 2, calorias: 140, categoria: "Lanche" },
  { nome: "Barra de Cereal Caseira", ingredientes: ["Aveia", "Mel", "Castanhas", "Frutas secas"], modoPreparo: "Misture tudo, espalhe em forma e asse. Corte em barras.", tempoPreparo: "30 min", porcoes: 8, calorias: 120, categoria: "Lanche" }
];

export default function Home() {
  const [modulos, setModulos] = useState<Modulo[]>(MODULOS_PADRAO);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [moduloAtivo, setModuloAtivo] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  // Estados para Análise de Foto
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  // NOVO: Estado para análise por texto
  const [foodText, setFoodText] = useState('');
  const [analysisMode, setAnalysisMode] = useState<'photo' | 'text'>('photo');

  // Estados para Chat
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Estados para Contador de Calorias
  const [atividades, setAtividades] = useState<Array<{nome: string, duracao: number, calorias: number}>>([]);
  const [alimentos, setAlimentos] = useState<Array<{nome: string, calorias: number}>>([]);
  const [novaAtividade, setNovaAtividade] = useState({nome: "", duracao: 0});
  const [novoAlimento, setNovoAlimento] = useState({nome: "", calorias: 0});

  // Estados para Pressão Arterial
  const [pressaoSistolica, setPressaoSistolica] = useState('');
  const [pressaoDiastolica, setPressaoDiastolica] = useState('');
  const [registrosPressao, setRegistrosPressao] = useState<Array<{sistolica: number, diastolica: number, data: string}>>([]);

  // Estados para Receitas
  const [receitaSelecionada, setReceitaSelecionada] = useState<Receita | null>(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("Todas");
  const [tipoReceita, setTipoReceita] = useState<'criancas' | 'emagrecimento'>('criancas');

  const iconMap: { [key: string]: any } = {
    'Análise de Alimentos por Foto': Camera,
    'Controle da Pressão Arterial': Heart,
    'Emagrecimento Saudável': Apple,
    'Alimentação Infantil': Users,
    'Contador de Calorias': Calculator,
    'Melhor Horário para Dormir': Moon,
    'Restrições Alimentares': AlertTriangle,
    'Chat Comunitário': MessageCircle,
    'Receitas Saudáveis para Crianças': ChefHat,
    'Receitas para Emagrecimento': Salad,
  };

  const colorMap: { [key: string]: string } = {
    'Análise de Alimentos por Foto': 'from-blue-500 via-cyan-500 to-teal-500',
    'Controle da Pressão Arterial': 'from-red-500 via-pink-500 to-rose-600',
    'Emagrecimento Saudável': 'from-green-500 via-emerald-500 to-lime-600',
    'Alimentação Infantil': 'from-purple-500 via-violet-500 to-fuchsia-600',
    'Contador de Calorias': 'from-orange-500 via-amber-500 to-yellow-600',
    'Melhor Horário para Dormir': 'from-indigo-500 via-blue-500 to-sky-600',
    'Restrições Alimentares': 'from-yellow-500 via-orange-500 to-red-600',
    'Chat Comunitário': 'from-teal-500 via-cyan-500 to-blue-600',
    'Receitas Saudáveis para Crianças': 'from-pink-500 via-rose-500 to-red-500',
    'Receitas para Emagrecimento': 'from-green-500 via-lime-500 to-emerald-600',
  };

  const atividadesPredefinidas = [
    { nome: "Caminhada leve", caloriasPorMinuto: 3.3 },
    { nome: "Caminhada rápida", caloriasPorMinuto: 5.0 },
    { nome: "Corrida leve", caloriasPorMinuto: 8.3 },
    { nome: "Corrida rápida", caloriasPorMinuto: 10.0 },
    { nome: "Ciclismo", caloriasPorMinuto: 6.7 },
    { nome: "Natação", caloriasPorMinuto: 7.0 },
    { nome: "Dança", caloriasPorMinuto: 5.0 },
    { nome: "Yoga", caloriasPorMinuto: 3.0 },
  ];

  const alimentosPredefinidos = [
    { nome: "Maçã média", calorias: 95 },
    { nome: "Banana média", calorias: 105 },
    { nome: "Arroz integral (1 xícara)", calorias: 215 },
    { nome: "Frango grelhado (100g)", calorias: 165 },
    { nome: "Salada verde", calorias: 50 },
    { nome: "Iogurte natural", calorias: 150 },
    { nome: "Cenoura crua (1 unidade)", calorias: 25 },
    { nome: "Aveia (1/2 xícara)", calorias: 150 },
  ];

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (moduloAtivo === 'Chat Comunitário' && isConnected) {
      fetchMessages();
      const channel = supabase
        .channel('messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [moduloAtivo, isConnected]);

  const initializeApp = async () => {
    setLoading(true);
    
    const connected = await checkConnection();
    setIsConnected(connected);
    
    await checkUser();
    await loadModulos();
    
    setLoading(false);
  };

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;

      setUser(user);

      if (user && isConnected) {
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('nome, imagem_perfil')
          .eq('id', user.id)
          .single();
        
        if (!profileError && data) {
          setProfile(data);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
    }
  };

  const loadModulos = async () => {
    if (!isConnected) {
      setModulos(MODULOS_PADRAO);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('modulos')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        setModulos(data);
      } else {
        setModulos(MODULOS_PADRAO);
      }
    } catch (error) {
      console.error('Erro ao carregar módulos:', error);
      setModulos(MODULOS_PADRAO);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setAnalysisError(null);
    }
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  const openGallery = () => {
    fileInputRef.current?.click();
  };

  // NOVA FUNÇÃO: Analisar alimento por texto
  const analyzeFoodByText = async () => {
    if (!foodText.trim()) return;
    
    setAnalyzing(true);
    setResult(null);
    setAnalysisError(null);
    
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodText: foodText.trim(),
          context: 'Analise este alimento com máxima precisão (99%) e forneça informações nutricionais detalhadas e precisas.'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Erro na análise');
      }
      
      setResult({
        food: data.foodName || foodText,
        portionSize: data.portionSize || '100g',
        calories: data.calories || 0,
        protein: data.protein || 0,
        carbs: data.carbs || 0,
        fat: data.fat || 0,
        fiber: data.fiber || 0,
        sodium: data.sodium || 0,
        hasGluten: data.hasGluten || false,
        suitableForDiabetics: data.suitableForDiabetics !== false,
        suitableForHypertension: data.suitableForHypertension !== false,
        description: data.description || '',
        confidence: data.confidence || 95,
        nutritionalSource: data.nutritionalSource || 'Análise IA com 99% de precisão',
        glycemicIndex: data.glycemicIndex || 'médio',
        healthScore: data.healthScore || 7
      });
      
    } catch (error) {
      console.error('Erro ao analisar alimento:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Erro ao analisar alimento. Verifique se a chave da API OpenAI está configurada corretamente.');
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeFood = async () => {
    if (!selectedFile || !preview) return;
    
    setAnalyzing(true);
    setResult(null);
    setAnalysisError(null);
    
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: preview,
          context: 'Analise esta imagem de alimento com máxima precisão (99%) e forneça informações nutricionais detalhadas e precisas.'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Erro na análise');
      }
      
      setResult({
        food: data.foodName || 'Alimento identificado',
        portionSize: data.portionSize || '100g',
        calories: data.calories || 0,
        protein: data.protein || 0,
        carbs: data.carbs || 0,
        fat: data.fat || 0,
        fiber: data.fiber || 0,
        sodium: data.sodium || 0,
        hasGluten: data.hasGluten || false,
        suitableForDiabetics: data.suitableForDiabetics !== false,
        suitableForHypertension: data.suitableForHypertension !== false,
        description: data.description || '',
        confidence: data.confidence || 95,
        nutritionalSource: data.nutritionalSource || 'Análise IA com 99% de precisão',
        glycemicIndex: data.glycemicIndex || 'médio',
        healthScore: data.healthScore || 7
      });
      
    } catch (error) {
      console.error('Erro ao analisar alimento:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Erro ao analisar alimento. Verifique se a chave da API OpenAI está configurada corretamente.');
    } finally {
      setAnalyzing(false);
    }
  };

  const fetchMessages = async () => {
    if (!isConnected) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (!error && data) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !isConnected) return;
    
    try {
      const { error } = await supabase.from('messages').insert([{ 
        content: newMessage, 
        user: profile?.nome || user.email 
      }]);
      
      if (!error) {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const adicionarAtividade = () => {
    if (novaAtividade.nome && novaAtividade.duracao > 0) {
      const atividade = atividadesPredefinidas.find(a => a.nome === novaAtividade.nome);
      if (atividade) {
        const calorias = Math.round(atividade.caloriasPorMinuto * novaAtividade.duracao);
        setAtividades([...atividades, { ...novaAtividade, calorias }]);
        setNovaAtividade({nome: "", duracao: 0});
      }
    }
  };

  const removerAtividade = (index: number) => {
    setAtividades(atividades.filter((_, i) => i !== index));
  };

  const adicionarAlimento = () => {
    if (novoAlimento.nome && novoAlimento.calorias > 0) {
      setAlimentos([...alimentos, novoAlimento]);
      setNovoAlimento({nome: "", calorias: 0});
    }
  };

  const removerAlimento = (index: number) => {
    setAlimentos(alimentos.filter((_, i) => i !== index));
  };

  const adicionarPressao = () => {
    const sistolica = parseInt(pressaoSistolica);
    const diastolica = parseInt(pressaoDiastolica);
    if (sistolica && diastolica) {
      setRegistrosPressao([...registrosPressao, {
        sistolica,
        diastolica,
        data: new Date().toLocaleString('pt-BR')
      }]);
      setPressaoSistolica('');
      setPressaoDiastolica('');
    }
  };

  const removerRegistroPressao = (index: number) => {
    setRegistrosPressao(registrosPressao.filter((_, i) => i !== index));
  };

  const classificarPressao = (sistolica: number, diastolica: number) => {
    if (sistolica < 120 && diastolica < 80) return { texto: 'Normal', cor: 'bg-green-500' };
    if (sistolica < 130 && diastolica < 80) return { texto: 'Elevada', cor: 'bg-yellow-500' };
    if (sistolica < 140 || diastolica < 90) return { texto: 'Hipertensão Estágio 1', cor: 'bg-orange-500' };
    return { texto: 'Hipertensão Estágio 2', cor: 'bg-red-500' };
  };

  const totalCaloriasPerdidas = atividades.reduce((total, atividade) => total + atividade.calorias, 0);
  const totalCaloriasIngeridas = alimentos.reduce((total, alimento) => total + alimento.calorias, 0);
  const balancoCalorico = totalCaloriasIngeridas - totalCaloriasPerdidas;

  const receitasAtivas = tipoReceita === 'criancas' ? RECEITAS_CRIANCAS : RECEITAS_EMAGRECIMENTO;
  const categorias = ["Todas", ...Array.from(new Set(receitasAtivas.map(r => r.categoria)))];
  const receitasFiltradas = categoriaFiltro === "Todas" 
    ? receitasAtivas 
    : receitasAtivas.filter(r => r.categoria === categoriaFiltro);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-200 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Carregando...</p>
        </div>
      </div>
    );
  }

  if (moduloAtivo) {
    const modulo = modulos.find(m => m.nome === moduloAtivo);
    const IconComponent = iconMap[moduloAtivo] || Camera;
    const gradientColor = colorMap[moduloAtivo] || 'from-gray-500 to-gray-600';

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
        <div className="max-w-7xl mx-auto p-4 sm:p-8">
          {/* Header */}
          <div className="mb-6 flex justify-between items-center bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
            <Button 
              onClick={() => {
                setModuloAtivo(null);
                setReceitaSelecionada(null);
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              ← Voltar
            </Button>
            {user && (
              <div className="flex items-center gap-4">
                <img 
                  src={profile?.imagem_perfil || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-purple-500"
                />
                <Button onClick={handleLogout} variant="destructive" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            )}
          </div>

          {/* Conteúdo do Módulo */}
          <div className="space-y-6">
            {/* Header do Módulo */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={modulo?.imagem}
                alt={moduloAtivo}
                className="w-full h-48 object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${gradientColor} opacity-80`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <IconComponent className="w-16 h-16 mx-auto mb-4" />
                  <h1 className="text-4xl font-bold">{moduloAtivo}</h1>
                </div>
              </div>
            </div>

            {/* Análise de Alimentos por Foto */}
            {moduloAtivo === 'Análise de Alimentos por Foto' && (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Analisar Alimento
                    </CardTitle>
                    <CardDescription>Tire uma foto ou escreva o nome do alimento para análise com 99% de precisão</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Seletor de modo */}
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant={analysisMode === 'photo' ? 'default' : 'outline'}
                        onClick={() => setAnalysisMode('photo')}
                        className="flex-1"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Foto
                      </Button>
                      <Button
                        variant={analysisMode === 'text' ? 'default' : 'outline'}
                        onClick={() => setAnalysisMode('text')}
                        className="flex-1"
                      >
                        <Type className="mr-2 h-4 w-4" />
                        Texto
                      </Button>
                    </div>

                    {/* Modo Foto */}
                    {analysisMode === 'photo' && (
                      <>
                        <input 
                          ref={cameraInputRef}
                          type="file" 
                          accept="image/*" 
                          capture="environment"
                          onChange={handleFileChange} 
                          className="hidden"
                        />
                        <input 
                          ref={fileInputRef}
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange} 
                          className="hidden"
                        />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Button 
                            onClick={openCamera}
                            className="w-full h-24 text-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                          >
                            <Camera className="mr-3 h-6 w-6" />
                            Tirar Foto
                          </Button>
                          <Button 
                            onClick={openGallery}
                            variant="outline"
                            className="w-full h-24 text-lg border-2 border-blue-500 hover:bg-blue-50"
                          >
                            <ImageIcon className="mr-3 h-6 w-6" />
                            Escolher da Galeria
                          </Button>
                        </div>

                        {preview && (
                          <div className="text-center space-y-4">
                            <img src={preview} alt="Preview" className="max-w-full h-64 object-cover rounded-lg mx-auto shadow-lg" />
                            <Button onClick={analyzeFood} disabled={analyzing} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                              {analyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analisando com IA (99% precisão)...</> : <><Upload className="mr-2 h-4 w-4" />Analisar Alimento</>}
                            </Button>
                          </div>
                        )}
                      </>
                    )}

                    {/* Modo Texto */}
                    {analysisMode === 'text' && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="foodText">Digite o nome do alimento</Label>
                          <Textarea
                            id="foodText"
                            placeholder="Ex: Arroz integral cozido, Frango grelhado 150g, Maçã média..."
                            value={foodText}
                            onChange={(e) => setFoodText(e.target.value)}
                            className="mt-2 min-h-[100px]"
                          />
                        </div>
                        <Button 
                          onClick={analyzeFoodByText} 
                          disabled={analyzing || !foodText.trim()} 
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        >
                          {analyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analisando com IA (99% precisão)...</> : <><Upload className="mr-2 h-4 w-4" />Analisar Alimento</>}
                        </Button>
                      </div>
                    )}

                    {analysisError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-700 text-sm">
                          <strong>⚠️ Erro:</strong> {analysisError}
                        </p>
                        <p className="text-red-600 text-xs mt-2">
                          Configure a variável de ambiente OPENAI_API_KEY para usar esta funcionalidade. Clique no banner laranja acima para configurar.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {result && (
                  <Card className="border-2 border-purple-300">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Resultado da Análise</span>
                        <Badge className="bg-blue-500">Precisão: {result.confidence}%</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-3xl font-bold text-purple-600">{result.food}</h3>
                        <p className="text-sm text-gray-500 mt-1">Porção: {result.portionSize}</p>
                        <p className="text-4xl font-bold text-orange-500 my-2">{result.calories} kcal</p>
                        <p className="text-sm text-gray-600">Total da porção</p>
                        <div className="flex gap-2 justify-center mt-2 flex-wrap">
                          <Badge variant="secondary">{result.nutritionalSource}</Badge>
                          <Badge className={`${result.glycemicIndex === 'baixo' ? 'bg-green-500' : result.glycemicIndex === 'alto' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                            IG: {result.glycemicIndex}
                          </Badge>
                          <Badge className="bg-purple-500">Score: {result.healthScore}/10</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{result.protein}g</p>
                          <p className="text-xs text-gray-600">Proteína</p>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-600">{result.carbs}g</p>
                          <p className="text-xs text-gray-600">Carboidratos</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <p className="text-2xl font-bold text-red-600">{result.fat}g</p>
                          <p className="text-xs text-gray-600">Gordura</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{result.fiber}g</p>
                          <p className="text-xs text-gray-600">Fibra</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Badge variant={result.hasGluten ? "destructive" : "secondary"} className="justify-center py-2">
                          {result.hasGluten ? "Contém Glúten" : "Sem Glúten"}
                        </Badge>
                        <Badge variant={result.suitableForDiabetics ? "secondary" : "destructive"} className="justify-center py-2">
                          {result.suitableForDiabetics ? "OK para Diabéticos" : "Evitar (Diabéticos)"}
                        </Badge>
                        <Badge variant={result.suitableForHypertension ? "secondary" : "destructive"} className="justify-center py-2">
                          {result.suitableForHypertension ? "OK para Hipertensos" : "Evitar (Hipertensos)"}
                        </Badge>
                      </div>

                      {result.description && (
                        <div className="bg-purple-50 p-4 rounded-lg mt-4">
                          <p className="text-sm text-gray-700">{result.description}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Receitas Saudáveis para Crianças */}
            {moduloAtivo === 'Receitas Saudáveis para Crianças' && (
              <div className="space-y-6">
                {!receitaSelecionada ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ChefHat className="h-5 w-5 text-pink-500" />
                          Receitas Nutritivas e Deliciosas
                        </CardTitle>
                        <CardDescription>
                          Alimentação saudável e divertida para os pequenos
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 mb-4 flex-wrap">
                          {categorias.map((cat) => (
                            <Button
                              key={cat}
                              variant={categoriaFiltro === cat ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCategoriaFiltro(cat)}
                            >
                              {cat}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {receitasFiltradas.map((receita, index) => (
                        <Card 
                          key={index} 
                          className="hover:shadow-xl transition-shadow cursor-pointer"
                          onClick={() => setReceitaSelecionada(receita)}
                        >
                          <CardHeader>
                            <CardTitle className="text-lg">{receita.nome}</CardTitle>
                            <div className="flex gap-2 flex-wrap">
                              <Badge variant="secondary">{receita.categoria}</Badge>
                              <Badge className="bg-orange-500">{receita.calorias} kcal</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 text-sm text-gray-600">
                              <p>⏱️ {receita.tempoPreparo}</p>
                              <p>🍽️ {receita.porcoes} porções</p>
                              <Button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-rose-500">
                                Ver Receita Completa
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <Card className="border-2 border-pink-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-2xl mb-2">{receitaSelecionada.nome}</CardTitle>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="secondary">{receitaSelecionada.categoria}</Badge>
                            <Badge className="bg-orange-500">{receitaSelecionada.calorias} kcal/porção</Badge>
                            <Badge className="bg-blue-500">⏱️ {receitaSelecionada.tempoPreparo}</Badge>
                            <Badge className="bg-green-500">🍽️ {receitaSelecionada.porcoes} porções</Badge>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => setReceitaSelecionada(null)}
                        >
                          ← Voltar
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-pink-600">📝 Ingredientes</h3>
                        <ul className="space-y-2">
                          {receitaSelecionada.ingredientes.map((ing, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-pink-500 mt-1">•</span>
                              <span>{ing}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-3 text-pink-600">👨‍🍳 Modo de Preparo</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {receitaSelecionada.modoPreparo}
                        </p>
                      </div>

                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h3 className="text-lg font-bold mb-2 text-pink-600">💡 Dica</h3>
                        <p className="text-sm text-gray-700">
                          Esta receita é perfeita para crianças! Nutritiva, saborosa e fácil de preparar. 
                          Envolva os pequenos no preparo para tornar a experiência ainda mais divertida!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Receitas para Emagrecimento */}
            {moduloAtivo === 'Receitas para Emagrecimento' && (
              <div className="space-y-6">
                {!receitaSelecionada ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Salad className="h-5 w-5 text-green-500" />
                          100+ Receitas para Emagrecimento Saudável
                        </CardTitle>
                        <CardDescription>
                          Receitas deliciosas e nutritivas para ajudar você a atingir seus objetivos
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 mb-4 flex-wrap">
                          {categorias.map((cat) => (
                            <Button
                              key={cat}
                              variant={categoriaFiltro === cat ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCategoriaFiltro(cat)}
                            >
                              {cat}
                            </Button>
                          ))}
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg mt-4">
                          <p className="text-sm text-gray-700">
                            <strong>💚 Total de receitas disponíveis: {RECEITAS_EMAGRECIMENTO.length}</strong>
                            <br />
                            Todas as receitas são balanceadas, saborosas e ideais para quem busca emagrecimento saudável!
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {receitasFiltradas.map((receita, index) => (
                        <Card 
                          key={index} 
                          className="hover:shadow-xl transition-shadow cursor-pointer"
                          onClick={() => setReceitaSelecionada(receita)}
                        >
                          <CardHeader>
                            <CardTitle className="text-lg">{receita.nome}</CardTitle>
                            <div className="flex gap-2 flex-wrap">
                              <Badge variant="secondary">{receita.categoria}</Badge>
                              <Badge className="bg-green-500">{receita.calorias} kcal</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 text-sm text-gray-600">
                              <p>⏱️ {receita.tempoPreparo}</p>
                              <p>🍽️ {receita.porcoes} porções</p>
                              <Button className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500">
                                Ver Receita Completa
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <Card className="border-2 border-green-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-2xl mb-2">{receitaSelecionada.nome}</CardTitle>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="secondary">{receitaSelecionada.categoria}</Badge>
                            <Badge className="bg-green-500">{receitaSelecionada.calorias} kcal/porção</Badge>
                            <Badge className="bg-blue-500">⏱️ {receitaSelecionada.tempoPreparo}</Badge>
                            <Badge className="bg-orange-500">🍽️ {receitaSelecionada.porcoes} porções</Badge>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => setReceitaSelecionada(null)}
                        >
                          ← Voltar
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-green-600">📝 Ingredientes</h3>
                        <ul className="space-y-2">
                          {receitaSelecionada.ingredientes.map((ing, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              <span>{ing}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-3 text-green-600">👨‍🍳 Modo de Preparo</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {receitaSelecionada.modoPreparo}
                        </p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-lg font-bold mb-2 text-green-600">💡 Dica Nutricional</h3>
                        <p className="text-sm text-gray-700">
                          Esta receita é ideal para quem busca emagrecimento saudável! Baixa em calorias, 
                          rica em nutrientes e muito saborosa. Combine com exercícios regulares para melhores resultados!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Chat Comunitário */}
            {moduloAtivo === 'Chat Comunitário' && (
              <Card>
                <CardHeader>
                  <CardTitle>Converse com a Comunidade</CardTitle>
                  <CardDescription>
                    {isConnected ? 'Compartilhe experiências e tire dúvidas' : '⚠️ Conecte ao Supabase para usar o chat'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-4 space-y-2">
                    {messages.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        {isConnected ? 'Nenhuma mensagem ainda. Seja o primeiro!' : 'Configure o Supabase para usar o chat'}
                      </p>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id} className="bg-white p-3 rounded-lg shadow-sm">
                          <strong className="text-purple-600">{msg.user}:</strong> {msg.content}
                          <span className="text-xs text-gray-500 ml-2">{new Date(msg.created_at).toLocaleTimeString('pt-BR')}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={isConnected ? "Digite sua mensagem..." : "Configure o Supabase primeiro"}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      disabled={!isConnected}
                    />
                    <Button onClick={sendMessage} disabled={!isConnected}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contador de Calorias */}
            {moduloAtivo === 'Contador de Calorias' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Atividades Físicas</CardTitle>
                      <CardDescription>Registre suas atividades</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Atividade</Label>
                        <Select value={novaAtividade.nome} onValueChange={(value) => setNovaAtividade({...novaAtividade, nome: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {atividadesPredefinidas.map((atividade, index) => (
                              <SelectItem key={index} value={atividade.nome}>
                                {atividade.nome} ({atividade.caloriasPorMinuto} cal/min)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Duração (minutos)</Label>
                        <Input type="number" value={novaAtividade.duracao || ""} onChange={(e) => setNovaAtividade({...novaAtividade, duracao: parseInt(e.target.value) || 0})} />
                      </div>
                      <Button onClick={adicionarAtividade} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {atividades.map((atividade, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                            <span className="text-sm">{atividade.nome} ({atividade.duracao}min)</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{atividade.calorias} cal</Badge>
                              <Button variant="ghost" size="sm" onClick={() => removerAtividade(index)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Alimentos Ingeridos</CardTitle>
                      <CardDescription>Registre suas refeições</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Alimento</Label>
                        <Input value={novoAlimento.nome} onChange={(e) => setNovoAlimento({...novoAlimento, nome: e.target.value})} placeholder="Nome do alimento" />
                      </div>
                      <div>
                        <Label>Calorias</Label>
                        <Input type="number" value={novoAlimento.calorias || ""} onChange={(e) => setNovoAlimento({...novoAlimento, calorias: parseInt(e.target.value) || 0})} />
                      </div>
                      <Button onClick={adicionarAlimento} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        {alimentosPredefinidos.map((alimento, index) => (
                          <Button key={index} variant="outline" size="sm" onClick={() => setAlimentos([...alimentos, alimento])}>
                            {alimento.nome}
                          </Button>
                        ))}
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {alimentos.map((alimento, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                            <span className="text-sm">{alimento.nome}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{alimento.calorias} cal</Badge>
                              <Button variant="ghost" size="sm" onClick={() => removerAlimento(index)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-2 border-purple-300">
                  <CardHeader>
                    <CardTitle>Resumo do Dia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-4xl font-bold text-red-600">{totalCaloriasIngeridas}</div>
                        <div className="text-sm text-gray-600 mt-2">Calorias Ingeridas</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-4xl font-bold text-green-600">{totalCaloriasPerdidas}</div>
                        <div className="text-sm text-gray-600 mt-2">Calorias Queimadas</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className={`text-4xl font-bold ${balancoCalorico >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {balancoCalorico > 0 ? '+' : ''}{balancoCalorico}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">Balanço Calórico</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Controle da Pressão Arterial */}
            {moduloAtivo === 'Controle da Pressão Arterial' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Registrar Pressão Arterial
                    </CardTitle>
                    <CardDescription>Monitore sua pressão diariamente</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Sistólica (mmHg)</Label>
                        <Input type="number" value={pressaoSistolica} onChange={(e) => setPressaoSistolica(e.target.value)} placeholder="120" />
                      </div>
                      <div>
                        <Label>Diastólica (mmHg)</Label>
                        <Input type="number" value={pressaoDiastolica} onChange={(e) => setPressaoDiastolica(e.target.value)} placeholder="80" />
                      </div>
                    </div>
                    <Button onClick={adicionarPressao} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Registrar Medição
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Medições</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {registrosPressao.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">Nenhuma medição registrada ainda</p>
                      ) : (
                        registrosPressao.map((registro, index) => {
                          const classificacao = classificarPressao(registro.sistolica, registro.diastolica);
                          return (
                            <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                              <div>
                                <p className="text-2xl font-bold text-gray-800">{registro.sistolica}/{registro.diastolica}</p>
                                <p className="text-xs text-gray-500">{registro.data}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={`${classificacao.cor} text-white`}>
                                  {classificacao.texto}
                                </Badge>
                                <Button variant="ghost" size="sm" onClick={() => removerRegistroPressao(index)}>
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Outros Módulos - Em Desenvolvimento */}
            {!['Análise de Alimentos por Foto', 'Chat Comunitário', 'Contador de Calorias', 'Controle da Pressão Arterial', 'Receitas Saudáveis para Crianças', 'Receitas para Emagrecimento'].includes(moduloAtivo) && (
              <Card>
                <CardContent className="py-16 text-center">
                  <IconComponent className="w-24 h-24 mx-auto mb-6 text-purple-400" />
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{moduloAtivo}</h2>
                  <p className="text-xl text-gray-600 mb-8">{modulo?.descricao}</p>
                  <Badge variant="secondary" className="text-lg px-6 py-2">Em breve disponível</Badge>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-200 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header com perfil */}
        {user && (
          <div className="mb-8 flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <div className="flex items-center space-x-4">
              <img 
                src={profile?.imagem_perfil || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                alt="Avatar"
                className="w-12 h-12 rounded-full border-2 border-purple-500"
              />
              <div>
                <p className="font-semibold text-gray-800">{profile?.nome || 'Usuário'}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        )}

        {/* Banner principal */}
        <div className="relative w-full h-72 sm:h-96 rounded-3xl shadow-2xl mb-12 overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=600&fit=crop&q=80"
            alt="Alimentos saudáveis"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h1 className="text-4xl sm:text-6xl font-bold mb-4 drop-shadow-lg">NutriApp</h1>
            <p className="text-lg sm:text-2xl font-light drop-shadow-md">Sua Saúde em Primeiro Lugar</p>
          </div>
        </div>
        
        {/* Grid de módulos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modulos.map((modulo) => {
            const IconComponent = iconMap[modulo.nome] || Camera;
            const gradientColor = colorMap[modulo.nome] || 'from-gray-500 to-gray-600';
            
            return (
              <div
                key={modulo.id}
                onClick={() => setModuloAtivo(modulo.nome)}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={modulo.imagem}
                    alt={modulo.nome}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${gradientColor} opacity-80 group-hover:opacity-70 transition-opacity`} />
                </div>

                <div className="relative bg-white p-6">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className={`bg-gradient-to-br ${gradientColor} rounded-xl p-3 shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 leading-tight flex-1">
                      {modulo.nome}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {modulo.descricao}
                  </p>
                  <button className={`w-full bg-gradient-to-r ${gradientColor} text-white font-semibold py-2.5 rounded-xl hover:shadow-lg transition-all`}>
                    Explorar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Call to action */}
        <div className="mt-16 relative rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&h=400&fit=crop&q=80"
            alt="Comida saudável"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-pink-900/90 backdrop-blur-sm" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Comece Sua Jornada Saudável Hoje!
            </h2>
            <p className="text-white/90 text-lg mb-6 max-w-2xl">
              Descubra ferramentas poderosas para melhorar sua alimentação e qualidade de vida.
            </p>
            {!user && (
              <button 
                onClick={() => router.push('/login')}
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Começar Agora
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
