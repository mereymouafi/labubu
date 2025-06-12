// Script to update the price of the "Exciting Macaron" product
import { supabase } from '../lib/supabase';

const updateProductPrice = async () => {
  try {
    // Update the price for the "Exciting Macaron" product
    const { data, error } = await supabase
      .from('products')
      .update({ price: 119 })
      .eq('name', 'EXCITING MACARON')
      .select();

    if (error) {
      console.error('Error updating product price:', error);
      return;
    }

    console.log('Product price updated successfully:', data);
  } catch (err) {
    console.error('Error in update operation:', err);
  }
};

updateProductPrice();
