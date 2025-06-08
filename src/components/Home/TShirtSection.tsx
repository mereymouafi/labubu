import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTShirtOptions, TShirtOption } from '../../lib/supabase';
import TShirtCategoryCard from '../Product/TShirtCategoryCard';

// Format Supabase image URL properly
const formatImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return '';
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  const supabaseProjectUrl = import.meta.env.VITE_SUPABASE_URL;
  return `https://${supabaseProjectUrl}/storage/v1/object/public/${imageUrl}`;
};

const TShirtSection: React.FC = () => {
  const [tshirtOptions, setTshirtOptions] = useState<TShirtOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTShirtOptions = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTShirtOptions();
        setTshirtOptions(data);
      } catch (error) {
        console.error('Error loading T-shirt options:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTShirtOptions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-lg text-gray-500">Loading T-shirts...</p>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-600">T-SHIRTS</h2>
          <Link to="/t-shirts" className="text-sm text-gray-600 hover:text-gray-900">
            More &gt;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tshirtOptions.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No T-shirt options found.</p>
          ) : (
            tshirtOptions.map((option) => (
              <TShirtCategoryCard
                key={option.id}
                id={option.id}
                name={option.option_name}
                description={option.option_description}
                imageUrl={option.image_urls && option.image_urls.length > 0 ? formatImageUrl(option.image_urls[0]) : undefined}
                bgColor={option.bgColor}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TShirtSection;
