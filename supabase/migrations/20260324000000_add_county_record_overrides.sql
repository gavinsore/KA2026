-- Add round_override column to county_records
-- Allows admins to set a canonical round name that overrides the raw scraped name.
-- The scraper continues to store the raw name in `round`; this column is admin-managed only.

alter table public.county_records
    add column if not exists round_override text;

-- Allow authenticated admins to update county record rows (override + manual edits)
-- The existing service-role policy already handles scraper writes.
create policy "Admins can update county records"
    on public.county_records
    for update
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');
