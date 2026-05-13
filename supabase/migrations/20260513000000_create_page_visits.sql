-- ============================================================
-- Page Visit Tracking (cookie-free, no PII stored)
-- Raw visits: kept 12 months
-- Monthly summaries: kept 5 years
-- Requires pg_cron extension (enable via Supabase Dashboard > Database > Extensions)
-- ============================================================

-- Raw visit log (one row per page navigation, no IP stored)
CREATE TABLE IF NOT EXISTS page_visits (
    id          bigint generated always as identity primary key,
    visited_at  timestamptz not null default now(),
    page        text        not null,
    referrer    text,
    user_agent  text
);

CREATE INDEX IF NOT EXISTS idx_page_visits_visited_at ON page_visits (visited_at);
CREATE INDEX IF NOT EXISTS idx_page_visits_page       ON page_visits (page, visited_at);

ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;

-- Admins (authenticated) can read; inserts only via service_role in the Edge Function
CREATE POLICY "Admins can read page_visits"
    ON page_visits FOR SELECT
    USING (auth.role() = 'authenticated');

-- ============================================================
-- Monthly summaries (rolled up from raw data, kept 5 years)
-- ============================================================
CREATE TABLE IF NOT EXISTS page_visits_monthly (
    id          bigint generated always as identity primary key,
    year        int  not null,
    month       int  not null, -- 1 = January … 12 = December
    page        text not null,
    visit_count int  not null default 0,
    created_at  timestamptz not null default now(),
    UNIQUE (year, month, page)
);

ALTER TABLE page_visits_monthly ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read page_visits_monthly"
    ON page_visits_monthly FOR SELECT
    USING (auth.role() = 'authenticated');

-- ============================================================
-- Monthly cron: runs on the 1st of every month at 02:00 UTC
--   1. Upserts previous month's totals into page_visits_monthly
--   2. Deletes raw rows older than 12 months
--   3. Deletes monthly summaries older than 5 years (60 months)
-- ============================================================

-- Remove any previous schedule (idempotent)
SELECT cron.unschedule('monthly-visit-rollup')
WHERE EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'monthly-visit-rollup'
);

SELECT cron.schedule(
    'monthly-visit-rollup',
    '0 2 1 * *',
    $$
        -- 1. Roll up previous month into monthly summary table
        INSERT INTO page_visits_monthly (year, month, page, visit_count)
        SELECT
            EXTRACT(YEAR  FROM visited_at)::int AS year,
            EXTRACT(MONTH FROM visited_at)::int AS month,
            page,
            COUNT(*)                            AS visit_count
        FROM page_visits
        WHERE
            visited_at >= date_trunc('month', now() - interval '1 month')
            AND visited_at  < date_trunc('month', now())
        GROUP BY 1, 2, 3
        ON CONFLICT (year, month, page)
            DO UPDATE SET visit_count = EXCLUDED.visit_count;

        -- 2. Purge raw visits older than 12 months
        DELETE FROM page_visits
        WHERE visited_at < now() - interval '12 months';

        -- 3. Purge monthly summaries older than 5 years (60 months)
        DELETE FROM page_visits_monthly
        WHERE (year * 12 + month) < (
            EXTRACT(YEAR FROM now())::int * 12
            + EXTRACT(MONTH FROM now())::int
            - 60
        );
    $$
);
