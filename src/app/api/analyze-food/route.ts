import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, foodText } = body;

    // Simulação de análise (substitua com API real se necessário)
    const mockAnalysis = {
      foodName: foodText || 'Alimento detectado',
      food: foodText || 'Alimento detectado',
      portionSize: '100g',
      calories: 150,
      protein: 8,
      carbs: 20,
      fat: 5,
      fiber: 3,
      hasGluten: false,
      suitableForDiabetics: true,
      suitableForHypertension: true,
      confidence: 95
    };

    return NextResponse.json(mockAnalysis);
  } catch (error) {
    console.error('Erro na análise:', error);
    return NextResponse.json(
      { error: 'Erro ao analisar alimento', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
