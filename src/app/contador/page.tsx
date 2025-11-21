"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function ContadorPage() {
  const [atividades, setAtividades] = useState<Array<{nome: string, duracao: number, calorias: number}>>([]);
  const [alimentos, setAlimentos] = useState<Array<{nome: string, calorias: number}>>([]);
  const [novaAtividade, setNovaAtividade] = useState({nome: "", duracao: 0, calorias: 0});
  const [novoAlimento, setNovoAlimento] = useState({nome: "", calorias: 0});

  const atividadesPredefinidas = [
    { nome: "Caminhada leve", caloriasPorMinuto: 3.3 },
    { nome: "Caminhada rápida", caloriasPorMinuto: 5.0 },
    { nome: "Corrida leve", caloriasPorMinuto: 8.3 },
    { nome: "Corrida rápida", caloriasPorMinuto: 10.0 },
    { nome: "Ciclismo leve", caloriasPorMinuto: 6.7 },
    { nome: "Natação", caloriasPorMinuto: 7.0 },
    { nome: "Dança", caloriasPorMinuto: 5.0 },
    { nome: "Yoga", caloriasPorMinuto: 3.0 },
  ];

  const alimentosPredefinidos = [
    { nome: "Maçã média", calorias: 95 },
    { nome: "Banana média", calorias: 105 },
    { nome: "Arroz cozido (1 xícara)", calorias: 205 },
    { nome: "Frango grelhado (100g)", calorias: 165 },
    { nome: "Salada verde (1 prato)", calorias: 50 },
    { nome: "Iogurte natural (1 pote)", calorias: 150 },
  ];

  const adicionarAtividade = () => {
    if (novaAtividade.nome && novaAtividade.duracao > 0) {
      const atividade = atividadesPredefinidas.find(a => a.nome === novaAtividade.nome);
      if (atividade) {
        const calorias = Math.round(atividade.caloriasPorMinuto * novaAtividade.duracao);
        setAtividades([...atividades, { ...novaAtividade, calorias }]);
        setNovaAtividade({nome: "", duracao: 0, calorias: 0});
      }
    }
  };

  const adicionarAlimento = () => {
    if (novoAlimento.nome && novoAlimento.calorias > 0) {
      setAlimentos([...alimentos, novoAlimento]);
      setNovoAlimento({nome: "", calorias: 0});
    }
  };

  const adicionarAlimentoPredefinido = (alimento: {nome: string, calorias: number}) => {
    setAlimentos([...alimentos, alimento]);
  };

  const totalCaloriasPerdidas = atividades.reduce((total, atividade) => total + atividade.calorias, 0);
  const totalCaloriasIngeridas = alimentos.reduce((total, alimento) => total + alimento.calorias, 0);
  const balancoCalorico = totalCaloriasIngeridas - totalCaloriasPerdidas;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-lime-50 dark:from-red-950 dark:to-lime-950">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            Contador de Calorias
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitore suas calorias ingeridas e queimadas durante o dia
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Atividades Físicas */}
          <Card>
            <CardHeader>
              <CardTitle>Atividades Físicas</CardTitle>
              <CardDescription>Adicione suas atividades para calcular calorias queimadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="atividade">Atividade</Label>
                  <Select value={novaAtividade.nome} onValueChange={(value) => setNovaAtividade({...novaAtividade, nome: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma atividade" />
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
                  <Label htmlFor="duracao">Duração (minutos)</Label>
                  <Input
                    id="duracao"
                    type="number"
                    value={novaAtividade.duracao || ""}
                    onChange={(e) => setNovaAtividade({...novaAtividade, duracao: parseInt(e.target.value) || 0})}
                  />
                </div>
                <Button onClick={adicionarAtividade} className="w-full">
                  Adicionar Atividade
                </Button>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-2">Atividades do Dia:</h4>
                <div className="space-y-2">
                  {atividades.map((atividade, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span>{atividade.nome} ({atividade.duracao}min)</span>
                      <Badge variant="secondary">{atividade.calorias} cal</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alimentos Ingeridos */}
          <Card>
            <CardHeader>
              <CardTitle>Alimentos Ingeridos</CardTitle>
              <CardDescription>Registre suas refeições e lanches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="alimento">Alimento</Label>
                  <Input
                    id="alimento"
                    value={novoAlimento.nome}
                    onChange={(e) => setNovoAlimento({...novoAlimento, nome: e.target.value})}
                    placeholder="Digite o nome do alimento"
                  />
                </div>
                <div>
                  <Label htmlFor="calorias">Calorias</Label>
                  <Input
                    id="calorias"
                    type="number"
                    value={novoAlimento.calorias || ""}
                    onChange={(e) => setNovoAlimento({...novoAlimento, calorias: parseInt(e.target.value) || 0})}
                  />
                </div>
                <Button onClick={adicionarAlimento} className="w-full">
                  Adicionar Alimento
                </Button>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-2">Alimentos Predefinidos:</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {alimentosPredefinidos.map((alimento, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => adicionarAlimentoPredefinido(alimento)}
                    >
                      {alimento.nome}
                    </Button>
                  ))}
                </div>

                <h4 className="font-semibold mb-2">Alimentos do Dia:</h4>
                <div className="space-y-2">
                  {alimentos.map((alimento, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span>{alimento.nome}</span>
                      <Badge variant="secondary">{alimento.calorias} cal</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo Calórico */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo Calórico do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{totalCaloriasIngeridas}</div>
                <div className="text-sm text-muted-foreground">Calorias Ingeridas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{totalCaloriasPerdidas}</div>
                <div className="text-sm text-muted-foreground">Calorias Queimadas</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${balancoCalorico >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {balancoCalorico > 0 ? '+' : ''}{balancoCalorico}
                </div>
                <div className="text-sm text-muted-foreground">Balanço Calórico</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}