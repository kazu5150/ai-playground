import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { serviceName, serviceDescription, personas } = await request.json()

    if (!serviceName || !serviceDescription || !personas) {
      return NextResponse.json(
        { error: 'サービス名、サービス概要、ペルソナデータが必要です' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI APIキーが設定されていません' },
        { status: 500 }
      )
    }

    const marketingPrompt = `あなたは日本市場のマーケティング専門家です。以下のサービスとペルソナ情報を基に、各ペルソナに最適なマーケティング施策を提案してください。

【サービス情報】
サービス名: ${serviceName}
サービス概要: ${serviceDescription}

【ペルソナ情報】
${JSON.stringify(personas, null, 2)}

【要件】
各ペルソナ（Persona A, B, C）について、以下の項目を具体的に提案してください：

1. 広告キャッチコピー案（3-5個）- 各ペルソナの価値観と悩みに響くコピー
2. 最適な広告チャネル（優先順位付き）- SNS、検索広告、動画など
3. おすすめ配信時間帯 - ライフスタイルに合わせた時間
4. 想定エンゲージメント率 - クリック率、コンバージョン率の予測
5. 具体的なアクションプラン - 実行可能な3-5つのステップ

【出力形式】
以下のJSON形式で出力してください（コメント不可、構文エラー無し）：

{
  "Persona A": {
    "target_name": "ペルソナ名",
    "ad_copies": [
      "キャッチコピー1",
      "キャッチコピー2",
      "キャッチコピー3"
    ],
    "channels": [
      {
        "name": "チャネル名",
        "priority": 1,
        "reason": "選択理由"
      }
    ],
    "timing": {
      "weekdays": "平日の最適時間帯",
      "weekends": "休日の最適時間帯",
      "reason": "タイミング選択の理由"
    },
    "expected_performance": {
      "click_rate": "予想クリック率（%）",
      "conversion_rate": "予想コンバージョン率（%）",
      "engagement_score": "エンゲージメント予想（1-10点）"
    },
    "action_plan": [
      "具体的なアクション1",
      "具体的なアクション2",
      "具体的なアクション3"
    ]
  },
  "Persona B": { ... },
  "Persona C": { ... }
}

日本市場の特性を考慮し、実用的で実行可能な提案をしてください。`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'あなたは日本市場に精通したマーケティング専門家です。実用的で具体的なマーケティング施策を提案してください。出力は必ずJSON形式で、構文エラーがないようにしてください。'
          },
          {
            role: 'user',
            content: marketingPrompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('OpenAIからの応答が無効です')
    }

    // JSONパースを試行
    try {
      const marketingData = JSON.parse(aiResponse)
      return NextResponse.json({ marketing_strategies: marketingData })
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return NextResponse.json(
        { error: 'マーケティング施策データの解析に失敗しました', rawResponse: aiResponse },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Marketing strategy generation error:', error)
    return NextResponse.json(
      { error: 'マーケティング施策生成中にエラーが発生しました' },
      { status: 500 }
    )
  }
}