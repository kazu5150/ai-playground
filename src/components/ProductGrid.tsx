'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'

interface Product {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  author: string
  createdAt: string
  imageUrl?: string
  isNew?: boolean
}

const sampleProducts: Product[] = [
  {
    id: 'voice-chat',
    title: 'AI音声会話エージェント',
    description: 'ElevenLabsの最先端AI音声技術を使った自然な音声会話体験。リアルタイムで応答する知能的なエージェントと話してみましょう。',
    category: '音声AI',
    tags: ['ElevenLabs', '音声合成', 'リアルタイム', '自然言語'],
    author: 'AI Playground',
    createdAt: '2024-08-17',
    isNew: true
  },
  {
    id: 'website-analyzer',
    title: 'ウェブサイト分析ツール',
    description: 'あなたのウェブサイトを自動で分析し、改善点をAIが提案します。SEO、パフォーマンス、ユーザビリティを総合的に評価。',
    category: 'ウェブ分析',
    tags: ['SEO', 'パフォーマンス', 'UX評価', 'AI分析'],
    author: 'AI Playground',
    createdAt: '2024-08-17',
    isNew: true
  },
  {
    id: 'persona-generator',
    title: 'AI ペルソナ生成 & マーケティング戦略ツール',
    description: 'サービス情報を入力するだけで、AIが日本市場向けの現実的なペルソナを3つ自動生成し、各ペルソナに最適なマーケティング施策も提案します。',
    category: 'マーケティング',
    tags: ['ペルソナ', 'マーケティング戦略', 'ターゲット分析', 'GPT-4'],
    author: 'AI Playground',
    createdAt: '2024-08-17',
    isNew: true
  },
  {
    id: 'place-finder',
    title: 'AI場所検索ツール',
    description: 'Google Places APIを使って、欲しい条件の場所を簡単に検索。レストラン、カフェ、観光地など、自然言語で検索できます。',
    category: '検索・情報',
    tags: ['Google Places API', '場所検索', '地図', 'リアルタイム'],
    author: 'AI Playground',
    createdAt: '2024-08-17',
    isNew: true
  },
  {
    id: '1',
    title: 'AIチャットボット',
    description: '自然言語処理を活用した高度な対話システム。カスタマーサポートや個人アシスタントとして活用できます。',
    category: 'チャット',
    tags: ['NLP', 'GPT', 'カスタマーサポート'],
    author: '田中太郎',
    createdAt: '2024-08-15',
    isNew: true
  },
  {
    id: '2',
    title: 'AI画像生成ツール',
    description: 'テキストから高品質な画像を生成するAIツール。アート作品やマーケティング素材の作成に最適です。',
    category: '画像生成',
    tags: ['Stable Diffusion', 'アート', 'マーケティング'],
    author: '佐藤花子',
    createdAt: '2024-08-12'
  },
  {
    id: '3',
    title: '音声認識システム',
    description: 'リアルタイムで音声をテキストに変換するシステム。会議の議事録作成や音声入力に便利です。',
    category: '音声認識',
    tags: ['音声処理', '議事録', 'リアルタイム'],
    author: '山田次郎',
    createdAt: '2024-08-10'
  },
  {
    id: '4',
    title: 'データ分析AI',
    description: '大量のデータから有用な洞察を抽出するAIシステム。ビジネスの意思決定をサポートします。',
    category: 'データ分析',
    tags: ['機械学習', 'ビジネス', '予測分析'],
    author: '鈴木一郎',
    createdAt: '2024-08-08'
  },
  {
    id: '5',
    title: 'コード生成AI',
    description: '自然言語の指示からプログラムコードを自動生成するツール。開発効率を大幅に向上させます。',
    category: 'コード生成',
    tags: ['プログラミング', '開発支援', '自動化'],
    author: '高橋美咲',
    createdAt: '2024-08-05',
    isNew: true
  },
  {
    id: '6',
    title: 'AIライティングアシスタント',
    description: 'ブログ記事やマーケティングコピーを効率的に作成するAIライティングツールです。',
    category: 'ライティング',
    tags: ['コンテンツ', 'ブログ', 'コピーライティング'],
    author: '伊藤健太',
    createdAt: '2024-08-03'
  }
]

const categories = ['すべて', '音声AI', 'ウェブ分析', 'マーケティング', '検索・情報', 'チャット', '画像生成', '音声認識', 'データ分析', 'コード生成', 'ライティング']

export default function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState('すべて')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = sampleProducts.filter(product => {
    const matchesCategory = selectedCategory === 'すべて' || product.category === selectedCategory
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AIプロダクト一覧
          </h2>
          <p className="text-lg text-gray-600">
            様々なAIプロダクトを探索し、あなたのニーズに合ったツールを見つけましょう
          </p>
        </div>

        {/* 検索とフィルター */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="プロダクトを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* プロダクトグリッド */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              検索条件に一致するプロダクトが見つかりませんでした。
            </p>
          </div>
        )}
      </div>
    </section>
  )
}