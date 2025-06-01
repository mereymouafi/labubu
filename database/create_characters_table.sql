-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert characters data
INSERT INTO characters (name, slug, description, image)
VALUES 
  ('Soymilk', 'soymilk', 'Soymilk character from the Labubu collection', 'characters/soymilk.jpg'),
  ('Lychee Berry', 'lychee-berry', 'Lychee Berry character from the Labubu collection', 'characters/lychee-berry.jpg'),
  ('Green Grape', 'green-grape', 'Green Grape character from the Labubu collection', 'characters/green-grape.jpg'),
  ('Sea Salt Coconut', 'sea-salt-coconut', 'Sea Salt Coconut character from the Labubu collection', 'characters/sea-salt-coconut.jpg'),
  ('Toffee', 'toffee', 'Toffee character from the Labubu collection', 'characters/toffee.jpg'),
  ('Sesame Bean', 'sesame-bean', 'Sesame Bean character from the Labubu collection', 'characters/sesame-bean.jpg');

-- Alter products table to add foreign key references
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS character_id UUID REFERENCES characters(id),
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id),
ADD COLUMN IF NOT EXISTS collection_id UUID REFERENCES collections(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_character_id ON products(character_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_collection_id ON products(collection_id);
