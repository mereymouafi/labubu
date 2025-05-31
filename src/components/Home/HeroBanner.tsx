import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Banner, fetchBanners } from '../../lib/supabase';

const HeroBanner: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await fetchBanners();
        setBanners(data);
      } catch (error) {
        console.error('Error loading banners:', error);
        // Fallback banners if Supabase fails
        setBanners([
          {
            id: '1',
            image: 'https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/banner/b13f2de36c33c4f3ce7f962fa17d24e.webp',
            title: 'Labubu Series',
            subtitle: 'Explore the latest Labubu collection',
            button_text: 'Shop Now',
            button_link: '/collections'
          },
          {
            id: '2',
            image: 'https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/banner/06f09b0e8af55c30be06a73a30ccbca.webp',
            title: 'Dimoo World',
            subtitle: 'Discover magical characters from Dimoo World',
            button_text: 'Explore',
            button_link: '/shop'
          },
          {
            id: '3',
            image: 'https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/banner/6b41e6ac5f19a56beb62eb1f8d1a42d.webp',
            title: 'SKULLPANDA',
            subtitle: 'Unleash your dark side with SKULLPANDA',
            button_text: 'View Collection',
            button_link: '/collections/skullpanda'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => {
    if (banners.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const prevSlide = () => {
    if (banners.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  if (loading) {
    return (
      <div className="h-[75vh] flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-popmart-red"></div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="h-[75vh] bg-popmart-lightgray flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-black">Welcome to LABUBU</h1>
          <p className="text-xl mb-8 text-gray-600">Discover our amazing collections</p>
          <Link to="/collections" className="bg-black text-white py-3 px-8 hover:bg-popmart-red transition-colors duration-300">
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="container mx-auto px-8 md:px-16 lg:px-32 xl:px-48 mt-8 relative">
      {/* Red border around the banner, similar to PopMart */}
      <div className="border-popmart-red border-4 relative">
        <div className="relative h-[550px] overflow-hidden px-6 md:px-12 lg:px-24 xl:px-36">
      {/* Slider Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 lg:left-20 xl:left-32 top-1/2 z-10 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-3 transition-colors duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 lg:right-20 xl:right-32 top-1/2 z-10 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-3 transition-colors duration-300"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div className="relative h-full w-full">
            <img
              src={currentBanner.image}
              alt={currentBanner.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6">
                <div className="max-w-lg">
                  <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-4xl md:text-5xl font-bold mb-4 text-white"
                  >
                    {currentBanner.title}
                  </motion.h1>
                  {currentBanner.subtitle && (
                    <motion.p
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="text-xl mb-8 text-white"
                    >
                      {currentBanner.subtitle}
                    </motion.p>
                  )}
                  {currentBanner.button_text && currentBanner.button_link && (
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                    >
                      <Link 
                        to={currentBanner.button_link} 
                        className="inline-block bg-white text-black py-3 px-8 hover:bg-popmart-red hover:text-white transition-colors duration-300"
                      >
                        {currentBanner.button_text}
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center space-x-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 transition-all duration-300 ${index === currentIndex ? 'bg-white w-8 rounded-sm' : 'bg-white/50 rounded-full'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;