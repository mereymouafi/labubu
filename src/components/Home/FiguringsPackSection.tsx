import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pack, fetchPacks } from '../../lib/supabase';
import PackCard from '../Pack/PackCard';

const FiguringsPackSection: React.FC = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPacks = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPacks();
        setPacks(data);
      } catch (error) {
        console.error('Error loading packs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPacks();
  }, []);

  if (isLoading || packs.length === 0) {
    return null; // Don't render the section if nothing to show yet
  }

  // Limit packs displayed on home (e.g., first 4)
  const packsToDisplay = packs.slice(0, 4);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-3">FIGURINE PACKS</h2>
            <p className="text-gray-600 max-w-2xl">Discover our curated Labubu figurine bundles</p>
          </div>
          <Link 
            to="/figurings" 
            className="mt-4 md:mt-0 px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-300 flex items-center group"
          >
            More <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {packsToDisplay.map((pack) => (
            <div key={pack.id} className="transform transition-all duration-300 hover:-translate-y-2">
              <PackCard pack={pack} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FiguringsPackSection;
