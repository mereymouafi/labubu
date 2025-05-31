import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  is_new?: boolean;
  is_featured?: boolean;
  is_on_sale?: boolean;
  description?: string;
  stock_status: string;
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
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  
  return data;
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