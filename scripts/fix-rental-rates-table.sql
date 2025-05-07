-- Check if rental_rates table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rental_rates') THEN
        CREATE TABLE rental_rates (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            rate_id VARCHAR(50) NOT NULL,
            rate_name VARCHAR(100) NOT NULL,
            pickup_start_date DATE NOT NULL,
            pickup_end_date DATE NOT NULL,
            rate_zone_id UUID,
            booking_start_date DATE,
            booking_end_date DATE,
            active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Add a comment to indicate this was created by the fix script
        COMMENT ON TABLE rental_rates IS 'Created by fix-rental-rates-table.sql';
    END IF;
END
$$;

-- Check if rate_zones table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rate_zones') THEN
        CREATE TABLE rate_zones (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            code VARCHAR(50) NOT NULL UNIQUE,
            name VARCHAR(100),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Add a comment to indicate this was created by the fix script
        COMMENT ON TABLE rate_zones IS 'Created by fix-rental-rates-table.sql';
    END IF;
END
$$;

-- Check if the foreign key constraint exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'rental_rates_rate_zone_id_fkey' 
        AND table_name = 'rental_rates'
    ) THEN
        ALTER TABLE rental_rates
        ADD CONSTRAINT rental_rates_rate_zone_id_fkey
        FOREIGN KEY (rate_zone_id) REFERENCES rate_zones(id);
    END IF;
END
$$;

-- Sync zones to rate_zones
INSERT INTO rate_zones (code, name)
SELECT code, name FROM zones
WHERE NOT EXISTS (
    SELECT 1 FROM rate_zones WHERE rate_zones.code = zones.code
)
ON CONFLICT (code) DO NOTHING;

-- Display table information for debugging
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name IN ('rental_rates', 'rate_zones', 'zones')
ORDER BY 
    table_name, ordinal_position;
