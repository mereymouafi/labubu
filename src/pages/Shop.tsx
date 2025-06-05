import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Product, Category, Character, fetchProducts, fetchCategories, fetchCharacters } from '../lib/supabase';
import ProductCard from '../components/Product/ProductCard';
import NotificationBar from '../components/Layout/NotificationBar';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    character: '',
    showSale: false,
    showNew: false,
    minPrice: 0,
    maxPrice: 1000 // Default max price
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get max price from products for range slider
  const maxProductPrice = products.length ? Math.max(...products.map(product => product.price)) : 1000;

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        
        // Load characters
        const charactersData = await fetchCharacters();
        setCharacters(charactersData);
        
        // Load all products
        const productsData = await fetchProducts();
        setProducts(productsData);
        
        // Update max price based on actual product prices
        if (productsData.length > 0) {
          const maxPrice = Math.max(...productsData.map(product => product.price));
          setFilters(prev => ({ ...prev, maxPrice }));
        }
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
    if (filters.character && product.character !== filters.character) return false;
    if (filters.showSale && !product.is_on_sale) return false;
    if (filters.showNew && !product.is_new) return false;
    if (product.price < filters.minPrice || product.price > filters.maxPrice) return false;
    return true;
  });

  const resetFilters = () => {
    setFilters({
      category: '',
      character: '',
      showSale: false,
      showNew: false,
      minPrice: 0,
      maxPrice: maxProductPrice
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
      <div className="bg-primary-900 py-16 grid place-items-center">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Shop Labubu</h1>
        </div>
      </div>
      
      {/* Notification Bar */}
      <NotificationBar 
        title="SHOP LABUBU"
        message="Browse our collection of Labubu figurines and accessories" 
      />

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
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category.name}
                        onChange={() => setFilters({...filters, category: category.name})}
                        className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                      />
                      <span className="ml-2 text-gray-700">{category.name}</span>
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

              {/* Characters Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-800">Characters</h3>
                <div className="space-y-2">
                  {characters.map((character) => (
                    <label key={character.id} className="flex items-center">
                      <input
                        type="radio"
                        name="character"
                        checked={filters.character === character.name}
                        onChange={() => setFilters({...filters, character: character.name})}
                        className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                      />
                      <span className="ml-2 text-gray-700">{character.name}</span>
                    </label>
                  ))}
                  {filters.character && (
                    <button
                      onClick={() => setFilters({...filters, character: ''})}
                      className="text-xs text-primary-600 hover:text-primary-800 flex items-center gap-1 mt-1"
                    >
                      <X size={12} /> Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-800">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>{filters.minPrice} MAD</span>
                    <span>{filters.maxPrice} MAD</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={maxProductPrice}
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Product Status */}
              <div className="mb-6">
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