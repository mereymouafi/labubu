import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, Category } from '../../lib/supabase';

// Format Supabase image URL properly
const formatImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return '';
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  const supabaseProjectUrl = import.meta.env.VITE_SUPABASE_URL;
  return `https://${supabaseProjectUrl}/storage/v1/object/public/${imageUrl}`;
};

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.slug}`}
              className="group flex flex-col items-center transition-all duration-300 hover:transform hover:-translate-y-2 bg-white p-4 rounded-lg shadow-sm hover:shadow-md"
            >
              <div className="relative w-full aspect-square overflow-hidden mb-4 bg-gray-100 rounded-lg">
                {category.image ? (
                  <img
                    src={formatImageUrl(category.image)}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      console.error(`Error loading image: ${category.image}`);
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(category.name);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-xl font-bold">{category.name[0]}</span>
                  </div>
                )}
              </div>
              <h3 className="text-center text-base font-medium uppercase tracking-wide">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-center text-sm text-gray-500 mt-2 line-clamp-2">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesGrid;
