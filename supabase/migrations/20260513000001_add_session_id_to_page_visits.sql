-- Add session_id to page_visits for unique-session counting.
-- A session_id is a random UUID generated in the browser's sessionStorage
-- (ephemeral — dies when the tab closes). No persistent identifier is stored
-- on the user's device, so this remains compliant with UK PECR / UK GDPR.
ALTER TABLE page_visits
    ADD COLUMN IF NOT EXISTS session_id text;

-- Index to make COUNT(DISTINCT session_id) GROUP BY date efficient
CREATE INDEX IF NOT EXISTS idx_page_visits_session ON page_visits (session_id);
