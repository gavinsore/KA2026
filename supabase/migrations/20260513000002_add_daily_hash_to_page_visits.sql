-- Add daily_hash for accurate unique-visitor counting.
--
-- The hash is computed server-side as HMAC-SHA256(IP + UserAgent + UTC-date, SECRET).
-- Because the UTC date is part of the input, the same visitor gets a DIFFERENT hash
-- tomorrow — making cross-day tracking structurally impossible.
-- The HMAC secret is stored only in Supabase Edge Function secrets (never in code/DB).
-- Without the secret, the hash cannot be reversed even by enumerating all IPv4 addresses.
--
-- Legal basis: pseudonymous, day-scoped identifier. No raw IP is stored.
-- Approach mirrors Plausible Analytics data policy (widely accepted as GDPR-compliant).

ALTER TABLE page_visits
    ADD COLUMN IF NOT EXISTS daily_hash text;

CREATE INDEX IF NOT EXISTS idx_page_visits_daily_hash ON page_visits (daily_hash);
