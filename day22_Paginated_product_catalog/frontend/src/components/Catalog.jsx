import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import FilterBar from './FilterBar';
import ProductCard from './ProductCard';

export default function Catalog() {
  const [filters, setFilters] = useState({ category: 'All', search: '' });
  const [page, setPage] = useState(1);

  const { products, loading, error, hasMore, totalCount } = useProducts(filters, page);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page whenever filters change
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Product Catalog</h1>
        <p className="mt-2 text-sm text-gray-500">Showing {products.length} of {totalCount} products</p>
      </div>

      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {products.length === 0 && !loading && !error && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100 mt-6">
          No products found matching your criteria.
        </div>
      )}

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button 
            onClick={() => setPage(prev => prev + 1)}
            disabled={loading}
            className="px-8 py-3 bg-gray-900 text-white font-medium rounded-full shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Loading...' : 'Load More Products'}
          </button>
        </div>
      )}
    </div>
  );
}