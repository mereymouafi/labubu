import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight, Sparkles, Gift } from 'lucide-react';

interface BlindBoxItem {
  id: number;
  name: string;
  productId: string;
  character?: string;
  rarity?: 'common' | 'rare' | 'ultra-rare' | 'secret';
}

const BlindBoxInterface: React.FC = () => {
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [animatingBox, setAnimatingBox] = useState<number | null>(null);
  const [revealedBox, setRevealedBox] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('level1');
  // Audio element reference for sound effects
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio element when component mounts
    audioRef.current = new Audio('/sounds/277672071-shake-box-8.m4a');
    
    // Clean up audio element on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  // Function to play shaking sound from the provided audio file
  const playShakeSound = () => {
    try {
      if (audioRef.current) {
        // Reset the audio to the beginning in case it was already played
        audioRef.current.currentTime = 0;
        // Play the sound
        audioRef.current.play().catch(error => {
          console.error('Error playing audio file:', error);
        });
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  // Mock data sets for different levels
  const createBlindBoxSet = (prefix: string, length: number): BlindBoxItem[] => {
    return Array.from({ length }, (_, i) => {
      // Assign random rarity to each box
      const rarities = ['common', 'common', 'common', 'common', 'rare', 'rare', 'ultra-rare', 'secret'] as const;
      const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
      const characters = ['Coco', 'Luna', 'Zephyr', 'Momo', 'Blitz', 'Nova', 'Pixel', 'Bubbles'];
      const randomChar = characters[Math.floor(Math.random() * characters.length)];
      
      return {
        id: i + 1,
        name: `${prefix} Box`,
        productId: `${prefix}-${(10000 + i).toString()}`,
        character: randomChar,
        rarity: randomRarity,
      };
    });
  };
  
  // Create sets for each level
  const level1Boxes = createBlindBoxSet('L1', 16); // Level 1 boxes
  const level2Boxes = createBlindBoxSet('L2', 16); // Level 2 boxes
  
  // Get the appropriate boxes based on selected level
  const getBoxesForLevel = (level: string): BlindBoxItem[] => {
    switch (level) {
      case 'level1': return level1Boxes;
      case 'level2': return level2Boxes;
      default: return level1Boxes;
    }
  };
  
  // Current blind boxes based on selected level
  const blindBoxes = getBoxesForLevel(selectedLevel);

  // Product information based on selected level
  const getProductInfo = (level: string) => {
    switch (level) {
      case 'level1':
        return {
          name: 'HACIPUPU Level 1 Series',
          price: '$15.99'
        };
      case 'level2':
        return {
          name: 'HACIPUPU Level 2 Premium Series',
          price: '$19.99'
        };
      default:
        return {
          name: 'HACIPUPU Rolling Time Machine Series',
          price: '$15.99'
        };
    }
  };
  
  // Get current product info based on selected level
  const { name: productName, price: productPrice } = getProductInfo(selectedLevel);

  const handleBoxClick = (id: number) => {
    setSelectedBox(id);
    
    // Play sound when a box is clicked
    playShakeSound();
    
    // Start shaking the box when clicked
    setAnimatingBox(id);
    
    // Stop shaking after animation completes
    setTimeout(() => {
      setAnimatingBox(null);
    }, 800); // Match the shake animation duration
  };

  const handleShakeBox = () => {
    if (selectedBox !== null) {
      setAnimatingBox(selectedBox);
      setRevealedBox(null);
      playShakeSound(); // Play the shaking sound
      
      // After shake animation completes, reveal the surprise
      setTimeout(() => {
        setAnimatingBox(null);
        setRevealedBox(selectedBox);
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
    // Reset selections when changing levels
    setSelectedBox(null);
    setRevealedBox(null);
    setAnimatingBox(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
        {/* Left side: Grid of blind boxes */}
        <div className="w-full lg:w-2/3">
          <div className="grid grid-cols-4 gap-2 perspective-800 max-w-lg mx-auto">
            {blindBoxes.map((box) => (
              <motion.div
                key={box.id}
                className={`aspect-square cursor-pointer rounded-lg ${
                  selectedBox === box.id ? 'border-4 border-blue-500 p-1 bg-blue-50' : ''
                }`}
                onClick={() => handleBoxClick(box.id)}
                initial="initial"
                animate={
                  animatingBox === box.id
                    ? 'shake'
                    : selectedBox === box.id
                    ? 'selected'
                    : 'initial'
                }
                whileHover="hover"
                variants={boxVariants}
              >
                <div className="w-full h-full overflow-hidden rounded-md shadow-sm">
                  <div className="w-full h-full flex items-center justify-center">
                    {revealedBox === box.id ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-center"
                      >
                        <Gift className="w-6 h-6 text-white" />
                      </motion.div>
                    ) : (
                      <img 
                        src="/images/blind-box-custom.png" 
                        alt="Blind Box" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex items-center text-[10px] font-medium text-white mt-0.5">
                    <span>#{box.id}</span>
                    {(revealedBox === box.id || box.rarity === 'secret') && (
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
            ))}
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
            <div className="text-xl font-semibold text-primary-600 mb-6">{productPrice}</div>

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
              
              <button className="w-full py-3 px-4 bg-white border-2 border-primary-500 text-primary-500 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-primary-50">
                <ShoppingBag size={18} />
                Buy Multiple Boxes
              </button>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <a 
                href="#" 
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
              >
                Explore More Series
                <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BlindBoxInterface;
