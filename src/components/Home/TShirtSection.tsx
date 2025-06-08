import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTShirtOptions, TShirtOption } from '../../lib/supabase';

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
              <Link
                key={option.id}
                to={`/t-shirt/${option.id}`}
                className="group transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow" style={{ backgroundColor: option.bgColor || '#ffffff' }}>
                  <div className="relative aspect-square overflow-hidden">
                    {option.image_urls && option.image_urls.length > 0 ? (
                      <img
                        src={formatImageUrl(option.image_urls[0])}
                        alt={option.option_name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-sm font-medium mb-2 line-clamp-2">{option.option_name}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{option.option_description}</p>
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
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TShirtSection;
