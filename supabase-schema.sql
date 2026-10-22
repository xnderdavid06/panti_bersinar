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

-- 7. Table Facilities (Fasilitas Panti Asuhan)
create table if not exists public.facilities (
  id text primary key,
  name text not null,
  photo text,
  description text,
  sort_order int default 0,
  updated_at timestamptz default now()
);

-- 8. Table Activities (Aktivitas Harian / Mingguan Panti)
create table if not exists public.activities (
  id text primary key,
  title text not null,
  schedule text not null,
  photo text,
  description text,
  sort_order int default 0,
  updated_at timestamptz default now()
);

-- 9. Table Homes (Detail Cabang Asrama Panti Asuhan)
create table if not exists public.homes (
  id text primary key,
  name text not null,
  contact text not null,
  location text not null,
  maps_link text,
  visit_activities text,
  visiting_hours text,
  description text,
  logo text,
  photo text,
  sort_order int default 0,
  is_sample boolean default false,
  updated_at timestamptz default now()
);

-- 10. Table Visits (Kunjungan Tamu / Donatur / Komunitas)
create table if not exists public.visits (
  id text primary key,
  visitor text not null,
  contact text not null,
  home text not null,
  date text not null,
  people int default 1,
  notes text,
  received text not null
);

-- 11. Table WhatsApp Pledges (Komitmen Donasi WhatsApp)
create table if not exists public.whatsapp_pledges (
  id text primary key,
  amount numeric not null,
  date text not null
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
alter table public.facilities enable row level security;
alter table public.activities enable row level security;
alter table public.homes enable row level security;
alter table public.visits enable row level security;
alter table public.whatsapp_pledges enable row level security;

-- Public can read website content
create policy "Allow public read site_settings" on public.site_settings for select using (true);
create policy "Allow public read branches" on public.branches for select using (true);
create policy "Allow public read core_values" on public.core_values for select using (true);
create policy "Allow public read faqs" on public.faqs for select using (true);
create policy "Allow public read donations" on public.donations for select using (true);
create policy "Allow public read volunteers" on public.volunteers for select using (true);
create policy "Allow public read facilities" on public.facilities for select using (true);
create policy "Allow public read activities" on public.activities for select using (true);
create policy "Allow public read homes" on public.homes for select using (true);
create policy "Allow public read visits" on public.visits for select using (true);
create policy "Allow public read whatsapp_pledges" on public.whatsapp_pledges for select using (true);

-- Public can insert volunteer application, donations, visits, pledges
create policy "Allow public insert volunteers" on public.volunteers for insert with check (true);
create policy "Allow public insert donations" on public.donations for insert with check (true);
create policy "Allow public insert visits" on public.visits for insert with check (true);
create policy "Allow public insert whatsapp_pledges" on public.whatsapp_pledges for insert with check (true);

-- Allow updates (for admins or registered users)
create policy "Allow update site_settings" on public.site_settings for all using (true);
create policy "Allow update branches" on public.branches for all using (true);
create policy "Allow update core_values" on public.core_values for all using (true);
create policy "Allow update faqs" on public.faqs for all using (true);
create policy "Allow update volunteers" on public.volunteers for all using (true);
create policy "Allow update donations" on public.donations for all using (true);
create policy "Allow update facilities" on public.facilities for all using (true);
create policy "Allow update activities" on public.activities for all using (true);
create policy "Allow update homes" on public.homes for all using (true);
create policy "Allow update visits" on public.visits for all using (true);
create policy "Allow update whatsapp_pledges" on public.whatsapp_pledges for all using (true);

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
alter publication supabase_realtime add table public.facilities;
alter publication supabase_realtime add table public.activities;
alter publication supabase_realtime add table public.homes;
alter publication supabase_realtime add table public.visits;
alter publication supabase_realtime add table public.whatsapp_pledges;
