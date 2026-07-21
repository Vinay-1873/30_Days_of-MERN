export default function FilterBar({ filters, onFilterChange }) {
  const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden'];

  const handleSearch = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleCategory = (category) => {
    onFilterChange({ ...filters, category });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
      <div className="w-full md:w-1/3">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={handleSearch}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>
      
      <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.category === cat 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}