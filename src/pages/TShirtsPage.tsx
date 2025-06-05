import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TShirtBanner from '../components/Product/TShirtBanner';
import { fetchTShirtOptions, fetchTShirtDetail, TShirtOption, TShirtDetail } from '../lib/supabase';
import { Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';

const TShirtsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tshirtOptions, setTshirtOptions] = useState<TShirtOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track current image index for each option
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});
  
  // Track which options should have auto-scrolling paused (e.g., when hovered)
  const [pausedOptions, setPausedOptions] = useState<Record<string, boolean>>({});
  
  // Modal state for showing T-shirt details
  const [showModal, setShowModal] = useState(false);
  const [selectedTShirt, setSelectedTShirt] = useState<TShirtDetail | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TShirtOption | null>(null);
  
  // Close modal function
  const closeModal = () => {
    setShowModal(false);
    setSelectedTShirt(null);
    setSelectedOption(null);
  };
  
  // Timer references for auto-scrolling
  const timersRef = useRef<Record<string, NodeJS.Timeout>>({});
  
  // Fetch T-shirt options from the database
  // Set up automatic image scrolling for all options
  useEffect(() => {
    // Clean up function to clear all timers
    const cleanupTimers = () => {
      Object.values(timersRef.current).forEach(timer => clearInterval(timer));
      timersRef.current = {};
    };
    
    // Only set up timers if we have options and they're not loading
    if (!loading && tshirtOptions.length > 0) {
      tshirtOptions.forEach(option => {
        // Only set up timer if option has multiple images and isn't paused
        if (option.image_urls && option.image_urls.length > 1 && !pausedOptions[option.id]) {
          // Clear any existing timer for this option
          if (timersRef.current[option.id]) {
            clearInterval(timersRef.current[option.id]);
          }
          
          // Set up a new timer
          timersRef.current[option.id] = setInterval(() => {
            setCurrentImageIndexes(prev => ({
              ...prev,
              [option.id]: (prev[option.id] + 1) % option.image_urls!.length
            }));
          }, 2000); // Scroll every 3 seconds
        }
      });
    }
    
    // Clean up timers when component unmounts
    return cleanupTimers;
  }, [loading, tshirtOptions, pausedOptions]);
  
  useEffect(() => {
    const loadTShirtOptions = async () => {
      try {
        setLoading(true);
        const options = await fetchTShirtOptions();
        setTshirtOptions(options);
        
        // Initialize image indexes and pause states for each option
        const initialIndexes: Record<string, number> = {};
        const initialPaused: Record<string, boolean> = {};
        options.forEach(option => {
          initialIndexes[option.id] = 0; // Start with first image
          initialPaused[option.id] = false; // Auto-scrolling enabled by default
        });
        setCurrentImageIndexes(initialIndexes);
        setPausedOptions(initialPaused);
        
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
  const handleChooseOption = async (optionId: string) => {
    try {
      setDetailsLoading(true);
      
      // Find the option from tshirtOptions
      const option = tshirtOptions.find(opt => opt.id === optionId) || null;
      setSelectedOption(option);
      
      // Fetch details from the database
      const details = await fetchTShirtDetail(optionId);
      setSelectedTShirt(details);
      
      // Show the modal
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching T-shirt details:', err);
      setError('Failed to load T-shirt details. Please try again.');
    } finally {
      setDetailsLoading(false);
    }
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
  
  // Functions to control auto-scrolling
  const pauseAutoScroll = (optionId: string) => {
    setPausedOptions(prev => ({ ...prev, [optionId]: true }));
    
    // Clear the timer if it exists
    if (timersRef.current[optionId]) {
      clearInterval(timersRef.current[optionId]);
      delete timersRef.current[optionId];
    }
  };
  
  const resumeAutoScroll = (optionId: string, imagesLength: number) => {
    setPausedOptions(prev => ({ ...prev, [optionId]: false }));
    
    // Only set up timer if there are multiple images
    if (imagesLength > 1) {
      // Clear any existing timer
      if (timersRef.current[optionId]) {
        clearInterval(timersRef.current[optionId]);
      }
      
      // Set up a new timer
      timersRef.current[optionId] = setInterval(() => {
        setCurrentImageIndexes(prev => ({
          ...prev,
          [optionId]: (prev[optionId] + 1) % imagesLength
        }));
      }, 3000); // Scroll every 3 seconds
    }
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
      className="min-h-screen bg-white"
    >
      {/* Full-width banner options carousel */}
      <TShirtBanner styles={displayOptions} />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-2">T-Shirt Collection</h1>
        <p className="text-xl text-gray-600 text-center mb-10">Choose your favorite style from our exclusive designs</p>
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="text-center text-red-500 py-10">
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
                  onMouseEnter={() => pauseAutoScroll(option.id)}
                  onMouseLeave={() => resumeAutoScroll(option.id, option.image_urls?.length || 1)}
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
      
      {/* T-Shirt Details Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Overlay */}
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />
            
            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
              >
                {detailsLoading ? (
                  <div className="flex justify-center items-center p-10">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                  </div>
                ) : selectedTShirt && selectedOption ? (
                  <div className="relative">
                    {/* Close button */}
                    <button
                      onClick={closeModal}
                      className="absolute right-4 top-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2 z-10"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    
                    <div className="flex flex-col md:flex-row">
                      {/* Image section */}
                      <div className="w-full md:w-1/2 p-6">
                        <div className="aspect-square overflow-hidden rounded-lg relative">
                          {selectedOption.image_urls && selectedOption.image_urls.length > 0 ? (
                            <img 
                              src={selectedOption.image_urls[0]} 
                              alt={selectedOption.option_name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div 
                              className="h-full w-full flex items-center justify-center text-white text-2xl font-bold"
                              style={{ backgroundColor: selectedOption.bgColor }}
                            >
                              {selectedOption.option_name}
                            </div>
                          )}
                        </div>
                        
                        {/* Thumbnail gallery */}
                        {selectedOption.image_urls && selectedOption.image_urls.length > 1 && (
                          <div className="mt-4 flex space-x-2 overflow-x-auto py-2">
                            {selectedOption.image_urls.map((url, idx) => (
                              <div 
                                key={idx} 
                                className="w-20 h-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2"
                                onClick={() => setCurrentImageIndexes(prev => ({
                                  ...prev,
                                  [selectedOption.id]: idx
                                }))}
                              >
                                <img 
                                  src={url} 
                                  alt={`${selectedOption.option_name} thumbnail ${idx + 1}`} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Details section */}
                      <div className="w-full md:w-1/2 p-6 flex flex-col">
                        <h2 className="text-3xl font-bold mb-2">{selectedTShirt.option_name}</h2>
                        <p className="text-gray-600 mb-4">{selectedOption.option_description}</p>
                        
                        {/* Price */}
                        <div className="flex items-center mb-6">
                          <span className="text-2xl font-bold text-primary-600">${selectedTShirt.price.toFixed(2)}</span>
                          {selectedTShirt.price_original > selectedTShirt.price && (
                            <span className="ml-2 text-lg text-gray-500 line-through">${selectedTShirt.price_original.toFixed(2)}</span>
                          )}
                        </div>
                        
                        {/* Sizes */}
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-2">Size</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedTShirt.size.map((size, idx) => (
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
                            {selectedTShirt.color.map((color, idx) => (
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
                            {selectedTShirt.style.map((style, idx) => (
                              <button 
                                key={idx}
                                className="py-2 px-4 border border-gray-300 rounded-md hover:border-primary-500 hover:bg-primary-50"
                              >
                                {style}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Add to cart button */}
                        <div className="mt-auto">
                          <button 
                            className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-medium text-lg rounded-md transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    Could not load product details.
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TShirtsPage;
