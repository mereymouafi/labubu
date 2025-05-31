import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Product, Collection, fetchProducts, fetchCollections } from '../lib/supabase';
import ProductCard from '../components/Product/ProductCard';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    collection: '',
    showSale: false,
    showNew: false
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))];

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load collections
        const collectionsData = await fetchCollections();
        setCollections(collectionsData);
        
        // Load all products
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading shop data:', error);
        // Add fallback data if needed
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters to products
  const filteredProducts = products.filter(product => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.collection && product.collection !== filters.collection) return false;
    if (filters.showSale && !product.is_on_sale) return false;
    if (filters.showNew && !product.is_new) return false;
    return true;
  });

  const resetFilters = () => {
    setFilters({
      category: '',
      collection: '',
      showSale: false,
      showNew: false
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div>
      {/* Shop Header */}
      <div className="bg-primary-900 py-32 px-4">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">Shop Labubu</h1>
          <p className="text-primary-100 text-center mt-4 max-w-2xl mx-auto">
            Browse our collection of Labubu figurines and accessories
          </p>
        </div>
      </div>

      {/* Shop Content */}
      <div className="container-custom py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full py-2 px-4 bg-gray-100 rounded-lg flex items-center justify-center gap-2"
            >
              <Filter size={20} />
              <span>{isFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          </div>

          {/* Filters Sidebar */}
          <div
            className={`lg:w-1/4 ${
              isFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                {Object.values(filters).some(v => v !== '' && v !== false) && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center gap-1"
                  >
                    <X size={14} /> Clear All
                  </button>
                )}
              </div>

              {/* Categories Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-800">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category}
                        onChange={() => setFilters({...filters, category})}
                        className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                      />
                      <span className="ml-2 text-gray-700">{category}</span>
                    </label>
                  ))}
                  {filters.category && (
                    <button
                      onClick={() => setFilters({...filters, category: ''})}
                      className="text-xs text-primary-600 hover:text-primary-800 flex items-center gap-1 mt-1"
                    >
                      <X size={12} /> Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Collections Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-800">Collections</h3>
                <div className="space-y-2">
                  {collections.map(collection => (
                    <label key={collection.id} className="flex items-center">
                      <input
                        type="radio"
                        name="collection"
                        checked={filters.collection === collection.name}
                        onChange={() => setFilters({...filters, collection: collection.name})}
                        className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                      />
                      <span className="ml-2 text-gray-700">{collection.name}</span>
                    </label>
                  ))}
                  {filters.collection && (
                    <button
                      onClick={() => setFilters({...filters, collection: ''})}
                      className="text-xs text-primary-600 hover:text-primary-800 flex items-center gap-1 mt-1"
                    >
                      <X size={12} /> Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Additional Filters */}
              <div>
                <h3 className="font-medium mb-3 text-gray-800">Product Status</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.showSale}
                      onChange={() => setFilters({...filters, showSale: !filters.showSale})}
                      className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded"
                    />
                    <span className="ml-2 text-gray-700">On Sale</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.showNew}
                      onChange={() => setFilters({...filters, showNew: !filters.showNew})}
                      className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded"
                    />
                    <span className="ml-2 text-gray-700">New Arrivals</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="rounded-xl bg-gray-200 animate-pulse h-80"></div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-medium mb-4">No Products Found</h2>
                <p className="text-gray-600 mb-6">
                  We couldn't find any products matching your selected filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-gray-600">
                    Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;