-- ==============================================================================
-- YAYASAN RUMAH BERSINAR - SUPABASE SCHEMA & REALTIME SETUP
-- Paste script ini di Supabase Dashboard -> SQL Editor -> Klik "Run"
-- ==============================================================================

-- 1. Table Site Settings (Hero, Story, Contacts, Tagline)
create table if not exists public.site_settings (
  id text primary key default 'current',
  settings jsonb not null,
  updated_at timestamptz default now()
);

-- 2. Table Branches (4 Panti Asuhan Surabaya & Sidoarjo)
create table if not exists public.branches (
  id text primary key,
  data jsonb not null,
  sort_order int default 0,
  updated_at timestamptz default now()
);

-- 3. Table Core Values (5 Nilai Dasar Yayasan)
create table if not exists public.core_values (
  id text primary key,
  data jsonb not null,
  sort_order int default 0,
  updated_at timestamptz default now()
);

-- 4. Table FAQs (Tanya Jawab Yayasan)
create table if not exists public.faqs (
  id text primary key,
  question text not null,
  answer text not null,
  sort_order int default 0,
  updated_at timestamptz default now()
);

-- 5. Table Volunteers (Pendaftar Relawan Realtime)
create table if not exists public.volunteers (
  id text primary key,
  full_name text not null,
  email text not null,
  phone text not null,
  institution text,
  preferred_branch_id text,
  preferred_branch_name text,
  role text,
  availability text,
  motivation text,
  submitted_at timestamptz default now(),
  status text default 'Pending'
);

-- 6. Table Donations (Buku Kas Donasi Realtime)
create table if not exists public.donations (
  transaction_id text primary key,
  donor_name text not null,
  donor_email text,
  donor_phone text,
  amount numeric not null,
  program_id text,
  program_title text,
  payment_method text,
  prayer_message text,
  is_anonymous boolean default false,
  timestamp timestamptz default now(),
  status text default 'Verified'
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.site_settings enable row level security;
alter table public.branches enable row level security;
alter table public.core_values enable row level security;
alter table public.faqs enable row level security;
alter table public.volunteers enable row level security;
alter table public.donations enable row level security;

-- Public can read website content
create policy "Allow public read site_settings" on public.site_settings for select using (true);
create policy "Allow public read branches" on public.branches for select using (true);
create policy "Allow public read core_values" on public.core_values for select using (true);
create policy "Allow public read faqs" on public.faqs for select using (true);
create policy "Allow public read donations" on public.donations for select using (true);
create policy "Allow public read volunteers" on public.volunteers for select using (true);

-- Public can insert volunteer application & donations
create policy "Allow public insert volunteers" on public.volunteers for insert with check (true);
create policy "Allow public insert donations" on public.donations for insert with check (true);

-- Allow updates (for admins or registered users)
create policy "Allow update site_settings" on public.site_settings for all using (true);
create policy "Allow update branches" on public.branches for all using (true);
create policy "Allow update core_values" on public.core_values for all using (true);
create policy "Allow update faqs" on public.faqs for all using (true);
create policy "Allow update volunteers" on public.volunteers for all using (true);
create policy "Allow update donations" on public.donations for all using (true);

-- ==============================================================================
-- ENABLE REALTIME ON ALL TABLES
-- ==============================================================================
-- Mengaktifkan pengiriman event realtime (INSERT, UPDATE, DELETE)
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;

alter publication supabase_realtime add table public.site_settings;
alter publication supabase_realtime add table public.branches;
alter publication supabase_realtime add table public.core_values;
alter publication supabase_realtime add table public.faqs;
alter publication supabase_realtime add table public.volunteers;
alter publication supabase_realtime add table public.donations;
