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
-- 3b. ACHIEVEMENT_MEMBERS : penghubung many-to-many achievements <-> members
--     (menentukan pencapaian ini muncul di profil siapa saja)
-- ---------------------------------------------------------------------
create table if not exists public.achievement_members (
  achievement_id uuid not null references public.achievements (id) on delete cascade,
  member_id uuid not null references public.members (id) on delete cascade,
  primary key (achievement_id, member_id)
);

create index if not exists achievement_members_member_id_idx
  on public.achievement_members (member_id);
create index if not exists achievement_members_achievement_id_idx
  on public.achievement_members (achievement_id);

alter table public.achievement_members enable row level security;

create policy "achievement_members_public_select"
  on public.achievement_members for select
  to anon, authenticated
  using (true);

create policy "achievement_members_authenticated_write"
  on public.achievement_members for all
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
  gallery jsonb not null default '[]'::jsonb,  -- [{type:'image'|'video', url}]
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
-- 4b. LAB_PHOTOS : foto "Kegiatan Lab" & "Fasilitas Lab" (beranda + /lab-activities)
-- ---------------------------------------------------------------------
create table if not exists public.lab_photos (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('kegiatan', 'fasilitas')),
  title text,
  description text,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  photo_url text,
  video_url text,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists lab_photos_category_idx on public.lab_photos (category);

alter table public.lab_photos enable row level security;

create policy "lab_photos_public_select"
  on public.lab_photos for select
  to anon, authenticated
  using (true);

create policy "lab_photos_authenticated_write"
  on public.lab_photos for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------
-- 5b. ABOUT_CONTENT : isi halaman /tentang (singleton, id selalu 1)
-- ---------------------------------------------------------------------
create table if not exists public.about_content (
  id int primary key default 1,
  intro_1 text,
  intro_2 text,
  intro_3 text,
  nilai_1_label text,
  nilai_1_desc text,
  nilai_2_label text,
  nilai_2_desc text,
  nilai_3_label text,
  nilai_3_desc text,
  naungan_title text,
  naungan_text text,
  updated_at timestamptz not null default now(),
  constraint about_content_singleton check (id = 1)
);

alter table public.about_content enable row level security;

create policy "about_content_public_select"
  on public.about_content for select
  to anon, authenticated
  using (true);

create policy "about_content_authenticated_write"
  on public.about_content for all
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
-- 6b. PROJECTS : katalog alat/teknologi yang dikembangkan SPIS Lab
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text,
  year int,
  status text,
  cover_image text,
  gallery jsonb not null default '[]'::jsonb,       -- [{type:'image'|'video', url}]
  short_description text,
  overview text,
  purpose text,
  how_it_works text,
  specifications jsonb not null default '[]'::jsonb,
  applications text,
  developers text,
  supervisor text,
  outputs jsonb not null default '[]'::jsonb,
  related_publications jsonb not null default '[]'::jsonb,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists projects_slug_idx on public.projects (slug);
create index if not exists projects_category_idx on public.projects (category);

alter table public.projects enable row level security;

create policy "projects_public_select"
  on public.projects for select
  to anon, authenticated
  using (true);

create policy "projects_authenticated_write"
  on public.projects for all
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
-- STORAGE : bucket untuk video dokumentasi (Abdimas, Lab Activities, Projects)
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'videos', 'videos', true, 104857600,
  array['video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "videos_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'videos');

create policy "videos_authenticated_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'videos');

create policy "videos_authenticated_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'videos');

create policy "videos_authenticated_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'videos');

-- =====================================================================
-- Selesai. Setelah menjalankan file ini, buat akun asisten pertama
-- lewat halaman /admin/login (lihat README.md bagian "Membuat Akun
-- Admin Pertama").
-- =====================================================================
