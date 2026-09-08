-- =====================================================================
-- DATA CONTOH (opsional)
-- Jalankan file ini SETELAH schema.sql jika ingin website langsung
-- terisi data contoh yang bisa diedit/dihapus lewat dashboard admin.
-- Jika ingin mulai dari kosong, lewati file ini saja.
-- =====================================================================

insert into public.members (category, name, position, bio, order_index) values
('dosen', 'Dr. Nama Dosen, S.T., M.T.', 'Kepala Laboratorium', 'Contoh keterangan singkat dosen pembina SPIS Lab. Ganti dengan data sebenarnya lewat menu Dosen & Asisten.', 1),
('asisten', 'Nama Asisten Satu', 'Koordinator Asisten', 'Mahasiswa S1 Teknik Telekomunikasi, fokus riset radar signal processing.', 2),
('asisten', 'Nama Asisten Dua', 'Asisten Riset', 'Mahasiswa S1 Sistem Komputer, fokus riset biosignal processing.', 3);

insert into public.achievements (type, title, authors, venue, year, description) values
('publikasi', 'Contoh judul publikasi tentang pengolahan sinyal radar', 'Nama Dosen, Nama Asisten', 'Nama Jurnal/Konferensi', 2025, 'Ringkasan singkat kontribusi penelitian ini. Ganti dengan publikasi asli lab.'),
('pendanaan', 'Contoh judul hibah penelitian', null, 'Sumber Pendanaan (mis. Kemdikbudristek)', 2025, 'Deskripsi singkat penggunaan dana riset.');

insert into public.abdimas (title, location, activity_date, description) values
('Contoh kegiatan pengabdian masyarakat', 'Nama Desa/Kelurahan, Bandung', current_date, 'Deskripsi singkat kegiatan abdimas yang dilakukan tim SPIS Lab.');

insert into public.recruitment (title, description, requirements, is_open) values
('Rekrutmen Asisten Laboratorium SPIS Semester Ganjil', 'Contoh deskripsi pembukaan rekrutmen asisten baru.', 'Mahasiswa aktif S1/S2 Teknik Elektro/Telekomunikasi/Sistem Komputer
Minimal semester 4
Memiliki minat pada signal processing / AI', true);

-- Menyusun organigram contoh berdasarkan data members di atas
insert into public.organigram (member_id, position_label, level, order_index)
select id, 'Kepala Laboratorium', 1, 0 from public.members where name = 'Dr. Nama Dosen, S.T., M.T.';

insert into public.organigram (member_id, position_label, level, order_index)
select id, 'Koordinator Asisten', 2, 0 from public.members where name = 'Nama Asisten Satu';

insert into public.organigram (member_id, position_label, level, order_index)
select id, 'Asisten Riset', 2, 1 from public.members where name = 'Nama Asisten Dua';
