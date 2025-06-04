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
      </div>
    </motion.div>
  );
};

export default BlindBoxPage;
