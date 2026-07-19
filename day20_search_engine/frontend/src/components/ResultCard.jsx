// src/components/ResultCard.jsx
import React from 'react';

const ResultCard = ({ item }) => {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h5 className="text-xl font-bold tracking-tight text-gray-900">{item.title}</h5>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {item.category}
        </span>
      </div>
      <p className="font-normal text-gray-700">{item.description}</p>
    </div>
  );
};

export default ResultCard;