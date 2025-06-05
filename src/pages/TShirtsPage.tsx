import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TShirtBanner from '../components/Product/TShirtBanner';

const TShirtsPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Function to handle style selection
  const handleChooseStyle = (styleId: number) => {
    // Navigate to t-shirt product details page with the style ID
    navigate(`/t-shirts/${styleId}`);
  };
  // T-shirt styles data for the banner
  const tshirtStyles = [
    {
      id: 1,
      name: "Special T-shirts",
      description: "Unique designs for special occasions and celebrations",
      bgColor: "#ff6b6b"
    },
    {
      id: 2,
      name: "Illustrated T-shirts",
      description: "Artistic graphics and detailed illustrations on premium fabric",
      bgColor: "#4d96ff"
    },
    {
      id: 3,
      name: "Big into Energy",
      description: "Bold statements and vibrant colors for expressive style",
      bgColor: "#50c878"
    },
    {
      id: 4,
      name: "Macaron",
      description: "Soft pastels and delicate designs for a sweet aesthetic",
      bgColor: "#ffb6c1"
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
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-10 mb-16 max-w-6xl mx-auto">
          {tshirtStyles.map(style => (
            <motion.div 
              key={style.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg w-full md:w-[500px] lg:w-[550px]"
            >
              <div 
                className="h-80 flex items-center justify-center text-white text-2xl font-bold" 
                style={{ backgroundColor: style.bgColor }}
              >
                {style.name}
              </div>
              <div className="p-5">
                <h3 className="text-2xl font-bold mb-3">{style.name}</h3>
                <p className="text-gray-600 text-lg mb-6">{style.description}</p>
                <button 
                  onClick={() => handleChooseStyle(style.id)}
                  className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-medium text-lg rounded-md transition-colors"
                >
                  Choose this style
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
