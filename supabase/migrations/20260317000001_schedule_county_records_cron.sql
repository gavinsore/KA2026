-- Schedule the scrape-county-records Edge Function to run every Monday at 03:00 UTC.
-- Requires the pg_cron and pg_net extensions to be enabled on your Supabase project.
-- Enable them via: Supabase Dashboard > Database > Extensions > pg_cron and pg_net

-- NOTE: The Edge Function URL and service role key are stored as database settings.
-- Set these in the Supabase Dashboard > Database > Extensions > pg_cron or via:
--   alter database postgres set app.edge_fn_url = 'https://<your-project-ref>.supabase.co/functions/v1';
--   alter database postgres set app.service_role_key = '<your-service-role-key>';
-- Or hard-code the values below if preferred.

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
            url := current_setting('app.edge_fn_url', true) || '/scrape-county-records',
            headers := jsonb_build_object(
                'Content-Type',  'application/json',
                'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
            ),
            body := '{}'::jsonb
        );
    $$
);
