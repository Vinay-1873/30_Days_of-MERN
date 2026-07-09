import { useState, useEffect } from 'react';
import axios from 'axios';

const AVAILABLE_TAGS = ['Tech', 'Frontend', 'Backend', 'Database', 'Design', 'UI', 'UX'];

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [mode, setMode] = useState('in');

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        let url = import.meta.env.VITE_API_URL;
        
        if (selectedTags.length > 0) {
          url += `?tags=${selectedTags.join(',')}&mode=${mode}`;
        }

        const response = await axios.get(url);
        setBookmarks(response.data.data);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    };

    fetchBookmarks();
  }, [selectedTags, mode]);

  const toggleTag = (tag) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-8 font-sans text-gray-800">
      <h1 className="text-3xl font-extrabold mb-6">🔖 Bookmark Manager</h1>

      {/* --- Controls Section --- */}
      <div className="mb-8 p-6 bg-gray-100 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Filter by Tags:</h3>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {AVAILABLE_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-200 ${
                selectedTags.includes(tag) 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="font-semibold text-gray-700">Filter Mode:</label>
          <select 
            value={mode} 
            onChange={(e) => setMode(e.target.value)} 
            className="p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="in">Match ANY selected tag (OR)</option>
            <option value="all">Match ALL selected tags (AND)</option>
          </select>
        </div>
      </div>

      {/* --- Results Section --- */}
      <div>
        <h2 className="text-xl font-bold mb-4">Results ({bookmarks.length})</h2>
        
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div key={bookmark._id} className="border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
              <h3 className="text-lg font-bold mb-2">
                <a 
                  href={bookmark.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-blue-700 hover:text-blue-900 hover:underline"
                >
                  {bookmark.title}
                </a>
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {bookmark.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded text-xs font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
          
          {bookmarks.length === 0 && (
            <p className="text-gray-500 italic p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
              No bookmarks match your current filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;