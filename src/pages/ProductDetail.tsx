import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, Star, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, fetchProductById, fetchProducts, supabase, Pack, fetchProductsByPack } from '../lib/supabase';
import ProductCard from '../components/Product/ProductCard';
import CustomBagIcon from '../components/UI/CustomBagIcon';
import { useShop } from '../context/ShopContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const packIdFromUrl = searchParams.get('packId');
  const [product, setProduct] = useState<Product | null>(null);
  const [packData, setPackData] = useState<Pack | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [packId, setPackId] = useState<string | null>(null);
  const [packProducts, setPackProducts] = useState<Product[]>([]);
  const [allPackImages, setAllPackImages] = useState<string[]>([]);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [packs, setPacks] = useState<Pack[]>([]);
  
  // Use our shop context
  const { addToCart, addToWishlist, isInWishlist } = useShop();

  // Auto-scroll images every second
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (product && (product.images.length > 1 || allPackImages.length > 1)) {
      intervalId = setInterval(() => {
        // If we're viewing pack images, use the pack images array
        if (allPackImages.length > 0) {
          setActiveImage(prev => (prev + 1) % allPackImages.length);
        } else {
          // Otherwise use the product images
          setActiveImage(prev => (prev + 1) % product.images.length);
        }
      }, 2000); // Change image every 2 seconds
    }
    
    // Clean up the interval when component unmounts
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [product, allPackImages]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // First, check if this product is part of any pack
        const { data: productPacksData } = await supabase
          .from('product_packs')
          .select('pack_id')
          .eq('product_id', id);
          
        if (productPacksData && productPacksData.length > 0) {
          // Get all packs this product belongs to
          const packIds = productPacksData.map(pp => pp.pack_id);
          
          // Fetch pack details
          const { data: packsData } = await supabase
            .from('pack')
            .select('*')
            .in('id', packIds);
            
          if (packsData && packsData.length > 0) {
            setPacks(packsData);
            
            // If a packId was provided in the URL, use that pack
            let selectedPackData;
            if (packIdFromUrl) {
              selectedPackData = packsData.find(pack => pack.id === packIdFromUrl) || packsData[0];
            } else {
              // Otherwise use the first pack as default
              selectedPackData = packsData[0];
            }
            
            setSelectedPack(selectedPackData);
            setPackId(selectedPackData.id);
            setPackData(selectedPackData); // Store pack data for display
            
            // Fetch all products in this pack
            const packProductsData = await fetchProductsByPack(selectedPackData.id);
            setPackProducts(packProductsData);
            
            // Fetch the product data for basic information
            const productData = await fetchProductById(id);
            setProduct(productData);
            
            // Use pack images if available, otherwise use product images
            if (selectedPackData.images && selectedPackData.images.length > 0) {
              setAllPackImages(selectedPackData.images);
            } else {
              // Collect all images from all products in the pack
              const allImages = packProductsData.flatMap(p => p.images || []);
              setAllPackImages(allImages);
            }
            
            // Fetch related products from the same category
            if (productData) {
              const related = await fetchProducts({
                category: productData.category,
                limit: 4
              });
              
              // Filter out the current product
              setRelatedProducts(related.filter(p => p.id !== id));
            }
          }
        } else {
          // If not part of a pack, just load the product normally
          const productData = await fetchProductById(id);
          setProduct(productData);
          
          if (productData) {
            // Fetch related products from the same category
            const related = await fetchProducts({
              category: productData.category,
              limit: 4
            });
            
            // Filter out the current product
            setRelatedProducts(related.filter(p => p.id !== id));
          }
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
    setPackId(null);
    setPackProducts([]);
    setAllPackImages([]);
    setSelectedPack(null);
  }, [id]);

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const nextImage = () => {
    if (!product) return;
    
    // If we're viewing pack images, use the pack images array
    if (allPackImages.length > 0) {
      setActiveImage(prev => (prev + 1) % allPackImages.length);
    } else {
      // Otherwise use the product images
      setActiveImage(prev => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (!product) return;
    
    // If we're viewing pack images, use the pack images array
    if (allPackImages.length > 0) {
      setActiveImage(prev => (prev - 1 + allPackImages.length) % allPackImages.length);
    } else {
      // Otherwise use the product images
      setActiveImage(prev => (prev - 1 + product.images.length) % product.images.length);
    }
  };
  
  // Handle pack selection
  const handlePackSelect = async (pack: Pack) => {
    setSelectedPack(pack);
    setPackId(pack.id);
    setActiveImage(0); // Reset to first image
    
    try {
      // Fetch all products in this pack
      const packProductsData = await fetchProductsByPack(pack.id);
      setPackProducts(packProductsData);
      
      // Collect all images from all products in the pack
      const allImages = packProductsData.flatMap(p => p.images || []);
      setAllPackImages(allImages);
    } catch (error) {
      console.error('Error loading pack products:', error);
    }
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
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Product Images with Vertical Thumbnails */}
            <div className="p-6 md:p-8 relative">
              <div className="flex">
                {/* Left Side - Vertical Thumbnails with scroll buttons */}
                <div className="hidden md:flex flex-col mr-4 relative" style={{ width: '140px' }}>
                  {/* Scroll up button */}
                  <button 
                    className="absolute top-0 left-0 right-0 z-10 bg-white/80 hover:bg-white text-gray-800 p-1 rounded-md shadow-sm transition-colors duration-300 flex justify-center items-center"
                    onClick={() => {
                      const container = document.getElementById('thumbnails-container');
                      if (container) container.scrollTop -= 100;
                    }}
                    aria-label="Scroll up"
                  >
                    <ChevronLeft className="rotate-90" size={16} />
                  </button>
                  
                  {/* Thumbnails container with scroll */}
                  <div 
                    id="thumbnails-container"
                    className="flex flex-col space-y-4 h-[450px] overflow-y-auto pr-2 pt-8 pb-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                  >
                    {/* Show pack images if a pack is selected and has images, otherwise show product images */}
                    {allPackImages.length > 0 ? (
                      allPackImages.map((img, index) => (
                        <button
                          key={`pack-${index}`}
                          onClick={() => setActiveImage(index)}
                          className={`w-[70px] h-[70px] border rounded-md overflow-hidden flex-shrink-0 transition-all duration-300 ${
                            activeImage === index
                              ? 'border-2 border-red-500 shadow-md'
                              : 'border-gray-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Pack image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))
                    ) : (
                      product.images.map((img, index) => (
                        <button
                          key={`product-${index}`}
                          onClick={() => setActiveImage(index)}
                          className={`w-[70px] h-[70px] border rounded-md overflow-hidden flex-shrink-0 transition-all duration-300 ${
                            activeImage === index
                              ? 'border-2 border-red-500 shadow-md'
                              : 'border-gray-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))
                    )}
                  </div>
                  
                  {/* Scroll down button */}
                  <button 
                    className="absolute bottom-0 left-0 right-0 z-10 bg-white/80 hover:bg-white text-gray-800 p-1 rounded-md shadow-sm transition-colors duration-300 flex justify-center items-center"
                    onClick={() => {
                      const container = document.getElementById('thumbnails-container');
                      if (container) container.scrollTop += 100;
                    }}
                    aria-label="Scroll down"
                  >
                    <ChevronLeft className="-rotate-90" size={16} />
                  </button>
                </div>

                {/* Main Image Container - Enlarged by 1cm */}
                <div className="flex-1">
                  <div className="relative overflow-hidden rounded-lg border border-gray-100 shadow-sm" style={{ height: 'calc(450px + 1cm)', width: 'calc(100% + 1cm)' }}>
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeImage}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 50, 
                          damping: 14,
                          mass: 1
                        }}
                        src={allPackImages.length > 0 ? allPackImages[activeImage] : product.images[activeImage]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>
                    
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
                  
                  {/* Mobile Thumbnails (Horizontal) with scroll indicators */}
                  <div className="flex md:hidden space-x-3 mt-4 overflow-x-auto pb-2 relative">
                    {/* Left scroll indicator */}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full shadow-sm z-10 p-1">
                      <ChevronLeft size={16} />
                    </div>
                    {allPackImages.length > 0 ? (
                      allPackImages.map((img, index) => (
                        <button
                          key={`pack-mobile-${index}`}
                          onClick={() => setActiveImage(index)}
                          className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 ${
                            activeImage === index
                              ? 'ring-2 ring-red-500'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Pack image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))
                    ) : (
                      product.images.map((img, index) => (
                        <button
                          key={`product-mobile-${index}`}
                          onClick={() => setActiveImage(index)}
                          className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 ${
                            activeImage === index
                              ? 'ring-2 ring-red-500'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
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

                {product.category && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Product Name - Use pack title if available */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {packData ? packData.title : product?.name}
              </h1>

              {/* Category */}
              <div className="text-gray-600 mb-4">
                <span>Category: {product?.category || 'Not specified'}</span>
              </div>

              {/* Price - Use pack price and original_price if available */}
              <div className="flex items-center mb-6">
                {packData?.original_price ? (
                  <span className="text-gray-400 line-through text-lg mr-2">
                    {packData.original_price} MAD
                  </span>
                ) : product?.original_price && (
                  <span className="text-gray-400 line-through text-lg mr-2">
                    {product.original_price} MAD
                  </span>
                )}
                <span className="text-2xl font-bold text-gray-900">
                  {packData ? packData.price : product?.price} MAD
                </span>
              </div>

              {/* Description - Use pack description if available */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">DESCRIPTION</h3>
                <div className="text-gray-600 space-y-3">
                  <p>{packData ? packData.description : (product?.description || 'No description available.')}</p>
                </div>
              </div>
              
              {/* Pack Selection removed */}


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
                    onClick={() => {
                      if (product) {
                        // If we have pack data, use its price instead of product price
                        const productWithPackPrice = packData ? {
                          ...product,
                          price: packData.price,
                          name: packData.title // Use pack title as product name
                        } : product;
                        addToCart(productWithPackPrice, quantity);
                      }
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors duration-300 ${
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
                    onClick={() => product && addToWishlist(product)}
                    className={`p-3 border rounded-lg transition-colors duration-300 ${
                      product && isInWishlist(product.id)
                        ? 'border-primary-600 text-primary-600 bg-primary-50'
                        : 'border-gray-300 text-gray-600 hover:text-primary-600 hover:border-primary-600'
                    }`}
                    aria-label="Add to wishlist"
                  >
                    <Heart size={20} fill={product && isInWishlist(product.id) ? 'currentColor' : 'none'} />
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
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        text: `Check out ${product.name} on Labubu Maroc`,
                        url: window.location.href,
                      })
                      .catch(error => console.log('Error sharing:', error));
                    } else {
                      // Fallback for browsers that don't support Web Share API
                      // Copy link to clipboard
                      navigator.clipboard.writeText(window.location.href)
                        .then(() => alert('Link copied to clipboard! You can now paste it in your favorite app.'))
                        .catch(err => console.error('Failed to copy link:', err));
                    }
                  }}
                  className="flex items-center gap-2 hover:text-primary-600 cursor-pointer"
                  aria-label="Share product"
                >
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
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