import React, { useState, useEffect } from 'react';
import axiosClient from './api/axiosClient';
import SearchBar from './components/SearchBar';
import ResultCard from './components/ResultCard';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Calls GET /api/v1/search?q=searchQuery
        const response = await axiosClient.get(`/search?q=${searchQuery}`);
        setResults(response.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery]); // Triggered every time the query changes

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Knowledge Base Search
          </h1>
          <p className="text-gray-500">Fast, fuzzy full-text engine powered by MongoDB.</p>
        </div>

        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 text-center">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center my-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {results.map((item) => (
              <ResultCard key={item._id} item={item} />
            ))}
          </div>
        )}

        {!isLoading && results.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No results found. Try adjusting your keywords.
          </div>
        )}

      </div>
    </div>
  );
};

export default App;