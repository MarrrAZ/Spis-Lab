-- =====================================================================
-- Migration 008 — Redesign v8 (HANYA MENAMBAH, tidak menghapus/mengubah data lama)
--   1. site_content         : semua teks & pengaturan kecil yang bisa diatur dari admin
--   2. members.division     : divisi asisten (untuk Organigram)
--   3. recruitment (+kolom)  : tanggal buka, visual kartu, highlight, pengaturan formulir
--   4. recruitment_sections / recruitment_questions : formulir pendaftaran (form builder)
--   5. applications         : data pendaftar + fungsi submit & cek status (tanpa akun)
--   6. storage 'applications': berkas pendaftar (privat, hanya asisten yang bisa membuka)
-- =====================================================================

-- 1. site_content ------------------------------------------------------
create table if not exists public.site_content (
  key text primary key,
  value jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
drop policy if exists "site_content_public_select" on public.site_content;
create policy "site_content_public_select" on public.site_content for select to anon, authenticated using (true);
drop policy if exists "site_content_authenticated_write" on public.site_content;
create policy "site_content_authenticated_write" on public.site_content for all to authenticated using (true) with check (true);

-- 2. members.division --------------------------------------------------
alter table public.members add column if not exists division text;

-- 3. recruitment: kolom tambahan ---------------------------------------
alter table public.recruitment
  add column if not exists opens_at date,
  add column if not exists card_visual text not null default 'halo',
  add column if not exists highlights jsonb not null default '[]'::jsonb,
  add column if not exists form_settings jsonb not null default '{"one_per_nim": true, "email_number": true, "confirmation": "Terima kasih sudah mendaftar. Simpan nomor pendaftaran ini untuk mengecek status seleksi."}'::jsonb;

-- 4. formulir pendaftaran ----------------------------------------------
create table if not exists public.recruitment_sections (
  id uuid primary key default gen_random_uuid(),
  position int not null default 0,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);
create table if not exists public.recruitment_questions (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.recruitment_sections (id) on delete cascade,
  position int not null default 0,
  key text,
  label text not null,
  type text not null default 'short' check (type in ('short','email','tel','number','paragraph','select','radio','checkbox','file','url','check','date')),
  required boolean not null default false,
  help text,
  options jsonb not null default '[]'::jsonb,
  accept text not null default 'pdf,jpg,png',
  max_mb int not null default 5,
  created_at timestamptz not null default now()
);
create index if not exists recruitment_questions_section_idx on public.recruitment_questions (section_id, position);
alter table public.recruitment_sections enable row level security;
alter table public.recruitment_questions enable row level security;
drop policy if exists "recruitment_sections_public_select" on public.recruitment_sections;
create policy "recruitment_sections_public_select" on public.recruitment_sections for select to anon, authenticated using (true);
drop policy if exists "recruitment_sections_authenticated_write" on public.recruitment_sections;
create policy "recruitment_sections_authenticated_write" on public.recruitment_sections for all to authenticated using (true) with check (true);
drop policy if exists "recruitment_questions_public_select" on public.recruitment_questions;
create policy "recruitment_questions_public_select" on public.recruitment_questions for select to anon, authenticated using (true);
drop policy if exists "recruitment_questions_authenticated_write" on public.recruitment_questions;
create policy "recruitment_questions_authenticated_write" on public.recruitment_questions for all to authenticated using (true) with check (true);

-- 5. pendaftar ----------------------------------------------------------
create sequence if not exists public.application_seq start 1;
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  reg_no text unique not null,
  recruitment_id uuid references public.recruitment (id) on delete set null,
  name text,
  nim text,
  email text,
  prodi text,
  ipk text,
  answers jsonb not null default '{}'::jsonb,   -- { "<question_id>": jawaban }
  files jsonb not null default '[]'::jsonb,     -- [{question_id, label, path, name, size, type}]
  status text not null default 'baru' check (status in ('baru','ditinjau','wawancara','diterima','ditolak')),
  notes text,
  status_updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists applications_created_idx on public.applications (created_at desc);
create index if not exists applications_status_idx on public.applications (status);
alter table public.applications enable row level security;
-- Pengunjung (anon) TIDAK bisa membaca/menulis tabel ini secara langsung;
-- mereka hanya bisa lewat fungsi submit_application & check_application di bawah.
drop policy if exists "applications_authenticated_all" on public.applications;
create policy "applications_authenticated_all" on public.applications for all to authenticated using (true) with check (true);

create or replace function public.applications_touch_status() returns trigger
language plpgsql as $$
begin
  if new.status is distinct from old.status then new.status_updated_at := now(); end if;
  return new;
end $$;
drop trigger if exists applications_status_touch on public.applications;
create trigger applications_status_touch before update on public.applications
  for each row execute function public.applications_touch_status();

create or replace function public.submit_application(p_answers jsonb, p_files jsonb)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rec uuid; v_open boolean; v_settings jsonb; v_reg text;
  v_name text; v_nim text; v_email text; v_prodi text; v_ipk text;
  q record; v_val text;
begin
  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then raise exception 'Jawaban tidak valid'; end if;
  if length(p_answers::text) > 60000 or length(coalesce(p_files, '[]'::jsonb)::text) > 30000 then raise exception 'Data terlalu besar'; end if;

  select id, is_open, form_settings into v_rec, v_open, v_settings
    from recruitment order by created_at desc limit 1;
  if v_rec is null or not v_open then raise exception 'Pendaftaran sedang ditutup'; end if;

  for q in select id, key, label, type, required from recruitment_questions loop
    v_val := nullif(trim(coalesce(p_answers ->> q.id::text, '')), '');
    if q.required and q.type <> 'file' and v_val is null then
      raise exception 'Pertanyaan wajib belum diisi: %', q.label;
    end if;
    if q.required and q.type = 'file' and not exists (
      select 1 from jsonb_array_elements(coalesce(p_files, '[]'::jsonb)) f where f ->> 'question_id' = q.id::text) then
      raise exception 'Berkas wajib belum diunggah: %', q.label;
    end if;
    if q.key = 'name' then v_name := v_val; end if;
    if q.key = 'nim' then v_nim := v_val; end if;
    if q.key = 'email' then v_email := v_val; end if;
    if q.key = 'prodi' then v_prodi := v_val; end if;
    if q.key = 'ipk' then v_ipk := v_val; end if;
  end loop;

  if v_nim is not null and coalesce((v_settings ->> 'one_per_nim')::boolean, true)
     and exists (select 1 from applications where nim = v_nim and recruitment_id = v_rec) then
    raise exception 'NIM ini sudah terdaftar pada periode rekrutmen ini';
  end if;

  v_reg := 'OR' || to_char(now() at time zone 'Asia/Jakarta', 'YY') || '-' || lpad(nextval('application_seq')::text, 4, '0');
  insert into applications (reg_no, recruitment_id, name, nim, email, prodi, ipk, answers, files)
  values (v_reg, v_rec, v_name, v_nim, v_email, v_prodi, v_ipk, p_answers, coalesce(p_files, '[]'::jsonb));
  return v_reg;
end $$;
revoke all on function public.submit_application(jsonb, jsonb) from public;
grant execute on function public.submit_application(jsonb, jsonb) to anon, authenticated;

create or replace function public.check_application(p_reg text, p_nim text)
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object('reg_no', reg_no, 'name', name, 'status', status,
                           'created_at', created_at, 'status_updated_at', status_updated_at)
    from applications
   where upper(reg_no) = upper(trim(p_reg)) and nim = trim(p_nim)
   limit 1;
$$;
revoke all on function public.check_application(text, text) from public;
grant execute on function public.check_application(text, text) to anon, authenticated;

-- 6. storage untuk berkas pendaftar (PRIVAT) -----------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('applications', 'applications', false, 10485760,
        array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists "applications_files_upload" on storage.objects;
create policy "applications_files_upload" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'applications');
drop policy if exists "applications_files_read" on storage.objects;
create policy "applications_files_read" on storage.objects for select to authenticated
  using (bucket_id = 'applications');
drop policy if exists "applications_files_delete" on storage.objects;
create policy "applications_files_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'applications');

-- 7. isi awal (hanya jika masih kosong) ---------------------------------
-- divisi asisten (kolom baru)
update public.members set division = 'Koordinator' where division is null and category = 'asisten' and position ilike '%koordinator%';
update public.members set division = 'Sosial Media & Publikasi' where division is null and category = 'asisten' and (name ilike 'ichsan%' or name ilike 'aprlia%');
update public.members set division = 'Information Technology' where division is null and category = 'asisten' and (name ilike 'umar%' or name ilike 'fahmida%');
update public.members set division = 'Asset & Logistics' where division is null and category = 'asisten' and (name ilike 'i putu%' or name ilike 'luthfi%');
update public.members set division = 'Administrasi & Kesekretariatan' where division is null and category = 'asisten' and (name ilike 'putri%' or name ilike 'almekka%');
update public.members set division = 'Mahasiswa Pascasarjana' where division is null and category = 'asisten' and (name ilike 'alika%' or name ilike 'intan%');

-- formulir default
do $$
declare s1 uuid; s2 uuid; s3 uuid; s4 uuid;
begin
  if exists (select 1 from public.recruitment_sections) then return; end if;
  insert into public.recruitment_sections (position, title, description) values (0, 'Data diri', 'Identitas dan kontak yang bisa kami hubungi.') returning id into s1;
  insert into public.recruitment_sections (position, title, description) values (1, 'Dokumen', 'Unggah dalam format PDF/JPG/PNG, maksimal 5 MB per file.') returning id into s2;
  insert into public.recruitment_sections (position, title, description) values (2, 'Instagram & twibbon', 'Pastikan akun Instagram kamu tidak di-private sampai pengumuman.') returning id into s3;
  insert into public.recruitment_sections (position, title, description) values (3, 'Pernyataan', 'Centang semua pernyataan berikut untuk melanjutkan.') returning id into s4;
  insert into public.recruitment_questions (section_id, position, key, label, type, required, help, options, accept, max_mb) values
    (s1, 0, 'name', 'Nama lengkap', 'short', true, 'Sesuai KTM', '[]', 'pdf,jpg,png', 5),
    (s1, 1, 'nim', 'NIM', 'short', true, null, '[]', 'pdf,jpg,png', 5),
    (s1, 2, 'email', 'Email kampus', 'email', true, 'nama@student.telkomuniversity.ac.id', '[]', 'pdf,jpg,png', 5),
    (s1, 3, 'phone', 'Nomor WhatsApp', 'tel', true, 'Aktif dan bisa dihubungi', '[]', 'pdf,jpg,png', 5),
    (s1, 4, 'prodi', 'Program studi', 'select', true, null, '["S1 Teknik Telekomunikasi","S1 Teknik Elektro","S1 Teknik Komputer","S1 Teknik Biomedis","S2 Teknik Elektro"]', 'pdf,jpg,png', 5),
    (s1, 5, 'angkatan', 'Angkatan', 'select', true, null, '["2022","2023","2024","2025"]', 'pdf,jpg,png', 5),
    (s1, 6, 'semester', 'Semester saat ini', 'number', true, null, '[]', 'pdf,jpg,png', 5),
    (s1, 7, 'ipk', 'IPK terakhir', 'number', true, 'Contoh: 3.65', '[]', 'pdf,jpg,png', 5),
    (s2, 0, 'cv', 'Curriculum Vitae (CV)', 'file', true, 'PDF · maks 5 MB', '[]', 'pdf', 5),
    (s2, 1, 'transkrip', 'Transkrip nilai', 'file', true, 'PDF · maks 5 MB', '[]', 'pdf', 5),
    (s2, 2, 'ktm', 'Kartu Tanda Mahasiswa (KTM)', 'file', true, 'JPG/PNG/PDF · maks 5 MB', '[]', 'pdf,jpg,png', 5),
    (s2, 3, 'foto', 'Pas foto', 'file', true, 'JPG/PNG · latar bebas · maks 5 MB', '[]', 'jpg,png', 5),
    (s2, 4, 'motivation', 'Motivation letter', 'file', true, 'PDF · maks 5 MB · 1 halaman', '[]', 'pdf', 5),
    (s2, 5, 'portofolio', 'Portofolio', 'file', false, 'Opsional · PDF · maks 10 MB', '[]', 'pdf', 10),
    (s3, 0, 'ig', 'Username Instagram', 'short', true, 'Contoh: @spislaboratory', '[]', 'pdf,jpg,png', 5),
    (s3, 1, 'twibbon', 'Twibbon', 'file', true, 'JPG/PNG · file twibbon yang kamu unggah', '[]', 'jpg,png', 5),
    (s3, 2, 'twibbon_link', 'Link postingan twibbon di feeds Instagram', 'url', true, 'https://www.instagram.com/p/…', '[]', 'pdf,jpg,png', 5),
    (s3, 3, 'story', 'Bukti share poster oprec di story Instagram', 'file', true, 'Screenshot story · JPG/PNG', '[]', 'jpg,png', 5),
    (s4, 0, 'agree_1', 'Saya menyatakan seluruh data dan dokumen yang saya kirim adalah benar.', 'check', true, null, '[]', 'pdf,jpg,png', 5),
    (s4, 1, 'agree_2', 'Saya bersedia mengikuti seluruh tahapan seleksi asisten riset SPIS Laboratory.', 'check', true, null, '[]', 'pdf,jpg,png', 5),
    (s4, 2, 'agree_3', 'Saya bersedia aktif sebagai asisten riset selama satu periode kepengurusan.', 'check', true, null, '[]', 'pdf,jpg,png', 5),
    (s4, 3, 'agree_4', 'Saya menyetujui data saya digunakan untuk keperluan seleksi.', 'check', true, null, '[]', 'pdf,jpg,png', 5);
end $$;
