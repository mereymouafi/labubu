import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../lib/supabase';

// Define the shape of our cart item
type CartItem = {
  product: Product;
  quantity: number;
};

// Define the shape of our context
type ShopContextType = {
  cartItems: CartItem[];
  wishlistItems: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  cartCount: number;
  wishlistCount: number;
};

// Create the context
export const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Create a provider component
export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Load cart and wishlist from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing saved cart:', error);
      }
    }
    
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing saved wishlist:', error);
      }
    }
  }, []);

  // Update localStorage when cart or wishlist changes
  useEffect(() => {
    // Only update cart count from cartItems, localStorage is handled in addToCart
    setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    setWishlistCount(wishlistItems.length);
  }, [wishlistItems]);

  // Add a product to the cart
  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      // Create a deep copy of previous items to avoid reference issues
      const prevItemsCopy = JSON.parse(JSON.stringify(prevItems));
      
      // Check if item already exists in cart
      const existingItemIndex = prevItemsCopy.findIndex((item: CartItem) => item.product.id === product.id);
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        updatedItems = [...prevItemsCopy];
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        updatedItems = [...prevItemsCopy, { product, quantity }];
      }
      
      // Save to localStorage immediately to ensure data is persisted
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  // Remove a product from the cart
  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.product.id !== productId);
      // Update localStorage immediately
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  // Clear the cart
  const clearCart = () => {
    setCartItems([]);
    // Clear cart in localStorage
    localStorage.setItem('cart', JSON.stringify([]));
  };

  // Add a product to the wishlist
  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      setWishlistItems(prevItems => [...prevItems, product]);
    } else {
      // If already in wishlist, remove it (toggle behavior)
      removeFromWishlist(product.id);
    }
  };

  // Remove a product from the wishlist
  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Check if a product is in the wishlist
  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  // Create value object for context
  const contextValue: ShopContextType = {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    cartCount,
    wishlistCount
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

// Custom hook to use the shop context
export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
