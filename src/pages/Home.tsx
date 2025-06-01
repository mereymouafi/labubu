import React from 'react';
import HeroBanner from '../components/Home/HeroBanner';
import NewArrivals from '../components/Home/NewArrivals';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import TrendingProducts from '../components/Home/TrendingProducts';
import OnSaleProducts from '../components/Home/OnSaleProducts';

const Home: React.FC = () => {
  return (
    <div className="pt-24">
      <HeroBanner />
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
        <NewArrivals />
        <FeaturedProducts />
        <OnSaleProducts />
        <TrendingProducts />
      </div>
    </div>
  );
};

export default Home;