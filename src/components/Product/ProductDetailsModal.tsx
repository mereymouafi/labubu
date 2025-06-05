import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TShirtDetail, TShirtOption } from '../../lib/supabase';

// Extending TShirtDetail to ensure image_urls property exists
interface ExtendedTShirtDetail extends TShirtDetail {
  image_urls?: string[];
}

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productDetails: ExtendedTShirtDetail | null;
  productOption: TShirtOption | null;
  isLoading: boolean;
  currentImageIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  isOpen,
  onClose,
  productDetails,
  productOption,
  isLoading,
  currentImageIndex,
  onNextImage,
  onPrevImage
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl z-50 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button 
                onClick={onClose}
                className="absolute right-4 top-4 z-50 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              {isLoading ? (
                <div className="p-10 flex items-center justify-center">
                  <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                </div>
              ) : productDetails && productOption ? (
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image gallery */}
                    <div className="w-full md:w-1/2 relative">
                      {/* Main image */}
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                        <img 
                          src={productDetails.image_urls?.[currentImageIndex] || productOption.image_urls?.[0] || ''} 
                          alt={productDetails.option_name}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Image navigation arrows */}
                        {productDetails.image_urls && productDetails.image_urls.length > 1 && (
                          <div className="absolute inset-0 flex items-center justify-between p-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onPrevImage();
                              }}
                              className="p-2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition-opacity"
                            >
                              <ChevronLeft size={20} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onNextImage();
                              }}
                              className="p-2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition-opacity"
                            >
                              <ChevronRight size={20} />
                            </button>
                          </div>
                        )}

                        {/* Image pagination indicator */}
                        {productDetails.image_urls && productDetails.image_urls.length > 1 && (
                          <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1">
                            {productDetails.image_urls.map((_, idx: number) => (
                              <span 
                                key={idx} 
                                className={`block h-2 w-2 rounded-full ${currentImageIndex === idx ? 'bg-primary-500' : 'bg-gray-300'}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Thumbnail gallery */}
                      {productDetails.image_urls && productDetails.image_urls.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {productDetails.image_urls.map((image: string, idx: number) => (
                            <button 
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Set current image index directly to this thumbnail
                              }}
                              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden ${
                                currentImageIndex === idx ? 'ring-2 ring-primary-500' : 'opacity-80 hover:opacity-100'
                              }`}
                            >
                              <img src={image} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Details section */}
                    <div className="w-full md:w-1/2 p-6 flex flex-col">
                      <h2 className="text-3xl font-bold mb-2">{productDetails.option_name}</h2>
                      <p className="text-gray-600 mb-4">{productOption.option_description}</p>
                      
                      {/* Price */}
                      <div className="flex items-center mb-6">
                        <span className="text-2xl font-bold text-primary-600">${productDetails.price.toFixed(2)}</span>
                        {productDetails.price_original > productDetails.price && (
                          <span className="ml-2 text-lg text-gray-500 line-through">${productDetails.price_original.toFixed(2)}</span>
                        )}
                      </div>
                      
                      {/* Sizes */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Size</h3>
                        <div className="flex flex-wrap gap-2">
                          {productDetails.size.map((size, idx) => (
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
                          {productDetails.color.map((color, idx) => (
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
                          {productDetails.style.map((style, idx) => (
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
  );
};

export default ProductDetailsModal;
