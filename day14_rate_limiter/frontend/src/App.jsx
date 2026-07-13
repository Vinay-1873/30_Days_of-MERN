import { useState } from 'react';

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(5);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch('http://localhost:5000/api/data');
      
      // Extract Rate Limit Headers sent by express-rate-limit
      const remaining = response.headers.get('RateLimit-Remaining');
      if (remaining !== null) {
        setRemainingRequests(parseInt(remaining, 10));
      }

      const result = await response.json();

      if (!response.ok) {
        // If status is not 2xx (e.g., our 429 Error)
        throw new Error(result.message || 'An error occurred');
      }

      setData(result.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">API Rate Limiter</h1>
          <p className="text-gray-500 text-sm">
            Click the button rapidly to test the 429 error handling.
          </p>
        </div>

        {/* Dashboard Status */}
        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-6">
          <span className="text-sm font-medium text-gray-700">API Health</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            remainingRequests > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {remainingRequests > 0 ? `${remainingRequests} Requests Left` : 'Limit Exceeded'}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={fetchData}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Fetching...' : 'Fetch Secure Data'}
        </button>

        {/* Dynamic Response Area */}
        <div className="mt-6 h-24">
          {data && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center text-sm">
              ✅ {data}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center text-sm flex flex-col items-center gap-2">
              <span className="font-bold">🚨 429 Too Many Requests</span>
              <span>{error}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}