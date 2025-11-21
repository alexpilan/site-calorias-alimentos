import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Users } from "lucide-react";

export default function Emagrecer() {
  const recipes = [
    {
      title: "Salada de Quinoa com Legumes",
      description: "Uma salada leve e nutritiva perfeita para o almoço",
      time: "25 min",
      servings: 2,
      calories: 320,
      ingredients: [
        "1 xícara de quinoa cozida",
        "1 pepino em cubos",
        "2 tomates cereja cortados",
        "1/2 cebola roxa picada",
        "Folhas de espinafre",
        "Suco de 1 limão",
        "Azeite de oliva a gosto",
        "Sal e pimenta do reino"
      ],
      instructions: [
        "Cozinhe a quinoa conforme as instruções da embalagem",
        "Em uma tigela grande, misture todos os vegetais",
        "Adicione a quinoa cozida",
        "Tempere com limão, azeite, sal e pimenta",
        "Misture bem e sirva fresca"
      ]
    },
    {
      title: "Sopa de Legumes com Abóbora",
      description: "Sopa cremosa e reconfortante, baixa em calorias",
      time: "40 min",
      servings: 4,
      calories: 180,
      ingredients: [
        "500g de abóbora cabotiá",
        "2 cenouras médias",
        "1 cebola média",
        "2 dentes de alho",
        "1 litro de água ou caldo de legumes",
        "Sal e temperos a gosto",
        "1 colher de sopa de azeite"
      ],
      instructions: [
        "Descasque e corte a abóbora e as cenouras em cubos",
        "Pique a cebola e o alho",
        "Refogue a cebola e o alho no azeite",
        "Adicione os legumes e refogue por 5 minutos",
        "Cubra com água ou caldo e cozinhe por 25 minutos",
        "Bata no liquidificador até ficar cremoso",
        "Ajuste o sal e sirva quente"
      ]
    },
    {
      title: "Frango Grelhado com Brócolis",
      description: "Proteína magra acompanhada de vegetais verdes",
      time: "30 min",
      servings: 2,
      calories: 280,
      ingredients: [
        "400g de peito de frango",
        "1 cabeça de brócolis",
        "2 dentes de alho picados",
        "Suco de 1 limão",
        "Azeite de oliva",
        "Sal, pimenta e ervas",
        "1 colher de chá de gengibre ralado"
      ],
      instructions: [
        "Tempere o frango com alho, limão, sal, pimenta e gengibre",
        "Deixe marinar por 15 minutos",
        "Corte o brócolis em floretes e cozinhe no vapor",
        "Grelhe o frango em uma frigideira antiaderente",
        "Sirva o frango acompanhado do brócolis",
        "Regue com um fio de azeite se desejar"
      ]
    },
    {
      title: "Smoothie Verde Detox",
      description: "Bebida refrescante e detoxificante",
      time: "5 min",
      servings: 1,
      calories: 120,
      ingredients: [
        "1 folha de couve",
        "1/2 maçã verde",
        "1/2 pepino",
        "Suco de 1 limão",
        "1 cm de gengibre",
        "200ml de água",
        "Gelo a gosto"
      ],
      instructions: [
        "Lave bem todos os ingredientes",
        "Corte em pedaços pequenos",
        "Coloque tudo no liquidificador",
        "Bata até ficar homogêneo",
        "Adicione gelo se desejar",
        "Beba imediatamente"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-lime-50 dark:from-red-950 dark:to-lime-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Receitas para Emagrecer</h1>
            <p className="text-muted-foreground">
              Receitas saudáveis, baixas em calorias e ricas em nutrientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recipes.map((recipe, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <ChefHat className="h-5 w-5" />
                        {recipe.title}
                      </CardTitle>
                      <CardDescription>{recipe.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{recipe.calories} kcal</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {recipe.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {recipe.servings} porções
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Ingredientes:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {recipe.ingredients.map((ingredient, i) => (
                          <li key={i}>• {ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Modo de Preparo:</h4>
                      <ol className="text-sm text-muted-foreground space-y-1">
                        {recipe.instructions.map((instruction, i) => (
                          <li key={i}>{i + 1}. {instruction}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Dicas para Emagrecer Saudável</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Alimentação</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Coma devagar e mastigue bem</li>
                    <li>• Priorize proteínas magras</li>
                    <li>• Inclua fibras em todas as refeições</li>
                    <li>• Beba muita água</li>
                    <li>• Evite doces e refrigerantes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Hábitos</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Faça refeições regulares</li>
                    <li>• Pratique exercícios diariamente</li>
                    <li>• Durma bem (7-8 horas por noite)</li>
                    <li>• Controle o estresse</li>
                    <li>• Monitore seu progresso semanalmente</li>
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