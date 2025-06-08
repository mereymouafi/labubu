import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product as BaseProduct, fetchProducts } from '../lib/supabase';
import { Product } from '../types';

// Product type is now imported from '../types'

// Define the shape of our cart item
type CartItem = {
  product: Product;
  quantity: number;
  blindBoxInfo?: {
    level: string;
    color: string;
    quantity: number;
  };
};

// Define the shape of our context
type ShopContextType = {
  cartItems: CartItem[];
  wishlistItems: Product[];
  selectedCartItems: CartItem[];
  products: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  cartCount: number;
  wishlistCount: number;
  setSelectedCartItems: (items: CartItem[]) => void;
  clearSelectedCartItems: () => void;
};

// Create the context
export const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Create a provider component
export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [selectedCartItems, setSelectedCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Load products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await fetchProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    loadProducts();
  }, []);

  // Load cart and wishlist from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Validate the cart structure before setting state
        if (Array.isArray(parsedCart)) {
          // Make sure each item has valid product and quantity
          const validCart = parsedCart.filter(item => 
            item && 
            item.product && 
            typeof item.product === 'object' && 
            item.product.id && 
            typeof item.quantity === 'number'
          );
          setCartItems(validCart);
        } else {
          // If cart is invalid, reset it
          console.warn('Invalid cart structure, resetting cart');
          localStorage.setItem('cart', JSON.stringify([]));
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        // Reset cart if there's an error
        localStorage.setItem('cart', JSON.stringify([]));
        setCartItems([]);
      }
    }
    
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          // Validate wishlist items
          const validWishlist = parsedWishlist.filter(item => 
            item && typeof item === 'object' && item.id
          );
          setWishlistItems(validWishlist);
        } else {
          console.warn('Invalid wishlist structure, resetting wishlist');
          localStorage.setItem('wishlist', JSON.stringify([]));
          setWishlistItems([]);
        }
      } catch (error) {
        console.error('Error parsing saved wishlist:', error);
        localStorage.setItem('wishlist', JSON.stringify([]));
        setWishlistItems([]);
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
    try {
      // First, ensure the product object is properly serializable
      // Create a clean copy of the product with only the necessary properties
      const cleanProduct: Product = {
        id: product.id,
        name: product.name,
        price: product.price,
        images: [...product.images], // Make a copy of the images array
        category: product.category,

        stock_status: product.stock_status,
        // Include optional properties only if they exist
        original_price: product.original_price,
        character: product.character,
        is_new: product.is_new,
        is_featured: product.is_featured,
        is_on_sale: product.is_on_sale,
        is_popular: product.is_popular,
        is_trending: product.is_trending,
        description: product.description,
        category_id: product.category_id,
        character_id: product.character_id,
        // Include blind box info if it exists
        blindBoxInfo: product.blindBoxInfo ? {
          level: product.blindBoxInfo.level,
          color: product.blindBoxInfo.color,
          quantity: product.blindBoxInfo.quantity
        } : undefined
      };

      setCartItems(prevItems => {
        // Create a clean copy of previous items
        const prevItemsCopy = prevItems.map(item => ({
          product: { ...item.product },
          quantity: item.quantity,
          blindBoxInfo: item.blindBoxInfo ? { ...item.blindBoxInfo } : undefined
        }));
        
        // Check if item already exists in cart
        const existingItemIndex = prevItemsCopy.findIndex(item => item.product.id === cleanProduct.id);
        
        let updatedItems;
        if (existingItemIndex >= 0) {
          // Update quantity of existing item
          updatedItems = [...prevItemsCopy];
          updatedItems[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          updatedItems = [...prevItemsCopy, { 
            product: cleanProduct, 
            quantity,
            blindBoxInfo: cleanProduct.blindBoxInfo ? {
              level: cleanProduct.blindBoxInfo.level,
              color: cleanProduct.blindBoxInfo.color,
              quantity: cleanProduct.blindBoxInfo.quantity
            } : undefined
          }];
        }
        
        // Save to localStorage immediately to ensure data is persisted
        try {
          localStorage.setItem('cart', JSON.stringify(updatedItems));
        } catch (storageError) {
          console.error('Error saving cart to localStorage:', storageError);
        }
        
        return updatedItems;
      });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      // Provide user feedback that something went wrong
      alert('There was an error adding this item to your cart. Please try again.');
    }
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
    setSelectedCartItems([]);
    // Clear cart in localStorage
    localStorage.setItem('cart', JSON.stringify([]));
  };

  // Clear selected cart items
  const clearSelectedCartItems = () => {
    setSelectedCartItems([]);
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
    selectedCartItems,
    products,
    addToCart,
    removeFromCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    cartCount,
    wishlistCount,
    setSelectedCartItems,
    clearSelectedCartItems
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
