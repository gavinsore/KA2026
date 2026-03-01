-- Add fields to support Away Competition events
-- external_url: link to the host club's website (Away Competition only)
-- discipline: 'Clout' or 'Target' (Away Competition only)

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS external_url TEXT,
  ADD COLUMN IF NOT EXISTS discipline TEXT CHECK (discipline IN ('Clout', 'Target'));
