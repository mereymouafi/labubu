import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/Product/ProductCard';
import { Product } from '../types';
import { fetchTShirtOptions, TShirtOption } from '../lib/supabase';

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const { products } = useShop();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [tshirtResults, setTshirtResults] = useState<TShirtOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Filter products and fetch T-shirts based on search query
    const searchForResults = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        setTshirtResults([]);
        setLoading(false);
        return;
      }

      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
      
      // Filter regular products
      const productResults = products ? products.filter((product: Product) => {
        const productName = product.name.toLowerCase();
        const productDescription = product.description?.toLowerCase() || '';
        const productCategory = product.category?.toLowerCase() || '';
        
        // Check if any search term is included in product name, description or category
        return searchTerms.some(term => 
          productName.includes(term) || 
          productDescription.includes(term) || 
          productCategory.includes(term)
        );
      }) : [];
      
      // Fetch and filter T-shirt options
      try {
        const allTshirtOptions = await fetchTShirtOptions();
        const tshirtMatches = allTshirtOptions.filter(option => {
          const optionName = option.option_name.toLowerCase();
          const optionDescription = option.option_description.toLowerCase();
          
          return searchTerms.some(term => 
            optionName.includes(term) || 
            optionDescription.includes(term) ||
            // Check if the term is 't-shirt' or 'tshirt'
            (term === 't-shirt' || term === 'tshirt')
          );
        });
        
        setTshirtResults(tshirtMatches);
      } catch (error) {
        console.error('Error fetching T-shirt options:', error);
      }
      
      setSearchResults(productResults);
      setLoading(false);
    };

    // Short timeout to allow for state updates and smooth UI
    const timer = setTimeout(() => {
      searchForResults();
    }, 300);

    return () => clearTimeout(timer);
  }, [query, products]);

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-600 mb-8">
        {searchResults.length + tshirtResults.length} results for "{query}"
      </p>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-popmart-red"></div>
        </div>
      ) : searchResults.length > 0 || tshirtResults.length > 0 ? (
        <>
          {/* T-shirt results section */}
          {tshirtResults.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">T-Shirts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tshirtResults.map((tshirt) => (
                  <Link 
                    to={`/tshirt/${tshirt.id}`} 
                    key={tshirt.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative h-64 overflow-hidden">
                      {tshirt.image_urls && tshirt.image_urls.length > 0 ? (
                        <img 
                          src={tshirt.image_urls[0]} 
                          alt={tshirt.option_name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-500">No image available</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2">{tshirt.option_name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{tshirt.option_description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Regular product results section */}
          {searchResults.length > 0 && (
            <div>
              {tshirtResults.length > 0 && <h2 className="text-2xl font-bold mb-4">Other Products</h2>}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-medium mb-4">No results found</h2>
          <p className="text-gray-600 mb-8">
            We couldn't find any products matching "{query}"
          </p>
          <p className="text-gray-600">
            Try using different keywords or check for spelling errors.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
