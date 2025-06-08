// This is a utility script to add a test figurine product directly from the browser console
// To use it: 
// 1. Open your browser console on your website
// 2. Copy and paste this entire script
// 3. Press Enter to execute it

(async function() {
  // Import the Supabase client
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  
  // Supabase connection details (these should match your project's)
  const supabaseUrl = 'https://kwpgsqzgmimxodnkjsly.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3cGdzcXpnbWlteG9kbmtqc2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2OTkyMzYsImV4cCI6MjA2NDI3NTIzNn0.t5jy6DEkBNXaCofJvqnu3jrvjEXml0W9sj1KSZVu5OI';
  
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Step 1: Get the Figurines category ID
  console.log('Fetching Figurines category ID...');
  const { data: categoryData, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('name', 'Figurines')
    .single();
  
  if (categoryError) {
    console.error('Error fetching category:', categoryError);
    return;
  }
  
  if (!categoryData) {
    console.error('Figurines category not found!');
    return;
  }
  
  const categoryId = categoryData.id;
  console.log('Found Figurines category ID:', categoryId);
  
  // Step 2: Create a test figurine product
  const testProduct = {
    id: crypto.randomUUID(), // Generate a random UUID
    name: 'Test Labubu Figurine',
    price: 29.99,
    original_price: 34.99,
    images: ['https://i.imgur.com/XYZabc.jpg'], // Replace with an actual image URL
    category: 'Figurines', // Set the category name
    collection: 'Test Collection',
    description: 'This is a test Labubu figurine for debugging purposes.',
    stock_status: 'in_stock',
    created_at: new Date().toISOString(),
    category_id: categoryId // Set the category ID
  };
  
  console.log('Creating test figurine product...');
  const { data: productData, error: productError } = await supabase
    .from('products')
    .insert([testProduct])
    .select();
  
  if (productError) {
    console.error('Error creating product:', productError);
    return;
  }
  
  console.log('Test figurine product created successfully:', productData);
  console.log('Please refresh the figurines page to see the new product.');
})();
