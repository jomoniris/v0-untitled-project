-- Check if rate_zones table exists, if not create it
CREATE TABLE IF NOT EXISTS rate_zones (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample rate zones if none exist
INSERT INTO rate_zones (code, name, description, active)
SELECT 'NYC-DOWNTOWN', 'New York Downtown', 'Downtown area of New York City', TRUE
WHERE NOT EXISTS (SELECT 1 FROM rate_zones WHERE code = 'NYC-DOWNTOWN');

INSERT INTO rate_zones (code, name, description, active)
SELECT 'NYC-MIDTOWN', 'New York Midtown', 'Midtown area of New York City', TRUE
WHERE NOT EXISTS (SELECT 1 FROM rate_zones WHERE code = 'NYC-MIDTOWN');

INSERT INTO rate_zones (code, name, description, active)
SELECT 'NYC-UPTOWN', 'New York Uptown', 'Uptown area of New York City', TRUE
WHERE NOT EXISTS (SELECT 1 FROM rate_zones WHERE code = 'NYC-UPTOWN');

INSERT INTO rate_zones (code, name, description, active)
SELECT 'BOS-DOWNTOWN', 'Boston Downtown', 'Downtown area of Boston', TRUE
WHERE NOT EXISTS (SELECT 1 FROM rate_zones WHERE code = 'BOS-DOWNTOWN');

INSERT INTO rate_zones (code, name, description, active)
SELECT 'LAX-CENTRAL', 'Los Angeles Central', 'Central area of Los Angeles', TRUE
WHERE NOT EXISTS (SELECT 1 FROM rate_zones WHERE code = 'LAX-CENTRAL');
