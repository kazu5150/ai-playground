'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

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
      
      <div className="min-h-screen bg-slate-200">
        {/* ヒーローセクション */}
        <section className="bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                AI音声会話
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  エージェント
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                ElevenLabsの最先端AI音声技術で、自然な音声会話を体験してください
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* 会話エージェント */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">会話を始める</h2>
              <p className="text-gray-600 mb-6">
                パソコンのマイクとスピーカーを使用して、AIエージェントと音声で会話できます。<br />
                右下の &quot;Start a call&quot; ボタンをクリックして、AIエージェントとの音声会話をお楽しみください
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
              <div dangerouslySetInnerHTML={{
                __html: '<elevenlabs-convai agent-id="AYSyQK5I8g1u6sN9vWja"></elevenlabs-convai>'
              }} />
            </div>
          </div>

        </div>
      </div>
    </>
  )
}