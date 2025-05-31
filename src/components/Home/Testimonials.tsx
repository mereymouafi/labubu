import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  productName: string;
}

const Testimonials: React.FC = () => {
  // Sample testimonial data
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah L.',
      rating: 5,
      date: 'May 15, 2025',
      comment: 'I absolutely love my Labubu blind box! The quality is amazing and the design is so unique. Will definitely buy more!',
      productName: 'Labubu The Lonely Monster'
    },
    {
      id: '2',
      name: 'Michael K.',
      rating: 5,
      date: 'May 12, 2025',
      comment: 'The DIMOO figurine exceeded my expectations. The details are incredible and it looks exactly like the photos. Very happy with my purchase!',
      productName: 'DIMOO Little Monsters'
    },
    {
      id: '3',
      name: 'Emma R.',
      rating: 5,
      date: 'May 8, 2025',
      comment: 'This is my third SKULLPANDA and I\'m still amazed by the quality. The packaging is beautiful and the figure itself is perfect.',
      productName: 'SKULLPANDA The Monsters'
    },
    {
      id: '4',
      name: 'Thomas B.',
      rating: 4,
      date: 'May 3, 2025',
      comment: 'Fast shipping and great customer service. The MOLLY blind box was a hit with my daughter. Will order again!',
      productName: 'MOLLY Seasons Series'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-20 bg-popmart-lightgray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black">Customer Reviews</h2>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {testimonials.map((testimonial) => (
            <motion.div 
              key={testimonial.id} 
              variants={itemVariants}
              className="bg-white p-6 flex flex-col h-full"
            >
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">{testimonial.date}</span>
              </div>
              <h3 className="font-bold text-black mb-1">{testimonial.name}</h3>
              <p className="text-sm text-gray-600 mb-2 italic">on {testimonial.productName}</p>
              <p className="text-gray-600 flex-grow">{testimonial.comment}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
