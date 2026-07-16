import React from 'react';
import { Headphones } from 'lucide-react';

const ProductHeader = () => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-start md:items-center">
      
      {/* Product Image Square with Lucide Icon */}
      <div className="h-24 w-24 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-200">
        <Headphones className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
      </div>
      
      {/* Product Details */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900">Wireless Noise-Canceling Headphones</h3>
        <p className="text-gray-600 mt-2">
          High fidelity audio with 30-hour battery life. Experience industry-leading noise cancellation.
        </p>
        <div className="mt-3 inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
          $199.99
        </div>
      </div>
      
    </div>
  );
};

export default ProductHeader;