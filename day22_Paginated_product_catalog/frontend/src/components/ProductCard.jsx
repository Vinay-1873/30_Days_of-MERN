export default function ProductCard({ product }) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            {product.category}
          </span>
          <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} title={product.inStock ? 'In Stock' : 'Out of Stock'}></span>
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
        <span className="text-xl font-extrabold text-gray-900">
          ${product.price.toFixed(2)}
        </span>
        <button className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
          View Details →
        </button>
      </div>
    </div>
  );
}