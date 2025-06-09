import React, { useEffect, useState } from 'react';
import { useParams, Routes, Route, useNavigate } from 'react-router-dom';
import { Product, Pack, supabase, fetchPacks, fetchProductsByPack } from '../lib/supabase';
import ProductCard from '../components/Product/ProductCard';
import PackCard from '../components/Pack/PackCard';

// Component to display products in a specific pack
const PackProducts: React.FC = () => {
  const { packId } = useParams<{ packId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [pack, setPack] = useState<Pack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPackProducts = async () => {
      if (!packId) {
        console.error('No packId provided');
        return;
      }
      
      console.log('Loading products for pack ID:', packId);
      setIsLoading(true);
      
      try {
        // Fetch the pack details
        const { data: packData, error: packError } = await supabase
          .from('pack')
          .select('*')
          .eq('id', packId)
          .single();
        
        console.log('Pack query result:', { packData, packError });
        
        if (packError) {
          console.error('Error fetching pack:', packError);
          return;
        }
        
        if (!packData) {
          console.error('Pack not found with ID:', packId);
          return;
        }
        
        setPack(packData);
        
        // Directly query the product_packs table to see what's in there
        const { data: directPackData, error: directPackError } = await supabase
          .from('product_packs')
          .select('*')
          .eq('pack_id', packId);
          
        console.log('Direct product_packs query:', { directPackData, directPackError });
        
        // Fetch products associated with this pack
        const productsData = await fetchProductsByPack(packId);
        console.log('Products returned from fetchProductsByPack:', productsData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading pack products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPackProducts();
  }, [packId]);

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Loading products...</p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <button 
              onClick={() => navigate('/figurings')} 
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Packs
            </button>
            
            {pack && (
              <>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {pack.title}
                </h1>
                <p className="text-gray-600 mt-2">
                  {pack.description}
                </p>
              </>
            )}
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No products found in this pack.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Main Figurines Page component
const FiguringsPage: React.FC = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPacks = async () => {
      setIsLoading(true);
      try {
        // Fetch all packs
        const packsData = await fetchPacks();
        setPacks(packsData);
      } catch (error) {
        console.error('Error loading packs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPacks();
  }, []);

  return (
    <Routes>
      <Route path="/" element={
        <div className="container mx-auto px-4 py-8 mt-24">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-gray-500">Loading figurines...</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Figurines Collection
                </h1>
                <p className="text-gray-600 mt-2">
                  Browse our collection of Labubu figurines and collectibles
                </p>
              </div>

              {/* Display Packs Section */}
              {packs.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Figurine Packs</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {packs.map(pack => (
                      <PackCard key={pack.id} pack={pack} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">No packs found. Check back soon for our latest collection!</p>
                </div>
              )}
            </>
          )}
        </div>
      } />
      <Route path="/pack/:packId" element={<PackProducts />} />
    </Routes>
  );
};

export default FiguringsPage;
