import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TShirtBanner from '../components/Product/TShirtBanner';
import { fetchTShirtOptions, TShirtOption } from '../lib/supabase';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const TShirtsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tshirtOptions, setTshirtOptions] = useState<TShirtOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track current image index for each option
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});
  
  // Fetch T-shirt options from the database
  useEffect(() => {
    const loadTShirtOptions = async () => {
      try {
        setLoading(true);
        const options = await fetchTShirtOptions();
        setTshirtOptions(options);
        
        // Initialize image indexes for each option
        const initialIndexes: Record<string, number> = {};
        options.forEach(option => {
          initialIndexes[option.id] = 0; // Start with first image
        });
        setCurrentImageIndexes(initialIndexes);
        
        setError(null);
      } catch (err) {
        console.error('Error loading T-shirt options:', err);
        setError('Failed to load T-shirt options. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadTShirtOptions();
  }, []);
  
  // Function to handle option selection
  const handleChooseOption = (optionId: string) => {
    // Navigate to t-shirt product details page with the option ID
    navigate(`/t-shirts/${optionId}`);
  };
  
  // Image navigation functions
  const nextImage = (optionId: string, imagesLength: number) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [optionId]: (prev[optionId] + 1) % imagesLength
    }));
  };
  
  const prevImage = (optionId: string, imagesLength: number) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [optionId]: (prev[optionId] - 1 + imagesLength) % imagesLength
    }));
  };
  
  // Fallback data in case the database fetch fails
  const fallbackTshirtOptions = [
    {
      id: '1',
      option_name: "Special T-shirts",
      option_description: "Unique designs for special occasions and celebrations",
      bgColor: "#ff6b6b",
      image_urls: []
    },
    {
      id: '2',
      option_name: "Illustrated T-shirts",
      option_description: "Artistic graphics and detailed illustrations on premium fabric",
      bgColor: "#4d96ff",
      image_urls: []
    },
    {
      id: '3',
      option_name: "Big into Energy",
      option_description: "Bold statements and vibrant colors for expressive style",
      bgColor: "#50c878",
      image_urls: []
    },
    {
      id: '4',
      option_name: "Macaron",
      option_description: "Soft pastels and delicate designs for a sweet aesthetic",
      bgColor: "#ffb6c1",
      image_urls: []
    }
  ];
  
  // Use the fetched options or fallback to hardcoded options if there's an error
  const displayOptions = tshirtOptions.length > 0 ? tshirtOptions : fallbackTshirtOptions;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Full-width banner options carousel */}
      <TShirtBanner styles={displayOptions} />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">T-Shirt Options</h1>
        <p className="text-lg text-center mb-10 max-w-3xl mx-auto">
          Explore our diverse range of t-shirt options, each designed for different fits and occasions.
        </p>
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
            <span className="ml-3 text-lg">Loading T-shirt options...</span>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-10">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {/* T-shirt options grid */}
        {!loading && (
          <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-10 mb-16 max-w-6xl mx-auto">
            {displayOptions.map(option => (
              <motion.div 
                key={option.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-lg overflow-hidden shadow-lg w-full md:w-[500px] lg:w-[550px]"
              >
                <div 
                  className="h-80 relative overflow-hidden"
                >
                  {option.image_urls && option.image_urls.length > 0 ? (
                    <>
                      <AnimatePresence mode="wait">
                        <motion.img 
                          key={`${option.id}-${currentImageIndexes[option.id]}`}
                          src={option.image_urls[currentImageIndexes[option.id] || 0]} 
                          alt={`${option.option_name} - Image ${currentImageIndexes[option.id] + 1}`} 
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </AnimatePresence>
                      
                      {/* Navigation controls */}
                      {option.image_urls.length > 1 && (
                        <>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              prevImage(option.id, option.image_urls?.length || 1);
                            }}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 z-10"
                          >
                            <ChevronLeft className="w-5 h-5 text-white" />
                          </button>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              nextImage(option.id, option.image_urls?.length || 1);
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 z-10"
                          >
                            <ChevronRight className="w-5 h-5 text-white" />
                          </button>
                          
                          {/* Dots indicator */}
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1.5">
                            {option.image_urls.map((_, index) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndexes(prev => ({ ...prev, [option.id]: index }));
                                }}
                                className={`w-2 h-2 rounded-full transition-all ${index === (currentImageIndexes[option.id] || 0) ? 'bg-white scale-125' : 'bg-white opacity-50'}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div 
                      className="h-full w-full flex items-center justify-center text-white text-2xl font-bold"
                      style={{ backgroundColor: option.bgColor }}
                    >
                      {option.option_name}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-2xl font-bold mb-3">{option.option_name}</h3>
                  <p className="text-gray-600 text-lg mb-6">{option.option_description}</p>
                  <button 
                    onClick={() => handleChooseOption(option.id)}
                    className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-medium text-lg rounded-md transition-colors"
                  >
                    Choose this option
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TShirtsPage;
