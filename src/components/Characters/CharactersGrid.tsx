import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCharacters, Character } from '../../lib/supabase';

// Format Supabase image URL properly
const formatImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return '';
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  const supabaseProjectUrl = import.meta.env.VITE_SUPABASE_URL;
  return `https://${supabaseProjectUrl}/storage/v1/object/public/${imageUrl}`;
};

const CharactersGrid: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCharacters = async () => {
      setIsLoading(true);
      try {
        const charactersData = await fetchCharacters();
        setCharacters(charactersData);
      } catch (error) {
        console.error('Error loading characters:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCharacters();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-lg text-gray-500">Loading characters...</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 md:px-6 lg:px-8 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {characters.map((character) => (
            <Link
              key={character.id}
              to={`/characters/${character.slug}`}
              className="group flex flex-col items-center transition-all duration-300 hover:transform hover:-translate-y-2 bg-white p-3 rounded-lg shadow-sm hover:shadow-md"
            >
              <div className="relative w-full aspect-square overflow-hidden mb-3 bg-gray-100 rounded-lg">
                {character.image ? (
                  <img
                    src={formatImageUrl(character.image)}
                    alt={character.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      console.error(`Error loading image: ${character.image}`);
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/120x80?text=' + encodeURIComponent(character.name);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-sm font-bold">{character.name[0]}</span>
                  </div>
                )}
              </div>
              <h3 className="text-center text-sm font-medium uppercase tracking-wide">
                {character.name}
              </h3>
              {character.description && (
                <p className="text-center text-xs text-gray-500 mt-1 line-clamp-2">
                  {character.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharactersGrid;
