-- Create non_revenue_movements table if it doesn't exist
CREATE TABLE IF NOT EXISTS non_revenue_movements (
  id VARCHAR(20) PRIMARY KEY,
  work_order_type VARCHAR(20) NOT NULL,
  supplier VARCHAR(100),
  claim VARCHAR(100),
  vehicle VARCHAR(100) NOT NULL,
  driver VARCHAR(20) NOT NULL,
  movement_reason VARCHAR(20) NOT NULL,
  created_by VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  checkout_location VARCHAR(20) NOT NULL,
  checkin_location VARCHAR(20),
  checkout_datetime TIMESTAMP NOT NULL,
  checkout_mileage INTEGER NOT NULL,
  checkout_tank INTEGER NOT NULL,
  checkin_datetime TIMESTAMP,
  checkin_mileage INTEGER,
  checkin_tank INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create non_revenue_movement_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS non_revenue_movement_items (
  id SERIAL PRIMARY KEY,
  movement_id VARCHAR(20) NOT NULL REFERENCES non_revenue_movements(id) ON DELETE CASCADE,
  supplier VARCHAR(100),
  start_datetime TIMESTAMP,
  end_datetime TIMESTAMP,
  task VARCHAR(20) NOT NULL,
  parts VARCHAR(20) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  labor_cost DECIMAL(10, 2) NOT NULL,
  vat DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  warranty BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data if the table is empty
INSERT INTO non_revenue_movements (
  id, work_order_type, supplier, claim, vehicle, driver, 
  movement_reason, created_by, status, checkout_location, 
  checkin_location, checkout_datetime, checkout_mileage, 
  checkout_tank, checkin_datetime, checkin_mileage, 
  checkin_tank, notes
)
SELECT 
  'NRM-001', 'WOT-001', 'AutoParts Inc.', 'CLM-001', 'Toyota Camry (ABC-1234)', 'DRV-001',
  'RSN-001', 'USR-001', 'STS-001', 'LOC-001',
  NULL, '2023-05-15 09:00:00', 15000,
  75, NULL, 0,
  0, 'Regular maintenance as per schedule. Oil change and filter replacement.'
WHERE NOT EXISTS (SELECT 1 FROM non_revenue_movements WHERE id = 'NRM-001');

INSERT INTO non_revenue_movements (
  id, work_order_type, supplier, claim, vehicle, driver, 
  movement_reason, created_by, status, checkout_location, 
  checkin_location, checkout_datetime, checkout_mileage, 
  checkout_tank, checkin_datetime, checkin_mileage, 
  checkin_tank, notes
)
SELECT 
  'NRM-002', 'WOT-003', NULL, NULL, 'Honda Civic (XYZ-5678)', 'DRV-002',
  'RSN-003', 'USR-002', 'STS-002', 'LOC-002',
  NULL, '2023-05-16 10:30:00', 22000,
  60, NULL, 0,
  0, 'Transfer to downtown branch for customer pickup.'
WHERE NOT EXISTS (SELECT 1 FROM non_revenue_movements WHERE id = 'NRM-002');

INSERT INTO non_revenue_movements (
  id, work_order_type, supplier, claim, vehicle, driver, 
  movement_reason, created_by, status, checkout_location, 
  checkin_location, checkout_datetime, checkout_mileage, 
  checkout_tank, checkin_datetime, checkin_mileage, 
  checkin_tank, notes
)
SELECT 
  'NRM-003', 'WOT-002', 'Service Center', 'CLM-002', 'Ford Explorer (DEF-9012)', 'DRV-003',
  'RSN-002', 'USR-003', 'STS-003', 'LOC-004',
  'LOC-004', '2023-05-10 08:15:00', 35000,
  45, '2023-05-12 14:30:00', 35050,
  40, 'Breakdown repair. Fixed engine cooling system issue.'
WHERE NOT EXISTS (SELECT 1 FROM non_revenue_movements WHERE id = 'NRM-003');

-- Insert sample items for NRM-001
INSERT INTO non_revenue_movement_items (
  movement_id, supplier, start_datetime, end_datetime,
  task, parts, cost, labor_cost, vat, total, warranty
)
SELECT 
  'NRM-001', NULL, NULL, NULL,
  'TSK-001', 'PRT-001', 45.00, 30.00, 15.00, 90.00, FALSE
WHERE NOT EXISTS (SELECT 1 FROM non_revenue_movement_items WHERE movement_id = 'NRM-001' AND task = 'TSK-001');

INSERT INTO non_revenue_movement_items (
  movement_id, supplier, start_datetime, end_datetime,
  task, parts, cost, labor_cost, vat, total, warranty
)
SELECT 
  'NRM-001', NULL, NULL, NULL,
  'TSK-004', 'PRT-002', 25.00, 15.00, 8.00, 48.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM non_revenue_movement_items WHERE movement_id = 'NRM-001' AND task = 'TSK-004');

-- Insert sample items for NRM-003
INSERT INTO non_revenue_movement_items (
  movement_id, supplier, start_datetime, end_datetime,
  task, parts, cost, labor_cost, vat, total, warranty
)
SELECT 
  'NRM-003', 'Service Center', '2023-05-10 09:00:00', '2023-05-12 12:00:00',
  'TSK-003', 'PRT-003', 120.00, 90.00, 42.00, 252.00, FALSE
WHERE NOT EXISTS (SELECT 1 FROM non_revenue_movement_items WHERE movement_id =   120.00, 90.00, 42.00, 252.00, FALSE
WHERE NOT EXISTS (SELECT 1 FROM non_revenue_movement_items WHERE movement_id = 'NRM-003' AND task = 'TSK-003');
