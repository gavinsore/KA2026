-- Create county_records table to store NCAS Northamptonshire county archery records
-- Records are populated and updated weekly by the scrape-county-records Edge Function

create table if not exists public.county_records (
    id uuid primary key default gen_random_uuid(),
    bow_type text not null,         -- e.g. 'Recurve', 'Compound', 'Longbow', 'Barebow'
    category text not null,         -- e.g. 'Men', 'Women', 'Men 50+', 'Junior Men'
    round text not null,            -- e.g. 'York', 'Portsmouth', 'WA 70m'
    score text not null default '', -- the record score
    archer_name text not null default '',
    club text not null default '',
    date_text text not null default '',   -- as shown on NCAS site, e.g. 'Sept 2012'
    is_national_record boolean not null default false,
    source_url text not null default '',  -- the NCAS page URL this was scraped from
    updated_at timestamptz not null default now(),
    -- Unique constraint: one record per bow_type + category + round combination
    unique (bow_type, category, round)
);

-- Enable Row Level Security
alter table public.county_records enable row level security;

-- Allow public read access (no auth required for viewing records)
create policy "County records are publicly readable"
    on public.county_records
    for select
    using (true);

-- Allow service role to insert/update (used by Edge Function)
create policy "Service role can manage county records"
    on public.county_records
    for all
    using (auth.role() = 'service_role');

-- Index for fast lookups by bow type and category
create index if not exists county_records_bow_type_idx on public.county_records (bow_type);
create index if not exists county_records_category_idx on public.county_records (category);
create index if not exists county_records_round_idx on public.county_records (round);
