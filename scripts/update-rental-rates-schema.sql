-- Alter the car_group_rates table to use TEXT for vehicle_group_id
ALTER TABLE car_group_rates 
ALTER COLUMN vehicle_group_id TYPE TEXT;

-- Alter the rate_additional_options table to use TEXT for additional_option_id
ALTER TABLE rate_additional_options 
ALTER COLUMN additional_option_id TYPE TEXT;
