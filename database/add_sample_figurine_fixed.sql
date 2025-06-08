-- Script to add a sample figurine product to the database (fixed version)

-- First, get the category ID for "Figurines"
DO $$
DECLARE
    figurines_category_id UUID;
BEGIN
    -- Get the category ID
    SELECT id INTO figurines_category_id 
    FROM categories 
    WHERE name = 'Figurines';
    
    -- If we found the category ID
    IF FOUND THEN
        -- Check if we already have this sample product
        IF NOT EXISTS (
            SELECT 1 FROM products 
            WHERE name = 'Labubu Original Figurine' 
            AND category_id = figurines_category_id
        ) THEN
            -- Insert a sample figurine product
            -- Removing the 'category' field since it doesn't exist in your schema
            INSERT INTO products (
                id,
                name,
                price,
                original_price,
                images,
                collection,
                description,
                stock_status,
                created_at,
                category_id
            ) VALUES (
                uuid_generate_v4(),
                'Labubu Original Figurine',
                29.99,
                34.99,
                ARRAY['https://i.imgur.com/XYZabc.jpg'],
                'Original Collection',
                'The original Labubu figurine that started it all. This collectible stands 6 inches tall and features the iconic Labubu design.',
                'in_stock',
                NOW(),
                figurines_category_id
            );
            
            RAISE NOTICE 'Sample figurine product added successfully';
        ELSE
            RAISE NOTICE 'Sample figurine product already exists';
        END IF;
    ELSE
        RAISE NOTICE 'Figurines category not found';
    END IF;
END $$;
