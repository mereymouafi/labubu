-- Script to ensure the Figurings category exists in the database

-- Check if the Figurings category already exists
DO $$
DECLARE
    category_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM categories WHERE name = 'Figurings'
    ) INTO category_exists;

    -- If the category doesn't exist, create it
    IF NOT category_exists THEN
        INSERT INTO categories (
            id, 
            name, 
            slug, 
            description, 
            image, 
            created_at
        ) VALUES (
            uuid_generate_v4(), -- Generate a new UUID
            'Figurings',
            'figurings',
            'Explore our collection of Labubu figurines and collectibles',
            'https://example.com/images/figurines-category.jpg', -- Replace with actual image URL
            NOW()
        );
        
        RAISE NOTICE 'Figurings category created successfully';
    ELSE
        RAISE NOTICE 'Figurings category already exists';
    END IF;
END $$;

-- Sample products for the Figurings category
-- Uncomment and modify this section if you want to add sample products

/*
DO $$
DECLARE
    category_id UUID;
BEGIN
    -- Get the category ID for Figurings
    SELECT id INTO category_id FROM categories WHERE name = 'Figurings';
    
    -- Insert sample figurine products if the category exists
    IF FOUND THEN
        -- Check if we already have figurine products
        IF NOT EXISTS (SELECT 1 FROM products WHERE category = 'Figurings' LIMIT 1) THEN
            -- Insert sample products
            INSERT INTO products (
                id,
                name,
                price,
                original_price,
                images,
                category,
                collection,
                description,
                stock_status,
                created_at,
                category_id
            ) VALUES
            (
                uuid_generate_v4(),
                'Labubu Original Figurine',
                29.99,
                34.99,
                ARRAY['https://example.com/images/labubu-original.jpg'],
                'Figurings',
                'Original Collection',
                'The original Labubu figurine that started it all. This collectible stands 6 inches tall and features the iconic Labubu design.',
                'in_stock',
                NOW(),
                category_id
            ),
            (
                uuid_generate_v4(),
                'Labubu Winter Edition',
                39.99,
                44.99,
                ARRAY['https://example.com/images/labubu-winter.jpg'],
                'Figurings',
                'Seasonal Collection',
                'Limited edition winter-themed Labubu figurine. Features a snow-covered design with festive accessories.',
                'in_stock',
                NOW(),
                category_id
            ),
            (
                uuid_generate_v4(),
                'Labubu Glow Edition',
                49.99,
                54.99,
                ARRAY['https://example.com/images/labubu-glow.jpg'],
                'Figurings',
                'Special Collection',
                'Special glow-in-the-dark Labubu figurine. Charges in daylight and glows with an eerie blue light in darkness.',
                'limited_stock',
                NOW(),
                category_id
            );
            
            RAISE NOTICE 'Sample figurine products added successfully';
        ELSE
            RAISE NOTICE 'Figurine products already exist';
        END IF;
    END IF;
END $$;
*/
