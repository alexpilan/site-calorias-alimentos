import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, foodText, context } = await request.json();

    if (!imageUrl && !foodText) {
      return NextResponse.json(
        { error: 'URL da imagem ou nome do alimento é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se a chave da API está configurada
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY não configurada');
      return NextResponse.json(
        { 
          error: 'Configure a variável de ambiente OPENAI_API_KEY',
          details: 'A chave da API OpenAI é necessária para análise de alimentos. Clique no banner laranja acima para configurar.'
        },
        { status: 500 }
      );
    }

    let messages;

    // Se for análise por texto
    if (foodText) {
      messages = [
        {
          role: 'user',
          content: `Você é um nutricionista especializado com 99% de precisão na análise nutricional.

ANALISE ESTE ALIMENTO COM MÁXIMA PRECISÃO: "${foodText}"

REGRAS CRÍTICAS PARA 99% DE PRECISÃO:
- Use APENAS valores reais de tabelas nutricionais oficiais (TACO Brasil, USDA)
- Seja ESPECÍFICO sobre o método de preparo (cozido, frito, grelhado, assado, cru)
- Se a porção não for especificada, use 100g como padrão
- Considere temperos e molhos comuns no preparo
- Ajuste valores para a porção especificada

ANÁLISE NUTRICIONAL DETALHADA:
- Calorias precisas (kcal)
- Macronutrientes (proteínas, carboidratos, gorduras)
- Micronutrientes importantes (fibras, sódio)
- Índice glicêmico estimado
- Densidade nutricional

ADEQUAÇÃO PARA CONDIÇÕES DE SAÚDE:
- Diabéticos: considere índice glicêmico e carga glicêmica
- Hipertensos: analise teor de sódio
- Celíacos: presença de glúten

Retorne APENAS um objeto JSON válido com esta estrutura:
{
  "foodName": "nome específico e completo do alimento com método de preparo",
  "portionSize": "tamanho da porção (ex: 100g, 150g, 1 unidade média)",
  "calories": número de calorias TOTAIS da porção,
  "protein": gramas de proteína TOTAIS da porção,
  "carbs": gramas de carboidratos TOTAIS da porção,
  "fat": gramas de gordura TOTAIS da porção,
  "fiber": gramas de fibra TOTAIS da porção,
  "sodium": miligramas de sódio TOTAIS da porção,
  "hasGluten": true ou false,
  "suitableForDiabetics": true ou false (baseado em índice glicêmico < 55),
  "suitableForHypertension": true ou false (baseado em sódio < 400mg por porção),
  "description": "descrição nutricional detalhada com benefícios, alertas e recomendações",
  "confidence": número de 95-99 indicando confiança na identificação,
  "nutritionalSource": "fonte da informação nutricional (TACO, USDA, etc)",
  "glycemicIndex": "baixo/médio/alto",
  "healthScore": número de 1-10 indicando quão saudável é o alimento
}

Seja EXTREMAMENTE PRECISO. Sua análise será usada para decisões de saúde importantes.`
        }
      ];
    } 
    // Se for análise por imagem
    else {
      messages = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Você é um nutricionista especializado com 99% de precisão na identificação de alimentos e análise nutricional.

ANALISE ESTA IMAGEM COM MÁXIMA PRECISÃO:

1. Identifique EXATAMENTE qual alimento está na imagem
2. Se houver múltiplos alimentos, identifique TODOS e forneça análise completa
3. Estime a porção visível (em gramas) com precisão
4. Forneça valores nutricionais PRECISOS baseados em tabelas nutricionais oficiais (TACO Brasil, USDA)

REGRAS CRÍTICAS PARA 99% DE PRECISÃO:
- Use APENAS valores reais de tabelas nutricionais oficiais
- Seja ESPECÍFICO: "Arroz branco cozido" em vez de "arroz"
- Considere o método de preparo (cozido, frito, grelhado, assado, cru)
- Para alimentos processados, identifique marca se visível
- Se múltiplos alimentos, some os valores nutricionais totais
- Considere temperos e molhos visíveis
- Ajuste valores para a porção estimada na imagem

ANÁLISE NUTRICIONAL DETALHADA:
- Calorias precisas (kcal)
- Macronutrientes (proteínas, carboidratos, gorduras)
- Micronutrientes importantes (fibras, sódio, vitaminas principais)
- Índice glicêmico estimado
- Densidade nutricional

ADEQUAÇÃO PARA CONDIÇÕES DE SAÚDE:
- Diabéticos: considere índice glicêmico e carga glicêmica
- Hipertensos: analise teor de sódio
- Celíacos: presença de glúten
- Veganos/Vegetarianos: origem dos ingredientes

Retorne APENAS um objeto JSON válido com esta estrutura:
{
  "foodName": "nome específico e completo do alimento com método de preparo",
  "portionSize": "tamanho da porção estimada (ex: 150g, 1 unidade média)",
  "calories": número de calorias TOTAIS da porção estimada,
  "protein": gramas de proteína TOTAIS da porção,
  "carbs": gramas de carboidratos TOTAIS da porção,
  "fat": gramas de gordura TOTAIS da porção,
  "fiber": gramas de fibra TOTAIS da porção,
  "sodium": miligramas de sódio TOTAIS da porção,
  "hasGluten": true ou false,
  "suitableForDiabetics": true ou false (baseado em índice glicêmico < 55),
  "suitableForHypertension": true ou false (baseado em sódio < 400mg por porção),
  "description": "descrição nutricional detalhada com benefícios, alertas e recomendações",
  "confidence": número de 95-99 indicando confiança na identificação,
  "nutritionalSource": "fonte da informação nutricional (TACO, USDA, etc)",
  "glycemicIndex": "baixo/médio/alto",
  "healthScore": número de 1-10 indicando quão saudável é o alimento
}

Seja EXTREMAMENTE PRECISO. Sua análise será usada para decisões de saúde importantes.`
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'high'
              }
            }
          ]
        }
      ];
    }

    // Chamada para OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_tokens: 2000,
        temperature: 0.1 // Temperatura baixa para máxima precisão
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro da OpenAI:', errorData);
      
      if (errorData.error?.code === 'invalid_api_key') {
        return NextResponse.json(
          { 
            error: 'Chave da API OpenAI inválida',
            details: 'Verifique se a chave OPENAI_API_KEY está correta. Clique no banner laranja para reconfigurar.'
          },
          { status: 401 }
        );
      }
      
      throw new Error('Falha na análise');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Resposta vazia da API');
    }

    // Parse do JSON retornado
    let nutritionData;
    try {
      // Remove markdown code blocks se existirem
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      nutritionData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      console.error('Conteúdo recebido:', content);
      throw new Error('Formato de resposta inválido da IA');
    }

    // Validação dos dados retornados
    if (!nutritionData.foodName || nutritionData.calories === undefined) {
      throw new Error('Dados nutricionais incompletos');
    }

    return NextResponse.json(nutritionData);

  } catch (error) {
    console.error('Erro na análise de alimento:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao analisar alimento',
        details: error instanceof Error ? error.message : 'Erro desconhecido. Tente novamente.'
      },
      { status: 500 }
    );
  }
}
