import React from 'react';
import NewAndFeatured from '../components/Home/NewAndFeatured';

const NewAndFeaturedPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-24 mt-24">
      <h1 className="text-3xl font-bold mb-8 text-center">New & Featured Products</h1>
      <NewAndFeatured />
    </div>
  );
};

export default NewAndFeaturedPage;
