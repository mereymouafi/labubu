import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface TShirtCategoryCardProps {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  bgColor?: string;
}

const TShirtCategoryCard: React.FC<TShirtCategoryCardProps> = ({
  id,
  name,
  description,
  imageUrl,
  bgColor = '#ffffff'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tshirt/${id}`);
  };

  return (
    <motion.div 
      className="group cursor-pointer"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
    >
      <div className="h-full rounded-lg overflow-hidden shadow-md">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden" style={{ backgroundColor: bgColor }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-xl font-bold">{name}</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 bg-white">
          <h3 className="text-lg font-medium mb-1">{name}</h3>
          {description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-red-600">
              Customize Now
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TShirtCategoryCard;
