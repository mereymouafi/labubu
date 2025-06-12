import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product, supabase } from '../../lib/supabase';
import ProductCard from '../Product/ProductCard';

const PochettesSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneModels, setPhoneModels] = useState<string[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string>('');

  useEffect(() => {
    const loadPochettes = async () => {
      setIsLoading(true);
      try {
        // Attempt 1: category equals POCHETTES
        let { data: pochetteProducts, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', 'POCHETTES')
          .limit(4);

        if (!error && pochetteProducts && pochetteProducts.length > 0) {
          setProducts(pochetteProducts);
          setFilteredProducts(pochetteProducts);
          extractPhoneModels(pochetteProducts);
          return;
        }

        // Attempt 2: accessories with subcategory = POCHETTES
        const { data: accessoriesCategory } = await supabase
          .from('categories')
          .select('id')
          .or('name.eq.ACCESSORIES,name.ilike.%accessories%')
          .limit(1);

        if (accessoriesCategory && accessoriesCategory.length > 0) {
          const categoryId = accessoriesCategory[0].id;
          const { data: subProducts } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', categoryId)
            .or('subcategory.eq.POCHETTES,sub_category.eq.POCHETTES,product_type.eq.POCHETTES')
            .limit(4);
          if (subProducts && subProducts.length > 0) {
            setProducts(subProducts);
            setFilteredProducts(subProducts);
            extractPhoneModels(subProducts);
            return;
          }
        }

        // Attempt 3: name/description search
        const { data: nameSearch } = await supabase
          .from('products')
          .select('*')
          .or('name.ilike.%pochette%,description.ilike.%pochette%')
          .limit(4);
        if (nameSearch && nameSearch.length > 0) {
          setProducts(nameSearch);
          setFilteredProducts(nameSearch);
          extractPhoneModels(nameSearch);
          return;
        }

        // Fallback sample data
        const sample: Product[] = [
          {
            id: 'sample-pochette-1',
            name: 'POCHETTE 1',
            price: 80,
            original_price: 90,
            images: ['https://via.placeholder.com/300x400?text=POCHETTE+1'],
            category: 'POCHETTES',
            stock_status: 'in_stock',
            description: 'Pochette Labubu 1',
            phone: 'iPhone 14 Pro'
          },
          {
            id: 'sample-pochette-2',
            name: 'POCHETTE 2',
            price: 83,
            original_price: 93,
            images: ['https://via.placeholder.com/300x400?text=POCHETTE+2'],
            category: 'POCHETTES',
            stock_status: 'in_stock',
            description: 'Pochette Labubu 2',
            phone: 'iPhone 13'
          },
          {
            id: 'sample-pochette-3',
            name: 'POCHETTE 3',
            price: 87,
            original_price: 97,
            images: ['https://via.placeholder.com/300x400?text=POCHETTE+3'],
            category: 'POCHETTES',
            stock_status: 'in_stock',
            description: 'Pochette Labubu 3',
            phone: 'Samsung Galaxy S22'
          },
          {
            id: 'sample-pochette-4',
            name: 'POCHETTE 4',
            price: 89,
            original_price: 99,
            images: ['https://via.placeholder.com/300x400?text=POCHETTE+4'],
            category: 'POCHETTES',
            stock_status: 'in_stock',
            description: 'Pochette Labubu 4',
            phone: 'Samsung Galaxy S23'
          }
        ];
        setProducts(sample);
        setFilteredProducts(sample);
        extractPhoneModels(sample);
      } catch (e) {
        console.error('Error loading pochettes:', e);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPochettes();
  }, []);
  
  // Extract unique phone models from products
  const extractPhoneModels = (products: Product[]) => {
    const phones = products
      .map(product => product.phone)
      .filter((phone, index, self) => 
        phone && self.indexOf(phone) === index
      ) as string[];
    
    setPhoneModels(phones);
  };
  
  // Filter products when phone selection changes
  useEffect(() => {
    if (selectedPhone) {
      setFilteredProducts(products.filter(product => product.phone === selectedPhone));
    } else {
      setFilteredProducts(products);
    }
  }, [selectedPhone, products]);

  // Handle phone selection change
  const handlePhoneChange = (phone: string) => {
    setSelectedPhone(phone === selectedPhone ? '' : phone);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-3">POCHETTES COLLECTION</h2>
            <p className="text-gray-600 max-w-2xl">Browse our collection of stylish Labubu pouches and bags</p>
          </div>
          <Link
            to="/accessories?subcategory=pochettes"
            className="mt-4 md:mt-0 px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-300 flex items-center group"
          >
            More <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>
        
        {/* Phone model selector - Hidden as requested */}
        {false && phoneModels.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              SELECT YOUR PHONE MODEL
            </h3>
            <div className="flex flex-wrap gap-2">
              {phoneModels.map(phone => (
                <button
                  key={phone}
                  onClick={() => handlePhoneChange(phone)}
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

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {filteredProducts.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                {selectedPhone 
                  ? `No pochettes found for ${selectedPhone}. Please select a different phone model.` 
                  : 'No pochettes found.'}
              </p>
            ) : (
              filteredProducts.map(product => (
                <motion.div key={product.id} variants={itemVariants} className="transform transition-all duration-300 hover:-translate-y-2">
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <ProductCard product={product} />
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PochettesSection;
