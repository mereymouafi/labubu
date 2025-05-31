import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Collection, fetchCollections } from '../../lib/supabase';

const FeaturedCollections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchCollections();
        setCollections(data);
      } catch (error) {
        console.error('Error loading collections:', error);
        // Fallback collections if Supabase fails
        setCollections([
          {
            id: '1',
            name: 'LABUBU',
            image: 'https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/hot-series/1cafd8e4c2f55b93a7e0bc1b7b56e0f.webp',
            description: 'The classic Labubu collection that started it all'
          },
          {
            id: '2',
            name: 'DIMOO',
            image: 'https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/hot-series/20e22b72a8dcc05c24ac4a25e2f3473.webp',
            description: 'Explore the magical world of Dimoo'
          },
          {
            id: '3',
            name: 'SKULLPANDA',
            image: 'https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/hot-series/2ffbf67c64bd94b3aafbe69abc4f0ce.webp',
            description: 'Discover the unique charm of SKULLPANDA'
          },
          {
            id: '4',
            name: 'MOLLY',
            image: 'https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/hot-series/bc66e84923b7fa8e4cc70a88bf97efd.webp',
            description: 'Meet the lovely and cheerful MOLLY'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadCollections();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  if (loading) {
    return (
      <div className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-black">Popular Series</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-popmart-lightgray animate-pulse h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="py-20 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-black">Popular Series</h2>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {collections.map((collection) => (
          <motion.div key={collection.id} variants={itemVariants}>
            <Link 
              to={`/collections/${collection.name.toLowerCase().replace(/\s+/g, '-')}`} 
              className="block group"
            >
              <div className="relative overflow-hidden">
                <div className="aspect-[3/4] bg-popmart-lightgray overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-black text-center">{collection.name}</h3>
                  {collection.description && (
                    <p className="text-gray-600 text-center mt-1">{collection.description}</p>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="text-center mt-12">
        <Link 
          to="/collections" 
          className="inline-flex items-center justify-center bg-black text-white py-3 px-8 hover:bg-popmart-red transition-colors duration-300"
        >
          View All Series <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedCollections;