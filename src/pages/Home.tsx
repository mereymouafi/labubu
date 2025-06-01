import React from 'react';
import HeroBanner from '../components/Home/HeroBanner';
import NewArrivals from '../components/Home/NewArrivals';
import FeaturedCollections from '../components/Home/FeaturedCollections';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import TrendingProducts from '../components/Home/TrendingProducts';
import BrandStory from '../components/Home/BrandStory';
import Testimonials from '../components/Home/Testimonials';

const Home: React.FC = () => {
  return (
    <div className="pt-24">
      <HeroBanner />
      <NewArrivals />
      <FeaturedCollections />
      <FeaturedProducts />
      <TrendingProducts />
      <BrandStory />
      <Testimonials />
    </div>
  );
};

export default Home;