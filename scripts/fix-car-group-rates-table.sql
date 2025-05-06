-- Check if the id column has a primary key constraint
SELECT 
    pg_get_constraintdef(con.oid) as constraint_def
FROM 
    pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE 
    rel.relname = 'car_group_rates'
    AND con.contype = 'p';

-- Check if there's a sequence for the id column
SELECT pg_get_serial_sequence('car_group_rates', 'id') as id_sequence;

-- Create a sequence for the id column if it doesn't exist
DO $$
BEGIN
    IF (SELECT pg_get_serial_sequence('car_group_rates', 'id')) IS NULL THEN
        CREATE SEQUENCE car_group_rates_id_seq;
        ALTER TABLE car_group_rates ALTER COLUMN id SET DEFAULT nextval('car_group_rates_id_seq');
        ALTER SEQUENCE car_group_rates_id_seq OWNED BY car_group_rates.id;
        -- Set the sequence to the max id value + 1
        PERFORM setval('car_group_rates_id_seq', COALESCE((SELECT MAX(id) FROM car_group_rates), 0) + 1, false);
    END IF;
END $$;

-- Add primary key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
        WHERE rel.relname = 'car_group_rates' AND con.contype = 'p'
    ) THEN
        ALTER TABLE car_group_rates ADD PRIMARY KEY (id);
    END IF;
END $$;

-- Verify the changes
SELECT 
    pg_get_constraintdef(con.oid) as constraint_def
FROM 
    pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE 
    rel.relname = 'car_group_rates'
    AND con.contype = 'p';

SELECT pg_get_serial_sequence('car_group_rates', 'id') as id_sequence;
