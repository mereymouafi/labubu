import React from 'react';
import HeroBanner from '../components/Home/HeroBanner';
import TrendingProducts from '../components/Home/TrendingProducts';
import OnSaleProducts from '../components/Home/OnSaleProducts';
import TShirtSection from '../components/Home/TShirtSection';
import PortClesSection from '../components/Home/PortClesSection';
import FiguringsPackSection from '../components/Home/FiguringsPackSection';

const Home: React.FC = () => {
  return (
    <div className="pt-24">
      <HeroBanner />
      <FiguringsPackSection />
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
        <OnSaleProducts />
      </div>
      <TShirtSection />
      <PortClesSection />
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
        <TrendingProducts />
      </div>
    </div>
  );
};

export default Home;