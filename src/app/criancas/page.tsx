import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CriancasPage() {
  const alimentos = [
    {
      nome: "Aveia",
      beneficios: "Rica em fibras, ajuda no crescimento e desenvolvimento",
      calorias: "379 kcal/100g",
      categoria: "Cereais"
    },
    {
      nome: "Banana",
      beneficios: "Fonte de potássio, energia natural para atividades",
      calorias: "89 kcal/unidade média",
      categoria: "Frutas"
    },
    {
      nome: "Peixe (salmão)",
      beneficios: "Ômega-3 para desenvolvimento cerebral e cognitivo",
      calorias: "206 kcal/100g",
      categoria: "Proteínas"
    },
    {
      nome: "Iogurte natural",
      beneficios: "Cálcio para ossos fortes, probióticos para intestino",
      calorias: "61 kcal/100g",
      categoria: "Lácteos"
    },
    {
      nome: "Abacate",
      beneficios: "Gorduras saudáveis para desenvolvimento do cérebro",
      calorias: "160 kcal/unidade média",
      categoria: "Frutas"
    },
    {
      nome: "Ovos",
      beneficios: "Proteína completa, vitaminas essenciais",
      calorias: "155 kcal/100g",
      categoria: "Proteínas"
    }
  ];

  const receitas = [
    {
      titulo: "Mingau de Aveia com Banana",
      ingredientes: ["1/2 xícara de aveia", "1 banana madura", "1 xícara de leite", "Canela a gosto"],
      preparo: "Cozinhe a aveia no leite, amasse a banana e misture. Polvilhe canela.",
      tempo: "10 min",
      porcoes: "1 porção"
    },
    {
      titulo: "Peixe Assado com Legumes",
      ingredientes: ["150g filé de salmão", "Cenoura, brócolis", "Azeite, limão"],
      preparo: "Tempere o peixe, asse com legumes no forno a 200°C por 15 min.",
      tempo: "20 min",
      porcoes: "1 porção"
    },
    {
      titulo: "Iogurte com Frutas",
      ingredientes: ["1 pote iogurte natural", "Morangos, blueberries", "Mel (opcional)"],
      preparo: "Corte as frutas e misture no iogurte.",
      tempo: "5 min",
      porcoes: "1 porção"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-lime-50 dark:from-red-950 dark:to-lime-950">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            Alimentos para Crianças
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Os melhores alimentos e receitas para o crescimento saudável das crianças
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Alimentos Recomendados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alimentos.map((alimento, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{alimento.nome}</CardTitle>
                    <Badge variant="secondary">{alimento.categoria}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {alimento.beneficios}
                  </p>
                  <p className="text-sm font-medium">
                    Calorias: {alimento.calorias}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6">Receitas Saudáveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {receitas.map((receita, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{receita.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Ingredientes:</h4>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      {receita.ingredientes.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Modo de Preparo:</h4>
                    <p className="text-sm text-muted-foreground">{receita.preparo}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span><strong>Tempo:</strong> {receita.tempo}</span>
                    <span><strong>Porções:</strong> {receita.porcoes}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}