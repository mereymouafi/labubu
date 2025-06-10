import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../lib/supabase';
import { ChevronRight } from 'lucide-react';

interface SearchSuggestionsProps {
  suggestions: Product[];
  query: string;
  onSelectSuggestion: () => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ 
  suggestions, 
  query, 
  onSelectSuggestion 
}) => {
  if (!query.trim() || suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[70vh] overflow-y-auto">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
          <p className="text-sm text-gray-500">
            Suggestions for "<span className="font-medium">{query}</span>"
          </p>
          <span className="text-xs text-gray-400">{suggestions.length} results</span>
        </div>
        
        <ul className="divide-y divide-gray-100">
          {suggestions.map((product) => (
            <li key={product.id} className="py-2">
              <Link 
                to={`/product/${product.id}`}
                className="flex items-center hover:bg-gray-50 rounded-md transition-colors p-2"
                onClick={onSelectSuggestion}
              >
                <div className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200 mr-3">
                  {product.images && product.images[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.jpg'; // Fallback image
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-grow min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">{product.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500 capitalize">{product.category || 'Product'}</p>
                    {product.price && (
                      <p className="text-xs font-medium text-labubumaroc-red">
                        {product.price.toFixed(2)} MAD
                      </p>
                    )}
                  </div>
                </div>
                
                <ChevronRight size={16} className="text-gray-400 ml-2 flex-shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
        
        {suggestions.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <Link 
              to={`/search?q=${encodeURIComponent(query)}`}
              className="flex items-center justify-center text-sm text-labubumaroc-red hover:text-red-700 hover:bg-red-50 py-2 px-3 rounded-md transition-colors"
              onClick={onSelectSuggestion}
            >
              <span>See all results</span>
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSuggestions;
