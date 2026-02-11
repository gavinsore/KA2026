-- Create the competition_entries table
CREATE TABLE IF NOT EXISTS competition_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    competition_id TEXT NOT NULL, -- Linking to the ID in your JSON/code, not a foreign key if competitions aren't in a table with UUIDs, but they seems to be in a table now?
    -- Competitions are in a table 'competitions' based on CompetitionsManager.jsx, so let's check that structure first or assume text id for now to be safe as the JSON uses string IDs like 'spring-target-2025'.
    -- Actually CompetitionsManager.jsx selects * from 'competitions', so there is a table.
    -- Let's assume competition_id is a text field matching the 'id' or 'slug' in the competitions table.
    
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    bowtype TEXT NOT NULL,
    distance TEXT NOT NULL,
    category TEXT NOT NULL,
    age_category TEXT NOT NULL,
    dob DATE, -- Can be null for seniors
    agb_number TEXT NOT NULL,
    seated BOOLEAN DEFAULT FALSE,
    club TEXT NOT NULL,
    emergency_contact TEXT NOT NULL,
    gdpr_consent BOOLEAN DEFAULT FALSE,
    
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE competition_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to insert (recaptcha/auth might be needed later, but for now open for entries)
CREATE POLICY "Enable insert for everyone" ON competition_entries FOR INSERT WITH CHECK (true);

-- Allow admins (authenticated users) to view all
-- Assuming you have some auth set up. If not, we might need a public view for now or just restrict to anon key with caution.
-- For now, let's allow read/update/delete for authenticated users.
CREATE POLICY "Enable all access for authenticated users" ON competition_entries FOR ALL USING (auth.role() = 'authenticated');

-- Optional: Allow users to read their own entries if we had user accounts, but we don't seem to for entrants.
