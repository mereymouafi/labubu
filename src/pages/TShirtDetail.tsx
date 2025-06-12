import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, ChevronLeft, ChevronRight, ShoppingCart, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { fetchTShirtDetail, fetchTShirtOptions, TShirtOption, TShirtDetail } from '../lib/supabase';
import { useShop } from '../context/ShopContext';

// Gallery Slideshow Component
interface GallerySlideshowProps {
  images: string[];
  productName: string;
}

const GallerySlideshow: React.FC<GallerySlideshowProps> = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  
  if (!images || images.length === 0) return null;
  
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Current Image Container */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <img 
          src={images[currentIndex]} 
          alt={`${productName} gallery ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />
        
        {/* Navigation buttons */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
          onClick={prevImage}
          aria-label="Previous image"
        >
          <ArrowLeft size={24} />
        </button>
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
          onClick={nextImage}
          aria-label="Next image"
        >
          <ArrowRight size={24} />
        </button>
      </div>
      
      {/* Image counter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

const TShirtDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tshirt, setTshirt] = useState<TShirtDetail | null>(null);
  const [tshirtOption, setTshirtOption] = useState<TShirtOption | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedAge, setSelectedAge] = useState<string>('');
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const { addToCart, addToWishlist, isInWishlist } = useShop();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadTShirtDetail = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const detail = await fetchTShirtDetail(id);
        if (detail) {
          setTshirt(detail);
          // No default selections - user must choose explicitly
          setSelectedSize('');
          setSelectedColor('');
          setSelectedStyle('');
          setSelectedAge('');
          
          // Check if item is already in wishlist
          setInWishlist(isInWishlist(detail.id));
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
    setSelectedSize('');
    setSelectedColor('');
    setSelectedStyle('');
    
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
              <div className="flex flex-row gap-4">
                {/* Thumbnails navigation - vertical on left */}
                {tshirtOption.image_urls && tshirtOption.image_urls.length > 1 && (
                  <div className="flex flex-col space-y-2 overflow-y-auto max-h-[500px] py-1">
                    {tshirtOption.image_urls.map((imgUrl, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`cursor-pointer border-2 ${currentImageIndex === idx ? 'border-primary-600' : 'border-transparent'}`}
                      >
                        <img 
                          src={imgUrl} 
                          alt={`${tshirt.option_name} thumbnail ${idx + 1}`} 
                          className="w-14 h-14 object-cover" 
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Main Image */}
                <div className="relative flex-1 aspect-square">
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
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-4">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold">{tshirt.option_name}</h1>
                <button 
                  className={`p-2 transition-colors ${inWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  onClick={() => {
                    if (tshirt) {
                      // Convert TShirt to Product format for wishlist
                      const productForWishlist = {
                        id: tshirt.id,
                        name: tshirt.option_name,
                        price: tshirt.price,
                        images: tshirtOption?.image_urls || [],
                        description: tshirtOption?.option_description || ''
                      };
                      
                      // Add/remove from wishlist (toggle)
                      addToWishlist(productForWishlist as any);
                      setInWishlist(!inWishlist);
                    }
                  }}
                  aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={24} fill={inWishlist ? "currentColor" : "none"} />
                </button>
              </div>
              
              <p className="text-gray-600 mb-4 text-sm">{tshirtOption.option_description}</p>
              
              {/* Price */}
              <div className="flex items-center mb-4">
                <span className="text-xl font-bold text-primary-600">{tshirt.price.toFixed(2)} MAD</span>
                {tshirt.price_original > tshirt.price && (
                  <span className="ml-2 text-lg text-gray-500 line-through">{tshirt.price_original.toFixed(2)} MAD</span>
                )}
              </div>
              
              {/* Quantity */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-1">QUANTITY</h3>
                <div className="flex items-center border border-gray-300 rounded-md inline-flex text-sm">
                  <button 
                    onClick={decrementQuantity}
                    className="py-1 px-3 border-r border-gray-300"
                  >
                    -
                  </button>
                  <span className="py-1 px-3">{quantity}</span>
                  <button 
                    onClick={incrementQuantity}
                    className="py-1 px-3 border-l border-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Sizes - Only show if age is not selected */}
              {!selectedAge && (
                <div className="mb-3">
                  <h3 className="text-sm font-semibold mb-1">SIZE</h3>
                  <div className="flex flex-wrap gap-1">
                    {tshirt.size.map((size, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          // Toggle selection - if already selected, deselect it
                          if (selectedSize === size) {
                            setSelectedSize('');
                          } else {
                            setSelectedSize(size);
                            // Clear age selection when size is selected
                            setSelectedAge('');
                          }
                        }}
                        className={`py-1 px-3 border rounded-md transition-colors text-xs ${selectedSize === size 
                          ? 'border-primary-500 bg-primary-500 text-white font-medium' 
                          : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Age - Only show if size is not selected */}
              {!selectedSize && (
                <div className="mb-3">
                  <h3 className="text-sm font-semibold mb-1">AGE</h3>
                  <div className="flex flex-wrap gap-1">
                    {tshirt.age && tshirt.age.map((age, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          // Toggle selection - if already selected, deselect it
                          if (selectedAge === age) {
                            setSelectedAge('');
                          } else {
                            setSelectedAge(age);
                            // Clear size selection when age is selected
                            setSelectedSize('');
                          }
                        }}
                        className={`py-1 px-3 border rounded-md transition-colors text-xs ${selectedAge === age 
                          ? 'border-primary-500 bg-primary-500 text-white font-medium' 
                          : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'}`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Colors */}
              <div className="mb-3">
                <h3 className="text-sm font-semibold mb-1">COLOR</h3>
                <div className="flex flex-wrap gap-1">
                  {tshirt.color.map((color, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        // Toggle selection - if already selected, deselect it
                        if (selectedColor === color) {
                          setSelectedColor('');
                        } else {
                          setSelectedColor(color);
                        }
                      }}
                      className={`py-1 px-3 border rounded-md transition-colors text-xs ${selectedColor === color 
                        ? 'border-primary-500 bg-primary-500 text-white font-medium' 
                        : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Styles */}
              <div className="mb-3">
                <h3 className="text-sm font-semibold mb-1">STYLE</h3>
                <div className="flex flex-wrap gap-1">
                  {tshirt.style.map((style, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        // Toggle selection - if already selected, deselect it
                        if (selectedStyle === style) {
                          setSelectedStyle('');
                        } else {
                          setSelectedStyle(style);
                        }
                      }}
                      className={`py-1 px-3 border rounded-md transition-colors text-xs ${selectedStyle === style 
                        ? 'border-primary-500 bg-primary-500 text-white font-medium' 
                        : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Features section removed as requested */}
              
              {/* Buttons container */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {/* Add to cart button */}
                <button 
                  className={`py-2 ${isAddedToCart ? 'bg-green-500 hover:bg-green-600' : 'bg-red-600 hover:bg-red-700'} text-white font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-1`}
                  disabled={isAddedToCart}
                  onClick={() => {
                    if (tshirt) {
                      // Convert TShirt to Product format for cart
                      const productForCart = {
                        id: tshirt.id,
                        name: tshirt.option_name,
                        price: tshirt.price,
                        // Use images array instead of image_url to match Cart.tsx expectations
                        images: tshirtOption?.image_urls || [],
                        description: tshirtOption?.option_description || '',
                        category: 'T-shirts',
                        stock_status: 'in_stock',
                        // Add selected options as custom properties
                        selectedSize,
                        selectedColor,
                        selectedStyle,
                        selectedAge,
                        quantity
                      };
                      
                      // Add to cart
                      addToCart(productForCart as any, quantity);
                      
                      // Show success feedback
                      setIsAddedToCart(true);
                      
                      // Reset after 2 seconds
                      setTimeout(() => {
                        setIsAddedToCart(false);
                      }, 1000);
                    }
                  }}
                >
                  {isAddedToCart ? (
                    <>
                      <Check size={16} />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      Add to Cart
                    </>
                  )}
                </button>
                
                {/* Shop Now button - add to cart and redirect to cart page */}
                <button 
                  className="py-2 bg-black hover:bg-gray-900 text-white font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-1"
                  disabled={isAddedToCart}
                  onClick={() => {
                    if (tshirt) {
                      // Convert TShirt to Product format for cart
                      const productForCart = {
                        id: tshirt.id,
                        name: tshirt.option_name,
                        price: tshirt.price,
                        images: tshirtOption?.image_urls || [],
                        description: tshirtOption?.option_description || '',
                        category: 'T-shirts',
                        stock_status: 'in_stock',
                        // Store customization options to be used in checkout
                        selectedSize,
                        selectedColor,
                        selectedStyle,
                        selectedAge,
                        quantity
                      };
                      
                      // Add to cart and immediately redirect to cart page
                      addToCart(productForCart as any, quantity);
                      navigate('/cart');
                    }
                  }}
                >
                  Shop Now
                </button>
              </div>
              
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
        
        {/* Gallery Section - Full Width Banner Style */}
        {tshirtOption?.gallery_images && tshirtOption.gallery_images.length > 0 && (
          <div className="w-full mt-8 mb-8">
            <div className="bg-white w-full">
              <div className="py-6">
                <h2 className="text-2xl font-bold mb-4 text-center">{tshirt.option_name.toUpperCase()} GALLERY</h2>
                <p className="text-gray-600 mb-6 text-center">Explore more images of this collection</p>
                
                {/* Image Slideshow Gallery */}
                <GallerySlideshow images={tshirtOption.gallery_images} productName={tshirt.option_name} />
              </div>
            </div>
          </div>
        )}
        
        {/* Game Rules Section */}
        <div className="w-full mb-16">
          <div className="bg-white w-full">
            <div className="py-10">
              <h2 className="text-4xl font-bold text-center mb-12">GAME RULES</h2>
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Single Box */}
                  <div className="bg-gray-50 p-8 rounded-lg shadow-md flex flex-col items-center text-center">
                    <div className="w-64 h-64 mb-6">
                      {tshirtOption?.rules_image1 && tshirtOption.rules_image1.length > 0 ? (
                        <img 
                          src={tshirtOption.rules_image1[0]} 
                          alt="Single Box" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
                          <span className="text-gray-600">Image not available</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-3xl font-bold mb-2">SINGLE T-SHIRT</h3>
                    <h4 className="text-xl font-semibold mb-4">1 TEE, 1 SURPRISE
                    Design unknown. Fun guaranteed!</h4>
                    <p className="text-gray-700">
                      Choose your color, style, and size — surprise on the design!
                      You select the T-shirt's size, color, and style, but the character and illustration will be a surprise when you receive it!
                      🎁 Plus, every T-shirt comes with a small gift from us — just for you! ❤️
                    </p>
                  </div>
                  
                  {/* Whole Sets */}
                  <div className="bg-gray-50 p-8 rounded-lg shadow-md flex flex-col items-center text-center">
                    <div className="w-64 h-64 mb-6">
                      {tshirtOption?.rules_image2 && tshirtOption.rules_image2.length > 0 ? (
                        <img 
                          src={tshirtOption.rules_image2[0]} 
                          alt="Whole Sets" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
                          <span className="text-gray-600">Image not available</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-3xl font-bold mb-2">T-SHIRT BUNDLE (SET OF 6)</h3>
                    <h4 className="text-xl font-semibold mb-4">COLLECTOR’S PACK – 6 UNIQUE TEES
                    No repeats, just fresh designs!</h4>
                    <p className="text-gray-700">
                      The whole set <strong>contains 6 blind boxes</strong>Choose your styles, no duplicates guaranteed!
Buy a set of 6 T-shirts and get 6 different character designs — no repeats!
You still pick the sizes, colors, and styles.
🎁 And yes, gifts included with each T-shirt in the bundle! ❤️
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TShirtDetailPage;
