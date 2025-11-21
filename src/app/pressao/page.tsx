import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Apple, Leaf, Droplets } from "lucide-react";

export default function Pressao() {
  const tips = [
    {
      title: "Reduza o Consumo de Sal",
      description: "Limite o sal a menos de 5g por dia. Evite alimentos processados ricos em sódio.",
      icon: Droplets,
    },
    {
      title: "Aumente o Consumo de Potássio",
      description: "Alimentos ricos em potássio ajudam a controlar a pressão arterial.",
      icon: Apple,
    },
    {
      title: "Pratique Exercícios Regularmente",
      description: "30 minutos de atividade física moderada diariamente ajudam a reduzir a pressão.",
      icon: Heart,
    },
    {
      title: "Consuma Alimentos Ricos em Fibras",
      description: "Frutas, vegetais e grãos integrais ajudam no controle da pressão.",
      icon: Leaf,
    },
  ];

  const foods = [
    { name: "Banana", reason: "Rica em potássio", benefit: "Ajuda a reduzir a pressão" },
    { name: "Aveia", reason: "Alta em fibras", benefit: "Melhora a saúde cardiovascular" },
    { name: "Espinafre", reason: "Fonte de magnésio", benefit: "Auxilia no relaxamento vascular" },
    { name: "Salmão", reason: "Ômega-3", benefit: "Reduz inflamação e pressão" },
    { name: "Abacate", reason: "Gorduras saudáveis", benefit: "Melhora a função cardíaca" },
    { name: "Beterraba", reason: "Nitratos naturais", benefit: "Dilata os vasos sanguíneos" },
    { name: "Iogurte natural", reason: "Cálcio e probióticos", benefit: "Equilibra a flora intestinal" },
    { name: "Nozes", reason: "Magnésio e gorduras boas", benefit: "Protege o coração" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-lime-50 dark:from-red-950 dark:to-lime-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Controle da Pressão Arterial</h1>
            <p className="text-muted-foreground">
              Dicas e alimentos para manter a pressão arterial saudável
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{tip.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-5 w-5" />
                Alimentos Recomendados
              </CardTitle>
              <CardDescription>
                Alimentos que ajudam no controle da pressão arterial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {foods.map((food, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-primary">{food.name}</h3>
                      <Badge variant="secondary">{food.reason}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{food.benefit}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Plano Alimentar Diário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Café da Manhã</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Aveia com banana e nozes</li>
                    <li>• Chá verde ou água</li>
                    <li>• Iogurte natural com frutas</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Almoço</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Salada de folhas verdes</li>
                    <li>• Peixe grelhado ou frango</li>
                    <li>• Arroz integral ou quinoa</li>
                    <li>• Legumes cozidos no vapor</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Jantar</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Sopa de legumes</li>
                    <li>• Salmão assado</li>
                    <li>• Batata doce assada</li>
                    <li>• Salada fresca</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Lanches</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Frutas frescas</li>
                    <li>• Iogurte natural</li>
                    <li>• Nozes (em porções pequenas)</li>
                    <li>• Suco natural de beterraba</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}