-- Jalankan di Supabase SQL Editor setelah schema.sql awal.
-- Menambahkan field angkatan & jurusan untuk kartu "About Us" dan halaman detail anggota.

alter table public.members
  add column if not exists angkatan text,
  add column if not exists jurusan text;

comment on column public.members.angkatan is 'Tahun angkatan, khusus kategori asisten. Contoh: 2022';
comment on column public.members.jurusan is 'Program studi/jurusan, khusus kategori asisten. Contoh: Teknik Telekomunikasi';
