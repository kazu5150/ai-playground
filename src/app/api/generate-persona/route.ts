import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { serviceName, serviceDescription } = await request.json()

    if (!serviceName || !serviceDescription) {
      return NextResponse.json(
        { error: 'サービス名とサービス概要が必要です' },
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

    const personaPrompt = `以下は、与えられた商品情報（商品名・商品説明）から、日本市場向けに現実的で活用できる「3つのペルソナ（Persona A, B, C）」を生成するためのプロンプトです。
出力は必ずJSON形式で、各ペルソナは以下の構造を完全に満たしてください（空欄不可）。各ペルソナは年齢層・ライフスタイル・価値観で明確に差を付け、実用的で具体的な内容にしてください。

【必須入力】
商品名: ${serviceName}
商品説明: ${serviceDescription}

【要件】
1. Persona A/B/Cは日本国内の代表的な顧客像として現実味を持たせること。
2. 各ペルソナは互いに明確に差別化する（年齢、職業、家族構成、テクノロジー理解度、価格感度など）。
3. 各項目は具体的に記述（例：どのSNS、どのECサイト、典型的な購買理由など）。
4. 文化的背景は日本市場に合わせる（居住地は都道府県・市区町村レベルまたは例示でよい）。
5. JSONは構文エラーが無いこと（コメント不可）。すべてのフィールドを埋めること。

【出力JSONフォーマット例】
{
  "Persona A": {
    "name": "田中 明子",
    "age": 28,
    "gender": "女性",
    "occupation": "会社員（マーケティング職）",
    "location": "東京都渋谷区",
    "family_status": "独身",
    "income": "年収450万円",
    "lifestyle": "平日は忙しく働き、週末は友人との時間を大切にする。健康志向で新しいサービスに興味がある",
    "technology_level": "高い（新しいアプリやサービスを積極的に試す）",
    "values": "効率性、自己投資、健康管理",
    "shopping_behavior": "オンラインショッピング中心、口コミを重視、InstagramやTwitterで情報収集",
    "pain_points": "忙しくて時間がない、継続するのが苦手",
    "motivation": "自分磨きと効率的な生活の実現",
    "preferred_channels": "Instagram、Twitter、オンライン広告"
  },
  "Persona B": {
    "name": "佐藤 健太",
    "age": 35,
    "gender": "男性",
    "occupation": "会社員（IT職）",
    "location": "神奈川県横浜市",
    "family_status": "既婚・子供1人",
    "income": "年収650万円",
    "lifestyle": "家族との時間を重視し、仕事とプライベートのバランスを大切にする。合理的な判断を好む",
    "technology_level": "非常に高い（ITプロフェッショナル）",
    "values": "家族、効率性、コストパフォーマンス",
    "shopping_behavior": "事前リサーチを徹底、価格比較サイトを活用、Amazon等のECサイト利用",
    "pain_points": "時間の制約、家計管理の必要性",
    "motivation": "家族のためのより良い生活環境の構築",
    "preferred_channels": "検索エンジン、比較サイト、技術系メディア"
  },
  "Persona C": {
    "name": "山田 美和子",
    "age": 45,
    "gender": "女性",
    "occupation": "主婦・パートタイム勤務",
    "location": "大阪府吹田市",
    "family_status": "既婚・子供2人（中学生・高校生）",
    "income": "世帯年収800万円（夫の収入含む）",
    "lifestyle": "家事と育児中心の生活。子供の教育費を考慮し、慎重な消費行動を取る",
    "technology_level": "中程度（必要な機能は使えるが、新しい技術には慎重）",
    "values": "家族の健康と安全、節約、実用性",
    "shopping_behavior": "実店舗とオンラインを併用、クーポンや割引を重視、口コミサイトで確認",
    "pain_points": "教育費の負担、家事の効率化の必要性",
    "motivation": "家族の健康管理と家計の節約",
    "preferred_channels": "LINE、Facebook、店舗での紹介、テレビCM"
  }
}

上記の形式に従って、${serviceName}（${serviceDescription}）に対する3つのペルソナをJSON形式で生成してください。JSONのみを出力し、説明文は含めないでください。`

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
            content: 'あなたは日本市場のマーケティング専門家です。与えられた商品情報から、実用的で現実的なペルソナを3つ生成してください。出力は必ずJSON形式で、構文エラーがないようにしてください。'
          },
          {
            role: 'user',
            content: personaPrompt
          }
        ],
        max_tokens: 2000,
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
      const personaData = JSON.parse(aiResponse)
      return NextResponse.json({ personas: personaData })
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return NextResponse.json(
        { error: 'ペルソナデータの解析に失敗しました', rawResponse: aiResponse },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Persona generation error:', error)
    return NextResponse.json(
      { error: 'ペルソナ生成中にエラーが発生しました' },
      { status: 500 }
    )
  }
}