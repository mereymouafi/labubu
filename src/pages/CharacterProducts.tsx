import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product, fetchProductsByCharacter, fetchCharacters, Character } from '../lib/supabase';

// Fonction utilitaire pour formater les URLs d'images Supabase
const formatImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return '';
  
  // Si l'URL est déjà complète, la retourner telle quelle
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Format attendu pour le stockage Supabase
  const supabaseProjectUrl = import.meta.env.VITE_SUPABASE_URL;
  return `https://${supabaseProjectUrl}/storage/v1/object/public/${imageUrl}`;
};

// Price formatter
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2
  }).format(price);
};

const CharacterProducts: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Load character details
      const characters = await fetchCharacters();
      const currentCharacter = characters.find(c => c.slug === slug);
      if (currentCharacter) {
        setCharacter(currentCharacter);
      }
      
      // Load products for this character
      if (slug) {
        const data = await fetchProductsByCharacter(slug);
        setProducts(data);
      }
      
      setLoading(false);
    };
    
    loadData();
  }, [slug]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 mt-20"
    >
      {character ? (
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center">{character.name}</h1>
          {character.description && (
            <p className="text-gray-600 mt-4 text-center max-w-2xl mx-auto">{character.description}</p>
          )}
        </div>
      ) : (
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Character Products</h1>
      )}
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No products found for this character.</p>
              <Link to="/characters" className="mt-4 inline-block text-labubumaroc-red hover:underline">
                View all characters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link 
                  key={product.id} 
                  to={`/product/${product.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={formatImageUrl(product.images[0])} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://via.placeholder.com/300?text=' + encodeURIComponent(product.name);
                        }}
                      />
                      {product.is_new && (
                        <div className="absolute top-2 left-2 bg-labubumaroc-red text-white text-xs px-2 py-1 rounded">
                          NEW
                        </div>
                      )}
                      {product.is_on_sale && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          SALE
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-gray-800 font-medium text-sm md:text-base mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          {product.is_on_sale && product.original_price ? (
                            <div className="flex items-center">
                              <span className="text-labubumaroc-red font-semibold">{formatPrice(product.price)}</span>
                              <span className="text-gray-400 line-through text-xs ml-2">{formatPrice(product.original_price)}</span>
                            </div>
                          ) : (
                            <span className="font-semibold">{formatPrice(product.price)}</span>
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-500 capitalize">
                          {product.stock_status}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default CharacterProducts;
