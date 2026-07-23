import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      // Connect to your backend server running on port 5000
      const response = await axios.get(`http://localhost:5000/api/weather/${city}`);
      setWeather(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-700">
        <h1 className="text-2xl font-bold text-center mb-6 text-sky-400">Weather Dashboard</h1>
        
        <form onSubmit={fetchWeather} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500 text-slate-100 placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-500 hover:bg-sky-600 transition-colors px-4 py-2 rounded-lg font-medium text-white disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {weather && (
          <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-5 text-center">
            <h2 className="text-xl font-semibold text-slate-200">{weather.name}, {weather.sys.country}</h2>
            <div className="text-4xl font-black my-3 text-sky-300">
              {Math.round(weather.main.temp)}°C
            </div>
            <p className="capitalize text-slate-400 mb-4">{weather.weather[0].description}</p>
            
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-300 border-t border-slate-800 pt-4">
              <div className="bg-slate-800 p-2 rounded-lg">
                <span className="block text-slate-500 text-xs">Humidity</span>
                <span className="font-semibold">{weather.main.humidity}%</span>
              </div>
              <div className="bg-slate-800 p-2 rounded-lg">
                <span className="block text-slate-500 text-xs">Wind Speed</span>
                <span className="font-semibold">{weather.wind.speed} m/s</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;