-- =====================================================================
-- MIGRATION 005 — Konten halaman About bisa diedit dari admin panel
-- Jalankan file ini di: Supabase Dashboard -> SQL Editor -> New query
-- =====================================================================
--
-- Sebelumnya isi halaman /tentang itu hardcode di kode (3 paragraf,
-- 3 nilai laboratorium, teks naungan). Tabel ini singleton (cuma 1
-- baris, id selalu 1) supaya gampang dibuatkan form "edit" tanpa perlu
-- fitur tambah/hapus baris.

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

-- Isi baris pertama dengan teks yang sekarang sudah tayang di website,
-- supaya setelah migration dijalankan TIDAK ADA perubahan tampilan
-- sampai kamu edit sendiri lewat admin panel.
insert into public.about_content (
  id, intro_1, intro_2, intro_3,
  nilai_1_label, nilai_1_desc,
  nilai_2_label, nilai_2_desc,
  nilai_3_label, nilai_3_desc,
  naungan_title, naungan_text
) values (
  1,
  'Signal Processing for Intelligent System (SPIS) Laboratory adalah laboratorium riset di bawah Kelompok Keahlian Signal Processing, Information Security, and Computer Engineering (SPICE), Fakultas Teknik Elektro, Telkom University.',
  'Lab ini berfokus pada pengembangan teori, algoritma, dan sistem pengolahan sinyal yang mendukung sistem cerdas dalam memahami, berinteraksi, dan beradaptasi terhadap lingkungannya — mencakup modalitas elektromagnetik, akustik, visual, dan sinyal biomedis. Riset di SPIS Lab menjembatani teori pengolahan sinyal klasik dengan pendekatan kecerdasan buatan modern.',
  'Selain aktivitas riset, laboratorium ini juga membuka kesempatan asistensi riset bagi mahasiswa S1 dan S2 yang tertarik mendalami bidang pengolahan sinyal dan sistem cerdas.',
  'Presisi', 'Setiap algoritma diuji dan divalidasi dengan metodologi yang ketat.',
  'Kolaborasi', 'Riset lintas disiplin bersama kelompok keahlian dan mitra industri.',
  'Dampak', 'Hasil riset diarahkan untuk pengabdian dan penerapan nyata di masyarakat.',
  'Kelompok Keahlian SPICE',
  'Signal Processing, Information Security, and Computer Engineering — Fakultas Teknik Elektro, Telkom University, Gedung Bangkit, Bandung.'
)
on conflict (id) do nothing;
