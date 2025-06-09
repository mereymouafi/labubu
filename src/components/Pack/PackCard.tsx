import React from 'react';
import { Link } from 'react-router-dom';
import { Pack } from '../../lib/supabase';

interface PackCardProps {
  pack: Pack;
}

const PackCard: React.FC<PackCardProps> = ({ pack }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <Link to={`/figurings/pack/${pack.id}`} className="block">
        {pack.images && pack.images.length > 0 ? (
          <div className="relative h-64 overflow-hidden">
            <img
              src={pack.images[0]}
              alt={pack.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-3 py-1 m-2 rounded-full">
              Pack #{pack.number}
            </div>
          </div>
        ) : (
          <div className="h-64 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{pack.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{pack.description}</p>
          <div className="mt-3">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              View Collection
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PackCard;
