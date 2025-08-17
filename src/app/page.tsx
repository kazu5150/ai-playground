import ProductGrid from '@/components/ProductGrid'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Playground
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            最先端のAI技術を体験できるプラットフォーム。
            様々なAIプロダクトを試し、あなたのアイデアを実現しましょう。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              プロダクトを探す
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              プロダクトを投稿
            </button>
          </div>
        </div>
      </section>

      {/* プロダクト一覧 */}
      <ProductGrid />

      {/* CTAセクション */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            今すぐAIの世界を探索しよう
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            無料でアカウントを作成して、最新のAIプロダクトを体験してください
          </p>
          <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            無料で始める
          </button>
        </div>
      </section>
    </div>
  );
}
