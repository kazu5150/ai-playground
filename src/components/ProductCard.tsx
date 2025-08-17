import Link from 'next/link'

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

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-slate-200 flex flex-col h-full hover:border-slate-300">
      {product.imageUrl && (
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-slate-100 text-slate-800 text-xs font-medium px-2 py-1 rounded">
            {product.category}
          </span>
          {product.isNew && (
            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded">
              NEW
            </span>
          )}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {product.title}
      </h3>
      
      <p className="text-slate-600 mb-4 flex-grow">
        {product.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {product.tags.map((tag, index) => (
          <span 
            key={index}
            className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
        <span>by {product.author}</span>
        <span>{new Date(product.createdAt).toLocaleDateString('ja-JP')}</span>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100">
        {product.id === 'voice-chat' ? (
          <Link href="/products/voice-chat" className="block w-full">
            <button className="w-full bg-slate-800 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors shadow-md">
              試してみる
            </button>
          </Link>
        ) : product.id === 'website-analyzer' ? (
          <Link href="/products/website-analyzer" className="block w-full">
            <button className="w-full bg-slate-800 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors shadow-md">
              試してみる
            </button>
          </Link>
        ) : product.id === 'persona-generator' ? (
          <Link href="/products/persona-generator" className="block w-full">
            <button className="w-full bg-slate-800 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors shadow-md">
              試してみる
            </button>
          </Link>
        ) : product.id === 'place-finder' ? (
          <Link href="/products/place-finder" className="block w-full">
            <button className="w-full bg-slate-800 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors shadow-md">
              試してみる
            </button>
          </Link>
        ) : product.id === '1' ? (
          <Link href="/products/ai-chatbot" className="block w-full">
            <button className="w-full bg-slate-800 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors shadow-md">
              試してみる
            </button>
          </Link>
        ) : (
          <button className="w-full bg-slate-400 text-white py-2 px-4 rounded-lg cursor-not-allowed">
            近日公開
          </button>
        )}
      </div>
    </div>
  )
}