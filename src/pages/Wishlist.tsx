import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
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
      <h1 className="text-2xl font-bold mb-8">MY WISHLIST</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-6">Your wishlist is empty</p>
          <Link to="/shop" className="btn-primary inline-flex items-center">
            <ArrowLeft size={18} className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex items-center">
                  <div className="w-24 h-24 mr-4">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <div className="flex-1">
                    <Link 
                      to={`/product/${product.id}`}
                      className="font-medium hover:text-popmart-red transition-colors duration-300"
                    >
                      {product.name}
                    </Link>
                    {product.collection && (
                      <p className="text-sm text-gray-500">{product.collection}</p>
                    )}
                    <p className="font-medium text-primary-600 mt-1">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="flex mt-4 space-x-2">
                  <button
                    onClick={() => addToCart(product, 1)}
                    disabled={product.stock_status === 'out-of-stock'}
                    className={`flex-1 py-2 px-3 rounded flex items-center justify-center space-x-2 transition-colors ${
                      product.stock_status === 'out-of-stock'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-popmart-red'
                    }`}
                  >
                    <ShoppingBag size={16} />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="p-2 text-gray-500 hover:text-red-500 border border-gray-300 rounded transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
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
