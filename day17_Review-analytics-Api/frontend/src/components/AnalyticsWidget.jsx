import React from 'react';

const AnalyticsWidget = ({ averageRating, totalReviews, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center animate-pulse text-blue-400">
        Syncing pipeline...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center text-center">
      <h3 className="text-lg font-semibold text-gray-700 mb-6">Real-Time Aggregation</h3>
      
      <div className="relative">
        <span className="text-7xl font-black text-blue-600 tracking-tighter">
          {averageRating || 0}
        </span>
        <span className="text-2xl text-blue-400 font-bold ml-1">/5</span>
      </div>

      <p className="mt-4 text-gray-500 font-medium">
        Based on <span className="font-bold text-gray-900">{totalReviews || 0}</span> verified reviews
      </p>

      <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-blue-500 bg-blue-50 px-3 py-1.5 rounded-full">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        Pipeline Synced
      </div>
    </div>
  );
};

export default AnalyticsWidget;