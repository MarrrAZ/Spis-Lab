-- =====================================================================
-- MIGRATION 003 — Hubungkan Achievement (publikasi/pendanaan) ke Members
-- Jalankan file ini di: Supabase Dashboard -> SQL Editor -> New query
-- =====================================================================
--
-- Sebelum ini, tabel "achievements" berdiri sendiri tanpa ada hubungan ke
-- "members" — jadi halaman profil dosen/asisten menampilkan SEMUA
-- pencapaian yang ada di database, bukan cuma milik orang itu.
--
-- Tabel penghubung ini bersifat many-to-many: satu pencapaian bisa
-- ditandai dilibatkan oleh lebih dari satu anggota lab (misal 1 paper
-- ditulis 2 dosen + 1 asisten), dan satu anggota bisa punya banyak
-- pencapaian. Kolom "authors" di tabel achievements TETAP ada dan tetap
-- dipakai sebagai teks bebas (bisa mencantumkan nama luar lab juga) —
-- tabel ini murni untuk menentukan "pencapaian ini muncul di profil
-- siapa saja di website".

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
