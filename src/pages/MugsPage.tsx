import React, { useEffect, useState } from 'react';
import { Product, supabase } from '../lib/supabase';
import ProductCard from '../components/Product/ProductCard';

const MugsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMugs = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching mug products by category_id');
        
        // Get the category ID for "Mugs"
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('name', 'Mugs')
          .single();
        
        if (categoryData?.id) {
          console.log('Found Mugs category ID:', categoryData.id);
          
          // Fetch products with that category_id
          const { data: productsData, error } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', categoryData.id);
          
          if (!error && productsData) {
            console.log('Found products:', productsData.length);
            setProducts(productsData);
          } else if (error) {
            console.error('Error fetching products:', error);
          }
        } else {
          console.error('Mugs category not found');
        }
      } catch (error) {
        console.error('Error loading mug products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMugs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Loading mugs...</p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Mugs Collection
            </h1>
            <p className="text-gray-600 mt-2">
              Discover our unique collection of mugs featuring your favorite characters and designs
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No mugs found. Check back soon for our latest collection!</p>
              <p className="text-sm text-gray-400 mt-2">
                Make sure you have products with the category_id linked to the Mugs category.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MugsPage;
