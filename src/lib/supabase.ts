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
  description?: string;
  stock_status: string;
  created_at?: string;
  category_id?: string;
  collection_id?: string;
  character_id?: string;
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