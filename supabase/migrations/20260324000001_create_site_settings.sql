-- Create site_settings table for storing configurable key-value settings
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public) to read settings (needed by the public beginners page)
CREATE POLICY "Allow public read of site_settings"
    ON site_settings FOR SELECT
    USING (true);

-- Allow authenticated users (admins) to update settings
CREATE POLICY "Allow authenticated users to update site_settings"
    ON site_settings FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Seed initial beginner course prices
INSERT INTO site_settings (key, value, description) VALUES
    ('beginners_price_adult', '40', 'Adult beginners course fee in GBP'),
    ('beginners_price_junior', '30', 'Junior beginners course fee in GBP')
ON CONFLICT (key) DO NOTHING;
