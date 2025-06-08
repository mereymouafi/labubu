import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AccessoriesPage: React.FC = () => {
  // Accessories categories
  const accessoriesCategories = [
    {
      name: 'Mugs',
      path: '/mugs',
      description: 'Discover our unique collection of mugs featuring your favorite characters',
      image: '/images/mugs.jpg'
    },
    {
      name: 'Port Clés',
      path: '/port-cles',
      description: 'Explore our collection of keychains with cute Labubu characters',
      image: '/images/port cle.jpg'
    },
    {
      name: 'Pochettes',
      path: '/accessories/pochettes',
      description: 'Stylish pouches and bags featuring Labubu designs',
      image: '' // Using figurings image as placeholder for pochettes
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Accessories Collection
        </h1>
        <p className="text-gray-600 mt-2">
          Browse our collection of Labubu accessories and collectibles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {accessoriesCategories.map((category) => (
          <motion.div
            key={category.name}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <Link to={category.path} className="block">
              <div className="aspect-w-16 aspect-h-9">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
                <p className="text-gray-600">{category.description}</p>
                <div className="mt-4 flex justify-center">
                  <span className="inline-block bg-labubumaroc-red text-white px-4 py-2 rounded-md font-medium">
                    View Collection
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AccessoriesPage;
