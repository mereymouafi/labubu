import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/Product/ProductCard';
import { Product } from '../types';
import { Search as SearchIcon } from 'lucide-react';

const Search: React.FC = () => {
  const location = useLocation();
  const { products } = useShop();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Parse search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
    
    if (query) {
      performSearch(query);
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [location.search, products]);
  
  // Function to perform search
  const performSearch = (query: string) => {
    setIsLoading(true);
    
    // Normalize the search query
    const normalizedQuery = query.toLowerCase().trim();
    
    // Filter products based on search query
    const results = products.filter(product => 
      product.name.toLowerCase().includes(normalizedQuery) ||
      (product.description && product.description.toLowerCase().includes(normalizedQuery)) ||
      (product.category && product.category.toLowerCase().includes(normalizedQuery))
    );
    
    setSearchResults(results);
    setIsLoading(false);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Update URL without full page reload
    const url = new URL(window.location.href);
    url.searchParams.set('q', searchQuery);
    window.history.pushState({}, '', url.toString());
    
    performSearch(searchQuery);
  };

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search Results</h1>
        
        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-8 flex max-w-xl">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-labubumaroc-red focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={20} className="text-gray-400" />
            </div>
          </div>
          <button
            type="submit"
            className="bg-labubumaroc-red text-white px-6 py-3 rounded-r-md hover:bg-red-700 transition-colors duration-200"
          >
            Search
          </button>
        </form>
        
        {/* Results section */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-labubumaroc-red"></div>
          </div>
        ) : (
          <>
            {searchQuery && (
              <p className="text-gray-600 mb-6">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
              </p>
            )}
            
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <SearchIcon size={28} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No results found</h2>
                <p className="text-gray-600 mb-6">
                  We couldn't find any products matching "{searchQuery}"
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    to="/"
                    className="bg-labubumaroc-red text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors duration-200"
                  >
                    Back to Home
                  </Link>
                  <Link
                    to="/categories"
                    className="border border-gray-300 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    Browse Categories
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
