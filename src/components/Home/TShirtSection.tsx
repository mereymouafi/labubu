import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchTShirtOptions, TShirtOption } from '../../lib/supabase';
import TShirtCategoryCard from '../Product/TShirtCategoryCard';

// Format Supabase image URL properly
const formatImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return '';
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  const supabaseProjectUrl = import.meta.env.VITE_SUPABASE_URL;
  return `https://${supabaseProjectUrl}/storage/v1/object/public/${imageUrl}`;
};

const TShirtSection: React.FC = () => {
  const [tshirtOptions, setTshirtOptions] = useState<TShirtOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Animation variants
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

  useEffect(() => {
    const loadTShirtOptions = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTShirtOptions();
        setTshirtOptions(data);
      } catch (error) {
        console.error('Error loading T-shirt options:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTShirtOptions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-lg text-gray-500">Loading T-shirts...</p>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-3">T-SHIRTS COLLECTION</h2>
            <p className="text-gray-600 max-w-2xl">
              Explore our unique Labubu T-shirt designs and styles
            </p>
          </div>
          <Link 
            to="/t-shirts" 
            className="mt-4 md:mt-0 px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-300 flex items-center group"
          >
            More 
            <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {tshirtOptions.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No T-shirt options found.</p>
          ) : (
            tshirtOptions.map((option) => (
              <motion.div key={option.id} variants={itemVariants} className="transform transition-all duration-300 hover:-translate-y-2">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <TShirtCategoryCard
                    id={option.id}
                    name={option.option_name}
                    description={option.option_description}
                    imageUrl={option.image_urls && option.image_urls.length > 0 ? formatImageUrl(option.image_urls[0]) : undefined}
                    bgColor={option.bgColor}
                  />
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TShirtSection;
