import ProductGrid from '@/components/ProductGrid'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            AI
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Playground
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            最先端のAI技術を体験できるプラットフォーム。
            様々なAIプロダクトを試し、あなたのアイデアを実現しましょう。
          </p>
        </div>
      </section>

      {/* プロダクト一覧 */}
      <ProductGrid />
    </div>
  );
}
