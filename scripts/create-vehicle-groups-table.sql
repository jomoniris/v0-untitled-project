-- Create vehicle_groups table if it doesn't exist
CREATE TABLE IF NOT EXISTS vehicle_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) NOT NULL UNIQUE,
  description VARCHAR(100) NOT NULL,
  sip_code VARCHAR(10),
  class VARCHAR(50) NOT NULL,
  auto_allocate BOOLEAN DEFAULT TRUE,
  fuel_type VARCHAR(20) NOT NULL,
  tank_capacity INTEGER,
  doors INTEGER NOT NULL,
  suitcases INTEGER,
  pax INTEGER NOT NULL,
  bags INTEGER,
  min_age INTEGER,
  young_driver_limit INTEGER,
  max_age_limit INTEGER,
  driving_years INTEGER,
  senior_limit INTEGER,
  upgrade_mode VARCHAR(20),
  alternate_groups VARCHAR(100),
  image_path VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add some sample data if the table is empty
INSERT INTO vehicle_groups (
  code, description, sip_code, class, auto_allocate, fuel_type, 
  tank_capacity, doors, suitcases, pax, bags, min_age, 
  young_driver_limit, max_age_limit, driving_years, senior_limit, 
  upgrade_mode, alternate_groups, image_path
)
SELECT
  'ECON', 'Economy', 'ECAR', 'economy', TRUE, 'petrol',
  45, 4, 1, 5, 1, 21,
  25, 75, 2, 70,
  'automatic', 'compact', '/urban-civic-night.png'
WHERE NOT EXISTS (SELECT 1 FROM vehicle_groups WHERE code = 'ECON');

INSERT INTO vehicle_groups (
  code, description, sip_code, class, auto_allocate, fuel_type, 
  tank_capacity, doors, suitcases, pax, bags, min_age, 
  young_driver_limit, max_age_limit, driving_years, senior_limit, 
  upgrade_mode, alternate_groups, image_path
)
SELECT
  'COMP', 'Compact', 'CCAR', 'compact', TRUE, 'petrol',
  50, 4, 2, 5, 2, 21,
  25, 75, 2, 70,
  'automatic', 'midsize', '/urban-rav4-adventure.png'
WHERE NOT EXISTS (SELECT 1 FROM vehicle_groups WHERE code = 'COMP');

INSERT INTO vehicle_groups (
  code, description, sip_code, class, auto_allocate, fuel_type, 
  tank_capacity, doors, suitcases, pax, bags, min_age, 
  young_driver_limit, max_age_limit, driving_years, senior_limit, 
  upgrade_mode, alternate_groups, image_path
)
SELECT
  'PREM', 'Premium', 'PCAR', 'premium', FALSE, 'petrol',
  60, 4, 3, 5, 2, 25,
  30, 75, 3, 70,
  'manual', 'luxury', '/sleek-bmw-cityscape.png'
WHERE NOT EXISTS (SELECT 1 FROM vehicle_groups WHERE code = 'PREM');

INSERT INTO vehicle_groups (
  code, description, sip_code, class, auto_allocate, fuel_type, 
  tank_capacity, doors, suitcases, pax, bags, min_age, 
  young_driver_limit, max_age_limit, driving_years, senior_limit, 
  upgrade_mode, alternate_groups, image_path
)
SELECT
  'LUXE', 'Luxury', 'LCAR', 'luxury', FALSE, 'petrol',
  70, 4, 4, 5, 3, 25,
  30, 75, 5, 70,
  'restricted', 'none', '/sleek-electric-sedan.png'
WHERE NOT EXISTS (SELECT 1 FROM vehicle_groups WHERE code = 'LUXE');
