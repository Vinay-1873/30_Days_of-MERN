// src/App.jsx
import { useState, useEffect } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch Data on Component Mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Fetch Categories for the Dropdown Form
      const catRes = await fetch('http://localhost:5000/api/categories');
      const catData = await catRes.json();
      setCategories(catData);

      // 2. Fetch Items (These come back with populated category objects!)
      const itemRes = await fetch('http://localhost:5000/api/items');
      const itemData = await itemRes.json();
      setItems(itemData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItemName,
          price: Number(newItemPrice),
          category: selectedCategory // Sending the raw ObjectId to the backend
        }),
      });

      if (response.ok) {
        // Reset form and refetch data to see the new populated item
        setNewItemName('');
        setNewItemPrice('');
        setSelectedCategory('');
        fetchData();
      }
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Inventory Dashboard</h1>
        <p className="text-gray-500">Relational Database Mapping Demo</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Add Item Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Item</h2>
          <form onSubmit={handleAddItem} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Item Name</label>
              <input
                type="text"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g., Mechanical Keyboard"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Price ($)</label>
              <input
                type="number"
                required
                min="0"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                placeholder="120"
              />
            </div>

            {/* The Relational Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Assign Category</label>
              <select
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="" disabled>Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Save Item to Database
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Inventory List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Current Inventory</h2>
          
          <div className="space-y-4">
            {items.length === 0 ? (
              <p className="text-gray-500 italic">No items in inventory. Create a category via Postman first!</p>
            ) : (
              items.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:shadow-md transition">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                    <p className="text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                  
                  {/* THE POPULATE MAGIC:
                    Because of your backend .populate() logic, item.category is an Object 
                    containing the name, rather than a raw ID string! 
                  */}
                  <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-100">
                    {item.category?.name || 'Uncategorized'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;