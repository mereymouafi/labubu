import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, Star, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchTShirtDetail, fetchTShirtOptions, TShirtOption, TShirtDetail } from '../lib/supabase';

const TShirtDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tshirt, setTshirt] = useState<TShirtDetail | null>(null);
  const [tshirtOption, setTshirtOption] = useState<TShirtOption | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const loadTShirtDetail = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const detail = await fetchTShirtDetail(id);
        if (detail) {
          setTshirt(detail);
        }
        
        // Fetch the option details separately
        const options = await fetchTShirtOptions();
        const option = options.find((opt: TShirtOption) => opt.id === id);
        setTshirtOption(option || null);
      } catch (err) {
        console.error('Error loading T-shirt details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadTShirtDetail();
    // Reset state when id changes
    setCurrentImageIndex(0);
    setQuantity(1);
    
    // Clean up any existing interval
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  }, [id]);
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };
  
  const nextImage = () => {
    if (!tshirtOption?.image_urls || tshirtOption.image_urls.length <= 1) return;
    setCurrentImageIndex(prev => (prev + 1) % tshirtOption.image_urls.length);
  };
  
  const prevImage = () => {
    if (!tshirtOption?.image_urls || tshirtOption.image_urls.length <= 1) return;
    setCurrentImageIndex(prev => (prev - 1 + tshirtOption.image_urls.length) % tshirtOption.image_urls.length);
  };
  
  // Set up auto-scrolling effect
  useEffect(() => {
    // Only set up auto-scroll if we have multiple images
    if (tshirtOption?.image_urls && tshirtOption.image_urls.length > 1) {
      // Start the auto-scroll interval
      autoScrollIntervalRef.current = setInterval(() => {
        nextImage();
      }, 3000); // Scroll every 3 seconds
    }
    
    // Clean up the interval when component unmounts
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, [tshirtOption]);
  
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
  
  if (!tshirt || !tshirtOption) {
    return (
      <div className="container-custom py-32 text-center">
        <h1 className="text-3xl font-bold mb-4">T-Shirt Not Found</h1>
        <p className="mb-8">The T-shirt you're looking for doesn't exist or has been removed.</p>
        <Link to="/tshirts" className="btn-primary">
          Browse T-Shirts
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
            <Link to="/tshirts" className="hover:text-primary-600">T-Shirts</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{tshirt.option_name}</span>
          </nav>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-16">
          <div className="flex flex-col md:flex-row">
            {/* Product Images */}
            <div className="md:w-1/2">
              {/* Main Image */}
              <div className="relative aspect-square">
                {tshirtOption.image_urls && tshirtOption.image_urls.length > 0 ? (
                  <>
                    <img 
                      src={tshirtOption.image_urls[currentImageIndex]}
                      alt={tshirt.option_name}
                      className="w-full h-full object-cover"
                      onMouseEnter={() => {
                        // Pause auto-scroll on hover
                        if (autoScrollIntervalRef.current) {
                          clearInterval(autoScrollIntervalRef.current);
                          autoScrollIntervalRef.current = null;
                        }
                      }}
                      onMouseLeave={() => {
                        // Resume auto-scroll when mouse leaves
                        if (!autoScrollIntervalRef.current && tshirtOption?.image_urls && tshirtOption.image_urls.length > 1) {
                          autoScrollIntervalRef.current = setInterval(() => {
                            nextImage();
                          }, 3000);
                        }
                      }}
                    />
                    
                    {/* Image navigation */}
                    {tshirtOption.image_urls.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/75 hover:bg-white p-2 rounded-full shadow-md"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/75 hover:bg-white p-2 rounded-full shadow-md"
                          aria-label="Next image"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div 
                    className="h-full w-full flex items-center justify-center text-white text-2xl font-bold"
                    style={{ backgroundColor: tshirtOption.bgColor }}
                  >
                    {tshirt.option_name}
                  </div>
                )}
              </div>

              {/* Thumbnails removed as requested */}
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-8">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold">{tshirt.option_name}</h1>
                <button className="p-2 text-gray-400 hover:text-red-500">
                  <Heart size={24} />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">{tshirtOption.option_description}</p>
              
              {/* Price */}
              <div className="flex items-center mb-8">
                <span className="text-2xl font-bold text-primary-600">${tshirt.price.toFixed(2)}</span>
                {tshirt.price_original > tshirt.price && (
                  <span className="ml-2 text-lg text-gray-500 line-through">${tshirt.price_original.toFixed(2)}</span>
                )}
              </div>
              
              {/* Quantity */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Quantity</h3>
                <div className="flex items-center border border-gray-300 rounded-md inline-flex">
                  <button 
                    onClick={decrementQuantity}
                    className="py-2 px-4 border-r border-gray-300"
                  >
                    -
                  </button>
                  <span className="py-2 px-4">{quantity}</span>
                  <button 
                    onClick={incrementQuantity}
                    className="py-2 px-4 border-l border-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Sizes */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {tshirt.size.map((size, idx) => (
                    <button 
                      key={idx}
                      className="py-2 px-4 border border-gray-300 rounded-md hover:border-primary-500 hover:bg-primary-50"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Colors */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {tshirt.color.map((color, idx) => (
                    <button 
                      key={idx}
                      className="py-2 px-4 border border-gray-300 rounded-md hover:border-primary-500 hover:bg-primary-50"
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Styles */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Style</h3>
                <div className="flex flex-wrap gap-2">
                  {tshirt.style.map((style, idx) => (
                    <button 
                      key={idx}
                      className="py-2 px-4 border border-gray-300 rounded-md hover:border-primary-500 hover:bg-primary-50"
                    >
                      {style}
                    </button>
                  ))}
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
                    <h4 className="font-medium text-gray-900">Premium Quality</h4>
                    <p className="text-sm text-gray-500">High quality materials</p>
                  </div>
                </div>
              </div>
              
              {/* Add to cart */}
              <button className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-medium text-lg rounded-md transition-colors mb-4">
                Add to Cart
              </button>
              
              {/* Share */}
              <div className="flex items-center gap-3 text-gray-500 justify-center">
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: tshirt.option_name,
                        text: `Check out ${tshirt.option_name} on Labubu Maroc`,
                        url: window.location.href,
                      })
                      .catch(error => console.log('Error sharing:', error));
                    } else {
                      // Fallback for browsers that don't support Web Share API
                      navigator.clipboard.writeText(window.location.href)
                        .then(() => alert('Link copied to clipboard! You can now paste it in your favorite app.'))
                        .catch(err => console.error('Failed to copy link:', err));
                    }
                  }}
                  className="flex items-center gap-2 hover:text-primary-600 cursor-pointer"
                >
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TShirtDetailPage;
