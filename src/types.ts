import { Product as BaseProduct } from './lib/supabase';

// Extend the Product type to include blind box information
export interface Product extends BaseProduct {
  blindBoxInfo?: {
    level: string;
    color: string;
    quantity: number;
  };
}

// Define the shape of our cart item
export type CartItem = {
  product: Product;
  quantity: number;
  blindBoxInfo?: {
    level: string;
    color: string;
    quantity: number;
  };
};
