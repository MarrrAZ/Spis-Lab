-- =====================================================================
-- MIGRATION 006 — Tabel Projects (katalog alat/teknologi SPIS Lab)
-- Jalankan file ini di: Supabase Dashboard -> SQL Editor -> New query
-- =====================================================================
--
-- Menggantikan halaman Team (daftar dosen/asisten sudah pindah total
-- ke Organigram) dengan halaman Projects: katalog alat, instrumen,
-- atau sistem yang sudah dikembangkan SPIS Lab.
--
-- Field bersifat fleksibel (specifications, outputs, gallery,
-- related_publications disimpan sebagai jsonb) supaya admin bisa
-- menambah/mengosongkan field sesuai data yang benar-benar tersedia,
-- tanpa perlu migration baru tiap kali kebutuhan field berubah.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text,              -- teks bebas, mis. "Radar", "Biosignal"
  year int,
  status text,                -- teks bebas, mis. "Completed", "Ongoing"
  cover_image text,
  gallery jsonb not null default '[]'::jsonb,        -- array of image URLs
  short_description text,
  overview text,
  purpose text,               -- Purpose / Function
  how_it_works text,
  specifications jsonb not null default '[]'::jsonb, -- [{label, value}]
  applications text,
  developers text,             -- teks bebas, nama-nama yang terlibat
  supervisor text,
  outputs jsonb not null default '[]'::jsonb,         -- array of strings
  related_publications jsonb not null default '[]'::jsonb, -- [{title, link}]
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
