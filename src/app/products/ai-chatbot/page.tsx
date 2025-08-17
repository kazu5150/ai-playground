'use client'

import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'こんにちは！OpenAI GPT-4 miniを搭載したAI Playground のチャットボットです。何でもお気軽にご質問ください。',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentMessage }),
      })

      if (!response.ok) {
        throw new Error('チャットAPIエラー')
      }

      const data = await response.json()
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        isUser: false,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('Chat error:', error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: '申し訳ございません。現在AIサービスに接続できません。しばらく時間をおいて再度お試しください。',
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      <Head>
        <title>AIチャットボット (GPT-4 mini) - AI Playground</title>
        <meta name="description" content="OpenAI GPT-4 miniを搭載したインテリジェントなAIチャットボットと自然な会話を楽しめます" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              AIチャットボット (GPT-4 mini)
            </h1>
            <p className="text-lg text-gray-600">
              OpenAI GPT-4 miniを搭載したインテリジェントなAIアシスタントと自然な会話をお楽しみください
            </p>
          </div>

          {/* チャットコンテナ */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* チャットヘッダー */}
            <div className="bg-blue-600 text-white p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-blue-100 text-sm">オンライン</p>
                </div>
              </div>
            </div>

            {/* メッセージエリア */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('ja-JP', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* ローディングインジケーター */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* 入力エリア */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="メッセージを入力してください..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}