-- Create vehicle_groups table if it doesn't exist
CREATE TABLE IF NOT EXISTS vehicle_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(100) NOT NULL,
  sip_code VARCHAR(10),
  class VARCHAR(50) NOT NULL,
  auto_allocate BOOLEAN DEFAULT TRUE,
  fuel_type VARCHAR(50) NOT NULL,
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
  upgrade_mode VARCHAR(50),
  alternate_groups VARCHAR(50),
  image_path TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add some sample data if the table is empty
INSERT INTO vehicle_groups (
  code, name, description, sip_code, class, auto_allocate, 
  fuel_type, tank_capacity, doors, suitcases, pax, bags, 
  min_age, young_driver_limit, max_age_limit, driving_years, 
  senior_limit, upgrade_mode, alternate_groups, image_path, active
)
SELECT
  'ECON', 'Economy', 'Small economical car', 'ECON', 'economy', TRUE,
  'petrol', 45, 4, 1, 5, 1, 
  21, 25, 75, 2, 
  70, 'automatic', 'compact', '/sleek-electric-sedan.png', TRUE
WHERE NOT EXISTS (SELECT 1 FROM vehicle_groups WHERE code = 'ECON')
UNION ALL
SELECT
  'COMP', 'Compact', 'Compact car with good fuel efficiency', 'COMP', 'compact', TRUE,
  'petrol', 50, 4, 2, 5, 2, 
  21, 25, 75, 2, 
  70, 'automatic', 'economy', '/urban-civic-night.png', TRUE
WHERE NOT EXISTS (SELECT 1 FROM vehicle_groups WHERE code = 'COMP')
UNION ALL
SELECT
  'SUV', 'SUV', 'Sport Utility Vehicle with extra space', 'SUV', 'suv', TRUE,
  'diesel', 65, 5, 3, 7, 3, 
  23, 25, 75, 3, 
  70, 'manual', 'fullsize', '/urban-rav4-adventure.png', TRUE
WHERE NOT EXISTS (SELECT 1 FROM vehicle_groups WHERE code = 'SUV')
UNION ALL
SELECT
  'LUX', 'Luxury', 'Premium luxury vehicle', 'LUX', 'luxury', FALSE,
  'hybrid', 60, 4, 3, 5, 2, 
  25, 30, 75, 5, 
  70, 'restricted', 'premium', '/sleek-bmw-cityscape.png', TRUE
WHERE NOT EXISTS (SELECT 1 FROM vehicle_groups WHERE code = 'LUX');
