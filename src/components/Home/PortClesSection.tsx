import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product, supabase } from '../../lib/supabase';
import ProductCard from '../Product/ProductCard';

const PortClesSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPortCles = async () => {
      setIsLoading(true);
      try {
        // Try multiple approaches to find port-clés products
        
        // First attempt: Direct category match
        let { data: directCategoryProducts, error: directError } = await supabase
          .from('products')
          .select('*')
          .eq('category', 'PORT CLÉS')
          .limit(4);
        
        if (!directError && directCategoryProducts && directCategoryProducts.length > 0) {
          console.log('Found port-clés products via direct category match:', directCategoryProducts.length);
          setProducts(directCategoryProducts);
          setIsLoading(false);
          return;
        }
        
        // Second attempt: Try with accessories category and subcategory
        const { data: accessoriesCategory } = await supabase
          .from('categories')
          .select('id')
          .or('name.eq.ACCESSORIES,name.eq.Accessories,name.ilike.%accessories%')
          .limit(1);
        
        if (accessoriesCategory && accessoriesCategory.length > 0) {
          const categoryId = accessoriesCategory[0].id;
          console.log('Found accessories category ID:', categoryId);
          
          // Try different subcategory field names and values
          const subcategoryQueries = [
            { field: 'subcategory', value: 'PORT CLÉS' },
            { field: 'subcategory', value: 'Port-Clés' },
            { field: 'subcategory', value: 'Port Clés' },
            { field: 'sub_category', value: 'PORT CLÉS' },
            { field: 'product_type', value: 'PORT CLÉS' }
          ];
          
          for (const query of subcategoryQueries) {
            const { data: subcategoryProducts, error: subError } = await supabase
              .from('products')
              .select('*')
              .eq('category_id', categoryId)
              .eq(query.field, query.value)
              .limit(4);
            
            if (!subError && subcategoryProducts && subcategoryProducts.length > 0) {
              console.log(`Found port-clés products via ${query.field}=${query.value}:`, subcategoryProducts.length);
              setProducts(subcategoryProducts);
              setIsLoading(false);
              return;
            }
          }
        }
        
        // Third attempt: Try with name or description containing 'port-clés'
        const { data: nameSearchProducts, error: nameError } = await supabase
          .from('products')
          .select('*')
          .or('name.ilike.%port-clé%,name.ilike.%porte-clé%,description.ilike.%port-clé%')
          .limit(4);
        
        if (!nameError && nameSearchProducts && nameSearchProducts.length > 0) {
          console.log('Found port-clés products via name/description search:', nameSearchProducts.length);
          setProducts(nameSearchProducts);
          setIsLoading(false);
          return;
        }
        
        // If we get here, we couldn't find any products - use sample data
        console.log('No port-clés products found with any method, using sample data');
        
        // Sample port-clés products to display when none are found in the database
        const sampleProducts: Product[] = [
          {
            id: 'sample-portcle-1',
            name: 'PORTE-CLÉ 1',
            price: 35.00,
            original_price: 45.00,
            images: ['https://kwpgsqzgmimxodnkjsly.supabase.co/storage/v1/object/public/products/portcles/portcle1.jpg'],
            category: 'PORT CLÉS',
            stock_status: 'in_stock',
            description: 'Porte-clé Labubu bleu clair'
          },
          {
            id: 'sample-portcle-2',
            name: 'PORTE-CLÉ 2',
            price: 37.50,
            original_price: 47.50,
            images: ['https://kwpgsqzgmimxodnkjsly.supabase.co/storage/v1/object/public/products/portcles/portcle2.jpg'],
            category: 'PORT CLÉS',
            stock_status: 'in_stock',
            description: 'Porte-clé Labubu rose'
          },
          {
            id: 'sample-portcle-3',
            name: 'PORTE-CLÉ 3',
            price: 40.00,
            original_price: 50.00,
            images: ['https://kwpgsqzgmimxodnkjsly.supabase.co/storage/v1/object/public/products/portcles/portcle3.jpg'],
            category: 'PORT CLÉS',
            stock_status: 'in_stock',
            description: 'Porte-clé Labubu noir'
          },
          {
            id: 'sample-portcle-4',
            name: 'PORTE-CLÉ 6',
            price: 47.50,
            original_price: 57.50,
            images: ['https://kwpgsqzgmimxodnkjsly.supabase.co/storage/v1/object/public/products/portcles/portcle6.jpg'],
            category: 'PORT CLÉS',
            stock_status: 'in_stock',
            description: 'Set de porte-clés Labubu'
          }
        ];
        
        setProducts(sampleProducts);
      } catch (error) {
        console.error('Error loading port-clés products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPortCles();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-3">PORT CLÉS COLLECTION</h2>
            <p className="text-gray-600 max-w-2xl">
              Découvrez notre collection de porte-clés uniques
            </p>
          </div>
          <Link 
            to="/accessories?subcategory=port-cles" 
            className="mt-4 md:mt-0 px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-300 flex items-center group"
          >
            More 
            <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>

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
            viewport={{ once: true, margin: "-100px" }}
          >
            {products.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">No port-clés found.</p>
            ) : (
              products.map(product => (
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

export default PortClesSection;
