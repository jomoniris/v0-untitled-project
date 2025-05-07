-- Check if rate_zones table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'rate_zones') THEN
        -- Create rate_zones table if it doesn't exist
        CREATE TABLE rate_zones (
            id SERIAL PRIMARY KEY,
            code VARCHAR(50) NOT NULL UNIQUE,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Insert default zone
        INSERT INTO rate_zones (code, name, description)
        VALUES ('DEFAULT', 'Default Zone', 'Default rate zone for all locations');
    END IF;
END
$$;

-- Create a function to copy zones from zones table to rate_zones if needed
CREATE OR REPLACE FUNCTION sync_zones_to_rate_zones() RETURNS void AS $$
DECLARE
    zone_record RECORD;
BEGIN
    FOR zone_record IN 
        SELECT id, code, description 
        FROM zones 
        WHERE code NOT IN (SELECT code FROM rate_zones)
    LOOP
        INSERT INTO rate_zones (code, name, description)
        VALUES (
            zone_record.code, 
            COALESCE(zone_record.description, zone_record.code), 
            COALESCE(zone_record.description, '')
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT sync_zones_to_rate_zones();
