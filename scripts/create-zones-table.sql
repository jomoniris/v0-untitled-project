-- Create zones table if it doesn't exist
CREATE TABLE IF NOT EXISTS zones (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data if the table is empty
INSERT INTO zones (code, description)
SELECT 'ZONE HQ', 'Headquarters Zone'
WHERE NOT EXISTS (SELECT 1 FROM zones LIMIT 1);

INSERT INTO zones (code, description)
SELECT 'ZONE EAST', 'Eastern Region Zone'
WHERE NOT EXISTS (SELECT 1 FROM zones WHERE code = 'ZONE EAST');

INSERT INTO zones (code, description)
SELECT 'ZONE WEST', 'Western Region Zone'
WHERE NOT EXISTS (SELECT 1 FROM zones WHERE code = 'ZONE WEST');
