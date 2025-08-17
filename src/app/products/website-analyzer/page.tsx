'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface AnalysisResult {
  score: number
  improvements: string[]
  strengths: string[]
  summary: string
  fullAnalysis?: string
}

interface AnalysisSection {
  title: string
  content: string[]
  type: 'info' | 'positive' | 'negative' | 'neutral'
}

export default function WebsiteAnalyzer() {
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  const analyzeWebsite = async () => {
    if (!url) {
      setError('URLを入力してください')
      return
    }

    if (!isValidUrl(url)) {
      setError('有効なURLを入力してください（例: https://example.com）')
      return
    }

    setIsAnalyzing(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/analyze-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('分析に失敗しました')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('分析中にエラーが発生しました。もう一度お試しください。')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const parseAnalysisText = (text: string): AnalysisSection[] => {
    if (!text) return []
    
    const sections: AnalysisSection[] = []
    const lines = text.split('\n').filter(line => line.trim())
    
    let currentSection: AnalysisSection | null = null
    
    lines.forEach(line => {
      const trimmedLine = line.trim()
      
      // セクションヘッダーを検出
      if (trimmedLine.match(/^#+\s*(.+)$/) || 
          trimmedLine.match(/^【(.+)】$/) ||
          trimmedLine.match(/^\*\*(.+)\*\*$/) ||
          trimmedLine.includes('##') ||
          trimmedLine.includes('分析') ||
          trimmedLine.includes('評価') ||
          trimmedLine.includes('推奨') ||
          trimmedLine.includes('改善') ||
          trimmedLine.includes('強み') ||
          trimmedLine.includes('課題')) {
        
        // 前のセクションを保存
        if (currentSection) {
          sections.push(currentSection)
        }
        
        // 新しいセクションを開始
        const title = trimmedLine.replace(/^#+\s*/, '').replace(/^【|】$/g, '').replace(/^\*\*|\*\*$/g, '')
        const type = getSectonType(title)
        currentSection = {
          title,
          content: [],
          type
        }
      } else if (currentSection && trimmedLine) {
        // セクション内容を追加
        if (trimmedLine.match(/^\d+[\.\)]\s*(.+)$/) || 
            trimmedLine.match(/^[-\*\+]\s*(.+)$/) ||
            trimmedLine.length > 10) {
          currentSection.content.push(trimmedLine)
        }
      } else if (!currentSection && trimmedLine) {
        // 最初のセクション（タイトルなし）
        if (!sections.some(s => s.title === '概要')) {
          currentSection = {
            title: '概要',
            content: [trimmedLine],
            type: 'info'
          }
        }
      }
    })
    
    // 最後のセクションを追加
    if (currentSection) {
      sections.push(currentSection)
    }
    
    return sections
  }
  
  const getSectonType = (title: string): 'info' | 'positive' | 'negative' | 'neutral' => {
    const positiveWords = ['強み', '良い', '優秀', '素晴らしい', 'メリット', '成功']
    const negativeWords = ['改善', '課題', '問題', '弱み', 'デメリット', '修正']
    
    if (positiveWords.some(word => title.includes(word))) return 'positive'
    if (negativeWords.some(word => title.includes(word))) return 'negative'
    return 'neutral'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ウェブサイト分析ツール
          </h1>
          <p className="text-lg text-gray-600">
            あなたのウェブサイトを自動で分析し、改善点をAIが提案します
          </p>
        </div>

        {/* 入力フォーム */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                ウェブサイトURL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isAnalyzing}
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={analyzeWebsite}
              disabled={isAnalyzing}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  分析中...
                </div>
              ) : (
                'ウェブサイトを分析'
              )}
            </button>
          </div>
        </div>

        {/* 分析結果 */}
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">分析結果</h2>
            
            {/* スコア */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">総合スコア</h3>
                      <p className="text-sm text-gray-600">ウェブサイトの総合評価</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-blue-600">{result.score}</div>
                    <div className="text-lg text-gray-500">/100</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 shadow-sm ${
                      result.score >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                      result.score >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                    style={{ width: `${result.score}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>改善が必要</span>
                  <span>良好</span>
                  <span>優秀</span>
                </div>
              </div>
            </div>

            {/* サマリー */}
            <div className="mb-8">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  分析サマリー
                </h3>
                <p className="text-blue-800 leading-relaxed">{result.summary}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* 強み */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  強み ({result.strengths.length}項目)
                </h3>
                <div className="space-y-3">
                  {result.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-green-800 leading-relaxed">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 改善点 */}
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-700 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  改善提案 ({result.improvements.length}項目)
                </h3>
                <div className="space-y-3">
                  {result.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-orange-800 leading-relaxed">{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 詳細分析結果 */}
            {result.fullAnalysis && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  詳細分析レポート
                </h3>
                
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-gray-700 leading-relaxed mb-4">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside space-y-2 mb-4 ml-4">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-gray-700 leading-relaxed">
                            {children}
                          </li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-gray-900">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-gray-600">
                            {children}
                          </em>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-blue-400 pl-4 py-2 mb-4 bg-blue-50 rounded-r">
                            {children}
                          </blockquote>
                        ),
                        code: ({ children }) => (
                          <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                            {children}
                          </pre>
                        )
                      }}
                    >
                      {result.fullAnalysis}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {/* 新しい分析ボタン */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setResult(null)
                  setUrl('')
                  setError('')
                }}
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                新しいウェブサイトを分析
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}