'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'

export default function VoiceChat() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // ElevenLabsスクリプトを動的に読み込み
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
    script.async = true
    script.type = 'text/javascript'
    
    script.onload = () => {
      setIsLoaded(true)
    }
    
    script.onerror = () => {
      setError('ElevenLabsウィジェットの読み込みに失敗しました')
    }
    
    document.body.appendChild(script)
    
    return () => {
      // クリーンアップ
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <>
      <Head>
        <title>音声会話エージェント - AI Playground</title>
        <meta name="description" content="ElevenLabsの最先端AI音声技術で自然な会話を体験してください" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              AI音声会話エージェント
            </h1>
            <p className="text-lg text-gray-600">
              ElevenLabsの最先端AI音声技術で、自然な音声会話を体験してください
            </p>
          </div>

          {/* 会話エージェント */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">会話を始める</h2>
              <p className="text-gray-600 mb-6">
                下のマイクボタンをクリックして、AIエージェントとの音声会話をお楽しみください
              </p>
            </div>

            {/* エラー表示 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* ローディング状態 */}
            {!isLoaded && !error && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">音声エージェントを読み込み中...</p>
              </div>
            )}

            {/* ElevenLabsウィジェット */}
            <div className="flex justify-center">
              <elevenlabs-convai agent-id="AYSyQK5I8g1u6sN9vWja"></elevenlabs-convai>
            </div>
          </div>

          {/* 機能説明 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">この機能について</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">自然な音声</h3>
                <p className="text-gray-600 text-sm">ElevenLabsの最先端AI技術による、人間のような自然な音声での会話</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">リアルタイム応答</h3>
                <p className="text-gray-600 text-sm">瞬時に理解し、適切な音声で応答する高性能な会話エンジン</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">スマートな対話</h3>
                <p className="text-gray-600 text-sm">文脈を理解し、意味のある会話を続ける知能的なAIエージェント</p>
              </div>
            </div>
          </div>

          {/* 使用方法 */}
          <div className="bg-blue-50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">使用方法</h3>
            <div className="space-y-3 text-blue-800">
              <div className="flex items-start">
                <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</span>
                <p>マイクへのアクセス許可を求められた場合は、「許可」をクリックしてください</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</span>
                <p>会話ウィジェットのマイクボタンをクリックして話しかけてください</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</span>
                <p>AIエージェントが音声で応答します。自然な会話をお楽しみください</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}