import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Product as BaseProduct } from '../../lib/supabase';

// Extend the Product type to include blind box specific information
interface Product extends BaseProduct {
  blindBoxInfo?: {
    level: string;
    color: string;
    quantity: number;
  };
}

interface BlindBoxItem {
  id: number;
  name: string;
  productId: string;
  character?: string;
  rarity?: 'common' | 'rare' | 'ultra-rare' | 'secret';
}

const BlindBoxInterface: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useShop(); // Use the shop context
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [animatingBox, setAnimatingBox] = useState<number | null>(null);
  const [revealedBox, setRevealedBox] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('level1');
  const [showQuantityModal, setShowQuantityModal] = useState<boolean>(false);
  const [multipleBoxesQuantity, setMultipleBoxesQuantity] = useState<number>(1);
  // Using Web Audio API for instant sound playback with zero delay
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const audioInitializedRef = useRef<boolean>(false);
  
  // Initialize audio context
  useEffect(() => {
    const initAudio = () => {
      try {
        // Create audio context
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(context);
        
        // Preload sound immediately
        fetch('/sounds/277672071-shake-box-8.m4a')
          .then(response => response.arrayBuffer())
          .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
          .then(audioBuffer => {
            audioBufferRef.current = audioBuffer;
            audioInitializedRef.current = true;
          })
          .catch(error => console.error('Error loading sound:', error));
      } catch (error) {
        console.error('Web Audio API not supported:', error);
      }
    };
    
    // Initialize audio on component mount
    initAudio();
    
    // Also initialize on first user interaction to handle mobile browsers
    const initOnFirstInteraction = () => {
      if (!audioContext) initAudio();
    };
    
    window.addEventListener('click', initOnFirstInteraction, { once: true });
    window.addEventListener('touchstart', initOnFirstInteraction, { once: true });
    
    return () => {
      window.removeEventListener('click', initOnFirstInteraction);
      window.removeEventListener('touchstart', initOnFirstInteraction);
      if (audioContext) {
        audioContext.close().catch(console.error);
      }
    };
  }, []);
  
  // Improved playShakeSound function using Web Audio API
  const playShakeSound = () => {
    try {
      // Create a simple dummy sound if audio isn't loaded yet
      if (!audioContext || !audioBufferRef.current) {
        // Fallback to basic Audio API
        const fallbackAudio = new Audio('/sounds/277672071-shake-box-8.m4a');
        fallbackAudio.play().catch(console.error);
        return;
      }
      
      // Use Web Audio API for precise, immediate playback
      const source = audioContext.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(audioContext.destination);
      source.start(0); // Start immediately (zero delay)
    } catch (error) {
      console.error('Error playing shake sound:', error);
    }
  };

  // Create a single box for each level
  const createSingleBox = (prefix: string): BlindBoxItem => {
    // Assign random rarity to the box
    const rarities = ['common', 'common', 'common', 'common', 'rare', 'rare', 'ultra-rare', 'secret'] as const;
    const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
    const characters = ['Coco', 'Luna', 'Zephyr', 'Momo', 'Blitz', 'Nova', 'Pixel', 'Bubbles'];
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    
    return {
      id: 1,
      name: `${prefix} Box`,
      productId: `${prefix}-10001`,
      character: randomChar,
      rarity: randomRarity,
    };
  };
  
  // Create single box for each level
  const level1Box = createSingleBox('L1'); // Level 1 box
  const level2Box = createSingleBox('L2'); // Level 2 box
  const level3Box = createSingleBox('L3'); // Level 3 box
  
  // Get the appropriate box based on selected level
  const getBoxForLevel = (level: string): BlindBoxItem => {
    switch (level) {
      case 'level1': return level1Box;
      case 'level2': return level2Box;
      case 'level3': return level3Box;
      default: return level1Box;
    }
  };
  
  // Current blind box based on selected level
  const currentBox = getBoxForLevel(selectedLevel);
  // Create an array with just the current box for compatibility with existing code
  const blindBoxes = [currentBox];

  // Product information based on selected level
  const getProductInfo = (level: string) => {
    switch (level) {
      case 'level1':
        return {
          name: 'Blindbox Level 1',
          price: '119.00 MAD',
          description: 'This box includes an "Exciting Macaron" T-shirt and an exclusive Labubu keychain. A cute combo at a great price.'
        };
      case 'level2':
        return {
          name: 'Blindbox Level 2',
          price: '178.00 MAD',
          description: 'This box contains a "Big Into Energy" T-shirt and a standard Labubu figurine. Perfect for curious collectors.'
        };
      case 'level3':
        return {
          name: 'Blindbox Level 3',
          price: '249.00 MAD',
          description: 'The ultimate box: "Exciting Macaron" T-shirt + "Big Into Energy" T-shirt + Labubu keychain + multicolor figurine.'
        };
      default:
        return {
          name: 'Blindbox Level 1',
          price: '119.00 MAD',
          description: 'This box includes an "Exciting Macaron" T-shirt and an exclusive Labubu keychain. A cute combo at a great price.'
        };
    }
  };
  
  // Get current product info based on selected level
  const { name: productName, price: productPrice, description: productDescription } = getProductInfo(selectedLevel);

  const handleBoxClick = (id: number) => {
    // First play the sound - this is now top priority
    playShakeSound();
    
    // Very small delay to ensure audio starts before animation
    // This helps with the perceived synchronization
    setTimeout(() => {
      setSelectedBox(id);
      setAnimatingBox(id);
      
      setTimeout(() => {
        setAnimatingBox(null);
      }, 800);
    }, 10); // Tiny delay to prioritize audio startup
  };

  const handleShakeBox = () => {
    if (selectedBox !== null) {
      setAnimatingBox(selectedBox);
      setRevealedBox(null);
      playShakeSound(); // Play the shaking sound
      
      // After shake animation completes, don't reveal the surprise, just stop the animation
      setTimeout(() => {
        setAnimatingBox(null);
      }, 1000); // Animation duration
    }
  };
  
  // Only reset revealed box when selecting a new one
  useEffect(() => {
    setRevealedBox(null);
    // Don't reset animatingBox here, as it interferes with the click animation
  }, [selectedBox]);

  const boxVariants = {
    initial: { scale: 1, y: 0 },
    selected: { scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)' },
    hover: { scale: 1.02, y: -5 },
    shake: {
      rotate: [0, -15, 15, -15, 15, -10, 10, -5, 5, 0],
      x: [0, -5, 5, -5, 5, -3, 3, 0],
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1]
      }
    }
  };

  // Handle level selection
  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
    setSelectedBox(null);
    setRevealedBox(null);
    setAnimatingBox(null);
  };
  
  // Handle Buy Now button click
  const handleBuyNow = (boxId: number) => {
    if (selectedBox === null) return;
    
    const selectedBoxData = blindBoxes[boxId - 1];
    
    // Create a product object from the blind box data
    const blindBoxProduct: Product = {
      id: selectedBoxData.productId,
      name: `${productName} - Box #${boxId}`,
      price: parseFloat(productPrice.replace(' MAD', '')),
      images: [
        selectedLevel === 'level1'
          ? "/images/white.jpg"
          : selectedLevel === 'level2'
            ? "/images/pink.jpg"
            : "/images/black.jpg"
      ],
      category: 'Blind Box',
      stock_status: 'in_stock',
      description: `Mystery Blind Box - ${selectedBoxData.rarity} rarity`,
      // Add blind box specific metadata
      blindBoxInfo: {
        level: selectedLevel,
        color: selectedBoxData.rarity || 'unknown',
        quantity: 1
      }
    };
    
    // Add to cart
    addToCart(blindBoxProduct, 1);
    
    // Navigate to cart
    navigate('/cart');
  };
  
  // Handle Multiple Boxes button click
  const handleMultipleBoxes = () => {
    setShowQuantityModal(true);
  };
  
  // Handle adding multiple boxes to cart
  const handleAddMultipleBoxesToCart = () => {
    if (multipleBoxesQuantity <= 0) {
      alert('Please select a valid quantity');
      return;
    }
    
    // Get product info based on selected level
    const { name, price } = getProductInfo(selectedLevel);
    
    // Create a product object
    const blindBoxProduct: Product = {
      id: `blind-box-multi-${selectedLevel}-${Date.now()}`,
      name: `${name} (×${multipleBoxesQuantity})`,
      price: parseFloat(price.replace(' MAD', '')),
      images: [
        selectedLevel === 'level1'
          ? "/images/white.jpg"
          : selectedLevel === 'level2'
            ? "/images/pink.jpg"
            : "/images/black.jpg"
      ],
      category: 'Blind Box',
      stock_status: 'in_stock',
      description: `Mystery Blind Box Set - ${selectedLevel}`,
      // Add blind box specific metadata
      blindBoxInfo: {
        level: selectedLevel,
        color: selectedLevel === 'level1' ? 'white' : selectedLevel === 'level2' ? 'pink' : 'black',
        quantity: multipleBoxesQuantity
      }
    };
    
    // Add to cart with the specified quantity
    addToCart(blindBoxProduct, multipleBoxesQuantity);
    setShowQuantityModal(false);
    
    // Navigate to cart
    navigate('/cart');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Quantity Selection Modal */}
      {showQuantityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold mb-4">Select Quantity</h3>
            <p className="text-gray-600 mb-4">How many boxes would you like to purchase?</p>
            
            <div className="flex items-center justify-center mb-6">
              <button 
                onClick={() => setMultipleBoxesQuantity(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 bg-gray-200 rounded-l-md hover:bg-gray-300"
              >
                -
              </button>
              <input 
                type="number" 
                min="1" 
                value={multipleBoxesQuantity} 
                onChange={(e) => setMultipleBoxesQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center py-2 border-t border-b border-gray-300"
              />
              <button 
                onClick={() => setMultipleBoxesQuantity(prev => prev + 1)}
                className="px-4 py-2 bg-gray-200 rounded-r-md hover:bg-gray-300"
              >
                +
              </button>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={() => setShowQuantityModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddMultipleBoxesToCart}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {/* Level selection - Simple horizontal line */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Select Level</h2>
        
        <div className="flex space-x-4">
          <button 
            onClick={() => handleLevelSelect('level1')}
            className={`px-6 py-2 rounded-md text-lg ${selectedLevel === 'level1' 
              ? 'bg-primary-500 text-white font-bold' 
              : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Level 1
          </button>
          
          <button 
            onClick={() => handleLevelSelect('level2')}
            className={`px-6 py-2 rounded-md text-lg ${selectedLevel === 'level2' 
              ? 'bg-primary-500 text-white font-bold' 
              : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Level 2
          </button>

          <button 
            onClick={() => handleLevelSelect('level3')}
            className={`px-6 py-2 rounded-md text-lg ${selectedLevel === 'level3' 
              ? 'bg-primary-500 text-white font-bold' 
              : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Level 3
          </button>
        </div>
      </div>

      {/* Surprise reveal modal */}
      <AnimatePresence>
        {revealedBox !== null && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setRevealedBox(null)}
          >
            <motion.div 
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 50 }}
              animate={{ y: 0 }}
            >
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <motion.div 
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <div className={`p-4 rounded-full ${revealedBox ? 
                      blindBoxes[revealedBox-1].rarity === 'common' ? 'bg-blue-100' :
                      blindBoxes[revealedBox-1].rarity === 'rare' ? 'bg-purple-100' :
                      blindBoxes[revealedBox-1].rarity === 'ultra-rare' ? 'bg-amber-100' : 'bg-pink-100'
                    : ''}`}>
                      <Sparkles className={`w-16 h-16 ${revealedBox ? 
                        blindBoxes[revealedBox-1].rarity === 'common' ? 'text-blue-500' :
                        blindBoxes[revealedBox-1].rarity === 'rare' ? 'text-purple-500' :
                        blindBoxes[revealedBox-1].rarity === 'ultra-rare' ? 'text-amber-500' : 'text-pink-500'
                      : ''}`} />
                    </div>
                  </motion.div>
                  <motion.div 
                    className="absolute -top-3 -right-3"
                    animate={{ 
                      rotate: [0, -10, 10, -10, 10, 0],
                      scale: [1, 1.1, 1, 1.1, 1]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      repeatDelay: 1
                    }}
                  >
                    {revealedBox && blindBoxes[revealedBox-1].rarity === 'secret' && (
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full">SECRET!</span>
                    )}
                  </motion.div>
                </div>
                
                <h3 className="text-xl font-bold mb-1">{revealedBox && blindBoxes[revealedBox-1].character}</h3>
                
                <div className="mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${revealedBox ? 
                    blindBoxes[revealedBox-1].rarity === 'common' ? 'bg-blue-100 text-blue-700' :
                    blindBoxes[revealedBox-1].rarity === 'rare' ? 'bg-purple-100 text-purple-700' :
                    blindBoxes[revealedBox-1].rarity === 'ultra-rare' ? 'bg-amber-100 text-amber-700' : 
                    'bg-pink-100 text-pink-700'
                  : ''}`}>
                    {revealedBox && blindBoxes[revealedBox-1].rarity?.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-6">You got {revealedBox && blindBoxes[revealedBox-1].character} from Box #{revealedBox}!</p>
                
                <button 
                  className="w-full py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all"
                  onClick={() => setRevealedBox(null)}
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side: Single large blind box */}
        <div className="w-full lg:w-2/3">
          <div className="flex justify-center items-center perspective-800 max-w-lg mx-auto">
            <motion.div
              key={currentBox.id}
              className={`w-96 h-96 cursor-pointer rounded-lg ${
                selectedBox === currentBox.id ? 'border-4 border-blue-500 p-1 bg-blue-50' : ''
              }`}
              onClick={() => handleBoxClick(currentBox.id)}
              initial="initial"
              animate={
                animatingBox === currentBox.id
                  ? 'shake'
                  : selectedBox === currentBox.id
                  ? 'selected'
                  : 'initial'
              }
              whileHover="hover"
              variants={boxVariants}
            >
              <div className="w-full h-full overflow-hidden rounded-md shadow-lg">
                <div className="w-full h-full flex items-center justify-center">
                  {revealedBox === currentBox.id ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center"
                    >
                      <Gift className="w-16 h-16 text-white" />
                    </motion.div>
                  ) : (
                    <img 
                      src={
                        selectedLevel === 'level1'
                          ? "/images/white.jpg"
                          : selectedLevel === 'level2'
                            ? "/images/pink.jpg"
                            : "/images/black.jpg"
                      }
                      alt="Blind Box" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm font-medium text-white">
                  <span>BLIND BOX</span>
                  {(revealedBox === currentBox.id || currentBox.rarity === 'secret') && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-1"
                    >
                      <Sparkles className="w-2 h-2" />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right side: Product information */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-2">{productName}</h2>
            <div className="text-sm text-gray-500 mb-2">
              Product ID: {selectedBox ? blindBoxes[selectedBox - 1].productId : 'Select a box'}
            </div>
            <div className="text-xl font-semibold text-primary-600 mb-4">{productPrice}</div>
            
            {/* Product Description */}
            <div className="mb-4 text-gray-700">
              <p>{productDescription}</p>
            </div>

            <div className="mb-6 p-3 bg-yellow-50 rounded-md text-sm">
              <p className="text-amber-800">
                <strong>Note:</strong> No duplicates if picking from the SAME SET.
              </p>
            </div>

            <div className="space-y-4">
              <motion.button
                onClick={handleShakeBox}
                disabled={selectedBox === null}
                className={`w-full py-3 px-4 rounded-full font-medium flex items-center justify-center gap-2 ${
                  selectedBox === null
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {animatingBox !== null ? (
                  <span className="flex items-center">
                    <motion.span
                      animate={{ rotate: [-10, 10, -10, 10, -5, 5, -5, 5, 0] }}
                      transition={{ duration: 0.8 }}
                    >
                      Shaking...
                    </motion.span>
                  </span>
                ) : (
                  'Pick One to Shake'
                )}
              </motion.button>
              
              {selectedBox !== null && (
                <motion.button 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full py-3 px-4 bg-red-600 text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-red-700"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBuyNow(selectedBox)}
                >
                  <ShoppingBag size={18} />
                  Buy It Now
                </motion.button>
              )}
              
              <button 
                onClick={handleMultipleBoxes}
                className="w-full py-3 px-4 bg-white border-2 border-primary-500 text-primary-500 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-primary-50"
              >
                <ShoppingBag size={18} />
                Buy Multiple Boxes
              </button>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <a 
                href="#" 
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
              >
               
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BlindBoxInterface;
