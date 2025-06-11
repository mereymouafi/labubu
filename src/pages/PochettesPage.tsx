import React, { useEffect, useState } from 'react';
import { Product, supabase } from '../lib/supabase';
import ProductCard from '../components/Product/ProductCard';
import { Spinner } from '../components/UI/Spinner';
import '../styles/pochette.css';

const PochettesPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneModels, setPhoneModels] = useState<string[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string>('');

  useEffect(() => {
    const loadPochettes = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching pochette products by category_id');
        
        // Get the category ID for "Pochette" (singular)
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('name', 'Pochette')
          .single();
        
        if (categoryData?.id) {
          console.log('Found Pochettes category ID:', categoryData.id);
          
          // Fetch products with that category_id
          const { data: productsData, error } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', categoryData.id);
          
          if (!error && productsData) {
            console.log('Found products:', productsData.length);
            // Transform the data to match the Product type
            const formattedProducts: Product[] = productsData.map(product => ({
              ...product,
              category: 'Pochette', // Set the category name
              stock_status: product.stock_status || 'in_stock' // Provide default stock status if missing
            }));
            setProducts(formattedProducts);
            setFilteredProducts(formattedProducts);
            
            // Extract unique phone models
            const phones = formattedProducts
              .map(product => product.phone)
              .filter((phone, index, self) => 
                phone && self.indexOf(phone) === index
              ) as string[];
            
            setPhoneModels(phones);
          } else if (error) {
            console.error('Error fetching products:', error);
          }
        } else {
          console.error('Pochette category not found');
        }
      } catch (error) {
        console.error('Error loading pochette products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPochettes();
  }, []);

  // Filter products when phone selection changes
  useEffect(() => {
    if (selectedPhone) {
      setFilteredProducts(products.filter(product => product.phone === selectedPhone));
    } else {
      setFilteredProducts(products);
    }
  }, [selectedPhone, products]);

  // Handle phone selection change
  const handlePhoneSelect = (phone: string) => {
    setSelectedPhone(phone === selectedPhone ? '' : phone);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
          <p className="text-lg text-gray-500 ml-3">Loading pochettes...</p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Pochettes Collection
            </h1>
            <p className="text-gray-600 mt-2">
              Browse our collection of stylish Labubu pouches and bags
            </p>
            
            {/* Phone model selector - As buttons */}
            {phoneModels.length > 0 && (
              <div className="mt-6 mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  SELECT YOUR PHONE MODEL
                </h3>
                <div className="flex flex-wrap gap-2">
                  {phoneModels.map(phone => (
                    <button
                      key={phone}
                      onClick={() => handlePhoneSelect(phone)}
                      className={`py-1 px-3 text-xs border rounded-md transition-colors ${
                        selectedPhone === phone
                          ? 'border-primary-500 bg-primary-500 text-white font-medium'
                          : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'
                      }`}
                    >
                      {phone}
                    </button>
                  ))}
                  {selectedPhone && (
                    <button
                      onClick={() => setSelectedPhone('')}
                      className="py-1 px-3 text-xs border rounded-md border-gray-300 hover:border-primary-500 hover:bg-primary-50"
                    >
                      Show All
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8">
              {filteredProducts.map(product => (
                <div className="pochette-card" key={product.id}>
                  <ProductCard key={product.id} product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">
                {selectedPhone 
                  ? `No pochettes found for ${selectedPhone}. Please select a different phone model.` 
                  : 'No pochettes found. Check back soon for our latest collection!'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {!selectedPhone && 'Make sure you have products with the category_id linked to the Pochette category.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PochettesPage;
