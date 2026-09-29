-- =====================================================================
-- MIGRATION 004 — Tabel foto Kegiatan Lab & Fasilitas Lab
-- Jalankan file ini di: Supabase Dashboard -> SQL Editor -> New query
-- =====================================================================
--
-- Sebelumnya foto di section "Lab Activities" di beranda itu hardcode
-- di kode (4 file gambar statis), jadi tidak bisa dikelola lewat admin
-- panel. Tabel ini menggantikannya dengan data yang bisa
-- ditambah/diedit/dihapus dari admin panel, mirip pola achievements.
--
-- category 'kegiatan'  -> tampil di bagian "Kegiatan Lab"
-- category 'fasilitas' -> tampil di bagian "Fasilitas Lab"

create table if not exists public.lab_photos (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('kegiatan', 'fasilitas')),
  title text,
  description text,
  photo_url text not null,
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
