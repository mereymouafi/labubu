import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Collection, fetchCollections } from '../lib/supabase';

const Collections: React.FC = () => {
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
            name: 'Original Labubu',
            image: 'https://images.pexels.com/photos/7680818/pexels-photo-7680818.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            description: 'The classic Labubu collection that started it all'
          },
          {
            id: '2',
            name: 'Special Edition',
            image: 'https://images.pexels.com/photos/6152391/pexels-photo-6152391.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            description: 'Limited edition Labubu figurines for collectors'
          },
          {
            id: '3',
            name: 'Mini Series',
            image: 'https://images.pexels.com/photos/6069552/pexels-photo-6069552.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            description: 'Smaller versions of your favorite characters'
          },
          {
            id: '4',
            name: 'Labubu Accessories',
            image: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            description: 'Keychains, phone cases, and more featuring your favorite Labubu characters'
          },
          {
            id: '5',
            name: 'Collaboration Series',
            image: 'https://images.pexels.com/photos/6740731/pexels-photo-6740731.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            description: 'Special collaborations with artists and designers'
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
        staggerChildren: 0.2
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
    <div>
      {/* Header */}
      <div className="bg-primary-900 py-32 px-4">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">Our Collections</h1>
          <p className="text-primary-100 text-center mt-4 max-w-2xl mx-auto">
            Explore our diverse range of Labubu collections, each with unique designs and characters
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="py-16 container-custom">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl bg-gray-200 animate-pulse h-80"></div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {collections.map((collection) => (
              <motion.div key={collection.id} variants={itemVariants} className="group">
                <Link
                  to={`/collections/${collection.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block h-full card overflow-hidden group-hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="relative h-80 image-hover-zoom">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"></div>
                    <div className="absolute bottom-0 left-0 p-8 text-white">
                      <h3 className="text-3xl font-bold mb-2">{collection.name}</h3>
                      {collection.description && (
                        <p className="text-white/90 text-lg">{collection.description}</p>
                      )}
                      <div className="mt-4 inline-flex items-center text-white/90 group-hover:text-white">
                        <span>View Collection</span>
                        <span className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Collections;