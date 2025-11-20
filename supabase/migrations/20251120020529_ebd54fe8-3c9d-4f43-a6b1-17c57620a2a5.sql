-- Add hierarchical attributes to product_codes table
ALTER TABLE product_codes 
ADD COLUMN IF NOT EXISTS product_type TEXT,
ADD COLUMN IF NOT EXISTS sub_category TEXT,
ADD COLUMN IF NOT EXISTS processing_type TEXT;

-- Update existing coffee products with hierarchical data
UPDATE product_codes 
SET product_type = 'coffee',
    sub_category = 'caffeinated',
    processing_type = 'roasted'
WHERE code = 'COFFEE-001';

UPDATE product_codes 
SET product_type = 'coffee',
    category = 'coffee beans',
    sub_category = 'decaf',
    processing_type = 'not roasted'
WHERE code = 'COFFEE-002';

-- Add more sample coffee products for demonstration
INSERT INTO product_codes (code, name, category, base_tariff, material_tariff, product_type, sub_category, processing_type)
VALUES 
  ('COFFEE-003', 'Caffeinated Roasted Coffee Beans', 'coffee beans', 12, 5, 'coffee', 'caffeinated', 'roasted'),
  ('COFFEE-004', 'Caffeinated Unroasted Coffee Beans', 'coffee beans', 10, 4, 'coffee', 'caffeinated', 'not roasted'),
  ('COFFEE-005', 'Decaf Roasted Coffee Beans', 'coffee beans', 12, 5, 'coffee', 'decaf', 'roasted'),
  ('COFFEE-006', 'Decaf Unroasted Coffee Beans', 'coffee beans', 10, 4, 'coffee', 'decaf', 'not roasted'),
  ('COFFEE-007', 'Caffeinated Coffee Products', 'coffee products', 15, 6, 'coffee', 'caffeinated', 'processed'),
  ('COFFEE-008', 'Decaf Coffee Products', 'coffee products', 15, 6, 'coffee', 'decaf', 'processed')
ON CONFLICT (code) DO NOTHING;