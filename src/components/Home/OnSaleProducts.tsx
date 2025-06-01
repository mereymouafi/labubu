import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product, fetchProducts } from '../../lib/supabase';
import ProductCard from '../Product/ProductCard';

const OnSaleProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts({ onSale: true, limit: 8 });
        setProducts(data);
      } catch (error) {
        console.error('Error loading on sale products:', error);
        // Fallback products if Supabase fails
        setProducts([
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
            id: '5',
            name: 'LABUBU Plush Toy',
            price: 24.99,
            original_price: 29.99,
            images: ['https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/new-releases/a943e8cb8f3ccb1a2dbe626a5a2bbce.webp'],
            category: 'Plush',
            collection: 'LABUBU',
            stock_status: 'in-stock',
            is_on_sale: true
          },
          {
            id: '6',
            name: 'SKULLPANDA Vinyl Figure',
            price: 19.99,
            original_price: 24.99,
            images: ['https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/new-releases/d8a5cda4db3eec44ad24e1c4a83e1f5.webp'],
            category: 'Figurine',
            collection: 'SKULLPANDA',
            stock_status: 'in-stock',
            is_on_sale: true
          },
          {
            id: '7',
            name: 'DIMOO Collectible Set',
            price: 34.99,
            original_price: 39.99,
            images: ['https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/new-releases/a3bd6a4d1bd07f493a8d15be69fb97e.webp'],
            category: 'Collectible',
            collection: 'DIMOO',
            stock_status: 'in-stock',
            is_on_sale: true
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
      <div className="py-20 bg-gray-50 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black">On Sale</h2>
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
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black">On Sale</h2>
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
            to="/shop?sale=true" 
            className="inline-flex items-center justify-center bg-popmart-red text-white py-3 px-8 hover:bg-black transition-colors duration-300"
          >
            View All Sale Items <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OnSaleProducts;
