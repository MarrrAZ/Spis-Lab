-- =====================================================================
-- SKEMA DATABASE WEBSITE SPIS LAB
-- Jalankan file ini di: Supabase Dashboard -> SQL Editor -> New query
-- Cukup tempel semua isi file ini lalu klik "Run" sekali saja.
-- =====================================================================

-- Aktifkan ekstensi untuk membuat id acak
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. PROFILES : data akun asisten/pengelola (tertaut ke auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

-- ---------------------------------------------------------------------
-- 2. MEMBERS : dosen & asisten lab (dipakai halaman Tim & Organigram)
-- ---------------------------------------------------------------------
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('dosen', 'asisten')),
  name text not null,
  position text,               -- contoh: "Kepala Laboratorium", "Asisten Riset"
  bio text,
  email text,
  photo_url text,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.members enable row level security;

create policy "members_public_select"
  on public.members for select
  to anon, authenticated
  using (true);

create policy "members_authenticated_write"
  on public.members for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------
-- 3. ACHIEVEMENTS : pencapaian (publikasi & pendanaan riset)
-- ---------------------------------------------------------------------
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('publikasi', 'pendanaan')),
  title text not null,
  authors text,                -- penulis / tim peneliti
  venue text,                  -- nama jurnal/konferensi atau sumber dana
  year int,
  link text,
  description text,
  created_at timestamptz not null default now()
);

alter table public.achievements enable row level security;

create policy "achievements_public_select"
  on public.achievements for select
  to anon, authenticated
  using (true);

create policy "achievements_authenticated_write"
  on public.achievements for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------
-- 4. ABDIMAS : kegiatan pengabdian kepada masyarakat
-- ---------------------------------------------------------------------
create table if not exists public.abdimas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text,
  activity_date date,
  description text,
  link text,
  created_at timestamptz not null default now()
);

alter table public.abdimas enable row level security;

create policy "abdimas_public_select"
  on public.abdimas for select
  to anon, authenticated
  using (true);

create policy "abdimas_authenticated_write"
  on public.abdimas for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------
-- 5. RECRUITMENT : info rekrutmen asisten
-- ---------------------------------------------------------------------
create table if not exists public.recruitment (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  requirements text,
  deadline date,
  is_open boolean not null default true,
  link text,
  created_at timestamptz not null default now()
);

alter table public.recruitment enable row level security;

create policy "recruitment_public_select"
  on public.recruitment for select
  to anon, authenticated
  using (true);

create policy "recruitment_authenticated_write"
  on public.recruitment for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------
-- 6. ORGANIGRAM : struktur organisasi lab (mengacu ke tabel members)
-- ---------------------------------------------------------------------
create table if not exists public.organigram (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members (id) on delete cascade,
  position_label text not null,   -- contoh: "Kepala Laboratorium"
  level int not null default 1,   -- 1 = paling atas
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.organigram enable row level security;

create policy "organigram_public_select"
  on public.organigram for select
  to anon, authenticated
  using (true);

create policy "organigram_authenticated_write"
  on public.organigram for all
  to authenticated
  using (true)
  with check (true);

-- =====================================================================
-- STORAGE : bucket untuk foto dosen/asisten
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

create policy "photos_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'photos');

create policy "photos_authenticated_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'photos');

create policy "photos_authenticated_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'photos');

create policy "photos_authenticated_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'photos');

-- =====================================================================
-- Selesai. Setelah menjalankan file ini, buat akun asisten pertama
-- lewat halaman /admin/login (lihat README.md bagian "Membuat Akun
-- Admin Pertama").
-- =====================================================================
