'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'

interface Persona {
  name: string
  age: number
  gender: string
  occupation: string
  location: string
  family_status: string
  income: string
  lifestyle: string
  technology_level: string
  values: string
  shopping_behavior: string
  pain_points: string
  motivation: string
  preferred_channels: string
}

interface PersonaResult {
  "Persona A": Persona
  "Persona B": Persona
  "Persona C": Persona
}

interface MarketingStrategy {
  target_name: string
  ad_copies: string[]
  channels: Array<{
    name: string
    priority: number
    reason: string
  }>
  timing: {
    weekdays: string
    weekends: string
    reason: string
  }
  expected_performance: {
    click_rate: string
    conversion_rate: string
    engagement_score: string
  }
  action_plan: string[]
}

interface MarketingResult {
  "Persona A": MarketingStrategy
  "Persona B": MarketingStrategy
  "Persona C": MarketingStrategy
}

export default function PersonaGenerator() {
  const [serviceName, setServiceName] = useState('')
  const [serviceDescription, setServiceDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<PersonaResult | null>(null)
  const [marketingStrategies, setMarketingStrategies] = useState<MarketingResult | null>(null)
  const [isGeneratingMarketing, setIsGeneratingMarketing] = useState(false)
  const [error, setError] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const generatePersonas = async () => {
    if (!serviceName.trim() || !serviceDescription.trim()) {
      setError('サービス名とサービス概要を入力してください')
      return
    }

    setIsGenerating(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/generate-persona', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          serviceName: serviceName.trim(),
          serviceDescription: serviceDescription.trim() 
        }),
      })

      if (!response.ok) {
        throw new Error('ペルソナ生成に失敗しました')
      }

      const data = await response.json()
      setResult(data.personas)
    } catch (err) {
      setError('ペルソナ生成中にエラーが発生しました。もう一度お試しください。')
      console.error('Persona generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMarketingStrategies = async () => {
    if (!result) {
      setError('まずペルソナを生成してください')
      return
    }

    setIsGeneratingMarketing(true)
    setError('')

    try {
      const response = await fetch('/api/generate-marketing-strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          serviceName: serviceName.trim(),
          serviceDescription: serviceDescription.trim(),
          personas: result
        }),
      })

      if (!response.ok) {
        throw new Error('マーケティング施策生成に失敗しました')
      }

      const data = await response.json()
      setMarketingStrategies(data.marketing_strategies)
    } catch (err) {
      setError('マーケティング施策生成中にエラーが発生しました。もう一度お試しください。')
      console.error('Marketing strategy generation error:', err)
    } finally {
      setIsGeneratingMarketing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      generatePersonas()
    }
  }

  const MarketingStrategyCard = ({ title, strategy }: { title: string; strategy: MarketingStrategy }) => (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-md p-6 border border-purple-200">
      <h3 className="text-xl font-bold text-purple-900 mb-4 text-center">{title}</h3>
      <h4 className="text-lg font-semibold text-gray-800 mb-4">{strategy.target_name} 向け施策</h4>
      
      <div className="space-y-4 text-sm">
        {/* 広告キャッチコピー */}
        <div>
          <span className="font-medium text-purple-700">🎯 広告キャッチコピー案:</span>
          <ul className="mt-2 space-y-1">
            {strategy.ad_copies.map((copy, index) => (
              <li key={index} className="text-gray-700 bg-white rounded p-2 border-l-4 border-purple-400">
                "{copy}"
              </li>
            ))}
          </ul>
        </div>
        
        {/* 推奨チャネル */}
        <div>
          <span className="font-medium text-purple-700">📢 推奨チャネル:</span>
          <div className="mt-2 space-y-2">
            {strategy.channels.slice(0, 3).map((channel, index) => (
              <div key={index} className="text-gray-700 bg-white rounded p-2">
                <span className="font-medium">{channel.priority}. {channel.name}</span>
                <p className="text-xs text-gray-600 mt-1">{channel.reason}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* 配信タイミング */}
        <div>
          <span className="font-medium text-purple-700">⏰ 最適な配信時間:</span>
          <div className="mt-2 bg-white rounded p-2">
            <p className="text-gray-700"><strong>平日:</strong> {strategy.timing.weekdays}</p>
            <p className="text-gray-700"><strong>休日:</strong> {strategy.timing.weekends}</p>
            <p className="text-xs text-gray-600 mt-1">{strategy.timing.reason}</p>
          </div>
        </div>
        
        {/* 予想パフォーマンス */}
        <div>
          <span className="font-medium text-purple-700">📊 予想パフォーマンス:</span>
          <div className="mt-2 bg-white rounded p-2 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-600">クリック率</p>
              <p className="font-bold text-purple-600">{strategy.expected_performance.click_rate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">CV率</p>
              <p className="font-bold text-purple-600">{strategy.expected_performance.conversion_rate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">エンゲージメント</p>
              <p className="font-bold text-purple-600">{strategy.expected_performance.engagement_score}点</p>
            </div>
          </div>
        </div>
        
        {/* アクションプラン */}
        <div>
          <span className="font-medium text-purple-700">🚀 実行プラン:</span>
          <ol className="mt-2 space-y-1">
            {strategy.action_plan.map((action, index) => (
              <li key={index} className="text-gray-700 bg-white rounded p-2 flex items-start">
                <span className="bg-purple-100 text-purple-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                {action}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )

  const PersonaCard = ({ title, persona }: { title: string; persona: Persona }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{title}</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">{persona.gender === '男性' ? '👨' : '👩'}</span>
          </div>
        </div>
        
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-900">{persona.name}</h4>
          <p className="text-gray-600">{persona.age}歳 / {persona.gender}</p>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-gray-700">職業:</span>
            <p className="text-gray-600 mt-1">{persona.occupation}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">居住地:</span>
            <p className="text-gray-600 mt-1">{persona.location}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">家族構成:</span>
            <p className="text-gray-600 mt-1">{persona.family_status}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">年収:</span>
            <p className="text-gray-600 mt-1">{persona.income}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">ライフスタイル:</span>
            <p className="text-gray-600 mt-1">{persona.lifestyle}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">ITリテラシー:</span>
            <p className="text-gray-600 mt-1">{persona.technology_level}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">価値観:</span>
            <p className="text-gray-600 mt-1">{persona.values}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">購買行動:</span>
            <p className="text-gray-600 mt-1">{persona.shopping_behavior}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">課題・悩み:</span>
            <p className="text-gray-600 mt-1">{persona.pain_points}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">モチベーション:</span>
            <p className="text-gray-600 mt-1">{persona.motivation}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">好むチャネル:</span>
            <p className="text-gray-600 mt-1">{persona.preferred_channels}</p>
          </div>
        </div>
      </div>
    </div>
  )

  if (!isClient) {
    return null
  }

  return (
    <>
      <Head>
        <title>AI ペルソナ生成 & マーケティング戦略ツール - AI Playground</title>
        <meta name="description" content="OpenAI GPT-4 miniを使ってサービス向けのペルソナとマーケティング施策を自動生成します" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              AI ペルソナ生成 & マーケティング戦略ツール
            </h1>
            <p className="text-lg text-gray-600">
              サービス情報を入力するだけで、AIが日本市場向けの現実的なペルソナを3つ自動生成し、各ペルソナに最適なマーケティング施策も提案します
            </p>
          </div>

          {/* 入力フォーム */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-2">
                  サービス名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="serviceName"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="例: スマート体重計 HealthTracker Pro"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isGenerating}
                />
              </div>
              
              <div>
                <label htmlFor="serviceDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  サービス概要 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="serviceDescription"
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="例: WiFi接続、スマホアプリ連携で体重/体脂肪率/筋肉量を記録・分析。健康管理を継続したい人向けのIoTデバイス。価格帯は約1万円。"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={isGenerating}
                />
              </div>
              
              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={generatePersonas}
                disabled={isGenerating}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ペルソナ生成中...
                  </div>
                ) : (
                  'ペルソナを生成 (Ctrl + Enter)'
                )}
              </button>
            </div>
          </div>

          {/* 生成結果 */}
          {result && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">生成されたペルソナ</h2>
                <p className="text-gray-600">
                  以下の3つのペルソナが{serviceName}に対して生成されました
                </p>
              </div>
              
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                <PersonaCard title="Persona A" persona={result["Persona A"]} />
                <PersonaCard title="Persona B" persona={result["Persona B"]} />
                <PersonaCard title="Persona C" persona={result["Persona C"]} />
              </div>

              {/* マーケティング施策生成ボタン */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <button
                  onClick={generateMarketingStrategies}
                  disabled={isGeneratingMarketing}
                  className="bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mr-4"
                >
                  {isGeneratingMarketing ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      マーケティング施策生成中...
                    </div>
                  ) : (
                    '📈 マーケティング施策を生成'
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setResult(null)
                    setMarketingStrategies(null)
                    setServiceName('')
                    setServiceDescription('')
                    setError('')
                  }}
                  className="bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  新しいペルソナを生成
                </button>
              </div>
            </div>
          )}

          {/* マーケティング戦略表示 */}
          {marketingStrategies && (
            <div className="space-y-8 mt-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-purple-900 mb-2">📈 マーケティング戦略</h2>
                <p className="text-gray-600">
                  各ペルソナに最適化されたマーケティング施策をご確認ください
                </p>
              </div>
              
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                <MarketingStrategyCard title="Strategy A" strategy={marketingStrategies["Persona A"]} />
                <MarketingStrategyCard title="Strategy B" strategy={marketingStrategies["Persona B"]} />
                <MarketingStrategyCard title="Strategy C" strategy={marketingStrategies["Persona C"]} />
              </div>

              {/* 追加アクション */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 次のステップ</h3>
                  <p className="text-gray-600 mb-4">
                    生成されたマーケティング戦略を活用して、効果的なキャンペーンを開始しましょう
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-sm">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">PDFエクスポート (開発予定)</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">カスタマージャーニー (開発予定)</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">A/Bテスト案 (開発予定)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}