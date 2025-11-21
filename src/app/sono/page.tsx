import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Moon, Sun, Zap } from "lucide-react";

export default function SonoPage() {
  const horarios = [
    {
      faixa: "Crianças (3-5 anos)",
      horas: "10-13 horas",
      horarioIdeal: "19:00 - 20:00",
      beneficios: "Desenvolvimento cerebral, crescimento físico"
    },
    {
      faixa: "Crianças (6-12 anos)",
      horas: "9-12 horas",
      horarioIdeal: "20:00 - 21:00",
      beneficios: "Aprendizado, memória, sistema imunológico"
    },
    {
      faixa: "Adolescentes (13-18 anos)",
      horas: "8-10 horas",
      horarioIdeal: "21:00 - 23:00",
      beneficios: "Regulação hormonal, desenvolvimento cognitivo"
    },
    {
      faixa: "Adultos (19-65 anos)",
      horas: "7-9 horas",
      horarioIdeal: "22:00 - 24:00",
      beneficios: "Recuperação física, saúde mental, produtividade"
    },
    {
      faixa: "Idosos (65+ anos)",
      horas: "7-8 horas",
      horarioIdeal: "21:00 - 23:00",
      beneficios: "Manutenção da saúde, prevenção de doenças"
    }
  ];

  const dicas = [
    {
      titulo: "Ritmo Circadiano",
      descricao: "Mantenha horários consistentes de sono, mesmo nos finais de semana.",
      icone: Clock
    },
    {
      titulo: "Ambiente Ideal",
      descricao: "Mantenha o quarto escuro, fresco (18-20°C) e silencioso.",
      icone: Moon
    },
    {
      titulo: "Rotina Pré-Sono",
      descricao: "Evite telas azuis 1 hora antes, pratique relaxamento ou leitura leve.",
      icone: Sun
    },
    {
      titulo: "Alimentação",
      descricao: "Jantar leve 2-3 horas antes, evite cafeína após 14h.",
      icone: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-lime-50 dark:from-red-950 dark:to-lime-950">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            Melhor Horário para Dormir
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra o horário ideal de sono para cada faixa etária e melhore sua qualidade de vida
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Horários Recomendados por Idade</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {horarios.map((horario, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{horario.faixa}</CardTitle>
                  <Badge variant="secondary" className="w-fit">
                    {horario.horas} de sono
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Horário Ideal:</p>
                    <p className="text-lg font-bold text-primary">{horario.horarioIdeal}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Benefícios:</strong> {horario.beneficios}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Dicas para um Sono de Qualidade</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dicas.map((dica, index) => {
              const IconComponent = dica.icone;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-8 w-8 text-primary" />
                      <CardTitle className="text-xl">{dica.titulo}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{dica.descricao}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardHeader>
            <CardTitle className="text-2xl">Por que o Horário Importa?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                O corpo humano segue um ritmo circadiano natural de aproximadamente 24 horas,
                regulado pelo relógio biológico. Dormir nos horários ideais permite:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Melhor recuperação física e mental</li>
                <li>Regulação adequada dos hormônios</li>
                <li>Maior produtividade durante o dia</li>
                <li>Redução do risco de doenças crônicas</li>
                <li>Melhora da memória e aprendizado</li>
                <li>Fortecimento do sistema imunológico</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}