import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, ChevronLeft, Loader2, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { supabase, TShirtOption, fetchTShirtOptions } from '../lib/supabase';

// Interface representing the tshirt_details table structure in the database
interface TShirtDetail {
  id: string;
  option_name: string;
  size: string[];
  color: string[];
  style: string[];
  price_original: number;
  price: number;
  created_at: string;
}

// Combined interface for the product details with its associated option
interface TShirtProduct {
  detail: TShirtDetail;
  option: {
    id: string;
    option_name: string;
    option_description: string;
    image_urls: string[];
    created_at: string;
  };
}

const TShirtProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State variables
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tshirtProduct, setTshirtProduct] = useState<TShirtProduct | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [tshirtOptions, setTshirtOptions] = useState<TShirtOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(true);
  
  // Auto image scroll references
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);

  const { addToCart, addToWishlist, isInWishlist } = useShop();
  
  // Auto-scrolling effect for product images
  useEffect(() => {
    if (!tshirtProduct) return;
    
    // Clear any existing interval
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
    
    // Set up auto scroll if we have multiple images
    const imageUrls = tshirtProduct.option.image_urls;
    if (imageUrls && imageUrls.length > 1 && autoScrollEnabled) {
      autoScrollRef.current = setInterval(() => {
        setSelectedImage(prev => (prev + 1) % imageUrls.length);
      }, 2000); // Change image every 2 seconds
    }
    
    // Clean up interval on unmount
    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [tshirtProduct, autoScrollEnabled]);

  // Fetch tshirt data from Supabase
  useEffect(() => {
    const fetchTshirtProduct = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          setError('No product ID provided');
          return;
        }
        
        // First, fetch the tshirt details
        const { data: detailData, error: detailError } = await supabase
          .from('tshirt_details')
          .select('*')
          .eq('id', id)
          .single();
        
        if (detailError) {
          console.error('Error fetching tshirt details:', detailError);
          setError('Failed to load product details');
          return;
        }
        
        if (!detailData) {
          setError('Product not found');
          return;
        }
        
        // Then, fetch the associated option using the option_name
        const { data: optionData, error: optionError } = await supabase
          .from('tshirt_options')
          .select('*')
          .eq('option_name', detailData.option_name)
          .single();
        
        if (optionError) {
          console.error('Error fetching tshirt options:', optionError);
          setError('Failed to load product options');
          return;
        }
        
        // Combine the detail and option data
        const product: TShirtProduct = {
          detail: detailData as TShirtDetail,
          option: optionData
        };
        
        setTshirtProduct(product);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    // Set initial selections when product data is loaded
    useEffect(() => {
      // Initialize selected option from first available values
      if (tshirtProduct) {
        if (tshirtProduct.detail.color && tshirtProduct.detail.color.length > 0) {
          setSelectedColor(tshirtProduct.detail.color[0]);
        }
        if (tshirtProduct.detail.size && tshirtProduct.detail.size.length > 0) {
          setSelectedSize(tshirtProduct.detail.size[0]);
        }
        if (tshirtProduct.detail.style && tshirtProduct.detail.style.length > 0) {
          setSelectedStyle(tshirtProduct.detail.style[0]);
        }
      }
    }, [tshirtProduct]);

    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        const options = await fetchTShirtOptions();
        setTshirtOptions(options);
      } catch (err) {
        console.error('Error fetching t-shirt options:', err);
      } finally {
        setLoadingOptions(false);
      }
    };
    
    fetchTshirtProduct();
    fetchOptions();
  }, [id]);

  // If loading or error, show appropriate feedback
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !tshirtProduct) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700">{error || 'Product not found'}</p>
        <button 
          onClick={() => navigate('/t-shirts')}
          className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Back to T-Shirts
        </button>
      </div>
    );
  }

  // Create a product object with the selected options
  const createProductWithOptions = () => {
    if (!tshirtProduct) return null;
    
    const productId = `tshirt-${tshirtProduct.detail.id}-${selectedColor}-${selectedSize}`.toLowerCase().replace(/\s+/g, '-');
    const styleSuffix = selectedStyle ? `, Style: ${selectedStyle}` : '';
    
    return {
      id: productId,
      name: `${tshirtProduct.option.option_name} - ${selectedColor}, ${selectedSize}${styleSuffix}`,
      price: tshirtProduct.detail.price,
      images: tshirtProduct.option.image_urls,
      category: 'T-shirts',
      collection: tshirtProduct.option.option_name,
      stock_status: 'In Stock', // Using default since we don't have this field in the new schema
      description: `${tshirtProduct.option.option_description} Color: ${selectedColor}, Size: ${selectedSize}${styleSuffix}`,
      color: selectedColor,
      size: selectedSize,
      style: selectedStyle || undefined
    };
  };
  
  const handleAddToCart = () => {
    const product = createProductWithOptions();
    if (product) {
      // Add the item to the cart with the selected quantity
      addToCart(product, quantity);
      
      // Show a confirmation message
      const styleSuffix = selectedStyle ? `, Style: ${selectedStyle}` : '';
      alert(`Added to cart: ${tshirtProduct.option.option_name} - Color: ${selectedColor}, Size: ${selectedSize}${styleSuffix}, Quantity: ${quantity}`);
    }
  };
  
  const handleAddToWishlist = () => {
    const product = createProductWithOptions();
    if (product) {
      // Add the item to the wishlist
      addToWishlist(product);
      
      // Show a confirmation message
      const styleSuffix = selectedStyle ? `, Style: ${selectedStyle}` : '';
      alert(`Added to wishlist: ${tshirtProduct.option.option_name} - Color: ${selectedColor}, Size: ${selectedSize}${styleSuffix}`);
    }
  };
  
  if (!tshirtProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">T-shirt not found</h2>
          <button 
            onClick={() => navigate('/t-shirts')}
            className="bg-primary-500 text-white px-6 py-2 rounded-md"
          >
            Back to T-shirt Options
          </button>
        </div>
      </div>
    );
  }
  
  if (loadingOptions) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
        <span className="ml-3 text-lg font-medium">Loading T-shirt options...</span>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 py-12"
    >
      <div className="container mx-auto px-4 py-10">
        {/* Top navigation */}
        <div className="mb-8">
          <Link to="/t-shirts" className="flex items-center text-primary-600 hover:text-primary-800 transition-colors">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Back to T-shirts</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <motion.div 
              className="bg-gray-100 rounded-xl overflow-hidden aspect-square mb-4 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onMouseEnter={() => setAutoScrollEnabled(false)}
              onMouseLeave={() => setAutoScrollEnabled(true)}
            >
              {/* Display main image from the option's image_urls array */}
              <AnimatePresence mode="wait">
                <motion.img 
                  key={`image-${selectedImage}`}
                  src={tshirtProduct.option.image_urls[selectedImage] || ''} 
                  alt={`${tshirtProduct.option.option_name} in ${selectedColor}`} 
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              
              {/* Navigation controls only if there are multiple images */}
              {tshirtProduct.option.image_urls.length > 1 && (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(prev => (prev - 1 + tshirtProduct.option.image_urls.length) % tshirtProduct.option.image_urls.length);
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 rounded-full p-2 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(prev => (prev + 1) % tshirtProduct.option.image_urls.length);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 rounded-full p-2 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              )}
              
              {/* Dots indicator for multiple images */}
              {tshirtProduct.option.image_urls.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
                  {tshirtProduct.option.image_urls.map((_, index) => (
                    <button
                      key={`dot-${index}`}
                      onClick={() => setSelectedImage(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${selectedImage === index ? 'bg-white scale-110' : 'bg-white opacity-50'}`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
            
            <div className="grid grid-cols-5 gap-2">
              {/* Show thumbnail images from the option's image_urls array */}
              {tshirtProduct.option.image_urls.slice(0, 5).map((imgUrl, index) => (
                <div 
                  key={index}
                  className={`bg-gray-100 rounded-lg overflow-hidden aspect-square cursor-pointer transition-opacity ${selectedImage === index ? 'ring-2 ring-primary-600' : 'hover:opacity-80'}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={imgUrl} alt={tshirtProduct.option.option_name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
        </div>
        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold">{tshirtProduct.option.option_name}</h1>
          
          <div className="flex items-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600">${tshirtProduct.detail.price.toFixed(2)}</div>
            {tshirtProduct.detail.price_original && (
              <div className="ml-3 text-lg text-gray-500 line-through">${tshirtProduct.detail.price_original.toFixed(2)}</div>
            )}
            
            {tshirtProduct.detail.price < tshirtProduct.detail.price_original && (
              <div className="ml-3 px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-md">
                Sale
              </div>
            )}
          </div>
          
          <p className="text-gray-600 text-lg">{tshirtProduct.option.option_description}</p>
          
          {/* Color selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Color: <span className="font-bold text-primary-600">{selectedColor}</span></h3>
            <div className="flex flex-wrap gap-4">
              {tshirtProduct.detail.color.map(color => (
                <div 
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`cursor-pointer text-center`}
                >
                  <div 
                    className={`w-16 h-16 rounded-full mx-auto mb-2 border-2 ${selectedColor === color ? 'border-primary-600 border-4' : 'border-gray-300'}`}
                    style={{ 
                      backgroundColor: 
                        color.toLowerCase() === 'white' ? '#ffffff' : 
                        color.toLowerCase() === 'black' ? '#000000' :
                        color.toLowerCase() === 'gray' ? '#808080' :
                        color.toLowerCase() === 'red' ? '#ff0000' :
                        color.toLowerCase() === 'blue' ? '#0000ff' :
                        color.toLowerCase() === 'green' ? '#008000' :
                        color.toLowerCase() === 'pink' ? '#FFC0CB' :
                        color.toLowerCase() === 'navy' ? '#000080' :
                        color.toLowerCase() === 'olive' ? '#808000' :
                        color.toLowerCase() === 'rust' ? '#B7410E' :
                        color.toLowerCase() === 'burgundy' ? '#800020' :
                        color.toLowerCase() === 'light blue' ? '#ADD8E6' :
                        color.toLowerCase() === 'beige' ? '#F5F5DC' : '#cccccc'
                    }}
                  ></div>
                  <div className={`font-medium ${selectedColor === color ? 'text-primary-600 font-bold' : ''}`}>
                    {color}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Size selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Size: <span className="font-bold text-primary-600">{selectedSize}</span></h3>
            <div className="flex flex-wrap gap-4">
              {tshirtProduct.detail.size.map(size => (
                <div 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`cursor-pointer w-16 h-16 flex items-center justify-center ${selectedSize === size ? 
                    'bg-primary-500 text-white font-bold border-2 border-primary-600 shadow-lg' : 
                    'bg-white text-gray-800 border-2 border-gray-300'} rounded-lg`}
                >
                  <span className="text-xl">{size}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Style selection if styles are available */}
          {tshirtProduct.detail.style && tshirtProduct.detail.style.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Style: <span className="font-bold text-primary-600">{selectedStyle}</span></h3>
              <div className="flex flex-wrap gap-4">
                {tshirtProduct.detail.style.map(style => (
                  <div 
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`cursor-pointer px-4 py-2 ${selectedStyle === style ? 
                      'bg-primary-500 text-white font-bold shadow-lg' : 
                      'bg-white text-gray-800 border border-gray-300'} rounded-lg`}
                  >
                    <span>{style}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Quantity: <span className="text-primary-600 font-bold">{quantity}</span></h3>
            
            <div className="flex items-center gap-4">
              <div 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="cursor-pointer w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center shadow-md"
              >
                <span className="text-3xl font-bold text-gray-700">−</span>
              </div>
              
              <div className="w-14 h-14 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-white">
                <span className="text-2xl font-bold">{quantity}</span>
              </div>
              
              <div 
                onClick={() => setQuantity(prev => prev + 1)}
                className="cursor-pointer w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center shadow-md"
              >
                <span className="text-3xl font-bold text-gray-700">+</span>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-md flex items-center justify-center font-medium"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </button>
            <button 
              onClick={handleAddToWishlist}
              className="flex-1 border-2 border-primary-500 text-primary-500 hover:bg-primary-50 py-3 px-6 rounded-md flex items-center justify-center font-medium"
            >
              <Heart className={`w-5 h-5 mr-2`} />
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
    </motion.div>
  );
};

export default TShirtProductDetail;
