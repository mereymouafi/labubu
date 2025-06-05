import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, ChevronLeft, Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { supabase, TShirtOption, fetchTShirtOptions } from '../lib/supabase';

// Interface representing the tshirts table structure in the database
interface TShirt {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  option_name: string;
  option_description: string;
  option_id: string;
  colors: string[];
  sizes: string[];
  images: string[];
  color_images?: Record<string, string[]>;
  stock_status: string;
  category_id?: string;
  collection?: string;
  is_featured: boolean;
  is_popular: boolean;
  is_new: boolean;
  is_trending: boolean;
  is_on_sale: boolean;
  features?: string[];
}

const TShirtProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State variables
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tshirt, setTshirt] = useState<TShirt | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [tshirtOptions, setTshirtOptions] = useState<TShirtOption[]>([]); 
  const [selectedOption, setSelectedOption] = useState<TShirtOption | null>(null);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(true);

  const { addToCart, addToWishlist, isInWishlist } = useShop();
  
  // Fetch tshirt data from Supabase
  useEffect(() => {
    const fetchTshirt = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          setError('No product ID provided');
          return;
        }
        
        const { data, error } = await supabase
          .from('tshirts')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching tshirt:', error);
          setError('Failed to load product details');
        } else if (data) {
          setTshirt(data as TShirt);
          // Set default color to first available color
          if (data.colors && data.colors.length > 0) {
            setSelectedColor(data.colors[0]);
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        const options = await fetchTShirtOptions();
        setTshirtOptions(options);
        
        // If we have a tshirt, find the matching option
        if (tshirt && tshirt.option_id) {
          const matchingOption = options.find(opt => opt.id === tshirt.option_id);
          if (matchingOption) {
            setSelectedOption(matchingOption);
          }
        }
      } catch (err) {
        console.error('Error fetching t-shirt options:', err);
      } finally {
        setLoadingOptions(false);
      }
    };
    
    fetchTshirt();
    fetchOptions();
  }, [id, tshirt?.option_id]);

  // If loading or error, show appropriate feedback
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !tshirt) {
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
    if (!tshirt) return null;
    
    const productId = `tshirt-${tshirt.id}-${selectedColor}-${selectedSize}`.toLowerCase().replace(/\s+/g, '-');
    
    return {
      id: productId,
      name: `${tshirt.name} - ${selectedColor}, ${selectedSize}`,
      price: tshirt.price,
      images: tshirt.images,
      category: 'T-shirts',
      collection: tshirt.collection || 'T-shirt Collection',
      stock_status: tshirt.stock_status,
      description: `${tshirt.description} Color: ${selectedColor}, Size: ${selectedSize}`,
      color: selectedColor,
      size: selectedSize
    };
  };
  
  const handleAddToCart = () => {
    const product = createProductWithOptions();
    if (product) {
      // Add the item to the cart with the selected quantity
      addToCart(product, quantity);
      
      // Show a confirmation message
      alert(`Added to cart: ${tshirt.name} - Color: ${selectedColor}, Size: ${selectedSize}, Quantity: ${quantity}`);
    }
  };
  
  const handleAddToWishlist = () => {
    const product = createProductWithOptions();
    if (product) {
      // Add the item to the wishlist
      addToWishlist(product);
      
      // Show a confirmation message
      alert(`Added to wishlist: ${tshirt.name} - Color: ${selectedColor}, Size: ${selectedSize}`);
    }
  };
  
  if (!tshirt) {
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
              className="bg-gray-100 rounded-xl overflow-hidden aspect-square mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Display main image - either from color_images or regular images array */}
              <img 
                src={tshirt.color_images?.[selectedColor]?.[selectedImage] || tshirt.images?.[selectedImage] || ''} 
                alt={`${tshirt.name} in ${selectedColor}`} 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <div className="grid grid-cols-4 gap-4">
              {/* Show thumbnail images - either color-specific or general product images */}
              {(tshirt.color_images?.[selectedColor] || tshirt.images || []).slice(0, 4).map((img, index) => (
                <div 
                  key={index}
                  className={`bg-gray-100 rounded-lg overflow-hidden aspect-square cursor-pointer transition-opacity ${selectedImage === index ? 'ring-2 ring-primary-600' : 'hover:opacity-80'}`}
                  onClick={() => setSelectedImage(index)}
                <h3 className="text-lg font-medium mb-3">Color: <span className="font-bold text-primary-600">{selectedColor}</span></h3>
                <div className="flex flex-wrap gap-4">
                  {tshirt.colors.map(color => (
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
                  {tshirt.sizes.map(size => (
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
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{tshirt.name}</h1>
            
            <h3 className="text-lg font-medium mb-3">Color: <span className="font-bold text-primary-600">{selectedColor}</span></h3>
            <div className="flex flex-wrap gap-4">
              {tshirt.colors.map(color => (
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
            
            {/* Size selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Size: <span className="font-bold text-primary-600">{selectedSize}</span></h3>
              <div className="flex flex-wrap gap-4">
                {tshirt.sizes.map(size => (
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
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {tshirt.features ? tshirt.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TShirtProductDetail;
