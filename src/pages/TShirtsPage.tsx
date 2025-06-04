import React from 'react';
import { motion } from 'framer-motion';
import TShirtBanner from '../components/Product/TShirtBanner';

const TShirtsPage: React.FC = () => {
  // T-shirt styles data for the banner
  const tshirtStyles = [
    {
      id: 1,
      name: "Crop Top",
      description: "Above the waistline, often paired with high-waisted pants",
      bgColor: "#ff6b6b"
    },
    {
      id: 2,
      name: "Oversized T-shirt",
      description: "Larger and longer than standard fit, often unisex",
      bgColor: "#4d96ff"
    },
    {
      id: 3,
      name: "Boxy Fit",
      description: "Straight-cut with a square shape, no waist taper",
      bgColor: "#6b66ff"
    },
    {
      id: 4,
      name: "Drop Shoulder Tee",
      description: "Seam falls below shoulder, gives a relaxed look",
      bgColor: "#38b000"
    },
    {
      id: 5,
      name: "Boyfriend Fit",
      description: "Like oversized but for women (styled like a men's shirt)",
      bgColor: "#ff7b00"
    },
    {
      id: 6,
      name: "Standard Fit / Classic Cut",
      description: "Normal unisex shape, not tight, not loose",
      bgColor: "#9d4edd"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Full-width banner style carousel */}
      <TShirtBanner styles={tshirtStyles} />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">T-Shirt Styles</h1>
        <p className="text-lg text-center mb-10 max-w-3xl mx-auto">
          Explore our diverse range of t-shirt styles, each designed for different fits and occasions.
        </p>
        
        {/* T-shirt styles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {tshirtStyles.map(style => (
            <motion.div 
              key={style.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg"
            >
              <div 
                className="h-64 flex items-center justify-center text-white text-xl font-bold" 
                style={{ backgroundColor: style.bgColor }}
              >
                {style.name}
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">{style.name}</h3>
                <p className="text-gray-600 mb-4">{style.description}</p>
                <button className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md transition-colors">
                  View Collection
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TShirtsPage;
