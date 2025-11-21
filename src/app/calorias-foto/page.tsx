import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, AlertCircle } from "lucide-react";

export default function CaloriasFoto() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    food: string;
    calories: number;
    hasGluten: boolean;
    suitableForDiabetics: boolean;
    suitableForHypertension: boolean;
  } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFood = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    // Simulação de análise - em produção, enviaria para uma API
    setTimeout(() => {
      // Simular resultado baseado no nome do arquivo ou aleatório
      const mockResults = [
        { food: "Maçã", calories: 52, hasGluten: false, suitableForDiabetics: true, suitableForHypertension: true },
        { food: "Pão de trigo", calories: 265, hasGluten: true, suitableForDiabetics: false, suitableForHypertension: false },
        { food: "Arroz integral", calories: 130, hasGluten: false, suitableForDiabetics: true, suitableForHypertension: true },
        { food: "Banana", calories: 89, hasGluten: false, suitableForDiabetics: true, suitableForHypertension: true },
        { food: "Chocolate", calories: 546, hasGluten: false, suitableForDiabetics: false, suitableForHypertension: false },
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult(randomResult);
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-lime-50 dark:from-red-950 dark:to-lime-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Calorias por Foto</h1>
            <p className="text-muted-foreground">
              Tire uma foto do seu alimento e descubra suas calorias e restrições
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Upload da Foto
              </CardTitle>
              <CardDescription>
                Selecione uma imagem do alimento (JPG, PNG, até 5MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="food-image">Imagem do Alimento</Label>
                <Input
                  id="food-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1"
                />
              </div>

              {preview && (
                <div className="text-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded-lg mx-auto"
                  />
                </div>
              )}

              <Button
                onClick={analyzeFood}
                disabled={!selectedFile || analyzing}
                className="w-full"
              >
                {analyzing ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Analisar Alimento
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Resultado da Análise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-primary">{result.food}</h3>
                  <p className="text-3xl font-bold text-secondary">{result.calories} kcal</p>
                  <p className="text-sm text-muted-foreground">por 100g</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Badge variant={result.hasGluten ? "destructive" : "secondary"}>
                      {result.hasGluten ? "Contém Glúten" : "Sem Glúten"}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <Badge variant={result.suitableForDiabetics ? "secondary" : "destructive"}>
                      {result.suitableForDiabetics ? "Adequado para Diabéticos" : "Não recomendado"}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <Badge variant={result.suitableForHypertension ? "secondary" : "destructive"}>
                      {result.suitableForHypertension ? "Bom para Pressão Alta" : "Evitar"}
                    </Badge>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Informações Nutricionais
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Esta análise é aproximada. Para informações precisas, consulte um nutricionista.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}