import { NextRequest, NextResponse } from 'next/server'

const N8N_WEBHOOK_URL = 'https://n8n.srv927568.hstgr.cloud/webhook/n8n-myPortfolio'

// スコアを抽出する関数
function extractScore(text: string): number | null {
  // 文章からスコアらしき数値を抽出（70-90の範囲で適当に決める）
  const positiveKeywords = ['素晴らしい', '良好', '優秀', '適切', '強み']
  const negativeKeywords = ['問題', '改善', '課題', 'ヤバい', '惜しい', 'もったいない']
  
  let positiveCount = 0
  let negativeCount = 0
  
  positiveKeywords.forEach(keyword => {
    const matches = text.match(new RegExp(keyword, 'g'))
    if (matches) positiveCount += matches.length
  })
  
  negativeKeywords.forEach(keyword => {
    const matches = text.match(new RegExp(keyword, 'g'))
    if (matches) negativeCount += matches.length
  })
  
  // 基本スコア70に、ポジティブ要素で+、ネガティブ要素で-調整
  const score = Math.max(40, Math.min(95, 70 + positiveCount * 3 - negativeCount * 2))
  return score
}

// 分析結果から強みと改善点を抽出する関数
function parseAnalysisOutput(text: string): { strengths: string[], improvements: string[] } {
  console.log('Parsing analysis output, text length:', text.length)
  
  const strengths: string[] = []
  const improvements: string[] = []
  
  // より柔軟な推奨事項の抽出パターン
  const lines = text.split('\n')
  let isInRecommendationSection = false
  
  lines.forEach((line, index) => {
    // 推奨事項セクションの開始を検出
    if (line.includes('推奨事項') || line.includes('アイデア') || line.includes('改善') || line.match(/^\d+\)/)) {
      isInRecommendationSection = true
    }
    
    // 番号付きの項目を抽出（複数のパターンに対応）
    const patterns = [
      /^(\d+)\)\s*(.+)$/,  // 1) パターン
      /^(\d+)\.\s*(.+)$/,  // 1. パターン  
      /^(\d+)\s*[\.\)\-]\s*(.+)$/  // 1- パターンなど
    ]
    
    for (const pattern of patterns) {
      const match = line.match(pattern)
      if (match && isInRecommendationSection) {
        const recommendation = match[2].trim()
        if (recommendation && recommendation.length > 15) {
          // より長い文章から適切な長さで切り取り
          const cleanRecommendation = recommendation
            .replace(/[\-─═]+/g, '') // 区切り線を除去
            .trim()
          
          if (cleanRecommendation.length > 20) {
            improvements.push(cleanRecommendation.substring(0, 150) + (cleanRecommendation.length > 150 ? '...' : ''))
          }
        }
        break
      }
    }
  })
  
  // 強み抽出の改善
  const positiveKeywords = [
    { keyword: 'かっこいい', strength: 'スタイリッシュなデザイン要素があります' },
    { keyword: 'カッコいい', strength: 'デザインにユニークな要素があります' },
    { keyword: 'ブランドカラー', strength: 'ブランドカラーが設定されています' },
    { keyword: 'サイドバー', strength: 'ナビゲーション構造が実装されています' },
    { keyword: 'ダークモード', strength: 'モダンなダークテーマを採用しています' },
    { keyword: 'アニメーション', strength: 'インタラクティブな要素が含まれています' },
    { keyword: 'レスポンシブ', strength: 'レスポンシブデザインが実装されています' }
  ]
  
  positiveKeywords.forEach(({ keyword, strength }) => {
    if (text.includes(keyword) && !strengths.includes(strength)) {
      strengths.push(strength)
    }
  })
  
  // デフォルトの強みが少ない場合の補完
  if (strengths.length < 3) {
    strengths.push('サイトの基本構造が確認できています')
    if (strengths.length < 3) strengths.push('技術的な実装が行われています')
    if (strengths.length < 3) strengths.push('ブランディング要素が含まれています')
  }
  
  console.log('Extracted improvements:', improvements.length)
  console.log('Extracted strengths:', strengths.length)
  
  return { 
    strengths: strengths.slice(0, 5), 
    improvements: improvements.slice(0, 8) 
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URLが提供されていません' },
        { status: 400 }
      )
    }

    // URLの基本的なバリデーション
    try {
      new URL(url)
    } catch (error) {
      return NextResponse.json(
        { error: '無効なURLです' },
        { status: 400 }
      )
    }

    // N8Nワークフローにリクエストを送信
    console.log('Sending request to N8N:', { website_url: url })
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        website_url: url,
        timestamp: new Date().toISOString(),
      }),
      // タイムアウトを長めに設定（N8Nワークフローの完了を待つ）
    })

    console.log('N8N response status:', response.status)
    console.log('N8N response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      console.error('N8N webhook error:', response.status, response.statusText)
      return NextResponse.json(
        { error: `分析サービスエラー: ${response.status} ${response.statusText}` },
        { status: 500 }
      )
    }

    // レスポンステキストを確認
    const responseText = await response.text()
    console.log('N8N response text length:', responseText.length)
    console.log('N8N response preview:', responseText.substring(0, 200))

    if (!responseText || responseText.trim() === '') {
      console.error('Empty response from N8N')
      return NextResponse.json(
        { error: 'N8Nから空のレスポンスが返されました。ワークフローがまだ完了していない可能性があります。' },
        { status: 500 }
      )
    }

    let analysisData
    try {
      analysisData = JSON.parse(responseText)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Raw response:', responseText)
      return NextResponse.json(
        { error: '分析結果の解析に失敗しました。N8Nワークフローの出力形式を確認してください。' },
        { status: 500 }
      )
    }

    // N8Nからの実際のレスポンスを処理
    if (!analysisData.output || typeof analysisData.output !== 'string') {
      console.error('No valid output from N8N:', analysisData)
      return NextResponse.json(
        { error: 'N8Nワークフローから有効な分析結果が返されませんでした。outputフィールドが見つからないか、無効な形式です。' },
        { status: 500 }
      )
    }

    const output = analysisData.output
    console.log('Processing N8N analysis output, length:', output.length)
    
    // 分析結果が十分な長さかチェック（短すぎる場合は不完全と判断）
    if (output.length < 100) {
      console.error('Analysis output too short:', output)
      return NextResponse.json(
        { error: '分析結果が不完全です。N8Nワークフローがまだ処理中の可能性があります。少し時間をおいて再度お試しください。' },
        { status: 500 }
      )
    }

    // テキスト分析結果からスコア、強み、改善点を抽出
    const score = extractScore(output)
    const { strengths, improvements } = parseAnalysisOutput(output)
    
    // 抽出した改善点が不十分な場合もエラーとする
    if (improvements.length === 0) {
      console.error('No improvements extracted from analysis')
      return NextResponse.json(
        { error: '分析結果から改善提案を抽出できませんでした。N8Nワークフローの出力を確認してください。' },
        { status: 500 }
      )
    }

    const result = {
      score,
      summary: `${url}の詳細分析が完了しました。AIによる総合的な評価と具体的な改善提案をご確認ください。`,
      strengths: strengths.length > 0 ? strengths : [
        'サイトの構造を詳細に確認しました',
        '改善ポイントを特定しました',
        'AIによる分析が完了しました'
      ],
      improvements: improvements,
      fullAnalysis: output // 完全な分析結果も含める
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Analysis API error:', error)
    return NextResponse.json(
      { error: '分析中にエラーが発生しました' },
      { status: 500 }
    )
  }
}