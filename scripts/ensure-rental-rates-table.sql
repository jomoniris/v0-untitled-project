-- Check if rental_rates table exists, if not create it
CREATE TABLE IF NOT EXISTS rental_rates (
  id SERIAL PRIMARY KEY,
  rate_id VARCHAR(50) NOT NULL,
  rate_name VARCHAR(100) NOT NULL,
  pickup_start_date DATE NOT NULL,
  pickup_end_date DATE NOT NULL,
  rate_zone_id VARCHAR(100),
  booking_start_date DATE,
  booking_end_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Check if rate_zones table exists, if not create it
CREATE TABLE IF NOT EXISTS rate_zones (
  id VARCHAR(100) PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data if the table is empty
INSERT INTO rate_zones (id, code, name)
SELECT 'SAMPLE-ZONE-1', 'ZONE1', 'Sample Zone 1'
WHERE NOT EXISTS (SELECT 1 FROM rate_zones LIMIT 1);

-- Insert sample data if the rental_rates table is empty
INSERT INTO rental_rates (rate_id, rate_name, pickup_start_date, pickup_end_date, rate_zone_id, booking_start_date, booking_end_date, active)
SELECT 
  'SAMPLE-RATE-1', 
  'Sample Rate 1', 
  CURRENT_DATE, 
  CURRENT_DATE + INTERVAL '30 days', 
  'SAMPLE-ZONE-1',
  CURRENT_DATE - INTERVAL '30 days',
  CURRENT_DATE + INTERVAL '60 days',
  true
WHERE NOT EXISTS (SELECT 1 FROM rental_rates LIMIT 1);
