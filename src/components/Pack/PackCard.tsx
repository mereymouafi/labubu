import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pack, Product, fetchProductsByPack } from '../../lib/supabase';

interface PackCardProps {
  pack: Pack;
}

const PackCard: React.FC<PackCardProps> = ({ pack }) => {
  const [firstProduct, setFirstProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch the first product in the pack to link directly to it
    const loadFirstProduct = async () => {
      try {
        const products = await fetchProductsByPack(pack.id);
        if (products && products.length > 0) {
          setFirstProduct(products[0]);
        }
      } catch (error) {
        console.error('Error loading first product:', error);
      }
    };
    
    loadFirstProduct();
  }, [pack.id]);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (firstProduct) {
      // Navigate directly to the product detail page
      navigate(`/product/${firstProduct.id}`);
    } else {
      // Fallback to the pack page if no products are found
      navigate(`/figurings/pack/${pack.id}`);
    }
  };
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <Link to={firstProduct ? `/product/${firstProduct.id}` : `/figurings/pack/${pack.id}`} className="block" onClick={handleClick}>
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
              View Product
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PackCard;
