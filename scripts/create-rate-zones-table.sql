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

-- Insert some sample data if the table is empty
INSERT INTO rate_zones (code, name, description)
SELECT 'DEFAULT', 'Default Zone', 'Default rate zone for all locations'
WHERE NOT EXISTS (SELECT 1 FROM rate_zones LIMIT 1);
