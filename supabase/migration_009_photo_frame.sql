-- =====================================================================
-- Migration 009 — Atur foto anggota (HANYA MENAMBAH, tidak mengubah data lama)
--  * members.photo_frame  : posisi & zoom foto hasil "Adjust photo" di admin {x, y, z}
--  * members.photo_cutout : foto tanpa latar (seperti di mockup); bila diisi, dipakai di website
-- Kolom baru diisi untuk asisten yang sudah punya foto tanpa latar di website (/assets/people).
-- =====================================================================
alter table public.members add column if not exists photo_frame jsonb;
alter table public.members add column if not exists photo_cutout text;

update public.members set photo_cutout = '/assets/people/as-inung.webp'   where photo_cutout is null and name ilike '%inung wijayanto%';
update public.members set photo_cutout = '/assets/people/as-ayu.webp'     where photo_cutout is null and category = 'asisten' and name ilike 'ayu sekar%';
update public.members set photo_cutout = '/assets/people/as-umar.webp'    where photo_cutout is null and category = 'asisten' and name ilike 'umar abdul%';
update public.members set photo_cutout = '/assets/people/as-ichsan.webp'  where photo_cutout is null and category = 'asisten' and name ilike 'ichsan%';
update public.members set photo_cutout = '/assets/people/as-putu.webp'    where photo_cutout is null and category = 'asisten' and name ilike 'i putu%';
update public.members set photo_cutout = '/assets/people/as-luthfi.webp'  where photo_cutout is null and category = 'asisten' and name ilike 'luthfi%';
update public.members set photo_cutout = '/assets/people/as-fahmida.webp' where photo_cutout is null and category = 'asisten' and name ilike 'fahmida%';
update public.members set photo_cutout = '/assets/people/as-aprlia.webp'  where photo_cutout is null and category = 'asisten' and name ilike 'aprlia%';
update public.members set photo_cutout = '/assets/people/as-putri.webp'   where photo_cutout is null and category = 'asisten' and name ilike 'putri ardelia%';
update public.members set photo_cutout = '/assets/people/as-alika.webp'   where photo_cutout is null and category = 'asisten' and name ilike 'alika%';
update public.members set photo_cutout = '/assets/people/as-intan.webp'   where photo_cutout is null and category = 'asisten' and name ilike 'intan%';
update public.members set photo_cutout = '/assets/people/as-almekka.webp' where photo_cutout is null and category = 'asisten' and name ilike 'almekka%';
