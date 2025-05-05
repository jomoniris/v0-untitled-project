-- Create rate_zones table if it doesn't exist
CREATE TABLE IF NOT EXISTS rate_zones (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample rate zones if the table is empty
INSERT INTO rate_zones (code, name, description, active)
SELECT 'DOMESTIC', 'Domestic', 'For domestic rentals within the country', TRUE
WHERE NOT EXISTS (SELECT 1 FROM rate_zones WHERE code = 'DOMESTIC');

INSERT INTO rate_zones (code, name, description, active)
SELECT 'INTL', 'International', 'For international rentals', TRUE
WHERE NOT EXISTS (SELECT 1 FROM rate_zones WHERE code = 'INTL');

INSERT INTO rate_zones (code, name, description, active)
SELECT 'CORP', 'Corporate', 'For corporate clients', TRUE
WHERE NOT EXISTS (SELECT 1 FROM rate_zones WHERE code = 'CORP');

-- Create vehicle_groups table if it doesn't exist
CREATE TABLE IF NOT EXISTS vehicle_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample vehicle groups if the table is empty
INSERT INTO vehicle_groups (name, description, active)
SELECT 'Economy', 'Small, fuel-efficient cars', TRUE
WHERE NOT EXISTS (SELECT 1 FROM vehicle_groups WHERE name = 'Economy');

INSERT INTO vehicle_groups (name, description, active)
SELECT 'Compact', 'Compact cars for city driving', TRUE
WHERE NOT EXISTS (SELECT 1 FROM vehicle_groups WHERE name = 'Compact');

INSERT INTO vehicle_groups (name, description, active)
SELECT 'SUV', 'Sport utility vehicles', TRUE
WHERE NOT EXISTS (SELECT 1 FROM vehicle_groups WHERE name = 'SUV');

INSERT INTO vehicle_groups (name, description, active)
SELECT 'Luxury', 'Premium luxury vehicles', TRUE
WHERE NOT EXISTS (SELECT 1 FROM vehicle_groups WHERE name = 'Luxury');

-- Create rental_rates table if it doesn't exist
CREATE TABLE IF NOT EXISTS rental_rates (
  id SERIAL PRIMARY KEY,
  rate_id VARCHAR(50) NOT NULL UNIQUE,
  rate_name VARCHAR(100) NOT NULL,
  pickup_start_date DATE NOT NULL,
  pickup_end_date DATE NOT NULL,
  rate_zone_id INTEGER REFERENCES rate_zones(id),
  booking_start_date DATE NOT NULL,
  booking_end_date DATE NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create car_group_rates table if it doesn't exist
CREATE TABLE IF NOT EXISTS car_group_rates (
  id SERIAL PRIMARY KEY,
  rental_rate_id INTEGER REFERENCES rental_rates(id) ON DELETE CASCADE,
  vehicle_group_id INTEGER REFERENCES vehicle_groups(id),
  miles_per_day INTEGER NOT NULL DEFAULT 0,
  miles_rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
  deposit_rate_cdw DECIMAL(10, 2) NOT NULL DEFAULT 0,
  policy_value_cdw DECIMAL(10, 2) NOT NULL DEFAULT 0,
  deposit_rate_pai DECIMAL(10, 2) NOT NULL DEFAULT 0,
  policy_value_pai DECIMAL(10, 2) NOT NULL DEFAULT 0,
  deposit_rate_scdw DECIMAL(10, 2) NOT NULL DEFAULT 0,
  policy_value_scdw DECIMAL(10, 2) NOT NULL DEFAULT 0,
  deposit_rate_cpp DECIMAL(10, 2) NOT NULL DEFAULT 0,
  policy_value_cpp DECIMAL(10, 2) NOT NULL DEFAULT 0,
  delivery_charges DECIMAL(10, 2) NOT NULL DEFAULT 0,
  rate_type VARCHAR(20) NOT NULL DEFAULT 'daily',
  included BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create daily_rates table if it doesn't exist
CREATE TABLE IF NOT EXISTS daily_rates (
  id SERIAL PRIMARY KEY,
  car_group_rate_id INTEGER REFERENCES car_group_rates(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  rate_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create other_rates table if it doesn't exist
CREATE TABLE IF NOT EXISTS other_rates (
  id SERIAL PRIMARY KEY,
  car_group_rate_id INTEGER REFERENCES car_group_rates(id) ON DELETE CASCADE,
  rate_type VARCHAR(20) NOT NULL,
  rate_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create additional_options table if it doesn't exist
CREATE TABLE IF NOT EXISTS additional_options (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  option_type VARCHAR(50) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample additional options if the table is empty
INSERT INTO additional_options (code, description, option_type, active)
SELECT 'GPS', 'GPS Navigation System', 'equipment', TRUE
WHERE NOT EXISTS (SELECT 1 FROM additional_options WHERE code = 'GPS');

INSERT INTO additional_options (code, description, option_type, active)
SELECT 'CHILD_SEAT', 'Child Safety Seat', 'equipment', TRUE
WHERE NOT EXISTS (SELECT 1 FROM additional_options WHERE code = 'CHILD_SEAT');

INSERT INTO additional_options (code, description, option_type, active)
SELECT 'WIFI', 'In-car WiFi Hotspot', 'equipment', TRUE
WHERE NOT EXISTS (SELECT 1 FROM additional_options WHERE code = 'WIFI');

-- Create rate_additional_options table if it doesn't exist
CREATE TABLE IF NOT EXISTS rate_additional_options (
  id SERIAL PRIMARY KEY,
  rental_rate_id INTEGER REFERENCES rental_rates(id) ON DELETE CASCADE,
  additional_option_id INTEGER REFERENCES additional_options(id),
  included BOOLEAN DEFAULT TRUE,
  customer_pays BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
