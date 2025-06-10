import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../lib/supabase';

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
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
      <div className="p-2">
        <p className="text-xs text-gray-500 mb-2">Suggestions for "{query}"</p>
        <ul>
          {suggestions.map((product) => (
            <li key={product.id}>
              <Link 
                to={`/product/${product.id}`}
                className="flex items-center p-2 hover:bg-gray-100 rounded-md transition-colors"
                onClick={onSelectSuggestion}
              >
                {product.images && product.images[0] && (
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-10 h-10 object-cover rounded-md mr-3"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <Link 
            to={`/search?q=${encodeURIComponent(query)}`}
            className="block text-center text-sm text-labubumaroc-red hover:underline p-2"
            onClick={onSelectSuggestion}
          >
            See all results for "{query}"
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchSuggestions;
