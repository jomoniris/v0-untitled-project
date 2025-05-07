-- Check if rate_additional_options table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'rate_additional_options'
    ) THEN
        -- Create rate_additional_options table
        CREATE TABLE rate_additional_options (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            rental_rate_id UUID NOT NULL,
            additional_option_id UUID NOT NULL,
            included BOOLEAN DEFAULT true,
            customer_pays BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_rental_rate FOREIGN KEY (rental_rate_id) REFERENCES rental_rates(id) ON DELETE CASCADE,
            CONSTRAINT fk_additional_option FOREIGN KEY (additional_option_id) REFERENCES additional_options(id) ON DELETE CASCADE,
            CONSTRAINT unique_rate_option UNIQUE (rental_rate_id, additional_option_id)
        );
        
        RAISE NOTICE 'Created rate_additional_options table';
    ELSE
        RAISE NOTICE 'rate_additional_options table already exists';
    END IF;
END $$;
