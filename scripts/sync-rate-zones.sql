-- Create a function to sync zones to rate_zones
CREATE OR REPLACE FUNCTION sync_zones_to_rate_zones() RETURNS void AS $$
BEGIN
    -- First, ensure the rate_zones table exists
    CREATE TABLE IF NOT EXISTS rate_zones (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Insert zones that don't exist in rate_zones
    INSERT INTO rate_zones (code, name, description, active)
    SELECT 
        z.code, 
        COALESCE(z.description, z.code) as name, 
        z.description, 
        z.active
    FROM 
        zones z
    LEFT JOIN 
        rate_zones rz ON z.code = rz.code
    WHERE 
        rz.id IS NULL;

    -- Update the rental_rates table to use the correct rate_zone_id
    UPDATE rental_rates rr
    SET rate_zone_id = rz.id
    FROM zones z
    JOIN rate_zones rz ON z.code = rz.code
    WHERE rr.rate_zone_id::text = z.id::text;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT sync_zones_to_rate_zones();
