import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, addToCart, setSelectedCartItems } = useShop();
  const [activeTab, setActiveTab] = useState<'delivery' | 'now'>('delivery');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [showAlert, setShowAlert] = useState(false);
  
  // Calculate total price based on selected items only
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (selectedItems[item.product.id] ? (item.product.price * item.quantity) : 0), 
    0
  );

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      const selected: Record<string, boolean> = {};
      cartItems.forEach(item => {
        selected[item.product.id] = true;
      });
      setSelectedItems(selected);
    } else if (Object.keys(selectedItems).length === cartItems.length) {
      // Only clear if select all was previously checked
      setSelectedItems({});
    }
  }, [selectAll, cartItems]);

  // Toggle item selection
  const toggleItemSelection = (productId: string) => {
    setSelectedItems(prev => {
      const newSelection = {...prev};
      newSelection[productId] = !newSelection[productId];
      
      // Update select all state based on selection state
      if (!newSelection[productId]) {
        setSelectAll(false);
      } else if (Object.keys(newSelection).length === cartItems.length && 
                Object.values(newSelection).every(value => value)) {
        setSelectAll(true);
      }
      
      return newSelection;
    });
  };

  // Handle quantity changes
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const item = cartItems.find(item => item.product.id === productId);
    if (item) {
      // If quantity is set to 0, remove the item
      if (newQuantity === 0) {
        removeFromCart(productId);
      } else {
        // Otherwise update by removing and re-adding with new quantity
        removeFromCart(productId);
        addToCart(item.product, newQuantity);
      }
    }
  };

  // Page transition animation
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const handleCheckoutClick = (e: React.MouseEvent) => {
    const hasSelectedItems = Object.values(selectedItems).some(Boolean);
    if (!hasSelectedItems) {
      e.preventDefault();
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    
    // Create an array of selected cart items
    const selectedCartItems = cartItems.filter(item => selectedItems[item.product.id]);
    
    // Set the selected items in the context
    setSelectedCartItems(selectedCartItems);
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
      {/* Alert message */}
      {showAlert && (
        <div className="fixed top-20 left-0 right-0 mx-auto w-max z-50">
          <div className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md">
            Please select an item
          </div>
        </div>
      )}
      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-8 py-3 font-medium text-sm ${activeTab === 'delivery' ? 'text-labubumaroc-red border-b-2 border-labubumaroc-red' : 'text-gray-600'}`}
          onClick={() => setActiveTab('delivery')}
        >
          Pop Upon Delivery({cartItems.length})
        </button>
        <button
          className={`px-8 py-3 font-medium text-sm ${activeTab === 'now' ? 'text-labubumaroc-red border-b-2 border-labubumaroc-red' : 'text-gray-600'}`}
          onClick={() => setActiveTab('now')}
        >
          POP NOW(0)
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-6">Your cart is empty</p>
          <Link to="/shop" className="px-6 py-2 bg-labubumaroc-red text-white rounded hover:bg-red-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="flex-grow">
            <div className="mb-4 pt-4">
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-labubumaroc-red"
                  checked={selectAll}
                  onChange={() => setSelectAll(!selectAll)}
                />
                <span className="ml-2 text-sm text-gray-700">Select all</span>
              </label>
            </div>
            
            {/* Cart item list */}
            {cartItems.map((item) => (
              <div key={item.product.id} className="border-t border-gray-200 py-6 flex">
                <div className="flex-shrink-0 mr-4">
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-5 w-5 text-labubumaroc-red mt-16"
                    checked={!!selectedItems[item.product.id]}
                    onChange={() => toggleItemSelection(item.product.id)}
                  />
                </div>
                
                <div className="flex flex-grow">
                  {/* Product Image */}
                  <Link to={`/product/${item.product.id}`} className="w-36 h-36 flex-shrink-0 mr-6 cursor-pointer">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      className="w-full h-full object-contain border border-gray-200 p-2" 
                    />
                  </Link>
                  
                  {/* Product Details */}
                  <div className="flex-grow">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <Link to={`/product/${item.product.id}`} className="hover:text-labubumaroc-red transition-colors">
                          <h3 className="font-medium mb-1">{item.product.name}</h3>
                        </Link>
                        {item.product.category === 'Blind Box' && (
                          <div className="text-sm text-gray-600 mt-1">
                            {item.blindBoxInfo ? (
                              <>
                                <p><span className="font-medium">Level:</span> {item.blindBoxInfo.level}</p>
                                <p><span className="font-medium">Color:</span> {item.blindBoxInfo.color}</p>
                                <p><span className="font-medium">Quantity:</span> {item.blindBoxInfo.quantity}</p>
                              </>
                            ) : (
                              <p className="text-sm text-gray-500">Blind Box</p>
                            )}
                          </div>
                        ) || (
                          <p className="text-sm text-gray-500">Single box</p>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="font-medium text-lg">{item.product.price.toFixed(2)} MAD</p>
                          
                          <div className="flex items-center border border-gray-300 mt-2 inline-block">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-4 py-1">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-labubumaroc-red text-sm font-medium hover:underline"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-gray-50 p-6 sticky top-24">
              <h3 className="text-sm font-medium mb-4">Subtotal</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-bold">{subtotal.toFixed(2)} MAD</span>
                <span className="text-xs text-gray-500">MAD</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Shipping</span>
                  <span className="text-xs text-blue-600">Calculated at next step</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total({Object.values(selectedItems).filter(Boolean).length})</span>
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold mr-1">{subtotal.toFixed(2)} MAD</span>
                    <span className="text-xs text-gray-500">MAD</span>
                  </div>
                </div>
              </div>
              
              <Link to="/checkout" className="block" onClick={handleCheckoutClick}>
                <button 
                  className="w-full py-3 bg-labubumaroc-red text-white font-medium tracking-wide uppercase hover:bg-red-700 transition-colors"
                >
                  CHECK OUT
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
