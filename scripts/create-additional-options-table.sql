-- Create additional_options table if it doesn't exist
CREATE TABLE IF NOT EXISTS additional_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) NOT NULL UNIQUE,
  description VARCHAR(100) NOT NULL,
  option_type VARCHAR(50) NOT NULL,
  mandatory_surcharge BOOLEAN DEFAULT FALSE,
  calculation_type VARCHAR(50) NOT NULL,
  excess_weight INTEGER DEFAULT 0,
  limitation_type VARCHAR(50),
  minimum_charge DECIMAL(10, 2),
  maximum_charge DECIMAL(10, 2),
  replacement_fee DECIMAL(10, 2),
  nominal_account VARCHAR(50),
  multiple_items BOOLEAN DEFAULT FALSE,
  primary_tax_exempt BOOLEAN DEFAULT FALSE,
  secondary_tax_exempt BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  prevent_price_change BOOLEAN DEFAULT FALSE,
  leasing BOOLEAN DEFAULT FALSE,
  commission_rate DECIMAL(5, 2),
  print_text TEXT,
  print_memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data if the table is empty
INSERT INTO additional_options (
  code, 
  description, 
  option_type, 
  mandatory_surcharge, 
  calculation_type,
  excess_weight,
  active
)
SELECT
  'GPS', 'GPS Navigation System', 'Equipment', FALSE, 'Daily', 0, TRUE
WHERE NOT EXISTS (SELECT 1 FROM additional_options WHERE code = 'GPS');

INSERT INTO additional_options (
  code, 
  description, 
  option_type, 
  mandatory_surcharge, 
  calculation_type,
  excess_weight,
  active
)
SELECT
  'CSEAT', 'Child Safety Seat', 'Equipment', FALSE, 'Daily', 0, TRUE
WHERE NOT EXISTS (SELECT 1 FROM additional_options WHERE code = 'CSEAT');

INSERT INTO additional_options (
  code, 
  description, 
  option_type, 
  mandatory_surcharge, 
  calculation_type,
  excess_weight,
  active
)
SELECT
  'WIFI', 'Portable WiFi Hotspot', 'Equipment', FALSE, 'Daily', 0, TRUE
WHERE NOT EXISTS (SELECT 1 FROM additional_options WHERE code = 'WIFI');

INSERT INTO additional_options (
  code, 
  description, 
  option_type, 
  mandatory_surcharge, 
  calculation_type,
  excess_weight,
  active
)
SELECT
  'INSUR', 'Additional Insurance', 'Insurance', TRUE, 'Daily', 0, TRUE
WHERE NOT EXISTS (SELECT 1 FROM additional_options WHERE code = 'INSUR');

INSERT INTO additional_options (
  code, 
  description, 
  option_type, 
  mandatory_surcharge, 
  calculation_type,
  excess_weight,
  active
)
SELECT
  'ROADAST', 'Roadside Assistance', 'Service', FALSE, 'Rental', 0, TRUE
WHERE NOT EXISTS (SELECT 1 FROM additional_options WHERE code = 'ROADAST');
