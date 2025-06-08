import React from 'react';
import NewArrivals from '../components/Home/NewArrivals';
import Featured from '../components/Home/Featured';

const NewAndFeaturedPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-24 mt-24">
      <h1 className="text-3xl font-bold mb-8">New & Featured</h1>
      <NewArrivals />
      <Featured />
    </div>
  );
};

export default NewAndFeaturedPage;
