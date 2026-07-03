import { useState, useEffect } from 'react';
import api from './api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // We need distinct colors for our pie slices
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      // Calling your aggregation endpoint from Day 3
      const response = await api.get('/summary');
      setData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-800">📊 Expense Analytics</h1>
        <p className="text-slate-500 mt-2">Aggregated directly from MongoDB</p>
      </header>

      {loading ? (
        <p className="text-center">Loading chart data...</p>
      ) : data.length === 0 ? (
        <p className="text-center text-slate-500">No expenses found. Add some records!</p>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-2xl mx-auto h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="totalAmount"
                nameKey="_id"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default App;
// ```eof

// /***How this works:
// 1.  **The API Call:** We call `api.get('/summary')`. Remember, since we set the base URL to `/api/expenses` in `api.js`, this hits `localhost:5001/api/expenses/summary`.
// 2.  **Recharts:** We feed the response directly into the `PieChart`. Notice how we set `dataKey="totalAmount"` and `nameKey="_id"`. This maps exactly to the aggregation object we created in Day 3.
// 3.  **Responsiveness:** Using `ResponsiveContainer` ensures the chart automatically fills its parent `div`, making your app look professional on both mobile and desktop.

// **Your Task:**
// 1. Copy the code into `src/App.jsx`.
// 2. Ensure you have added expenses via your `POST` endpoint (from Day 3) so the chart has data to display!
// 3. Check your browser.

// If you see a colorful Pie Chart rendering, **congratulations!** You have completed the Day 3-4 full-stack flow. Let me know if the chart renders correctly! **/