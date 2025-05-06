-- Create rental_rates table if it doesn't exist
CREATE TABLE IF NOT EXISTS rental_rates (
  id SERIAL PRIMARY KEY,
  rate_id VARCHAR(20) NOT NULL UNIQUE,
  rate_name VARCHAR(100) NOT NULL,
  pickup_start_date DATE NOT NULL,
  pickup_end_date DATE NOT NULL,
  rate_zone_id INTEGER NOT NULL,
  booking_start_date DATE NOT NULL,
  booking_end_date DATE NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create car_group_rates table if it doesn't exist
CREATE TABLE IF NOT EXISTS car_group_rates (
  id SERIAL PRIMARY KEY,
  rental_rate_id INTEGER NOT NULL REFERENCES rental_rates(id) ON DELETE CASCADE,
  vehicle_group_id INTEGER NOT NULL,
  miles_per_day INTEGER DEFAULT 0,
  miles_rate DECIMAL(10, 2) DEFAULT 0,
  deposit_rate_cdw DECIMAL(10, 2) DEFAULT 0,
  policy_value_cdw DECIMAL(10, 2) DEFAULT 0,
  deposit_rate_pai DECIMAL(10, 2) DEFAULT 0,
  policy_value_pai DECIMAL(10, 2) DEFAULT 0,
  deposit_rate_scdw DECIMAL(10, 2) DEFAULT 0,
  policy_value_scdw DECIMAL(10, 2) DEFAULT 0,
  deposit_rate_cpp DECIMAL(10, 2) DEFAULT 0,
  policy_value_cpp DECIMAL(10, 2) DEFAULT 0,
  delivery_charges DECIMAL(10, 2) DEFAULT 0,
  rate_type VARCHAR(20) NOT NULL DEFAULT 'daily',
  included BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create daily_rates table if it doesn't exist
CREATE TABLE IF NOT EXISTS daily_rates (
  id SERIAL PRIMARY KEY,
  car_group_rate_id INTEGER NOT NULL REFERENCES car_group_rates(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  rate_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(car_group_rate_id, day_number)
);

-- Create other_rates table if it doesn't exist
CREATE TABLE IF NOT EXISTS other_rates (
  id SERIAL PRIMARY KEY,
  car_group_rate_id INTEGER NOT NULL REFERENCES car_group_rates(id) ON DELETE CASCADE,
  rate_type VARCHAR(20) NOT NULL,
  rate_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(car_group_rate_id, rate_type)
);

-- Create rate_additional_options table if it doesn't exist
CREATE TABLE IF NOT EXISTS rate_additional_options (
  id SERIAL PRIMARY KEY,
  rental_rate_id INTEGER NOT NULL REFERENCES rental_rates(id) ON DELETE CASCADE,
  additional_option_id INTEGER NOT NULL,
  included BOOLEAN DEFAULT TRUE,
  customer_pays BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(rental_rate_id, additional_option_id)
);
