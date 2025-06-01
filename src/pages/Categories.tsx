import React from 'react';
import CategoriesGrid from '../components/Categories/CategoriesGrid';

const Categories: React.FC = () => {
  return (
    <div className="mt-24">
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">CATEGORIES</h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">Explore our wide range of product categories and find your perfect LABUBU collectibles.</p>
        </div>
      </div>
      <CategoriesGrid />
    </div>
  );
};

export default Categories;
