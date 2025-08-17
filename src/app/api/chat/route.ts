import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'メッセージが提供されていません' },
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
            content: 'あなたは親切で知識豊富なAIアシスタントです。日本語で自然な会話を行い、ユーザーの質問に正確で有用な回答を提供してください。'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiMessage = data.choices[0]?.message?.content

    if (!aiMessage) {
      throw new Error('OpenAIからの応答が無効です')
    }

    return NextResponse.json({ message: aiMessage })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'チャット処理中にエラーが発生しました' },
      { status: 500 }
    )
  }
}