import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, fetchProducts } from '../../lib/supabase';
import ProductCard from '../Product/ProductCard';

const TrendingProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Number of items to show at once based on screen size
  const itemsPerPage = {
    sm: 1,
    md: 2,
    lg: 4
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Fetch products that have is_trending flag set to true
        const data = await fetchProducts({ trending: true, limit: 12 });
        setProducts(data);
      } catch (error) {
        console.error('Error loading trending products:', error);
        // Fallback products if Supabase fails
        setProducts([
          {
            id: '5',
            name: 'LABUBU Winter Edition',
            price: 14.99,
            images: ['https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/trending/d28e0e5fef8293dfc70018ecf81e1b7.webp'],
            category: 'Blind Box',
            collection: 'LABUBU',
            stock_status: 'in-stock',
            is_featured: true,
            is_new: true
          },
          {
            id: '6',
            name: 'SPACE MOLLY Constellation Series',
            price: 14.99,
            images: ['https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/trending/7e4b9b38b3d1f8d7b1c9f0da75992a3.webp'],
            category: 'Blind Box',
            collection: 'MOLLY',
            stock_status: 'in-stock',
            is_featured: true
          },
          {
            id: '7',
            name: 'DIMOO Fairytale Series',
            price: 14.99,
            images: ['https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/trending/1ecbf8f7c4cc6ec1e40cf9cd26cc5cd.webp'],
            category: 'Blind Box',
            collection: 'DIMOO',
            stock_status: 'in-stock',
            is_featured: true
          },
          {
            id: '8',
            name: 'SKULLPANDA Hypnotic Series',
            price: 14.99,
            images: ['https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/trending/9b9e13a08f5647f5f0b49264d14c639.webp'],
            category: 'Blind Box',
            collection: 'SKULLPANDA',
            stock_status: 'in-stock',
            is_featured: true
          },
          {
            id: '9',
            name: 'CRYBABY Tokyo Series',
            price: 14.99,
            images: ['https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/trending/48c27c26b1ba29e02abe5af9be86d0d.webp'],
            category: 'Blind Box',
            collection: 'CRYBABY',
            stock_status: 'in-stock',
            is_featured: true
          },
          {
            id: '10',
            name: 'BUNNY Starry Night Series',
            price: 14.99,
            images: ['https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/trending/8f1c1c82642fe74d99fe3e90c6f1883.webp'],
            category: 'Blind Box',
            collection: 'BUNNY',
            stock_status: 'in-stock',
            is_featured: true
          },
          {
            id: '11',
            name: 'HIRONO Dreamland Series',
            price: 14.99,
            images: ['https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/trending/8d1fb87e7a61ba4b2c63d9f8b1b85ec.webp'],
            category: 'Blind Box',
            collection: 'HIRONO',
            stock_status: 'in-stock',
            is_featured: true
          },
          {
            id: '12',
            name: 'PUCKY Pool Babies Series',
            price: 14.99,
            images: ['https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/trending/abec7f8518e6abf83fb2e61a41e3232.webp'],
            category: 'Blind Box',
            collection: 'PUCKY',
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

  const next = () => {
    if (currentIndex < products.length - itemsPerPage.lg) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Loop back to start
      setCurrentIndex(0);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Loop to end
      setCurrentIndex(products.length - itemsPerPage.lg);
    }
  };

  // Calculate visible products based on current index
  const visibleProducts = products.slice(
    currentIndex,
    currentIndex + itemsPerPage.lg
  );

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
          <h2 className="text-3xl font-bold text-black">Trending Now</h2>
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
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-black">Trending Now</h2>
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="p-2 bg-white border border-gray-200 hover:bg-black hover:text-white transition-colors duration-300"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="p-2 bg-white border border-gray-200 hover:bg-black hover:text-white transition-colors duration-300"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          key={currentIndex}
        >
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingProducts;
