import React from 'react';
import { motion } from 'framer-motion';
import BlindBoxInterface from '../components/Product/BlindBoxInterface';

const BlindBoxPage: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 py-12"
    >
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Blind Box Collection</h1>
        <BlindBoxInterface />
        
        {/* Game Rules Section */}
        <div className="w-full mt-16 mb-16">
          <div className="bg-white w-full rounded-xl shadow-md">
            <div className="py-10">
              <h2 className="text-4xl font-bold text-center mb-12">GAME RULES</h2>
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Single Box */}
                  <div className="bg-gray-50 p-8 rounded-lg shadow-md flex flex-col items-center text-center">
                    <div className="w-64 h-64 mb-6 flex items-center justify-center">
                      <img 
                        src="/images/white.jpg" 
                        alt="Single Box" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder-box.png';
                        }}
                      />
                    </div>
                    <h3 className="text-3xl font-bold mb-2">SINGLE BLIND BOX</h3>
                    <h4 className="text-xl font-semibold mb-4">1 BOX, 1 SURPRISE FIGURE INSIDE!</h4>
                    <p className="text-gray-700">
                      Choose your box level and color — what's inside is a surprise!
                      Each box contains one randomly selected collectible figure from the series.
                      🎁 Every box comes with a certificate of authenticity and a small gift!
                    </p>
                  </div>
                  
                  {/* Box Sets */}
                  <div className="bg-gray-50 p-8 rounded-lg shadow-md flex flex-col items-center text-center">
                    <div className="w-64 h-64 mb-6 flex items-center justify-center">
                      <img 
                        src="/images/6boxs.png" 
                        alt="Box Sets" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder-box-set.png';
                        }}
                      />
                    </div>
                    <h3 className="text-3xl font-bold mb-2">BLIND BOX SET</h3>
                    <h4 className="text-xl font-semibold mb-4">COLLECTOR'S PACK – MULTIPLE BOXES
                    No duplicates from the same set!</h4>
                    <p className="text-gray-700 mb-4">
                      Buy multiple boxes at once and increase your chances of finding rare figures!
                      🎁 Special bonus items included with purchases of 6 or more boxes!
                    </p>
                    <div className="p-4 border-2 border-red-500 bg-red-50 rounded-lg mb-4">
                      <p className="text-red-800 font-medium">
                        <span className="font-bold text-red-900">Guarantee:</span> No duplicates when purchasing multiple boxes from the same set.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlindBoxPage;
