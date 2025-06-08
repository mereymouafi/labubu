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
    <div className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-600">FIGURINES COLLECTION</h2>
          <Link to="/figurings" className="text-sm text-gray-600 hover:text-gray-900">
            More &gt;
          </Link>
        </div>
        
        <p className="text-gray-600 mb-8">
          Browse our collection of Labubu figurines and collectibles
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {products.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">No figurines found.</p>
            ) : (
              products.map(product => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
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
