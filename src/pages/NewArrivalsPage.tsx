import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts, Product } from '../lib/supabase';

const formatImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return '';
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  const supabaseProjectUrl = import.meta.env.VITE_SUPABASE_URL;
  return `https://${supabaseProjectUrl}/storage/v1/object/public/${imageUrl}`;
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  
  return `${month} ${day}`;
};

const NewArrivalsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Page transition animation
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch most recent products, ordered by created_at
        const data = await fetchProducts({ limit: 20 });
        // Sort by creation date (newest first)
        const sortedProducts = data.sort((a, b) => {
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        });
        setProducts(sortedProducts);
      } catch (error) {
        console.error('Error loading new arrivals:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="container mx-auto px-4 py-8 md:py-12"
    >
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">New Arrivals</span>
        </nav>
      </div>

      <h1 className="text-3xl font-bold text-left text-red-600 my-8 py-4">NEW ARRIVALS</h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-xl text-gray-500">No new arrivals found.</p>
              <Link to="/shop" className="mt-4 inline-block text-primary-600 hover:underline">
                View all products
              </Link>
            </div>
          ) : (
            products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
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
                    
                    {/* New badge */}
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      NEW
                    </div>
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
      )}
    </motion.div>
  );
};

export default NewArrivalsPage;
