import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product, fetchProducts } from '../../lib/supabase';
import ProductCard from '../Product/ProductCard';

const Featured: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Featured component mounted');
    loadProducts();
  }, []);

  const loadProducts = async () => {
    console.log('Loading featured products');
    setLoading(true);
    try {
      // Fetch featured products
      const filter = { featured: true };
      console.log('Filter applied:', filter);
      const data = await fetchProducts({ ...filter, limit: 8 });
      console.log('Products fetched:', data);
      setProducts(data);
    } catch (error) {
      console.error('Error loading featured products:', error);
      // Fallback products
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  console.log('Rendering Featured, products:', products, 'loading:', loading);
  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold uppercase tracking-wide mb-2">FEATURED</h2>
        <p className="text-gray-600">Discover our featured products for this season.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 animate-pulse h-80 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link 
              to="/shop" 
              className="inline-flex items-center justify-center bg-black text-white py-2 px-6 hover:bg-red-600 transition-colors duration-300 text-sm"
            >
              View All Featured Products <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default Featured;
