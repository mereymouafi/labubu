import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product, Collection, fetchCollections, fetchProductsByCollection } from '../lib/supabase';
import ProductCard from '../components/Product/ProductCard';

const CollectionDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCollectionData = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        // Convert slug back to collection name
        const collectionName = slug.replace(/-/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        // Get all collections to find the matching one
        const collections = await fetchCollections();
        const foundCollection = collections.find(c => 
          c.name.toLowerCase() === collectionName.toLowerCase()
        );
        
        if (foundCollection) {
          setCollection(foundCollection);
          
          // Fetch products for this collection
          const collectionProducts = await fetchProductsByCollection(foundCollection.name);
          setProducts(collectionProducts);
        }
      } catch (error) {
        console.error('Error loading collection data:', error);
        // Add fallback data if needed
      } finally {
        setLoading(false);
      }
    };

    loadCollectionData();
  }, [slug]);

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
      <div>
        <div className="bg-gray-200 animate-pulse h-64 w-full"></div>
        <div className="container-custom py-12">
          <div className="h-8 w-64 bg-gray-200 animate-pulse mb-8 mx-auto"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="rounded-xl bg-gray-200 animate-pulse h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="container-custom py-32 text-center">
        <h1 className="text-3xl font-bold mb-4">Collection Not Found</h1>
        <p>The collection you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Collection Header */}
      <div 
        className="relative py-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${collection.image})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{collection.name}</h1>
          {collection.description && (
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {collection.description}
            </p>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="container-custom py-16">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium mb-4">No Products Available</h2>
            <p className="text-gray-600">
              This collection doesn't have any products yet. Check back soon for updates!
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{collection.name} Products</h2>
              <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;