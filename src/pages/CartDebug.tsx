import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Product } from '../lib/supabase';

const CartDebug: React.FC = () => {
  console.log('CartDebug component rendering');
  
  // Try to access the shop context
  const shopContext = useShop();
  console.log('Shop Context:', shopContext);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Cart Diagnostic Page</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-2">ShopContext Status:</h2>
        <p>Context Available: {shopContext ? 'Yes' : 'No'}</p>
        <p>Cart Items: {shopContext?.cartItems?.length || 0}</p>
        <p>Wishlist Items: {shopContext?.wishlistItems?.length || 0}</p>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Test: Add Item to Cart</h2>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => {
              try {
                // Create a mock product that matches the Product type
                const mockProduct: Product = {
                  id: 'test-' + Date.now(),
                  name: 'Test Product',
                  price: 19.99,
                  images: [''],
                  category: 'Test Category',
                  collection: 'Test Collection',
                  description: 'Test description',
                  stock_status: 'in_stock'
                };
                
                shopContext?.addToCart(mockProduct, 1);
                alert('Added test item to cart. Cart count: ' + (shopContext?.cartCount || 0));
              } catch (err) {
                alert('Error adding to cart: ' + (err instanceof Error ? err.message : String(err)));
              }
            }}
          >
            Add Test Item
          </button>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">localStorage Status:</h2>
          <pre className="bg-gray-200 p-2 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify({
              cart: JSON.parse(localStorage.getItem('cart') || '[]'),
              wishlist: JSON.parse(localStorage.getItem('wishlist') || '[]')
            }, null, 2)}
          </pre>
        </div>
      </div>
      
      <div className="mt-8 space-x-4">
        <Link to="/" className="px-4 py-2 bg-gray-200 rounded">Back to Home</Link>
        <Link to="/cart" className="px-4 py-2 bg-blue-500 text-white rounded">Go to Cart</Link>
      </div>
    </div>
  );
};

export default CartDebug;
