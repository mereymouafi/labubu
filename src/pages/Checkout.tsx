import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { createOrder, Order, OrderItem, ShippingInfo as SupabaseShippingInfo } from '../lib/supabase';

// Checkout form types
type ShippingInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
};

type PaymentMethod = 'cash-on-delivery';

const Checkout: React.FC = () => {
  const { cartItems, clearCart } = useShop();
  const navigate = useNavigate();
  
  // State for checkout steps
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  
  // State for form data
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Morocco',
  });
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash-on-delivery');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping above 500
  const total = subtotal + shippingCost;

  // Handle shipping form input changes
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  
  // Navigate between steps
  const nextStep = () => {
    if (step === 'shipping') setStep('payment');
    else if (step === 'payment') setStep('review');
  };
  
  const prevStep = () => {
    if (step === 'payment') setStep('shipping');
    else if (step === 'review') setStep('payment');
  };
  
  // Submit order
  const placeOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Prepare order items for database
      const orderItems: OrderItem[] = cartItems.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.images[0],
        price: item.product.price,
        quantity: item.quantity
      }));
      
      // Convert shipping info to match Supabase type
      const formattedShippingInfo: SupabaseShippingInfo = {
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: '',
        zip: shippingInfo.zipCode
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
      const errorMessage = error?.message || 'Unknown error';
      alert(`There was an error processing your order: ${errorMessage}\n\nPlease make sure the orders table exists in your Supabase database.`);
    } finally {
      setIsProcessing(false);
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
      
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between">
          <div className={`text-center ${step === 'shipping' ? 'text-popmart-red font-medium' : ''}`}>
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${step === 'shipping' ? 'bg-popmart-red text-white' : 'bg-gray-200'}`}>1</div>
            <span>Shipping</span>
          </div>
          <div className={`text-center ${step === 'payment' ? 'text-popmart-red font-medium' : ''}`}>
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${step === 'payment' ? 'bg-popmart-red text-white' : 'bg-gray-200'}`}>2</div>
            <span>Payment</span>
          </div>
          <div className={`text-center ${step === 'review' ? 'text-popmart-red font-medium' : ''}`}>
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${step === 'review' ? 'bg-popmart-red text-white' : 'bg-gray-200'}`}>3</div>
            <span>Review</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-grow">
          {/* Shipping Information */}
          {step === 'shipping' && (
            <div className="bg-white p-6 border border-gray-200 rounded-md">
              <h2 className="text-xl font-medium mb-6">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <input 
                    type="text"
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-popmart-red"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <input 
                    type="text"
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-popmart-red"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input 
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-popmart-red"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone *</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-popmart-red"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Address *</label>
                <input 
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-popmart-red"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <input 
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-popmart-red"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Postal Code *</label>
                  <input 
                    type="text"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-popmart-red"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Country *</label>
                  <select 
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-popmart-red"
                    required
                  >
                    <option value="Morocco">Morocco</option>
                    <option value="France">France</option>
                    <option value="Spain">Spain</option>
                    <option value="United States">United States</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={nextStep}
                  className="px-6 py-2 bg-popmart-red text-white rounded hover:bg-red-700 transition-colors"
                >
                  Next: Payment
                </button>
              </div>
            </div>
          )}
          
          {/* Payment Method */}
          {step === 'payment' && (
            <div className="bg-white p-6 border border-gray-200 rounded-md">
              <h2 className="text-xl font-medium mb-6">Payment Method</h2>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 border rounded-md border-popmart-red bg-red-50">
                  <div className="flex items-center">
                    <input 
                      type="radio"
                      id="cash-on-delivery"
                      name="payment-method"
                      checked={true}
                      className="mr-3"
                      readOnly
                    />
                    <label htmlFor="cash-on-delivery" className="flex-grow">
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-sm text-gray-500">Pay when you receive your order</div>
                    </label>
                    <div className="w-10 h-6 bg-green-600 rounded"></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <p className="text-sm">You will pay for your order when it arrives at your address. Please have the exact amount ready.</p>
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                  Back to Shipping
                </button>
                <button 
                  onClick={nextStep}
                  className="px-6 py-2 bg-popmart-red text-white rounded hover:bg-red-700 transition-colors"
                >
                  Next: Review Order
                </button>
              </div>
            </div>
          )}
          
          {/* Order Review */}
          {step === 'review' && (
            <div className="bg-white p-6 border border-gray-200 rounded-md">
              <h2 className="text-xl font-medium mb-6">Review Your Order</h2>
              
              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-4">Items</h3>
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="py-4 flex">
                      <div className="w-16 h-16 flex-shrink-0 mr-4">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">C${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Shipping Address */}
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-4">Shipping Address</h3>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="font-medium">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                  <p>{shippingInfo.address}</p>
                  <p>{shippingInfo.city}, {shippingInfo.zipCode}</p>
                  <p>{shippingInfo.country}</p>
                  <p>{shippingInfo.email}</p>
                  <p>{shippingInfo.phone}</p>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-4">Payment Method</h3>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="font-medium">Cash on Delivery</p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                  Back to Payment
                </button>
                <button 
                  onClick={placeOrder}
                  disabled={isProcessing}
                  className={`px-6 py-2 bg-popmart-red text-white rounded hover:bg-red-700 transition-colors ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-gray-50 p-6 sticky top-24 border border-gray-200 rounded-md">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>C${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                {shippingCost === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  <span>C${shippingCost.toFixed(2)}</span>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <div className="text-right">
                  <span className="text-xl">C${total.toFixed(2)}</span>
                  <span className="block text-xs text-gray-500">MAD</span>
                </div>
              </div>
            </div>
            
            {step === 'shipping' && (
              <button 
                onClick={nextStep}
                className="w-full px-6 py-3 bg-popmart-red text-white rounded hover:bg-red-700 transition-colors"
              >
                Continue to Payment
              </button>
            )}
            
            {step === 'payment' && (
              <button 
                onClick={nextStep}
                className="w-full px-6 py-3 bg-popmart-red text-white rounded hover:bg-red-700 transition-colors"
              >
                Review Order
              </button>
            )}
            
            {step === 'review' && (
              <button 
                onClick={placeOrder}
                disabled={isProcessing}
                className={`w-full px-6 py-3 bg-popmart-red text-white rounded hover:bg-red-700 transition-colors ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
