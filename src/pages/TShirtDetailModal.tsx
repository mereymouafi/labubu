import React from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Truck, Shield, RotateCcw, Award, Share2 } from 'lucide-react';
import { TShirtOption, TShirtDetail } from '../lib/supabase';

interface TShirtDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOption: TShirtOption | null;
  selectedTShirt: TShirtDetail | null;
  isLoading: boolean;
}

const TShirtDetailModal: React.FC<TShirtDetailModalProps> = ({
  isOpen,
  onClose,
  selectedOption,
  selectedTShirt,
  isLoading
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = React.useState<string | null>(null);
  const [added, setAdded] = React.useState(false);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - darkened background */}
      <motion.div
        className="fixed inset-0 bg-black/50 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Modal content */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {isLoading ? (
            <div className="p-10 flex justify-center items-center">
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            </div>
          ) : selectedTShirt && selectedOption ? (
            <div className="flex flex-col md:flex-row">
              {/* Left: Product image */}
              <div className="w-full md:w-1/2 bg-gray-50">
                {selectedOption.image_urls && selectedOption.image_urls.length > 0 ? (
                  <img 
                    src={selectedOption.image_urls[0]} 
                    alt={selectedTShirt.option_name} 
                    className="w-full h-auto object-contain"
                  />
                ) : (
                  <div 
                    className="aspect-square flex items-center justify-center"
                    style={{ backgroundColor: selectedOption.bgColor }}
                  >
                    <span className="text-2xl font-bold text-white">{selectedTShirt.option_name}</span>
                  </div>
                )}
                
                {/* Thumbnail gallery */}
                {selectedOption.image_urls && selectedOption.image_urls.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {selectedOption.image_urls.map((url, idx) => (
                      <div 
                        key={idx} 
                        className="w-16 h-16 flex-shrink-0 cursor-pointer border border-gray-200 rounded overflow-hidden"
                      >
                        <img 
                          src={url} 
                          alt={`${selectedOption.option_name} view ${idx + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Right: Product details */}
              <div className="w-full md:w-1/2 p-6 flex flex-col">
                {/* Product tags */}
                <div className="flex gap-2 mb-3">
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">New</span>
                  {selectedTShirt.price_original > selectedTShirt.price && (
                    <span className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded">Sale</span>
                  )}
                </div>
                
                {/* Product name */}
                <h2 className="text-2xl font-bold mb-1">{selectedTShirt.option_name}</h2>
                
                {/* Category */}
                <p className="text-sm text-gray-500 mb-4">Category: Not specified</p>
                
                {/* Price */}
                <div className="flex items-center gap-2 mb-6">
                  {selectedTShirt.price_original > selectedTShirt.price && (
                    <span className="text-gray-400 line-through">{selectedTShirt.price_original.toFixed(2)} MAD</span>
                  )}
                  <span className="text-xl font-bold">{selectedTShirt.price.toFixed(2)} MAD</span>
                </div>
                
                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">DESCRIPTION</h3>
                  <p className="text-gray-600">{selectedOption.option_description}</p>
                </div>
                
                {/* Size selection */}
                <div className="mb-5">
                  <h3 className="text-sm mb-2">SIZE</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTShirt.size.map((size, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSelectedSize(size); setAdded(false); }}
                        className={`py-1 px-3 border rounded text-sm ${
                          selectedSize === size
                            ? 'border-primary-600 text-primary-600 bg-primary-50'
                            : 'border-gray-300 text-gray-600 hover:text-primary-600 hover:border-primary-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color selection */}
                <div className="mb-5">
                  <h3 className="text-sm mb-2">COLOR</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTShirt.color.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSelectedColor(color); setAdded(false); }}
                        className={`py-1 px-3 border rounded text-sm ${
                          selectedColor === color
                            ? 'border-primary-600 text-primary-600 bg-primary-50'
                            : 'border-gray-300 text-gray-600 hover:text-primary-600 hover:border-primary-600'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style selection */}
                <div className="mb-5">
                  <h3 className="text-sm mb-2">STYLE</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTShirt.style.map((style, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSelectedStyle(style); setAdded(false); }}
                        className={`py-1 px-3 border rounded text-sm ${
                          selectedStyle === style
                            ? 'border-primary-600 text-primary-600 bg-primary-50'
                            : 'border-gray-300 text-gray-600 hover:text-primary-600 hover:border-primary-600'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Quantity selector */}
                <div className="flex items-center mb-6">
                  <div className="flex border border-gray-300 rounded-md">
                    <button 
                      onClick={decreaseQuantity}
                      className="px-3 py-1 border-r border-gray-300 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <div className="px-4 py-1 flex items-center justify-center">
                      {quantity}
                    </div>
                    <button 
                      onClick={increaseQuantity}
                      className="px-3 py-1 border-l border-gray-300 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Add to cart button */}
                <button
                  disabled={!selectedSize || !selectedColor || !selectedStyle || added}
                  onClick={() => { setAdded(true); /* Add your addToCart logic here */ }}
                  className={`w-full py-3 font-medium rounded transition-colors mb-6 ${
                    !selectedSize || !selectedColor || !selectedStyle || added
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {added ? 'Added to Cart' : 'Add to Cart'}
                </button>
                
                {/* Feature icons - similar to second image */}
                <div className="border-t border-gray-200 pt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Truck size={18} className="text-gray-600" />
                    <div>
                      <p className="text-xs font-semibold">FAST SHIPPING</p>
                      <p className="text-xs text-gray-500">2-3 business days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Shield size={18} className="text-gray-600" />
                    <div>
                      <p className="text-xs font-semibold">100% AUTHENTIC</p>
                      <p className="text-xs text-gray-500">Genuine product</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <RotateCcw size={18} className="text-gray-600" />
                    <div>
                      <p className="text-xs font-semibold">EASY RETURNS</p>
                      <p className="text-xs text-gray-500">30 day return policy</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-gray-600" />
                    <div>
                      <p className="text-xs font-semibold">COLLECTOR QUALITY</p>
                      <p className="text-xs text-gray-500">Premium quality</p>
                    </div>
                  </div>
                </div>
                
                {/* Share button */}
                <div className="mt-4 flex justify-end">
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center text-gray-500">
              Could not load product details.
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default TShirtDetailModal;
