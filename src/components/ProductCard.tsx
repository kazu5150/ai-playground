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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
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
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
            {product.category}
          </span>
          {product.isNew && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
              NEW
            </span>
          )}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {product.title}
      </h3>
      
      <p className="text-gray-600 mb-4 line-clamp-3">
        {product.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {product.tags.map((tag, index) => (
          <span 
            key={index}
            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>by {product.author}</span>
        <span>{new Date(product.createdAt).toLocaleDateString('ja-JP')}</span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        {product.id === 'voice-chat' ? (
          <Link href="/products/voice-chat" className="block w-full">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              試してみる
            </button>
          </Link>
        ) : product.id === 'website-analyzer' ? (
          <Link href="/products/website-analyzer" className="block w-full">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              試してみる
            </button>
          </Link>
        ) : product.id === 'persona-generator' ? (
          <Link href="/products/persona-generator" className="block w-full">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              試してみる
            </button>
          </Link>
        ) : product.id === '1' ? (
          <Link href="/products/ai-chatbot" className="block w-full">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              試してみる
            </button>
          </Link>
        ) : (
          <button className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed">
            近日公開
          </button>
        )}
      </div>
    </div>
  )
}