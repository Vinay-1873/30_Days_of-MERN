import { useState, useEffect } from 'react';
import axios from 'axios';

export const useProducts = (filters, page) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams({
          page,
          limit: 8,
          ...(filters.category !== 'All' && { category: filters.category }),
          ...(filters.search && { search: filters.search })
        });

        const response = await axios.get(`/api/products?${params}`);
        const { data, hasMore: morePages, totalCount: total } = response.data;
        setProducts(prev => page === 1 ? data : [...prev, ...data]);
        setHasMore(morePages);
        setTotalCount(total);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, page]);

  return { products, loading, error, hasMore, totalCount };
};