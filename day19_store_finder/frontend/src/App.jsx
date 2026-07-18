import { useState } from 'react';
import axios from 'axios';

function App() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const findNearbyStores = () => {
    setLoading(true);
    setError('');

    // 1. Grab user's current coordinates
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { longitude, latitude } = position.coords;

        try {
          // 2. Fetch from the backend API
          const response = await axios.get(
            `http://localhost:5000/api/v1/stores/near?lng=${longitude}&lat=${latitude}&distance=5000`
          );
          setStores(response.data.data);
        } catch (err) {
          setError('Failed to fetch stores from the server.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Unable to retrieve your location. Please enable location services.');
        setLoading(false);
      }
    );
  };

  return (
    <div className="p-8 font-sans max-w-[600px] mx-auto min-h-screen text-gray-800">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Day 19: Geo-Store Finder
      </h1>
      
      <button 
        onClick={findNearbyStores}
        disabled={loading}
        className="px-5 py-2.5 mb-6 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Scanning...' : 'Find Stores Near Me'}
      </button>

      {error && (
        <p className="text-red-500 font-medium mb-4 bg-red-50 p-3 rounded-md border border-red-200">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {stores.length === 0 && !loading && !error ? (
          <p className="text-gray-500 italic bg-gray-50 p-4 rounded-md border border-gray-200">
            No stores found yet. Click the button to search.
          </p>
        ) : (
          stores.map((store) => (
            <div 
              key={store._id} 
              className="border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <h3 className="mb-1 text-lg font-semibold text-gray-900">
                {store.name}
              </h3>
              <p className="text-gray-600 text-sm m-0">
                {store.address}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;