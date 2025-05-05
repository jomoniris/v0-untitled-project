-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) NOT NULL,
  name VARCHAR(100) NOT NULL,
  metroplex VARCHAR(100) NOT NULL,
  station_type VARCHAR(50) NOT NULL,
  operating_hours VARCHAR(100) NOT NULL,
  tax1 VARCHAR(10),
  tax2 VARCHAR(10),
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  telephone VARCHAR(50),
  fax VARCHAR(50),
  latitude VARCHAR(50),
  longitude VARCHAR(50),
  nominal_account VARCHAR(50),
  dbr_next_no VARCHAR(50),
  dbr_date DATE,
  station_manager VARCHAR(100),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_locations_name ON locations(name);
CREATE INDEX IF NOT EXISTS idx_locations_code ON locations(code);
CREATE INDEX IF NOT EXISTS idx_locations_active ON locations(active);

-- Insert sample data
INSERT INTO locations (
  code, name, metroplex, station_type, operating_hours, 
  tax1, tax2, address, city, postal_code, 
  country, state, email, telephone, fax, 
  latitude, longitude, nominal_account, dbr_next_no, 
  dbr_date, station_manager, active
) VALUES 
(
  'NYC-DT', 'Downtown Office', 'New York', 'Full Service', '8:00 AM - 8:00 PM',
  '8.875', '0', '123 Main St', 'New York', '10001',
  'USA', 'NY', 'nyc.downtown@example.com', '+1 (212) 555-1234', '+1 (212) 555-5678',
  '40.7128', '-74.0060', 'NYC-001', '10001',
  '2023-04-15', 'John Smith', true
),
(
  'NYC-AP', 'Airport Terminal', 'New York', 'Airport', '24/7',
  '8.875', '0', 'JFK Airport, Terminal 4', 'New York', '11430',
  'USA', 'NY', 'nyc.airport@example.com', '+1 (212) 555-4321', '+1 (212) 555-8765',
  '40.6413', '-73.7781', 'NYC-002', '10002',
  '2023-04-15', 'Jane Doe', true
),
(
  'LAX-AP', 'LAX Airport', 'Los Angeles', 'Airport', '24/7',
  '9.5', '0', 'LAX Terminal 1', 'Los Angeles', '90045',
  'USA', 'CA', 'lax.airport@example.com', '+1 (310) 555-1234', '+1 (310) 555-5678',
  '33.9416', '-118.4085', 'LAX-001', '20001',
  '2023-04-15', 'Michael Johnson', true
),
(
  'CHI-DT', 'Chicago Downtown', 'Chicago', 'Full Service', '7:00 AM - 9:00 PM',
  '10.25', '0', '456 Michigan Ave', 'Chicago', '60601',
  'USA', 'IL', 'chicago.downtown@example.com', '+1 (312) 555-1234', '+1 (312) 555-5678',
  '41.8781', '-87.6298', 'CHI-001', '30001',
  '2023-04-15', 'Sarah Williams', false
);
