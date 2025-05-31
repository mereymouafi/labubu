import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCategories, Category, fetchProducts, Product } from '../lib/supabase';
import ProductCard from '../components/Product/ProductCard';

const CategoryProducts: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategoryAndProducts = async () => {
      setIsLoading(true);
      
      try {
        // First fetch all categories to find the one matching our slug
        const categories = await fetchCategories();
        const matchingCategory = categories.find(cat => cat.slug === slug);
        
        if (matchingCategory) {
          setCategory(matchingCategory);
          
          // Then fetch products for this category
          // Note: Currently we're using the category name for filtering since the product schema
          // still references category by name, not ID
          const categoryProducts = await fetchProducts({ 
            category: matchingCategory.name 
          });
          
          setProducts(categoryProducts);
        }
      } catch (error) {
        console.error('Error loading category products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadCategoryAndProducts();
    }
  }, [slug]);

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Loading products...</p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {category?.name || 'Category'}
            </h1>
            {category?.description && (
              <p className="text-gray-600 mt-2">{category.description}</p>
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
              <p className="text-lg text-gray-500">No products found in this category.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryProducts;
