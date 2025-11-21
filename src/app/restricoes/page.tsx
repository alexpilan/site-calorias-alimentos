import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Wheat, Heart, AlertTriangle } from "lucide-react";

export default function Restricoes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState<{
    food: string;
    hasGluten: boolean;
    suitableForDiabetics: boolean;
    suitableForHypertension: boolean;
    suitableForGlutenIntolerant: boolean;
  } | null>(null);

  const foodDatabase = [
    { food: "Pão de trigo", hasGluten: true, suitableForDiabetics: false, suitableForHypertension: false, suitableForGlutenIntolerant: false },
    { food: "Arroz integral", hasGluten: false, suitableForDiabetics: true, suitableForHypertension: true, suitableForGlutenIntolerant: true },
    { food: "Maçã", hasGluten: false, suitableForDiabetics: true, suitableForHypertension: true, suitableForGlutenIntolerant: true },
    { food: "Banana", hasGluten: false, suitableForDiabetics: true, suitableForHypertension: true, suitableForGlutenIntolerant: true },
    { food: "Chocolate", hasGluten: false, suitableForDiabetics: false, suitableForHypertension: false, suitableForGlutenIntolerant: true },
    { food: "Aveia", hasGluten: false, suitableForDiabetics: true, suitableForHypertension: true, suitableForGlutenIntolerant: true },
    { food: "Quinoa", hasGluten: false, suitableForDiabetics: true, suitableForHypertension: true, suitableForGlutenIntolerant: true },
    { food: "Batata doce", hasGluten: false, suitableForDiabetics: true, suitableForHypertension: true, suitableForGlutenIntolerant: true },
    { food: "Salmão", hasGluten: false, suitableForDiabetics: true, suitableForHypertension: true, suitableForGlutenIntolerant: true },
    { food: "Abacate", hasGluten: false, suitableForDiabetics: true, suitableForHypertension: true, suitableForGlutenIntolerant: true },
  ];

  const searchFood = () => {
    const found = foodDatabase.find(item =>
      item.food.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResult(found || null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-lime-50 dark:from-red-950 dark:to-lime-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Verificar Restrições</h1>
            <p className="text-muted-foreground">
              Descubra se um alimento é adequado para suas necessidades dietéticas
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Alimento
              </CardTitle>
              <CardDescription>
                Digite o nome do alimento para verificar restrições
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="food-search">Nome do Alimento</Label>
                <Input
                  id="food-search"
                  type="text"
                  placeholder="Ex: maçã, arroz, chocolate..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchFood()}
                  className="mt-1"
                />
              </div>

              <Button onClick={searchFood} className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Verificar
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Resultado para: {result.food}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Wheat className="h-4 w-4" />
                      <span className="font-medium">Glúten:</span>
                      <Badge variant={result.hasGluten ? "destructive" : "secondary"}>
                        {result.hasGluten ? "Contém" : "Não contém"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span className="font-medium">Diabéticos:</span>
                      <Badge variant={result.suitableForDiabetics ? "secondary" : "destructive"}>
                        {result.suitableForDiabetics ? "Adequado" : "Não recomendado"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Pressão Alta:</span>
                      <Badge variant={result.suitableForHypertension ? "secondary" : "destructive"}>
                        {result.suitableForHypertension ? "Adequado" : "Não recomendado"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wheat className="h-4 w-4" />
                      <span className="font-medium">Intolerante ao Glúten:</span>
                      <Badge variant={result.suitableForGlutenIntolerant ? "secondary" : "destructive"}>
                        {result.suitableForGlutenIntolerant ? "Adequado" : "Não recomendado"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Recomendações</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {!result.hasGluten && <li>✓ Adequado para celíacos e intolerantes ao glúten</li>}
                    {result.suitableForDiabetics && <li>✓ Baixo índice glicêmico, bom para diabéticos</li>}
                    {result.suitableForHypertension && <li>✓ Baixo teor de sódio, bom para hipertensos</li>}
                    {!result.suitableForDiabetics && <li>⚠️ Alto teor de açúcar, consultar médico</li>}
                    {!result.suitableForHypertension && <li>⚠️ Alto teor de sódio, evitar se hipertenso</li>}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}