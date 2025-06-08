import React, { useEffect, useState } from 'react';
import { fetchProducts, Product } from '../lib/supabase';
import ProductCard from '../components/Product/ProductCard';

const FiguringsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFigurines = async () => {
      setIsLoading(true);
      try {
        // Fetch products with category "Figurings"
        const figurineProducts = await fetchProducts({ 
          category: 'Figurings' 
        });
        
        setProducts(figurineProducts);
      } catch (error) {
        console.error('Error loading figurine products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFigurines();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Loading figurines...</p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Figurines Collection
            </h1>
            <p className="text-gray-600 mt-2">
              Browse our collection of Labubu figurines and collectibles
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No figurines found. Check back soon for our latest collection!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FiguringsPage;
