import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TShirtStyle {
  id: number;
  name: string;
  description: string;
  bgColor: string;
}

interface TShirtBannerProps {
  styles: TShirtStyle[];
}

const TShirtBanner: React.FC<TShirtBannerProps> = ({ styles }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle automatic slide advancement
  useEffect(() => {
    if (autoPlay) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % styles.length);
      }, 1000); // Change slide every 5 seconds
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [autoPlay, styles.length]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % styles.length);
    setAutoPlay(false); // Pause autoplay when manually navigating
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + styles.length) % styles.length);
    setAutoPlay(false); // Pause autoplay when manually navigating
  };

  // Restart autoplay when mouse leaves the banner
  const handleMouseLeave = () => {
    setAutoPlay(true);
  };

  return (
    <div 
      className="relative w-full h-[600px] overflow-hidden" 
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setAutoPlay(false)}
    >
      {/* Main banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundColor: styles[currentSlide].bgColor }}
        >
          <div className="container mx-auto px-8 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-white space-y-4 mb-8 md:mb-0">
              <motion.h2 
                className="text-5xl md:text-6xl font-bold"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {styles[currentSlide].name}
              </motion.h2>
              <motion.p 
                className="text-2xl md:text-3xl max-w-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {styles[currentSlide].description}
              </motion.p>
              <motion.button
                className="bg-white text-gray-900 px-10 py-4 rounded-md font-medium text-xl mt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                Shop Now
              </motion.button>
            </div>
            <div className="md:w-1/2 flex justify-center items-center">
              {/* Image would go here in production */}
              <div className="w-72 h-72 md:w-[450px] md:h-[450px] bg-white bg-opacity-20 flex items-center justify-center rounded-full">
                <span className="text-white text-xl">{styles[currentSlide].name} Style</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <button 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>
      <button 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2"
        onClick={nextSlide}
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
        {styles.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white opacity-50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default TShirtBanner;
