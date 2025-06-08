-- Add category_id to tshirt_details table
ALTER TABLE tshirt_details 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tshirt_details_category_id ON tshirt_details(category_id);

-- Update order_items type to include category information
-- Note: This is a modification to the JSONB schema, not a table structure change
COMMENT ON COLUMN orders.order_items IS 'Order items including product details and category information';
