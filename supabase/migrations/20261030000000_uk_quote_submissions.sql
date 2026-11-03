-- Quote form submissions for betranslated.co.uk (app/api/quote/route.js).
-- Modelled on public.betranslated_es_quote_submissions. Not applied by this
-- repo: Mike or Andre runs it on the Supabase project. public schema with a
-- prefix, because the project's PostgREST only exposes public/ops/ticketing.
create table if not exists public.betranslated_uk_quote_submissions (
  id uuid primary key default gen_random_uuid(),
  received_at timestamptz not null default now(),
  kind text check (kind in ('translation', 'certified', 'interpreting')),
  name text not null,
  email text not null,
  phone text,
  languages text,
  message text,
  deadline date,
  files text[] not null default '{}',
  -- Fields that differ per form (subject, document type, event dates...) and the
  -- visit attribution (details -> attribution: referrer, landing_page, utm_*, gclid...).
  details jsonb not null default '{}'::jsonb,
  ip text
);

-- Rate limit: the route counts recent rows per IP.
create index if not exists betranslated_uk_quote_submissions_ip_received_idx
  on public.betranslated_uk_quote_submissions (ip, received_at);

alter table public.betranslated_uk_quote_submissions enable row level security;

-- Writes and reads only through the service role key used by the route.
-- No policies and no grants for anon or authenticated.
revoke all on public.betranslated_uk_quote_submissions from anon, authenticated;
