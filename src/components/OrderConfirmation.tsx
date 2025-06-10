import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface OrderConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ isOpen, onClose, orderId }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with close button */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <img 
                    src="/logo.png" 
                    alt="Labubu Maroc Logo" 
                    className="h-8 mr-2"
                    onError={(e) => {
                      // Fallback if logo image is not found
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <h3 className="text-lg font-bold text-labubumaroc-red">Labubu Maroc</h3>
                </div>
                <button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-8 w-8 text-green-600" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  </div>
                </div>
                
                <h4 className="text-xl font-semibold text-center mb-2">Order Placed Successfully!</h4>
                <p className="text-gray-600 text-center mb-4">
                  Thank you for shopping with Labubu Maroc.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <p className="text-sm text-gray-700 mb-1">Order ID:</p>
                  <p className="font-mono font-medium text-gray-900">{orderId}</p>
                </div>
                
                <p className="text-sm text-gray-600 mb-6 text-center">
                  We'll send you a confirmation email with your order details shortly.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    to="/"
                    className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-center font-medium transition-colors"
                    onClick={onClose}
                  >
                    Continue Shopping
                  </Link>
                  <button
                    onClick={onClose}
                    className="flex-1 py-2 px-4 bg-labubumaroc-red hover:bg-red-700 text-white rounded-md text-center font-medium transition-colors"
                  >
                    OK
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderConfirmation;
