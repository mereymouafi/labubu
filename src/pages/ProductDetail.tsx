import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, Star, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, fetchProductById, fetchProducts } from '../lib/supabase';
import ProductCard from '../components/Product/ProductCard';
import CustomBagIcon from '../components/UI/CustomBagIcon';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const productData = await fetchProductById(id);
        setProduct(productData);

        if (productData) {
          // Fetch related products from the same collection
          const related = await fetchProducts({
            collection: productData.collection,
            limit: 4
          });
          
          // Filter out the current product
          setRelatedProducts(related.filter(p => p.id !== id));
        }
      } catch (error) {
        console.error('Error loading product:', error);
        // Add fallback data if needed
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
    // Reset state when id changes
    setActiveImage(0);
    setQuantity(1);
  }, [id]);

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const nextImage = () => {
    if (!product) return;
    setActiveImage(prev => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product) return;
    setActiveImage(prev => (prev - 1 + product.images.length) % product.images.length);
  };

  if (loading) {
    return (
      <div className="container-custom py-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 bg-gray-200 animate-pulse h-96 rounded-xl"></div>
          <div className="md:w-1/2">
            <div className="h-8 w-3/4 bg-gray-200 animate-pulse mb-4"></div>
            <div className="h-6 w-1/4 bg-gray-200 animate-pulse mb-6"></div>
            <div className="h-4 w-full bg-gray-200 animate-pulse mb-2"></div>
            <div className="h-4 w-full bg-gray-200 animate-pulse mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-200 animate-pulse mb-8"></div>
            <div className="h-12 w-full bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-32 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex text-sm text-gray-500">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-primary-600">Shop</Link>
            <span className="mx-2">/</span>
            <Link to={`/collections/${product.collection.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary-600">
              {product.collection}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Product Images */}
            <div className="p-6 md:p-8">
              <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors duration-300"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors duration-300"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 mt-4">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-16 h-16 rounded-md overflow-hidden ${
                        activeImage === index
                          ? 'ring-2 ring-primary-500'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-100">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.is_new && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                    New
                  </span>
                )}
                {product.is_on_sale && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-accent-100 text-accent-800">
                    Sale
                  </span>
                )}
                {product.stock_status === 'low-stock' && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                    Low Stock
                  </span>
                )}
                {product.stock_status === 'out-of-stock' && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              {/* Category & Collection */}
              <div className="text-gray-500 mb-4">
                <span>Category: {product.category}</span>
                <span className="mx-2">|</span>
                <span>Collection: {product.collection}</span>
              </div>

              {/* Price */}
              <div className="flex items-center mb-6">
                {product.original_price && (
                  <span className="text-gray-400 line-through text-lg mr-2">
                    ${product.original_price}
                  </span>
                )}
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-8">
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-gray-800 w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    disabled={product.stock_status === 'out-of-stock'}
                    className={`flex-1 btn-primary flex items-center justify-center gap-2 ${
                      product.stock_status === 'out-of-stock'
                        ? 'opacity-60 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    <CustomBagIcon size={18} />
                    {product.stock_status === 'out-of-stock'
                      ? 'Out of Stock'
                      : 'Add to Cart'}
                  </button>
                  <button
                    className="p-3 border border-gray-300 rounded-lg text-gray-600 hover:text-primary-600 hover:border-primary-600 transition-colors duration-300"
                    aria-label="Add to wishlist"
                  >
                    <Heart size={20} />
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Fast Shipping</h4>
                    <p className="text-sm text-gray-500">2-3 business days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">100% Authentic</h4>
                    <p className="text-sm text-gray-500">Genuine product</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <RotateCcw size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Easy Returns</h4>
                    <p className="text-sm text-gray-500">30 day return policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <Star size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Collector Quality</h4>
                    <p className="text-sm text-gray-500">Premium quality</p>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center gap-3 text-gray-500">
                <Share2 size={18} />
                <span>Share:</span>
                <a href="#" className="hover:text-primary-600">
                  Facebook
                </a>
                <a href="#" className="hover:text-primary-600">
                  Twitter
                </a>
                <a href="#" className="hover:text-primary-600">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">You May Also Like</h2>
              <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;