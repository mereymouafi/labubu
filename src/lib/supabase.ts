import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kwpgsqzgmimxodnkjsly.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3cGdzcXpnbWlteG9kbmtqc2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2OTkyMzYsImV4cCI6MjA2NDI3NTIzNn0.t5jy6DEkBNXaCofJvqnu3jrvjEXml0W9sj1KSZVu5OI';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  created_at?: string;
};

export type Character = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  created_at?: string;
};

export type Banner = {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  button_text?: string;
  button_link?: string;
  created_at?: string;
};

export type Collection = {
  id: string;
  name: string;
  image: string;
  description?: string;
  created_at?: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  images: string[];
  category: string;
  collection: string;
  character?: string;
  is_new?: boolean;
  is_featured?: boolean;
  is_on_sale?: boolean;
  is_popular?: boolean;
  is_trending?: boolean;
  description?: string;
  stock_status: string;
  created_at?: string;
  category_id?: string;
  collection_id?: string;
  character_id?: string;
};

export type OrderItem = {
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  category_id?: string;
  category_name?: string;
  // Add t-shirt customization options
  tshirt_options?: {
    size?: string;
    color?: string;
    style?: string;
    age?: string;
  };
};

export type ShippingInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export type Order = {
  id?: string;
  user_id?: string;
  shipping_info: ShippingInfo;
  order_items: OrderItem[];
  total_amount: number;
  payment_method: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at?: string;
};

export const fetchBanners = async (): Promise<Banner[]> => {
  const { data, error } = await supabase.from('banners').select('*');
  
  if (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
  
  return data || [];
};

export const fetchCollections = async (): Promise<Collection[]> => {
  const { data, error } = await supabase.from('collections').select('*');
  
  if (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
  
  return data || [];
};

export const fetchProducts = async (options?: { 
  category?: string; 
  collection?: string;
  featured?: boolean;
  new?: boolean;
  onSale?: boolean;
  popular?: boolean;
  trending?: boolean;
  limit?: number;
}): Promise<Product[]> => {
  let query = supabase.from('products').select('*');
  
  if (options?.category) {
    query = query.eq('category', options.category);
  }
  
  if (options?.collection) {
    query = query.eq('collection', options.collection);
  }
  
  if (options?.featured) {
    query = query.eq('is_featured', true);
  }
  
  if (options?.new) {
    query = query.eq('is_new', true);
  }
  
  if (options?.onSale) {
    query = query.eq('is_on_sale', true);
  }
  
  if (options?.popular) {
    query = query.eq('is_popular', true);
  }
  
  if (options?.trending) {
    query = query.eq('is_trending', true);
  }
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data || [];
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  // First get the product with its basic data
  const { data: productData, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (productError) {
    console.error('Error fetching product:', productError);
    return null;
  }

  if (!productData) return null;
  
  // If we have a category_id, fetch the category name
  if (productData.category_id) {
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('name')
      .eq('id', productData.category_id)
      .single();
    
    if (!categoryError && categoryData) {
      // Update the product's category field with the actual category name
      productData.category = categoryData.name;
    }
  }
  
  return productData;
};

export const fetchProductsByCollection = async (collectionName: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('collection', collectionName);
  
  if (error) {
    console.error('Error fetching products by collection:', error);
    return [];
  }
  
  return data || [];
};

export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  return data || [];
};

export const fetchProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', categorySlug);
  
  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
  
  return data || [];
};

export const fetchCharacters = async (): Promise<Character[]> => {
  const { data, error } = await supabase.from('characters').select('*');
  
  if (error) {
    console.error('Error fetching characters:', error);
    return [];
  }
  
  return data || [];
};

export const fetchProductsByCharacter = async (characterSlug: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('character', characterSlug);
  
  if (error) {
    console.error('Error fetching products by character:', error);
    return [];
  }
  
  return data || [];
};

export type TShirtOption = {
  id: string;
  option_name: string;
  option_description: string;
  image_urls: string[];
  created_at?: string;
  gallery_images?: string[]; // Added for gallery section
  rules_image1?: string[]; // For single box rules image
  rules_image2?: string[]; // For whole sets rules image
  bgColor?: string; // Added for frontend display
};

export type TShirtDetail = {
  id: string;
  option_name: string;
  size: string[];
  color: string[];
  style: string[];
  age: string[];
  price_original: number;
  price: number;
  created_at?: string;
  category_id?: string;
};

export const fetchTShirtOptions = async (): Promise<TShirtOption[]> => {
  const { data, error } = await supabase.from('tshirt_options').select('*');
  
  if (error) {
    console.error('Error fetching T-shirt options:', error);
    return [];
  }
  
  // Add default background colors based on index position - using clear pastel colors
  const bgColors = ['#FFCDD2', '#FFF9C4', '#E1BEE7', '#BBDEFB']; // Clear pastel pink, yellow, purple, blue
  
  return (data || []).map((option, index) => ({
    ...option,
    bgColor: bgColors[index % bgColors.length]
  }));
};

export const fetchTShirtDetail = async (optionId: string): Promise<TShirtDetail | null> => {
  // First get the option to get the option_name
  const { data: optionData, error: optionError } = await supabase
    .from('tshirt_options')
    .select('option_name')
    .eq('id', optionId)
    .single();
  
  if (optionError) {
    console.error('Error fetching T-shirt option:', optionError);
    return getMockTShirtDetail(optionId);
  }
  
  if (!optionData) {
    return getMockTShirtDetail(optionId);
  }
  
  // Now get the details using the option_name to match
  const { data, error } = await supabase
    .from('tshirt_details')
    .select('*')
    .eq('option_name', optionData.option_name)
    .single();
  
  if (error) {
    console.error('Error fetching T-shirt details:', error);
    return getMockTShirtDetail(optionId, optionData.option_name);
  }
  
  // If we have the details and a category_id, fetch the category name
  const tshirtDetail = data || getMockTShirtDetail(optionId, optionData.option_name);
  
  return tshirtDetail;
};

export const fetchTShirtDetailWithCategory = async (optionId: string): Promise<{ tshirtDetail: TShirtDetail, categoryName?: string } | null> => {
  const tshirtDetail = await fetchTShirtDetail(optionId);
  
  if (!tshirtDetail) {
    return null;
  }
  
  // If the tshirt detail has a category_id, fetch the category name
  if (tshirtDetail.category_id) {
    try {
      const { data: categoryData, error } = await supabase
        .from('categories')
        .select('name')
        .eq('id', tshirtDetail.category_id)
        .single();
      
      if (!error && categoryData) {
        return { tshirtDetail, categoryName: categoryData.name };
      }
    } catch (err) {
      console.error('Error fetching category for tshirt detail:', err);
    }
  }
  
  return { tshirtDetail };
};

// Provide mock details if database fetch fails
const getMockTShirtDetail = (id: string, optionName?: string): TShirtDetail => {
  return {
    id,
    option_name: optionName || 'T-Shirt Option',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    color: ['Black', 'White', 'Blue', 'Red'],
    style: ['Regular Fit', 'Slim Fit', 'Oversized'],
    age: ['Adult', 'Teen', 'Kids'],
    price_original: 39.99,
    price: 29.99,
    created_at: new Date().toISOString(),
    category_id: undefined // Default to undefined for mock data
  };
};

export const updateTShirtDetailCategory = async (tshirtDetailId: string, categoryId: string): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('tshirt_details')
      .update({ category_id: categoryId })
      .eq('id', tshirtDetailId);
    
    if (error) {
      console.error('Error updating T-shirt detail category:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (err) {
    console.error('Exception updating T-shirt detail category:', err);
    return { success: false, error: err };
  }
};

export const createOrder = async (order: Order): Promise<{ success: boolean; orderId?: string; error?: any }> => {
  try {
    console.log('Attempting to create order:', order);
    
    // Verify the 'orders' table exists by checking table structure
    const { error: tableError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);
      
    if (tableError) {
      console.error('Table check error, table may not exist:', tableError);
      return { success: false, error: `Table error: ${tableError.message}` };
    }
    
    // Ensure category information is included in order items if available
    const orderItems = await Promise.all(order.order_items.map(async (item) => {
      // If the item is a t-shirt and has a category_id but no category_name, fetch the category name
      if (item.category_id && !item.category_name) {
        try {
          const { data: categoryData } = await supabase
            .from('categories')
            .select('name')
            .eq('id', item.category_id)
            .single();
          
          if (categoryData) {
            return { ...item, category_name: categoryData.name };
          }
        } catch (err) {
          console.error('Error fetching category name:', err);
        }
      }
      return item;
    }));
    
    // Proceed with insertion
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        shipping_info: order.shipping_info,
        order_items: orderItems,
        total_amount: order.total_amount,
        payment_method: order.payment_method,
        status: order.status || 'pending',
        user_id: order.user_id
      }])
      .select('id')
      .single();
    
    if (error) {
      console.error('Insert error details:', error);
      throw error;
    }
    
    return { success: true, orderId: data?.id };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { 
      success: false, 
      error: error?.message || 'Unknown error occurred when creating order'
    };
  }
};