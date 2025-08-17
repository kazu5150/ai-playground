import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured')
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { query, location } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: '検索条件が提供されていません' },
        { status: 400 }
      )
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        { error: 'Google Places APIキーが設定されていません' },
        { status: 500 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI APIキーが設定されていません' },
        { status: 500 }
      )
    }

    console.log('AIスマート検索開始:', query)

    // OpenAI GPTを使って検索クエリを最適化
    const openai = getOpenAIClient()
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `あなたは場所検索の専門家です。ユーザーの曖昧な要求を、Google Places APIで検索しやすい具体的なクエリに変換してください。

以下の例を参考にしてください：
- "デートにおすすめの場所" → "レストラン カフェ 公園"
- "友達と遊べる場所" → "カラオケ ゲームセンター ボウリング場"
- "一人で勉強できる場所" → "カフェ 図書館 コワーキングスペース"
- "子供と楽しめる場所" → "公園 遊園地 動物園 ファミリーレストラン"
- "美味しい食事" → "評判の良いレストラン"
- "おしゃれな場所" → "インスタ映え カフェ ショップ"
- "安くて美味しい" → "コスパの良い 定食 ラーメン 居酒屋"

レスポンスは以下のJSON形式で返してください：
{
  "optimizedQuery": "最適化された検索クエリ",
  "explanation": "なぜこのクエリに変換したかの簡単な説明",
  "searchTips": "検索のコツやアドバイス"
}`
        },
        {
          role: "user",
          content: `以下のユーザーの要求を、Google Places APIで検索しやすいクエリに変換してください：

ユーザーの要求: "${query}"
検索エリア: "${location || '指定なし'}"`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const aiContent = aiResponse.choices[0]?.message?.content
    if (!aiContent) {
      throw new Error('OpenAI APIからの応答が空でした')
    }

    let optimizationResult
    try {
      optimizationResult = JSON.parse(aiContent)
    } catch {
      console.error('AI応答のパース失敗:', aiContent)
      // パースに失敗した場合は元のクエリを使用
      optimizationResult = {
        optimizedQuery: query,
        explanation: '元の検索条件をそのまま使用します',
        searchTips: '検索条件をより具体的にすると、より良い結果が得られます'
      }
    }

    console.log('AI最適化結果:', optimizationResult)

    // 最適化されたクエリでGoogle Places APIを検索
    const searchQuery = location ? `${optimizationResult.optimizedQuery} in ${location}` : optimizationResult.optimizedQuery
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${GOOGLE_PLACES_API_KEY}&language=ja&region=jp`

    console.log('Google Places API検索:', searchQuery)

    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('Google Places API error:', response.status, response.statusText)
      return NextResponse.json(
        { error: `Google Places APIエラー: ${response.status} ${response.statusText}` },
        { status: 500 }
      )
    }

    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API response error:', data.status, data.error_message)
      return NextResponse.json(
        { error: `Google Places API response error: ${data.status}` },
        { status: 500 }
      )
    }

    // 結果を最大10件に制限
    const places = (data.results || []).slice(0, 10)

    console.log(`AIスマート検索完了: ${places.length}件の結果`)

    return NextResponse.json({
      places,
      aiAnalysis: optimizationResult,
      originalQuery: query,
      optimizedQuery: optimizationResult.optimizedQuery,
      status: data.status
    })

  } catch (error) {
    console.error('AIスマート検索エラー:', error)
    return NextResponse.json(
      { error: 'AIスマート検索中にエラーが発生しました' },
      { status: 500 }
    )
  }
}