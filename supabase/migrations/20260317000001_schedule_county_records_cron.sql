-- Schedule the scrape-county-records Edge Function to run every Monday at 03:00 UTC.
-- Requires the pg_cron and pg_net extensions to be enabled on your Supabase project.
-- Enable them via: Supabase Dashboard > Database > Extensions > pg_cron and pg_net

-- !! FILL IN YOUR VALUES BEFORE RUNNING !!
-- Replace <YOUR-PROJECT-REF> with your Supabase project ref (e.g. abcdefghijklmnop)
-- Replace <YOUR-SERVICE-ROLE-KEY> with the service_role secret from Project Settings > API
-- NOTE: Supabase does not allow ALTER DATABASE SET for custom params, so values are inlined here.

-- Remove any existing schedule with this name (idempotent)
select cron.unschedule('weekly-county-records-refresh')
where exists (
    select 1 from cron.job where jobname = 'weekly-county-records-refresh'
);

-- Schedule: every Monday at 03:00 UTC
select cron.schedule(
    'weekly-county-records-refresh',
    '0 3 * * 1',
    $$
    select
        net.http_post(
            url := 'https://https://cyylmnxlzfbexyeufkhg.supabase.co/functions/v1/scrape-county-records',
            headers := jsonb_build_object(
                'Content-Type',  'application/json',
                'Authorization', 'Bearer <YOUR-SERVICE-ROLE-KEY>'  -- !! DO NOT COMMIT - paste key here only when running manually in Supabase SQL Editor !!
            ),
            body := '{}'::jsonb
        );
    $$
);
