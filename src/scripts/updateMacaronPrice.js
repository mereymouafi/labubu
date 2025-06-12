// Script to update the price of the "Exciting Macaron" product
import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = 'https://kwpgsqzgmimxodnkjsly.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3cGdzcXpnbWlteG9kbmtqc2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2OTkyMzYsImV4cCI6MjA2NDI3NTIzNn0.t5jy6DEkBNXaCofJvqnu3jrvjEXml0W9sj1KSZVu5OI';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const updateProductPrice = async () => {
  try {
    // First try to update in the products table
    const { data: productData, error: productError } = await supabase
      .from('products')
      .update({ price: 119 })
      .eq('name', 'EXCITING MACARON')
      .select();

    if (productError) {
      console.error('Error updating product price:', productError);
    } else if (productData && productData.length > 0) {
      console.log('Product price updated successfully in products table:', productData);
      return;
    } else {
      console.log('No product found with name "EXCITING MACARON" in products table');
    }

    // If not found in products, try the tshirt_details table
    const { data: tshirtData, error: tshirtError } = await supabase
      .from('tshirt_details')
      .update({ price: 119 })
      .eq('option_name', 'EXCITING MACARON')
      .select();

    if (tshirtError) {
      console.error('Error updating T-shirt price:', tshirtError);
    } else if (tshirtData && tshirtData.length > 0) {
      console.log('T-shirt price updated successfully in tshirt_details table:', tshirtData);
    } else {
      console.log('No T-shirt found with option_name "EXCITING MACARON" in tshirt_details table');
    }
  } catch (err) {
    console.error('Error in update operation:', err);
  }
};

updateProductPrice();
