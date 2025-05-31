import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product, fetchProducts } from '../../lib/supabase';
import ProductCard from '../Product/ProductCard';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts({ featured: true, limit: 8 });
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback products if Supabase fails
        setProducts([
          {
            id: '1',
            name: 'Labubu The Lonely Monster Blind Box Series',
            price: 14.99,
            images: ['https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/best-sellers/a6c8ffd3a7ebe06cbb4db2a0cc6bfeb.webp'],
            category: 'Blind Box',
            collection: 'LABUBU',
            stock_status: 'in-stock',
            is_featured: true
          },
          {
            id: '2',
            name: 'DIMOO Little Monsters Series Blind Box',
            price: 14.99,
            original_price: 19.99,
            images: ['https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/best-sellers/2b35b3b0e9a6a01bcef6b72a97f1580.webp'],
            category: 'Blind Box',
            collection: 'DIMOO',
            stock_status: 'in-stock',
            is_featured: true,
            is_on_sale: true
          },
          {
            id: '3',
            name: 'SKULLPANDA The Monsters Blind Box',
            price: 14.99,
            images: ['https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/best-sellers/2d9ffd47a66d4f2a93d644c97fc72f4.webp'],
            category: 'Blind Box',
            collection: 'SKULLPANDA',
            stock_status: 'in-stock',
            is_featured: true,
            is_new: true
          },
          {
            id: '4',
            name: 'MOLLY Seasons Series Blind Box',
            price: 14.99,
            images: ['https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/best-sellers/b9f58b1d4cae1835adafcab36de2b0e.webp'],
            category: 'Blind Box',
            collection: 'MOLLY',
            stock_status: 'in-stock',
            is_featured: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="py-20 bg-white container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black">Best Sellers</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-popmart-lightgray animate-pulse h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black">Best Sellers</h2>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link 
            to="/shop" 
            className="inline-flex items-center justify-center bg-black text-white py-3 px-8 hover:bg-popmart-red transition-colors duration-300"
          >
            View All Products <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;