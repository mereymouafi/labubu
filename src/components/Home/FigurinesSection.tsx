import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, supabase } from '../../lib/supabase';
import ProductCard from '../Product/ProductCard';
import { motion } from 'framer-motion';

const FigurinesSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFigurines = async () => {
      setIsLoading(true);
      try {
        // Get the category ID for "Figurines"
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('name', 'Figurines')
          .single();
        
        if (categoryData?.id) {
          // Fetch products with that category_id, limit to 4 for the homepage
          const { data: productsData, error } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', categoryData.id)
            .limit(4);
          
          if (!error && productsData) {
            setProducts(productsData);
          } else if (error) {
            console.error('Error fetching figurine products:', error);
          }
        } else {
          console.error('Figurines category not found');
        }
      } catch (error) {
        console.error('Error loading figurine products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFigurines();
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-3">FIGURINES COLLECTION</h2>
            <p className="text-gray-600 max-w-2xl">
              Browse our collection of Labubu figurines and collectibles
            </p>
          </div>
          <Link 
            to="/figurings" 
            className="mt-4 md:mt-0 px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-300 flex items-center group"
          >
            More 
            <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {products.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">No figurines found.</p>
            ) : (
              products.map(product => (
                <motion.div key={product.id} variants={itemVariants} className="transform transition-all duration-300 hover:-translate-y-2">
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <ProductCard product={product} />
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FigurinesSection;
