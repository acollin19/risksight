-- Add hierarchical attributes to product_codes table
ALTER TABLE product_codes 
ADD COLUMN IF NOT EXISTS product_type TEXT,
ADD COLUMN IF NOT EXISTS sub_category TEXT,
ADD COLUMN IF NOT EXISTS processing_type TEXT;

-- Update existing coffee products with hierarchical data
UPDATE product_codes 
SET product_type = 'Coffee',
    sub_category = 'Caffeinated',
    processing_type = 'Roasted'
WHERE code = '0901.21';

UPDATE product_codes 
SET product_type = 'Coffee',
    category = 'Coffee beans',
    sub_category = 'Decaf',
    processing_type = 'Not Roasted'
WHERE code = '0903.24';

UPDATE product_codes 
SET product_type = 'Equipment',
    sub_category = 'Espresso Machines',
    processing_type = 'Electric'
WHERE code = '8516.71';

UPDATE product_codes 
SET product_type = 'Supplies',
    sub_category = 'Coffee Filters',
    processing_type = 'Clean'
WHERE code = '48373.1'; 

UPDATE product_codes 
SET product_type = 'Syrups',
    sub_category = 'Syrups',
    processing_type = 'Liquid'
WHERE code = '2106.90';

UPDATE product_codes 
SET product_type = 'Ingredients',
    sub_category = 'Syrups',
    processing_type = 'Liquid'
WHERE code = '1302.19';

-- Add more sample coffee products for demonstration
INSERT INTO product_codes (code, name, category, base_tariff, material_tariff, product_type, sub_category, processing_type)
VALUES 
  ('0901.24', 'Caffeinated Roasted Coffee Beans', 'Coffee Beans', 12, 5, 'Coffee', 'Caffeinated', 'Roasted'),
  ('0901.34', 'Caffeinated Unroasted Coffee Beans', 'Coffee Beans', 10, 4, 'Coffee', 'Caffeinated', 'Not Roasted'),
  ('0903.35', 'Decaf Roasted Coffee Beans', 'Coffee Beans', 12, 5, 'Coffee', 'Decaf', 'Roasted'),
  ('0903.43', 'Decaf Unroasted Coffee Beans', 'Coffee Beans', 10, 4, 'Coffee', 'Decaf', 'Not Roasted'),
  ('0901.32', 'Caffeinated Coffee Products', 'Coffee Products', 15, 6, 'Coffee', 'Caffeinated', 'Processed'),
  -- filters
  ('0344.98', 'Small Filter', 'Coffee Products', 15, 6, 'Coffee', 'Small', 'Clean'),
  ('0344.21', 'Large Filter', 'coffee Products', 15, 6, 'Coffee', 'Large', 'Clean'),
  -- equipment
  ('8516.72', 'Drip Coffee Maker', 'Coffee Equipment', 18, 7, 'Equipment', 'Drip Maker', 'Electric'),
  ('8516.73', 'French Press', 'Coffee Equipment', 10, 3, 'Equipment', 'French Press', 'Manual'),
  ('8516.74', 'Cold Brew Maker', 'Coffee Equipment', 12, 4, 'Equipment', 'Cold Brew', 'Manual'),
  -- accessories
  ('9617.00', 'Coffee Scoop', 'Accessories', 5, 2, 'Accessories', 'Scoop', 'Solid'),
  ('9617.10', 'Coffee Tamper', 'Accessories', 7, 3, 'Accessories', 'Tamper', 'Solid'),
  ('9617.20', 'Milk Frother', 'Accessories', 15, 5, 'Accessories', 'Frother', 'Electric'),
  -- syrups
  ('2106.12', 'Vanilla Syrup', 'Syrups', 10, 0, 'Syrups', 'Vanilla', 'Liquid'),
  ('2106.95', 'Caramel Syrup', 'Syrups', 12, 0, 'Syrups', 'Caramel', 'Liquid'),
  ('2106.24', 'Hazelnut Syrup', 'Syrups', 11, 0, 'Syrups', 'Hazelnut', 'Liquid'),
  ('2106.53', 'Chocolate Syrup', 'Syrups', 13, 0, 'Syrups', 'Chocolate', 'Liquid'),
  ('2106.43', 'Pumpkin Spice Syrup', 'Syrups', 14, 0, 'Syrups', 'Pumpkin Spice', 'Liquid'),
  -- mugs
  ('6912.00', 'Ceramic Coffee Mug', 'Mugs', 5, 2, 'Mugs', 'Ceramic', 'Solid'),
  ('6913.10', 'Glass Coffee Mug', 'Mugs', 6, 3, 'Mugs', 'Glass', 'Solid'),
  ('3924.90', 'Plastic Coffee Mug', 'Mugs', 4, 1, 'Mugs', 'Plastic', 'Solid'),
  ('7323.93', 'Stainless Steel Coffee Mug', 'Mugs', 7, 4, 'Mugs', 'Stainless Steel', 'Solid')
  --
ON CONFLICT (code) DO NOTHING;