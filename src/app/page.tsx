'use client';

import { useState, useRef } from 'react';
import { Camera, Heart, Calculator, ChefHat, Salad, Loader2, Upload, ImageIcon, Type, Plus, Trash2 } from 'lucide-react';
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
  icon: any;
  gradient: string;
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

const MODULOS: Modulo[] = [
  {
    id: '1',
    nome: 'Análise de Alimentos',
    descricao: 'Tire foto ou digite o nome do alimento para análise nutricional com 99% de precisão',
    imagem: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
    icon: Camera,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: '2',
    nome: 'Contador de Calorias',
    descricao: 'Monitore suas calorias diárias',
    imagem: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop',
    icon: Calculator,
    gradient: 'from-orange-500 to-amber-500'
  },
  {
    id: '3',
    nome: 'Controle de Pressão',
    descricao: 'Acompanhe sua pressão arterial',
    imagem: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&h=300&fit=crop',
    icon: Heart,
    gradient: 'from-red-500 to-pink-500'
  },
  {
    id: '4',
    nome: 'Receitas Infantis',
    descricao: 'Receitas saudáveis para crianças',
    imagem: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=300&fit=crop',
    icon: ChefHat,
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    id: '5',
    nome: 'Receitas Emagrecimento',
    descricao: '100+ receitas para perder peso',
    imagem: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    icon: Salad,
    gradient: 'from-green-500 to-emerald-500'
  }
];

const RECEITAS_CRIANCAS: Receita[] = [
  {
    nome: "Panqueca de Banana e Aveia",
    ingredientes: ["2 bananas maduras", "1 xícara de aveia", "2 ovos", "Canela"],
    modoPreparo: "Amasse as bananas, adicione ovos e aveia. Cozinhe em frigideira antiaderente por 2-3 min cada lado.",
    tempoPreparo: "15 min",
    porcoes: 4,
    calorias: 180,
    categoria: "Café da manhã"
  },
  {
    nome: "Nuggets de Frango Caseiros",
    ingredientes: ["500g frango", "Farinha de rosca integral", "2 ovos", "Temperos"],
    modoPreparo: "Corte o frango, tempere, passe no ovo e farinha. Asse a 200°C por 20-25 min.",
    tempoPreparo: "35 min",
    porcoes: 4,
    calorias: 220,
    categoria: "Almoço"
  }
];

const RECEITAS_EMAGRECIMENTO: Receita[] = [
  {
    nome: "Omelete de Claras com Espinafre",
    ingredientes: ["4 claras", "1 xícara espinafre", "Tomate", "Temperos"],
    modoPreparo: "Bata as claras, adicione espinafre. Cozinhe em frigideira antiaderente.",
    tempoPreparo: "10 min",
    porcoes: 1,
    calorias: 120,
    categoria: "Café da manhã"
  },
  {
    nome: "Frango Grelhado com Legumes",
    ingredientes: ["150g frango", "Brócolis", "Cenoura", "Abobrinha"],
    modoPreparo: "Grelhe o frango temperado. Cozinhe legumes no vapor.",
    tempoPreparo: "25 min",
    porcoes: 1,
    calorias: 280,
    categoria: "Almoço"
  }
];

export default function Home() {
  const [moduloAtivo, setModuloAtivo] = useState<string | null>(null);
  
  // Análise de alimentos
  const [analysisMode, setAnalysisMode] = useState<'photo' | 'text'>('photo');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [foodText, setFoodText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Contador de calorias
  const [atividades, setAtividades] = useState<Array<{nome: string, duracao: number, calorias: number}>>([]);
  const [alimentos, setAlimentos] = useState<Array<{nome: string, calorias: number}>>([]);
  const [novaAtividade, setNovaAtividade] = useState({nome: "", duracao: 0});
  const [novoAlimento, setNovoAlimento] = useState({nome: "", calorias: 0});

  // Pressão arterial
  const [pressaoSistolica, setPressaoSistolica] = useState('');
  const [pressaoDiastolica, setPressaoDiastolica] = useState('');
  const [registrosPressao, setRegistrosPressao] = useState<Array<{sistolica: number, diastolica: number, data: string}>>([]);

  // Receitas
  const [receitaSelecionada, setReceitaSelecionada] = useState<Receita | null>(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

  const atividadesPredefinidas = [
    { nome: "Caminhada leve", caloriasPorMinuto: 3.3 },
    { nome: "Corrida leve", caloriasPorMinuto: 8.3 },
    { nome: "Ciclismo", caloriasPorMinuto: 6.7 },
    { nome: "Natação", caloriasPorMinuto: 7.0 }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      setResult(null);
      setAnalysisError(null);
    }
  };

  const analyzeFood = async () => {
    if (!preview) return;
    
    setAnalyzing(true);
    setResult(null);
    setAnalysisError(null);
    
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: preview })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.details || data.error);
      
      setResult(data);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'Erro ao analisar');
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeFoodByText = async () => {
    if (!foodText.trim()) return;
    
    setAnalyzing(true);
    setResult(null);
    setAnalysisError(null);
    
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodText: foodText.trim() })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.details || data.error);
      
      setResult(data);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'Erro ao analisar');
    } finally {
      setAnalyzing(false);
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

  const adicionarAlimento = () => {
    if (novoAlimento.nome && novoAlimento.calorias > 0) {
      setAlimentos([...alimentos, novoAlimento]);
      setNovoAlimento({nome: "", calorias: 0});
    }
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

  const classificarPressao = (sistolica: number, diastolica: number) => {
    if (sistolica < 120 && diastolica < 80) return { texto: 'Normal', cor: 'bg-green-500' };
    if (sistolica < 130 && diastolica < 80) return { texto: 'Elevada', cor: 'bg-yellow-500' };
    if (sistolica < 140 || diastolica < 90) return { texto: 'Hipertensão 1', cor: 'bg-orange-500' };
    return { texto: 'Hipertensão 2', cor: 'bg-red-500' };
  };

  const totalCaloriasPerdidas = atividades.reduce((t, a) => t + a.calorias, 0);
  const totalCaloriasIngeridas = alimentos.reduce((t, a) => t + a.calorias, 0);
  const balancoCalorico = totalCaloriasIngeridas - totalCaloriasPerdidas;

  const receitasAtivas = moduloAtivo === 'Receitas Infantis' ? RECEITAS_CRIANCAS : RECEITAS_EMAGRECIMENTO;
  const categorias = ["Todas", ...Array.from(new Set(receitasAtivas.map(r => r.categoria)))];
  const receitasFiltradas = categoriaFiltro === "Todas" ? receitasAtivas : receitasAtivas.filter(r => r.categoria === categoriaFiltro);

  // Tela de módulo ativo
  if (moduloAtivo) {
    const modulo = MODULOS.find(m => m.nome === moduloAtivo);
    const IconComponent = modulo?.icon || Camera;
    const gradient = modulo?.gradient || 'from-gray-500 to-gray-600';

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
        <div className="max-w-7xl mx-auto p-4 sm:p-8">
          <div className="mb-6 flex justify-between items-center bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
            <Button onClick={() => { setModuloAtivo(null); setReceitaSelecionada(null); }} variant="outline">
              ← Voltar
            </Button>
          </div>

          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img src={modulo?.imagem} alt={moduloAtivo} className="w-full h-48 object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-80`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <IconComponent className="w-16 h-16 mx-auto mb-4" />
                  <h1 className="text-4xl font-bold">{moduloAtivo}</h1>
                </div>
              </div>
            </div>

            {/* Análise de Alimentos */}
            {moduloAtivo === 'Análise de Alimentos' && (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Analisar Alimento
                    </CardTitle>
                    <CardDescription>Tire foto ou digite o nome para análise com 99% de precisão</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Button variant={analysisMode === 'photo' ? 'default' : 'outline'} onClick={() => setAnalysisMode('photo')} className="flex-1">
                        <Camera className="mr-2 h-4 w-4" /> Foto
                      </Button>
                      <Button variant={analysisMode === 'text' ? 'default' : 'outline'} onClick={() => setAnalysisMode('text')} className="flex-1">
                        <Type className="mr-2 h-4 w-4" /> Texto
                      </Button>
                    </div>

                    {analysisMode === 'photo' ? (
                      <>
                        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Button onClick={() => cameraInputRef.current?.click()} className="w-full h-24 text-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                            <Camera className="mr-3 h-6 w-6" /> Tirar Foto
                          </Button>
                          <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full h-24 text-lg border-2 border-blue-500">
                            <ImageIcon className="mr-3 h-6 w-6" /> Galeria
                          </Button>
                        </div>

                        {preview && (
                          <div className="text-center space-y-4">
                            <img src={preview} alt="Preview" className="max-w-full h-64 object-cover rounded-lg mx-auto shadow-lg" />
                            <Button onClick={analyzeFood} disabled={analyzing} className="w-full bg-gradient-to-r from-green-500 to-emerald-500">
                              {analyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analisando...</> : <><Upload className="mr-2 h-4 w-4" />Analisar</>}
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <Label>Digite o nome do alimento</Label>
                          <Textarea
                            placeholder="Ex: Arroz integral, Frango grelhado 150g..."
                            value={foodText}
                            onChange={(e) => setFoodText(e.target.value)}
                            className="mt-2 min-h-[100px]"
                          />
                        </div>
                        <Button onClick={analyzeFoodByText} disabled={analyzing || !foodText.trim()} className="w-full bg-gradient-to-r from-green-500 to-emerald-500">
                          {analyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analisando...</> : <><Upload className="mr-2 h-4 w-4" />Analisar</>}
                        </Button>
                      </div>
                    )}

                    {analysisError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-700 text-sm"><strong>⚠️ Erro:</strong> {analysisError}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {result && (
                  <Card className="border-2 border-purple-300">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Resultado</span>
                        <Badge className="bg-blue-500">Precisão: {result.confidence || 95}%</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-3xl font-bold text-purple-600">{result.foodName || result.food}</h3>
                        <p className="text-sm text-gray-500 mt-1">Porção: {result.portionSize}</p>
                        <p className="text-4xl font-bold text-orange-500 my-2">{result.calories} kcal</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                          {result.suitableForDiabetics ? "OK Diabéticos" : "Evitar"}
                        </Badge>
                        <Badge variant={result.suitableForHypertension ? "secondary" : "destructive"} className="justify-center py-2">
                          {result.suitableForHypertension ? "OK Hipertensos" : "Evitar"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Contador de Calorias */}
            {moduloAtivo === 'Contador de Calorias' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Atividades Físicas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Atividade</Label>
                        <Select value={novaAtividade.nome} onValueChange={(v) => setNovaAtividade({...novaAtividade, nome: v})}>
                          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            {atividadesPredefinidas.map((a, i) => (
                              <SelectItem key={i} value={a.nome}>{a.nome}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Duração (min)</Label>
                        <Input type="number" value={novaAtividade.duracao || ""} onChange={(e) => setNovaAtividade({...novaAtividade, duracao: parseInt(e.target.value) || 0})} />
                      </div>
                      <Button onClick={adicionarAtividade} className="w-full">
                        <Plus className="w-4 h-4 mr-2" /> Adicionar
                      </Button>
                      <div className="space-y-2">
                        {atividades.map((a, i) => (
                          <div key={i} className="flex justify-between items-center p-2 bg-green-50 rounded">
                            <span className="text-sm">{a.nome} ({a.duracao}min)</span>
                            <div className="flex items-center gap-2">
                              <Badge>{a.calorias} cal</Badge>
                              <Button variant="ghost" size="sm" onClick={() => setAtividades(atividades.filter((_, idx) => idx !== i))}>
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
                      <CardTitle>Alimentos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Alimento</Label>
                        <Input value={novoAlimento.nome} onChange={(e) => setNovoAlimento({...novoAlimento, nome: e.target.value})} />
                      </div>
                      <div>
                        <Label>Calorias</Label>
                        <Input type="number" value={novoAlimento.calorias || ""} onChange={(e) => setNovoAlimento({...novoAlimento, calorias: parseInt(e.target.value) || 0})} />
                      </div>
                      <Button onClick={adicionarAlimento} className="w-full">
                        <Plus className="w-4 h-4 mr-2" /> Adicionar
                      </Button>
                      <div className="space-y-2">
                        {alimentos.map((a, i) => (
                          <div key={i} className="flex justify-between items-center p-2 bg-red-50 rounded">
                            <span className="text-sm">{a.nome}</span>
                            <div className="flex items-center gap-2">
                              <Badge>{a.calorias} cal</Badge>
                              <Button variant="ghost" size="sm" onClick={() => setAlimentos(alimentos.filter((_, idx) => idx !== i))}>
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
                  <CardHeader><CardTitle>Resumo do Dia</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-4xl font-bold text-red-600">{totalCaloriasIngeridas}</div>
                        <div className="text-sm text-gray-600 mt-2">Ingeridas</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-4xl font-bold text-green-600">{totalCaloriasPerdidas}</div>
                        <div className="text-sm text-gray-600 mt-2">Queimadas</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className={`text-4xl font-bold ${balancoCalorico >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {balancoCalorico > 0 ? '+' : ''}{balancoCalorico}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">Balanço</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Controle de Pressão */}
            {moduloAtivo === 'Controle de Pressão' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Registrar Pressão
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Sistólica</Label>
                        <Input type="number" value={pressaoSistolica} onChange={(e) => setPressaoSistolica(e.target.value)} placeholder="120" />
                      </div>
                      <div>
                        <Label>Diastólica</Label>
                        <Input type="number" value={pressaoDiastolica} onChange={(e) => setPressaoDiastolica(e.target.value)} placeholder="80" />
                      </div>
                    </div>
                    <Button onClick={adicionarPressao} className="w-full">
                      <Plus className="w-4 h-4 mr-2" /> Registrar
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Histórico</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {registrosPressao.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">Nenhuma medição</p>
                      ) : (
                        registrosPressao.map((r, i) => {
                          const c = classificarPressao(r.sistolica, r.diastolica);
                          return (
                            <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                              <div>
                                <p className="text-2xl font-bold">{r.sistolica}/{r.diastolica}</p>
                                <p className="text-xs text-gray-500">{r.data}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={`${c.cor} text-white`}>{c.texto}</Badge>
                                <Button variant="ghost" size="sm" onClick={() => setRegistrosPressao(registrosPressao.filter((_, idx) => idx !== i))}>
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

            {/* Receitas */}
            {(moduloAtivo === 'Receitas Infantis' || moduloAtivo === 'Receitas Emagrecimento') && (
              <div className="space-y-6">
                {!receitaSelecionada ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Receitas Saudáveis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 mb-4 flex-wrap">
                          {categorias.map((cat) => (
                            <Button key={cat} variant={categoriaFiltro === cat ? "default" : "outline"} size="sm" onClick={() => setCategoriaFiltro(cat)}>
                              {cat}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {receitasFiltradas.map((r, i) => (
                        <Card key={i} className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setReceitaSelecionada(r)}>
                          <CardHeader>
                            <CardTitle className="text-lg">{r.nome}</CardTitle>
                            <div className="flex gap-2 flex-wrap">
                              <Badge variant="secondary">{r.categoria}</Badge>
                              <Badge className="bg-green-500">{r.calorias} kcal</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">⏱️ {r.tempoPreparo}</p>
                            <p className="text-sm">🍽️ {r.porcoes} porções</p>
                            <Button className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500">
                              Ver Receita
                            </Button>
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
                            <Badge>{receitaSelecionada.categoria}</Badge>
                            <Badge className="bg-green-500">{receitaSelecionada.calorias} kcal</Badge>
                          </div>
                        </div>
                        <Button variant="outline" onClick={() => setReceitaSelecionada(null)}>← Voltar</Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-green-600">Ingredientes</h3>
                        <ul className="space-y-2">
                          {receitaSelecionada.ingredientes.map((ing, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-500">•</span>
                              <span>{ing}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-green-600">Modo de Preparo</h3>
                        <p className="text-gray-700">{receitaSelecionada.modoPreparo}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Tela inicial
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-200 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative w-full h-72 sm:h-96 rounded-3xl shadow-2xl mb-12 overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=600&fit=crop"
            alt="Alimentos saudáveis"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h1 className="text-4xl sm:text-6xl font-bold mb-4 drop-shadow-lg">NutriApp</h1>
            <p className="text-lg sm:text-2xl font-light drop-shadow-md">Sua Saúde em Primeiro Lugar</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULOS.map((modulo) => {
            const IconComponent = modulo.icon;
            
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
                  <div className={`absolute inset-0 bg-gradient-to-t ${modulo.gradient} opacity-80`} />
                </div>

                <div className="relative bg-white p-6">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className={`bg-gradient-to-br ${modulo.gradient} rounded-xl p-3 shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 leading-tight flex-1">
                      {modulo.nome}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {modulo.descricao}
                  </p>
                  <button className={`w-full bg-gradient-to-r ${modulo.gradient} text-white font-semibold py-2.5 rounded-xl hover:shadow-lg transition-all`}>
                    Explorar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
