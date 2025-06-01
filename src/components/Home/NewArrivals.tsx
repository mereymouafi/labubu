import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, Product } from '../../lib/supabase';

// Format Supabase image URL properly
const formatImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return '';
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  const supabaseProjectUrl = import.meta.env.VITE_SUPABASE_URL;
  return `https://${supabaseProjectUrl}/storage/v1/object/public/${imageUrl}`;
};

// Format date to display in a readable format
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  
  return `${month} ${day < 10 ? '0' + day : day}`;
};

const NewArrivals: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch products marked as new
        const data = await fetchProducts({ new: true, limit: 8 });
        
        // If we have more than 4 products, still sort them by date and show the newest ones
        if (data.length > 4) {
          const sortedProducts = data.sort((a, b) => {
            return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
          });
          setProducts(sortedProducts.slice(0, 4)); // Take only the first 4 newest products
        } else {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error loading new arrivals:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-lg text-gray-500">Loading new arrivals...</p>
      </div>
    );
  }

  return (
    <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-600">NEW ARRIVALS</h2>
          <Link to="/new-arrivals" className="text-sm text-gray-600 hover:text-gray-900">
            More &gt;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No new arrivals found.</p>
          ) : (
            products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow">
                  <div className="relative aspect-square overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={formatImageUrl(product.images[0])}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="text-xs text-gray-600 mb-1">
                      {product.created_at && formatDate(product.created_at)}
                    </div>
                    <h3 className="text-sm font-medium mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-red-600">
                        C${product.price.toFixed(2)}
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-gray-500 line-through">
                          C${product.original_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
    </div>
  );
};

export default NewArrivals;
