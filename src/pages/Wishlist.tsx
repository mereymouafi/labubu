import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const Wishlist: React.FC = () => {
  const { wishlistItems, removeFromWishlist, addToCart } = useShop();

  // Page transition animation
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
      <h1 className="text-3xl font-bold mb-8 text-center">MY WISHLIST</h1>
      
      <div className="flex justify-end mb-4">
        <p className="text-sm">{wishlistItems.length} items</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-6">Your wishlist is empty</p>
          <Link to="/" className="btn-primary inline-flex items-center">
            <ArrowLeft size={18} className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {wishlistItems.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center">
                <div className="w-24 h-24 mr-4 flex-shrink-0">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-contain" 
                  />
                </div>
                <div className="flex-grow mt-4 sm:mt-0">
                  <div className="flex flex-col sm:flex-row justify-between w-full">
                    <div>
                      <span className="font-medium text-lg">
                        {product.name}
                      </span>
                      {product.collection && (
                        <p className="text-sm text-gray-500 mt-1">Style: {product.collection}</p>
                      )}
                    </div>
                    <div className="mt-2 sm:mt-0 text-right">
                      <p className="font-bold text-xl">
                        {/* Display pack price if available, otherwise use regular price */}
                        {product.packPrice ? (
                          <>
                            {product.packPrice.toFixed(2)} MAD
                            {product.packOriginalPrice && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                {product.packOriginalPrice.toFixed(2)} MAD
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            {product.price.toFixed(2)} MAD
                            {product.original_price && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                {product.original_price.toFixed(2)} MAD
                              </span>
                            )}
                          </>
                        )}
                      </p>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="text-sm text-gray-500 hover:text-red-500 mt-2 transition-colors inline-block"
                        aria-label="Remove from wishlist"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      onClick={() => addToCart(product, 1)}
                      disabled={product.stock_status === 'out-of-stock'}
                      className={`py-2 px-3 rounded flex items-center justify-center space-x-2 transition-colors text-sm w-full sm:w-auto ${
                        product.stock_status === 'out-of-stock'
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-labubumaroc-red'
                      }`}
                    >
                      <ShoppingBag size={16} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Wishlist;
