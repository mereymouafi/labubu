# Labubu Maroc Database Setup

This directory contains SQL scripts to set up and configure the database for the Labubu Maroc e-commerce site.

## Characters Implementation

The `create_characters_table.sql` script creates the characters table and modifies the products table to include references to categories, collections, and characters.

### How to Run the SQL Script

1. Log in to your Supabase dashboard at [https://app.supabase.io](https://app.supabase.io)
2. Select your project (URL: https://kwpgsqzgmimxodnkjsly.supabase.co)
3. Go to the SQL Editor section
4. Copy and paste the contents of `create_characters_table.sql` into the SQL editor
5. Run the script by clicking the "Run" button

### What the Script Does

1. Creates a `characters` table with the following fields:
   - `id` (UUID, primary key)
   - `name` (text, required)
   - `slug` (text, required, unique)
   - `description` (text, optional)
   - `image` (text, optional)
   - `created_at` (timestamp, auto-generated)

2. Inserts the following characters into the table:
   - Soymilk
   - Lychee Berry
   - Green Grape
   - Sea Salt Coconut
   - Toffee
   - Sesame Bean

3. Modifies the `products` table to add foreign key references:
   - `character_id` - references characters(id)
   - `category_id` - references categories(id)
   - `collection_id` - references collections(id)

4. Creates indexes for better query performance

## Next Steps After Running the Script

1. Upload character images to the Supabase storage bucket in a `characters/` folder
2. Update existing products to reference the appropriate character, category, and collection IDs
3. Test the character dropdown navigation and character product pages in the application

## Frontend Implementation

The frontend implementation includes:

1. A dropdown navigation for Characters in the Header component
2. A Characters page that displays all available characters
3. A CharacterProducts page that displays products for a specific character
4. API functions in the Supabase library to fetch characters and products by character
