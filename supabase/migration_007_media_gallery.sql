-- =====================================================================
-- MIGRATION 007 — Dokumentasi foto & video (Abdimas, Lab Activities,
-- Projects)
-- Jalankan file ini di: Supabase Dashboard -> SQL Editor -> New query
-- =====================================================================

-- 1) Bucket storage baru khusus video, pola sama dengan bucket "photos"
--    yang sudah ada. Batas ukuran file 100MB per video — video yang
--    lebih besar dari itu akan ditolak saat upload. Kalau butuh lebih
--    besar, ubah angka file_size_limit di bawah (dalam bytes) dan
--    jalankan ulang bagian ini saja.
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

-- 2) ABDIMAS — tambah kolom galeri dokumentasi (campuran foto & video)
--    Bentuknya array of {type: 'image'|'video', url: string}
alter table public.abdimas
  add column if not exists gallery jsonb not null default '[]'::jsonb;

-- 3) LAB_PHOTOS — sekarang tiap entri bisa berupa foto ATAU video
alter table public.lab_photos
  add column if not exists media_type text not null default 'image'
    check (media_type in ('image', 'video')),
  add column if not exists video_url text,
  alter column photo_url drop not null;

-- 4) PROJECTS — kolom "gallery" yang sudah ada isinya diubah bentuknya
--    dari array of string (url foto saja) menjadi array of
--    {type: 'image'|'video', url: string}. Karena belum ada data
--    project yang tersimpan, tidak perlu migrasi data lama.
