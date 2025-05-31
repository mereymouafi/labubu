import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, Category } from '../../lib/supabase';

const CategoriesGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-lg text-gray-500">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-8 lg:px-16 bg-white">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 uppercase tracking-wider">Shop By Category</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.slug}`}
              className="group flex flex-col items-center transition-all duration-300 hover:transform hover:-translate-y-1"
            >
              <div className="relative w-full aspect-square overflow-hidden mb-4 bg-gray-100 rounded-lg">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-lg">{category.name[0]}</span>
                  </div>
                )}
              </div>
              <h3 className="text-center text-sm font-medium uppercase tracking-wide">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesGrid;
