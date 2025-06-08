import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ShoppingCart } from 'lucide-react';
import { Product } from '../../lib/supabase';
import { useShop } from '../../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Use shop context
  const { addToCart, addToWishlist, isInWishlist } = useShop();
  const navigate = useNavigate();
  
  const {
    id,
    name,
    price,
    original_price,
    images,
    is_new,
    is_on_sale,
    stock_status
  } = product;

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

  return (
    <motion.div variants={itemVariants} className="group">
      <div className="h-full">
        <div className="relative overflow-hidden">
          {/* Product Image */}
          <Link to={`/product/${id}`} className="block">
            <div className="aspect-square bg-labubumaroc-lightgray overflow-hidden p-0">
              <div className="w-full h-full">
                <img
                  src={images[0]}
                  alt={name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  style={{ objectPosition: 'center' }}
                />
              </div>
            </div>

            {/* Product Status Badges */}
            <div className="absolute top-0 left-0">
              {is_new && (
                <span className="inline-block bg-labubumaroc-red text-white text-xs px-3 py-1">
                  NEW
                </span>
              )}
              {is_on_sale && (
                <span className="inline-block bg-black text-white text-xs px-3 py-1">
                  SALE
                </span>
              )}
              {stock_status === 'out-of-stock' && (
                <span className="inline-block bg-gray-700 text-white text-xs px-3 py-1">
                  SOLD OUT
                </span>
              )}
            </div>

            {/* Quick Action Buttons */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToWishlist(product);
              }}
              className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center transition-colors duration-300 ${isInWishlist(id) ? 'bg-primary-50 text-primary-600' : 'bg-white/80 text-gray-700 hover:text-labubumaroc-red'}`}
              aria-label="Add to wishlist"
            >
              <Heart size={16} fill={isInWishlist(id) ? 'currentColor' : 'none'} />
            </button>

            {/* Add to Cart Button - Only visible on hover */}
            <div className="absolute -bottom-20 left-0 right-0 group-hover:bottom-0 transition-all duration-300 flex flex-col">
              <button
                disabled={stock_status === 'out-of-stock'}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (stock_status !== 'out-of-stock') {
                    addToCart(product, 1);
                  }
                }}
                className={`w-full py-2 flex items-center justify-center gap-2 transition-colors duration-300 ${
                  stock_status === 'out-of-stock'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-labubumaroc-red'
                }`}
              >
                <ShoppingBag size={16} />
                <span className="text-sm">ADD TO CART</span>
              </button>
              
              <button
                disabled={stock_status === 'out-of-stock'}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (stock_status !== 'out-of-stock') {
                    addToCart(product, 1);
                    navigate('/cart');
                  }
                }}
                className={`w-full py-2 flex items-center justify-center gap-2 transition-colors duration-300 mt-1 ${
                  stock_status === 'out-of-stock'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-labubumaroc-red text-white hover:bg-black'
                }`}
              >
                <ShoppingCart size={16} />
                <span className="text-sm">SHOP NOW</span>
              </button>
            </div>
          </Link>
        </div>

        {/* Product Info */}
        <div className="pt-4 pb-2 text-center">
          <Link to={`/product/${id}`} className="block">
            <h3 className="text-sm text-gray-600 hover:text-labubumaroc-red transition-colors duration-300 mb-1">
              {product.collection || 'LABUBU MAROC'}
            </h3>
            <h4 className="font-medium text-black line-clamp-2 hover:text-labubumaroc-red transition-colors duration-300">
              {name}
            </h4>
          </Link>
          <div className="mt-2 flex items-center justify-center">
            {original_price && (
              <span className="text-gray-400 line-through mr-2">
                {original_price.toFixed(2)} MAD
              </span>
            )}
            <span className="font-medium text-labubumaroc-red">
              {price.toFixed(2)} MAD
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;