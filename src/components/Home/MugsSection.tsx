import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product, supabase } from '../../lib/supabase';
import ProductCard from '../Product/ProductCard';

const MugsSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMugs = async () => {
      setIsLoading(true);
      try {
        // Attempt 1: category equals MUGS
        let { data: mugsProducts, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', 'MUGS')
          .limit(4);

        if (!error && mugsProducts && mugsProducts.length > 0) {
          setProducts(mugsProducts);
          return;
        }

        // Attempt 2: search by subcategory or type
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
            .or('subcategory.eq.MUGS,sub_category.eq.MUGS,product_type.eq.MUGS')
            .limit(4);
          if (subProducts && subProducts.length > 0) {
            setProducts(subProducts);
            return;
          }
        }

        // Attempt 3: name/description search
        const { data: nameSearch } = await supabase
          .from('products')
          .select('*')
          .or('name.ilike.%mug%,description.ilike.%mug%')
          .limit(4);
        if (nameSearch && nameSearch.length > 0) {
          setProducts(nameSearch);
          return;
        }

        // Fallback sample data
        const sample: Product[] = [
          {
            id: 'sample-mug-1',
            name: 'MUG 7',
            price: 80.00,
            original_price: 90.00,
            images: ['https://kwpgsqzgmimxodnkjsly.supabase.co/storage/v1/object/public/products/mugs/mug7.jpg'],
            category: 'MUGS',
            stock_status: 'in_stock',
            description: 'Mug Labubu brown'
          },
          {
            id: 'sample-mug-2',
            name: 'MUG 11',
            price: 90.00,
            original_price: 100.00,
            images: ['https://kwpgsqzgmimxodnkjsly.supabase.co/storage/v1/object/public/products/mugs/mug11.jpg'],
            category: 'MUGS',
            stock_status: 'in_stock',
            description: 'Mug Labubu mint'
          },
          {
            id: 'sample-mug-3',
            name: 'MUG 14',
            price: 97.50,
            original_price: 107.50,
            images: ['https://kwpgsqzgmimxodnkjsly.supabase.co/storage/v1/object/public/products/mugs/mug14.jpg'],
            category: 'MUGS',
            stock_status: 'in_stock',
            description: 'Mug Labubu beige'
          },
          {
            id: 'sample-mug-4',
            name: 'MUG 16',
            price: 102.50,
            original_price: 112.50,
            images: ['https://kwpgsqzgmimxodnkjsly.supabase.co/storage/v1/object/public/products/mugs/mug16.jpg'],
            category: 'MUGS',
            stock_status: 'in_stock',
            description: 'Mug Labubu collection'
          }
        ];
        setProducts(sample);
      } catch (e) {
        console.error('Error loading mugs:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadMugs();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-3">MUGS COLLECTION</h2>
            <p className="text-gray-600 max-w-2xl">Discover our unique collection of mugs featuring your favorite characters</p>
          </div>
          <Link
            to="/accessories?subcategory=mugs"
            className="mt-4 md:mt-0 px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-300 flex items-center group"
          >
            More <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
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
            viewport={{ once: true, margin: '-100px' }}
          >
            {products.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">No mugs found.</p>
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

export default MugsSection;
