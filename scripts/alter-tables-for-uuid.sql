-- Check the current column types
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'car_group_rates' AND column_name = 'vehicle_group_id';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'rate_additional_options' AND column_name = 'additional_option_id';

-- Alter the tables to use TEXT type for UUID columns
ALTER TABLE car_group_rates 
ALTER COLUMN vehicle_group_id TYPE TEXT;

ALTER TABLE rate_additional_options 
ALTER COLUMN additional_option_id TYPE TEXT;

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'car_group_rates' AND column_name = 'vehicle_group_id';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'rate_additional_options' AND column_name = 'additional_option_id';
