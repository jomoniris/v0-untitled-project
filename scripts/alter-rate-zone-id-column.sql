-- First, identify the constraint name
SELECT conname, conrelid::regclass AS table_from, 
       conrelid::regclass, a.attname AS col, 
       confrelid::regclass AS table_to, 
       af.attname AS ref_col
FROM pg_constraint c
JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
JOIN pg_attribute af ON af.attnum = ANY(c.confkey) AND af.attrelid = c.confrelid
WHERE conrelid::regclass::text = 'rental_rates' AND a.attname = 'rate_zone_id';

-- Drop the foreign key constraint
ALTER TABLE rental_rates DROP CONSTRAINT IF EXISTS rental_rates_rate_zone_id_fkey;

-- Alter the rate_zone_id column in rental_rates table to use TEXT type
ALTER TABLE rental_rates ALTER COLUMN rate_zone_id TYPE TEXT;

-- Now we need to alter the referenced table's id column as well
-- First, identify which table is referenced
SELECT ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'rental_rates'
  AND tc.constraint_name = 'rental_rates_rate_zone_id_fkey';

-- Alter the id column in rate_zones table to use TEXT type
ALTER TABLE rate_zones ALTER COLUMN id TYPE TEXT;

-- Recreate the foreign key constraint
ALTER TABLE rental_rates 
ADD CONSTRAINT rental_rates_rate_zone_id_fkey 
FOREIGN KEY (rate_zone_id) REFERENCES rate_zones(id);

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'rental_rates' AND column_name = 'rate_zone_id';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'rate_zones' AND column_name = 'id';
