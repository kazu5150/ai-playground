'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Place {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  price_level?: number
  types: string[]
  opening_hours?: {
    open_now: boolean
  }
  photos?: Array<{
    photo_reference: string
  }>
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
}

interface SearchResult {
  places: Place[]
  status: string
}

interface AIAnalysis {
  optimizedQuery: string
  explanation: string
  searchTips: string
}

interface SmartSearchResult {
  places: Place[]
  aiAnalysis: AIAnalysis
  originalQuery: string
  optimizedQuery: string
  status: string
}

// AIスマート検索用のサンプル
const smartSearchSamples = [
  {
    query: "デートにおすすめの場所",
    description: "ロマンチックな雰囲気の場所を探します"
  },
  {
    query: "友達と遊べる場所", 
    description: "グループで楽しめるエンターテイメント施設"
  },
  {
    query: "一人で勉強できる場所",
    description: "集中して作業・勉強できる静かな環境"
  },
  {
    query: "子供と楽しめる場所",
    description: "ファミリー向けの安全で楽しい施設"
  },
  {
    query: "雨の日でも楽しめる場所",
    description: "屋内で過ごせる娯楽・ショッピング施設"
  },
  {
    query: "夜遅くまで営業している場所",
    description: "深夜まで利用できるお店や施設"
  },
  {
    query: "安くて美味しい食事ができる場所",
    description: "コストパフォーマンスの良い飲食店"
  },
  {
    query: "インスタ映えする場所",
    description: "写真撮影に最適なおしゃれなスポット"
  }
]

// 通常検索用のサンプル
const normalSearchSamples = [
  {
    query: "美味しいラーメン屋",
    description: "具体的な料理ジャンルで検索"
  },
  {
    query: "おしゃれなカフェ", 
    description: "雰囲気重視のカフェ探し"
  },
  {
    query: "24時間営業のコンビニ",
    description: "営業時間を指定した検索"
  },
  {
    query: "駐車場のあるレストラン",
    description: "設備条件を含めた検索"
  },
  {
    query: "病院 内科",
    description: "医療機関の専門科目で検索"
  },
  {
    query: "銀行 ATM",
    description: "金融機関・設備での検索"
  }
]

export default function PlaceFinder() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('東京')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<Place[]>([])
  const [error, setError] = useState('')
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [searchMode, setSearchMode] = useState<'normal' | 'smart'>('smart')

  const loadSample = (sampleQuery: string) => {
    setQuery(sampleQuery)
    setError('')
    setResults([])
    setAiAnalysis(null)
  }

  const searchPlaces = async () => {
    if (!query.trim()) {
      setError('検索条件を入力してください')
      return
    }

    setIsSearching(true)
    setError('')
    setResults([])
    setAiAnalysis(null)

    try {
      const endpoint = searchMode === 'smart' ? '/api/smart-search-places' : '/api/search-places'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: query.trim(),
          location: location.trim()
        }),
      })

      if (!response.ok) {
        throw new Error('場所検索に失敗しました')
      }

      if (searchMode === 'smart') {
        const data: SmartSearchResult = await response.json()
        setResults(data.places || [])
        setAiAnalysis(data.aiAnalysis)
      } else {
        const data: SearchResult = await response.json()
        setResults(data.places || [])
      }
    } catch (err) {
      setError('場所検索中にエラーが発生しました。もう一度お試しください。')
      console.error('Place search error:', err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // Enterキーでは自動検索しない - ボタンクリックのみで検索実行
    }
  }

  const getPriceDisplay = (priceLevel?: number) => {
    if (!priceLevel) return '価格情報なし'
    return '¥'.repeat(priceLevel)
  }

  const getTypeDisplay = (types: string[]) => {
    const typeMap: { [key: string]: string } = {
      'restaurant': 'レストラン',
      'food': '飲食店',
      'cafe': 'カフェ',
      'store': '店舗',
      'shopping_mall': 'ショッピングモール',
      'hospital': '病院',
      'pharmacy': '薬局',
      'bank': '銀行',
      'gas_station': 'ガソリンスタンド',
      'parking': '駐車場',
      'tourist_attraction': '観光地',
      'lodging': '宿泊施設'
    }
    
    return types
      .filter(type => typeMap[type])
      .map(type => typeMap[type])
      .slice(0, 2)
      .join('・') || types[0] || '施設'
  }

  return (
    <div className="min-h-screen bg-slate-200">
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ホームに戻るボタン */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-slate-300 hover:text-white transition-colors"
            >
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              ホームに戻る
            </Link>
          </div>
          
          {/* ヘッダー */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              AI場所検索
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                ツール
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Google Mapを使って、欲しい条件の場所を簡単に検索できます
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* 検索フォーム */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-4">
            {/* 検索モード切り替え */}
            <div>
              <label className="block text-lg font-bold text-slate-800 mb-4">
                🔍 検索モード
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchMode"
                    value="smart"
                    checked={searchMode === 'smart'}
                    onChange={(e) => setSearchMode(e.target.value as 'normal' | 'smart')}
                    className="mr-2"
                  />
                  <span className="text-base font-semibold">
                    🤖 AIスマート検索（推奨）
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchMode"
                    value="normal"
                    checked={searchMode === 'normal'}
                    onChange={(e) => setSearchMode(e.target.value as 'normal' | 'smart')}
                    className="mr-2"
                  />
                  <span className="text-base font-semibold">
                    🔍 通常検索
                  </span>
                </label>
              </div>
              {searchMode === 'smart' && (
                <p className="text-sm text-gray-600 mt-3 font-medium">
                  AIが曖昧な検索条件を理解し、最適な結果を見つけます
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="query" className="block text-lg font-bold text-slate-800 mb-3">
                  📝 検索条件 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={searchMode === 'smart' 
                    ? "例: デートにおすすめの場所、友達と遊べる場所、一人で勉強できる場所" 
                    : "例: 美味しいラーメン屋、おしゃれなカフェ、24時間営業のコンビニ"
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black placeholder-gray-400"
                  disabled={isSearching}
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-lg font-bold text-slate-800 mb-3">
                  📍 検索エリア
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="例: 東京、渋谷、新宿駅周辺"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black placeholder-gray-400"
                  disabled={isSearching}
                />
              </div>
            </div>
            
            {/* 検索ボタン */}
            <div className="mt-6">
              <button
                onClick={searchPlaces}
                disabled={isSearching}
                className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSearching ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    検索中...
                  </div>
                ) : (
                  '🔍 場所を検索'
                )}
              </button>
            </div>
            
            {/* サンプル選択ボタン */}
            <div>
              <label className="block text-lg font-bold text-slate-800 mb-4">
                ✨ {searchMode === 'smart' ? 'AIスマート検索のサンプル' : '通常検索のサンプル'}
                <span className="text-base font-medium text-slate-600 ml-2">（ワンクリックで入力）</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {(searchMode === 'smart' ? smartSearchSamples : normalSearchSamples).map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => loadSample(sample.query)}
                    disabled={isSearching}
                    className="p-4 text-left border border-slate-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                  >
                    <div className="font-bold text-base text-slate-900 mb-2">
                      {sample.query}
                    </div>
                    <div className="text-sm text-slate-600 font-medium">
                      {sample.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={searchPlaces}
              disabled={isSearching}
              className="w-full bg-slate-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              {isSearching ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  検索中...
                </div>
              ) : (
                '場所を検索'
              )}
            </button>
          </div>
        </div>

        {/* AI分析結果 */}
        {aiAnalysis && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm">🤖</span>
              </div>
              <h3 className="text-lg font-semibold text-amber-900">AI検索分析</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-amber-800 mb-2">最適化された検索クエリ:</h4>
                <p className="text-amber-700 bg-white rounded-lg px-4 py-2 border border-amber-200">
                  {aiAnalysis.optimizedQuery}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-amber-800 mb-2">AI分析:</h4>
                <p className="text-amber-700 text-sm">
                  {aiAnalysis.explanation}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-amber-800 mb-2">検索のコツ:</h4>
                <p className="text-amber-600 text-sm bg-white rounded-lg px-4 py-2 border border-amber-200">
                  💡 {aiAnalysis.searchTips}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 検索結果 */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-slate-900">
                検索結果 ({results.length}件)
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      施設名・種類
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      住所
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      評価
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      価格
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      営業状況
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      詳細
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((place) => (
                    <tr key={place.place_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {place.name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {getTypeDisplay(place.types)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 max-w-xs">
                          {place.formatted_address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {place.rating ? (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm text-slate-900">
                              {place.rating.toFixed(1)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-900">
                          {getPriceDisplay(place.price_level)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {place.opening_hours ? (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            place.opening_hours.open_now 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {place.opening_hours.open_now ? '営業中' : '営業時間外'}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`https://www.google.com/maps/place/?q=place_id:${place.place_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-amber-600 hover:text-amber-700 text-sm font-medium"
                        >
                          地図で見る
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {results.length === 0 && !isSearching && !error && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-slate-500 text-lg">
              検索条件を入力して場所を探してみましょう
            </p>
          </div>
        )}
      </div>
    </div>
  )
}