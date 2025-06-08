import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { createOrder, Order, OrderItem, ShippingInfo as SupabaseShippingInfo } from '../lib/supabase';

// Checkout form types
type ShippingInfo = {
  fullName: string;
  address: string;
  phone: string;
};

type PaymentMethod = 'cash-on-delivery';

const Checkout: React.FC = () => {
  const { cartItems, clearCart } = useShop();
  const navigate = useNavigate();
  
  // Single step checkout
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  
  // State for form data
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    address: '',
    phone: '',
  });
  
  const paymentMethod: PaymentMethod = 'cash-on-delivery';
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingCost = 0; // Free shipping for all orders
  const total = subtotal + shippingCost;

  // Handle shipping form input changes
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  

  
  // Submit order
  const placeOrder = async () => {
    // Validate shipping info first
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.phone) {
      alert('Please fill in all required fields: Full Name, Address, and Phone Number');
      return;
    }

    // Check if cart is empty
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add some products before checking out.');
      return;
    }
    
    setIsProcessingOrder(true);
    
    try {
      console.log('Cart items before processing:', cartItems);

      // Prepare order items for database - with comprehensive error checking
      const orderItems: OrderItem[] = cartItems.map(item => {
        if (!item || !item.product) {
          console.error('Invalid item in cart:', item);
          throw new Error('Invalid item in cart');
        }
        
        return {
          product_id: String(item.product.id || ''),
          product_name: item.product.name || 'Unknown Product',
          product_image: item.product.images && Array.isArray(item.product.images) && item.product.images.length > 0 
            ? item.product.images[0] 
            : '',
          price: item.product.price || 0,
          quantity: item.quantity || 1
        };
      });
      
      // Convert shipping info to match Supabase type
      const formattedShippingInfo: SupabaseShippingInfo = {
        firstName: shippingInfo.fullName.split(' ')[0] || '',
        lastName: shippingInfo.fullName.split(' ').slice(1).join(' ') || '',
        email: '',
        phone: shippingInfo.phone || '',
        address: shippingInfo.address || '',
        city: '',
        state: '',
        zip: ''
      };
      
      // Create order object
      const order: Order = {
        shipping_info: formattedShippingInfo,
        order_items: orderItems,
        total_amount: total,
        payment_method: paymentMethod,
        status: 'pending'
      };
      
      console.log('Submitting order:', order);
      
      // Save order to database
      const result = await createOrder(order);
      console.log('Order creation result:', result);
      
      if (result.success) {
        console.log('Order placed successfully with ID:', result.orderId);
        
        // Clear cart and redirect to success page
        clearCart();
        
        // Show success alert and redirect to home
        alert(`Order #${result.orderId} placed successfully! Thank you for shopping with Labubu Maroc.`);
        navigate('/');
      } else {
        // Show specific error message from backend
        const errorMsg = result.error ? String(result.error) : 'Failed to save order';
        console.error('Order creation failed:', errorMsg);
        alert(`Error: ${errorMsg}\n\nMake sure you've created the orders table in Supabase using the SQL provided.`);
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      alert(`Error placing order: ${error.message}`);
    } finally {
      setIsProcessingOrder(false);
    }
  };
  
  // Page animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };
  
  // If cart is empty, redirect to cart page
  if (cartItems.length === 0) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="container mx-auto px-4 py-16 max-w-6xl"
      >
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-6">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to your cart before proceeding to checkout.</p>
          <Link to="/shop" className="px-6 py-3 bg-popmart-red text-white rounded hover:bg-red-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-grow">
          {/* Shipping Information */}
          <div>
            <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleShippingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
                  required
                  placeholder="Your Full Name"
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
                  required
                  placeholder="Your Complete Address"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleShippingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
                  required
                  placeholder="Your Phone Number"
                />
              </div>
              
              <div className="pt-4">
                <button 
                  type="button" 
                  onClick={placeOrder}
                  disabled={isProcessingOrder}
                  className={`w-full px-6 py-3 bg-popmart-red text-white rounded hover:bg-red-700 transition-colors ${isProcessingOrder ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isProcessingOrder ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-gray-50 p-6 sticky top-24 border border-gray-200 rounded-md">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>{subtotal.toFixed(2)} MAD</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                {shippingCost === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  <span>{shippingCost.toFixed(2)} MAD</span>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <div className="text-right">
                  <span className="text-xl">{total.toFixed(2)} MAD</span>
                  <span className="block text-xs text-gray-500">MAD</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={placeOrder}
              disabled={isProcessingOrder}
              className={`w-full px-6 py-3 bg-popmart-red text-white rounded hover:bg-red-700 transition-colors ${isProcessingOrder ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isProcessingOrder ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
