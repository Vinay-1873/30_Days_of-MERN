import React, { useState, useEffect, useCallback } from 'react';
import ProductHeader from './components/ProductHeader';
import ReviewForm from './components/ReviewForm';
import AnalyticsWidget from './components/AnalyticsWidget';

function App() {
  // product_id 
  const PRODUCT_ID = '6a591d337bd83dd816e2106b'; 

  const [analytics, setAnalytics] = useState({ averageRating: 0, totalReviews: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/${PRODUCT_ID}/analytics`);
      const result = await response.json();
      
      if (result.success) {
        setAnalytics({
          averageRating: result.data.averageRating,
          totalReviews: result.data.totalReviews
        });
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  }, [PRODUCT_ID]);

  // Fetch data on initial mount
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-200">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Analytics<span className="text-blue-600">Board</span>
          </h1>
          <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Live Aggregation
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Product Overview</h2>
          <p className="text-gray-500 mt-1">Real-time sentiment and review aggregation.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <section className="bg-white p-6 rounded-2xl shadow-sm">
              <ProductHeader />
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm">
              <ReviewForm 
                productId={PRODUCT_ID} 
                onReviewSubmitted={fetchAnalytics} 
              />
            </section>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6">
            <section className="bg-gradient-to-b from-blue-50 to-white p-6 rounded-2xl shadow-sm border border-blue-100 h-full flex flex-col justify-center">
              <AnalyticsWidget 
                averageRating={analytics.averageRating}
                totalReviews={analytics.totalReviews}
                isLoading={isLoading}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;