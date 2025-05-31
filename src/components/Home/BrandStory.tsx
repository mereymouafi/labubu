import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BrandStory: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-3xl font-bold text-black mb-6">Discover Our Story</h2>
            <p className="text-gray-600 mb-6">
              Since our founding, we've been dedicated to bringing joy and artistry to collectors worldwide. 
              Our Labubu character has become an iconic symbol of creativity and imagination, 
              capturing the hearts of art toy enthusiasts across the globe.
            </p>
            <p className="text-gray-600 mb-8">
              Each of our designer toys is meticulously crafted with attention to detail, 
              bringing unique characters and stories to life. Our collaborations with renowned artists 
              have created limited edition pieces that blend pop culture with fine art sensibilities.
            </p>
            <Link 
              to="/about" 
              className="inline-flex items-center justify-center bg-black text-white py-3 px-8 hover:bg-popmart-red transition-colors duration-300"
            >
              Learn More <ArrowRight size={16} className="ml-2" />
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="aspect-square bg-popmart-lightgray overflow-hidden">
              <img 
                src="https://cdn-global-naus.popmart.com/global-web/common/20240531072622/assets/image/ca/home/about/33dd4c7bf5d8f551c59ec2e71a40b06.webp" 
                alt="Brand Story" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
