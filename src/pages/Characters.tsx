import React from 'react';
import { motion } from 'framer-motion';
import CharactersGrid from '../components/Characters/CharactersGrid';

const Characters: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 mt-20"
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">CHARACTERS</h1>
      <CharactersGrid />
    </motion.div>
  );
};

export default Characters;
