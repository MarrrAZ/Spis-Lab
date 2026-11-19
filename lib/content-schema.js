// =====================================================================
// DAFTAR SEMUA TEKS & PENGATURAN KECIL WEBSITE PUBLIK
// File ini dipakai DUA project: website publik (nilai default) dan admin panel
// (editor "Site Content"). Kalau menambah kunci baru, salin file ini ke
// spis-lab-admin/lib/content-schema.js juga.
// Nilai yang disimpan admin ada di tabel Supabase `site_content` (key → value).
// =====================================================================
const f = (key, label, def, type = 'text', extra = {}) => ({ key, label, def, type, ...extra });

export const DIVISIONS = ['Sosial Media & Publikasi', 'Information Technology', 'Asset & Logistics', 'Administrasi & Kesekretariatan', 'Mahasiswa Pascasarjana'];
export const VISUALS = [['radar', 'Radar sweep'], ['ecg', 'ECG trace'], ['spec', 'Spectrum bars'], ['net', 'Neural network'], ['precision', 'Precision'], ['collab', 'Collaboration'], ['impact', 'Impact'], ['wave', 'Wave']];

export const CONTENT = [
  { id: 'global', title: 'Global (all pages)', sections: [
    { id: 'nav', title: 'Navigation menu', fields: [
      f('nav.home', 'Menu: Home', 'Home'), f('nav.about', 'Menu: About', 'About'), f('nav.achievement', 'Menu: Achievement', 'Achievement'),
      f('nav.abdimas', 'Menu: Abdimas', 'Abdimas'), f('nav.recruitment', 'Menu: Recruitment', 'Recruitment'), f('nav.organigram', 'Menu: Organigram', 'Organigram'),
      f('nav.projects', 'Menu: Projects', 'Projects'), f('nav.people', 'Mobile menu: Dosen & Asisten', 'Dosen & Asisten'), f('nav.lab', 'Mobile menu: Lab activities', 'Lab'),
      f('nav.menu', 'Menu button (mobile)', 'MENU'), f('nav.close', 'Close menu button (mobile)', 'TUTUP'), f('nav.intro', 'Replay intro button', '↻ Intro'),
    ] },
    { id: 'footer', title: 'Footer', fields: [
      f('footer.desc', 'Description under logo', 'Signal Processing for Intelligent System Laboratory — Kelompok Keahlian SPICE, Fakultas Teknik Elektro, Telkom University.', 'textarea'),
      f('footer.col_explore', 'Column 1 title', 'Jelajahi'), f('footer.col_org', 'Column 2 title', 'Organisasi'), f('footer.col_social', 'Column 3 title', 'Sosial'), f('footer.col_contact', 'Column 4 title', 'Kontak'),
      f('footer.l_about', 'Link: About lab', 'Tentang Lab'), f('footer.l_achievement', 'Link: Achievement', 'Pencapaian'), f('footer.l_abdimas', 'Link: Abdimas', 'Abdimas'),
      f('footer.l_recruitment', 'Link: Recruitment', 'Rekrutmen'), f('footer.l_lab', 'Link: Lab activities', 'Kegiatan & Fasilitas'), f('footer.l_org', 'Link: Organigram', 'Organigram'),
      f('footer.l_people', 'Link: Dosen & Asisten', 'Dosen & Asisten'), f('footer.l_projects', 'Link: Projects', 'Projects'), f('footer.l_login', 'Link: Assistant login', 'Login Asisten'),
      f('footer.login_url', 'Admin panel address', 'https://spis-laboratory-asisten.vercel.app', 'url'),
      f('footer.social', 'Social media accounts', [{ label: 'Instagram', url: 'https://www.instagram.com/spislaboratory/' }, { label: 'LinkedIn', url: 'https://www.linkedin.com/in/spis-laboratory/' }], 'list', { item: [['label', 'Name'], ['url', 'URL']] }),
      f('footer.building', 'Building', 'Gedung Bangkit, Telkom University'), f('footer.address', 'Address', 'Jl. Telekomunikasi, Terusan Buah Batu, Bandung 40257'), f('footer.phone', 'Phone', '(022) 7566456'),
      f('footer.copyright', 'Copyright text', '© 2026 SPIS Lab · Telkom University'), f('footer.hashtags', 'Hashtag', '#TransformingSignals #ShapingTomorrow'),
    ] },
    { id: 'intro', title: 'Intro animation (Home)', fields: [
      f('intro.enabled', 'Show intro on first Home visit', true, 'toggle'),
      f('intro.caption', 'Text under logo', '#TransformingSignals · #ShapingTomorrow'), f('intro.tagline', 'Bottom-left text', 'Signal Processing for Intelligent System Laboratory'), f('intro.skip', 'Skip button', 'Skip intro'),
    ] },
    { id: 'seo', title: 'Tab title & description (SEO)', fields: [
      f('seo.site', 'Site name in browser tab', 'SPIS Lab'),
      f('seo.description', 'Description for Google', 'Laboratorium riset Signal Processing for Intelligent System (SPIS), Kelompok Keahlian SPICE, Fakultas Teknik Elektro, Telkom University.', 'textarea'),
    ] },
    { id: 'theme', title: 'Theme', fields: [
      f('theme.default', 'Default theme for new visitors', 'dark', 'select', { options: [['dark', 'Dark'], ['light', 'Light']] }),
    ] },
  ] },
  { id: 'home', title: 'Home', sections: [
    { id: 'hero', title: 'Hero (top of page)', fields: [
      f('home.hero.kicker', 'Small text above title', 'Telkom University — Fakultas Teknik Elektro'),
      f('home.hero.title_before', 'Title — first part', 'Signal Processing for'), f('home.hero.title_highlight', 'Title — blue part', 'Intelligent System'), f('home.hero.title_after', 'Title — last part', 'Laboratory'),
      f('home.hero.sub', 'Paragraph', 'Riset radar, biosignal, dan speech processing — dari eksperimen di lab sampai publikasi. Kami membangun sistem sensor yang memahami dunia di sekitarnya.', 'textarea'),
      f('home.hero.btn1', 'Button 1 — text', 'About Lab'), f('home.hero.btn1_link', 'Button 1 — link', '/tentang', 'url'),
      f('home.hero.btn2', 'Button 2 — text', 'About Us'), f('home.hero.btn2_link', 'Button 2 — link', '/tim', 'url'),
      f('home.hero.hint', 'Hint under hero', 'Seret logo untuk memutar · sentuh partikelnya dengan kursor'), f('home.hero.scroll', 'Scroll text', 'Scroll ↓'),
    ] },
    { id: 'about', title: 'About lab + numbers', fields: [
      f('home.about.kicker', 'Small label', 'About lab'), f('home.about.title', 'Title', 'Laboratorium riset di bawah Kelompok Keahlian SPICE.'),
      f('home.about.text', 'Paragraph', 'SPIS Laboratory mengembangkan teori dan algoritma pengolahan sinyal untuk radar, biosignal, dan speech processing — memadukan riset dasar dengan kolaborasi mahasiswa di Fakultas Teknik Elektro, Telkom University.', 'textarea'),
      f('home.about.link', 'Link text', 'Selengkapnya tentang lab'),
      f('home.stat1', 'Number 1 label (dosen count, automatic)', 'Dosen'), f('home.stat2', 'Number 2 label (assistant count, automatic)', 'Asisten riset'),
      f('home.stat3', 'Number 3 label (publication count, automatic)', 'Publikasi'), f('home.stat4', 'Number 4 label (research areas, automatic)', 'Arah riset'),
    ] },
    { id: 'research', title: 'Research areas (animated cards)', fields: [
      f('home.research.title', 'Title line 1', 'Empat arah riset,'), f('home.research.title_dim', 'Title line 2 (grey)', 'satu bahasa: sinyal.'),
      f('home.research.sub', 'Side text', 'Arahkan kursor ke tiap kartu untuk mempercepat sinyalnya.'),
      f('research.items', 'Research areas (also used on About)', [
        { label: '01 / RADAR', title: 'Radar & Sonar', desc: 'Deteksi, estimasi, dan pelacakan objek pada sistem radar & sonar.', visual: 'radar' },
        { label: '02 / BIOSIGNAL', title: 'Biosignal', desc: 'Ekstraksi informasi dari sinyal biomedis untuk aplikasi kesehatan.', visual: 'ecg' },
        { label: '03 / SPEECH', title: 'Speech Processing', desc: 'Pemrosesan sinyal suara untuk interaksi & sistem cerdas.', visual: 'spec' },
        { label: '04 / AI', title: 'AI Signal Processing', desc: 'Machine learning & deep learning pada data sinyal berdimensi tinggi.', visual: 'net' },
      ], 'list', { item: [['label', 'Small label'], ['title', 'Title'], ['desc', 'Description', 'textarea'], ['visual', 'Card animation', 'visual']] }),
    ] },
    { id: 'lab', title: 'Lab gallery', fields: [
      f('home.lab.title', 'Title', 'Kegiatan & fasilitas lab'), f('home.lab.sub', 'Side text', 'Ruang riset SPIS di Gedung Bangkit, Telkom University. Seret galeri ke samping.'),
      f('home.lab.link', 'Link text', 'Lihat semua'), f('home.lab.caption', 'Photo caption prefix', 'Fasilitas lab'),
    ] },
    { id: 'pubs', title: 'Latest publications', fields: [ f('home.pubs.title', 'Title', 'Publikasi terbaru'), f('home.pubs.link', 'Link text', 'Lihat semua'), f('home.pubs.count', 'Number of publications shown', '3', 'number') ] },
    { id: 'cta', title: 'Recruitment card', fields: [
      f('home.cta.kicker', 'Small label (when open)', 'Registration open'), f('home.cta.kicker_closed', 'Small label (when closed)', 'Registration closed'),
      f('home.cta.sub', 'Paragraph', 'Satu kursi asisten riset menunggu. Mungkin itu kamu.', 'textarea'), f('home.cta.btn', 'Button', 'View Details'),
      f('home.cta.show_closed', 'Keep showing the card when registration is closed', true, 'toggle'),
    ] },
  ] },
  { id: 'group', title: 'Assistants group photo', sections: [
    { id: 'photo', title: 'Photo & texts', fields: [
      f('group.photo', 'Group photo (landscape)', '/assets/group.webp', 'image'),
      f('group.kicker', 'Small label', 'Asisten riset 26/27 · arahkan kursor ke wajah'),
      f('group.title_home', 'Title on Home', 'Para asisten di balik sinyal.'), f('group.title_people', 'Title on Dosen & Asisten page', 'Satu tim, satu frekuensi.'),
      f('group.btn1', 'Button 1', 'Kenali tim'), f('group.btn2', 'Button 2', 'Organigram'),
    ] },
    { id: 'tags', title: 'Face tags', fields: [
      f('group.tags', 'Face position of each assistant', [
        { match: 'ayu', x: 0.51, y: 0.347 }, { match: 'ichsan', x: 0.75, y: 0.134 }, { match: 'umar', x: 0.87, y: 0.158 }, { match: 'i putu', x: 0.69, y: 0.27 },
        { match: 'luthfi', x: 0.127, y: 0.128 }, { match: 'fahmida', x: 0.81, y: 0.347 }, { match: 'aprlia', x: 0.41, y: 0.412 }, { match: 'almekka', x: 0.43, y: 0.152 },
        { match: 'putri', x: 0.19, y: 0.335 }, { match: 'alika', x: 0.57, y: 0.235 }, { match: 'intan', x: 0.3, y: 0.211 },
      ], 'facetags', { hint: 'Click a face on the photo to add a tag, then choose the assistant. Drag a marker to move it.' }),
    ] },
  ] },
  { id: 'about', title: 'About', sections: [
    { id: 'hero', title: 'Page header', fields: [ f('about.kicker', 'Small label', 'About'), f('about.title', 'Title', 'Apa itu SPIS Laboratory?'), f('about.photo', 'Header photo', '/assets/group.webp', 'image') ] },
    { id: 'parts', title: 'Section titles', fields: [
      f('about.values_title', 'Values title', 'Nilai laboratorium'),
      f('about.values_visuals', 'Value card animations (1–3)', ['precision', 'collab', 'impact'], 'list', { item: [['value', 'Animation', 'visual']], simple: true }),
      f('about.focus_title', 'Research focus title', 'Fokus riset'), f('about.naungan_kicker', 'Parent group label', 'Naungan'),
      f('about.location_kicker', 'Location label', 'Lokasi'), f('about.fac_title', 'Facilities title', 'Fasilitas lab'), f('about.fac_link', 'Facilities link text', 'Galeri lengkap'),
    ] },
    { id: 'location', title: 'Location', fields: [
      f('about.building', 'Building', 'Gedung Bangkit, Telkom University'), f('about.address', 'Address', 'Jl. Telekomunikasi, Terusan Buah Batu, Bandung 40257'), f('about.phone', 'Phone', '(022) 7566456'),
      f('about.beacon', 'Label in location animation', 'GEDUNG BANGKIT · KK SPICE'),
    ] },
  ] },
  { id: 'achievement', title: 'Achievement', sections: [
    { id: 'texts', title: 'Page texts', fields: [
      f('ach.kicker', 'Small label', 'Achievement'), f('ach.title', 'Title', 'Publikasi & pendanaan riset'),
      f('ach.sub', 'Paragraph', 'Karya ilmiah dosen dan asisten SPIS Laboratory — klik judul untuk membuka abstrak.', 'textarea'),
      f('ach.count_label', 'Count label', 'Publikasi tercatat'), f('ach.range_label', 'Year range label', 'Rentang tahun'),
      f('ach.f_all', 'Filter: all', 'Semua'), f('ach.f_pub', 'Filter: publications', 'Publikasi'), f('ach.f_fund', 'Filter: funding', 'Pendanaan'),
      f('ach.search', 'Search placeholder', 'Cari judul, penulis, venue…'), f('ach.shown', '“Showing” text', 'Menampilkan'), f('ach.of', '“of” text', 'dari'),
      f('ach.empty', 'No results text', 'Tidak ada publikasi yang cocok.'), f('ach.link', 'Link text', 'Tautan'),
    ] },
  ] },
  { id: 'abdimas', title: 'Abdimas', sections: [
    { id: 'texts', title: 'Page texts', fields: [
      f('abd.kicker', 'Small label', 'Abdimas'), f('abd.title', 'Title', 'Pengabdian kepada masyarakat'),
      f('abd.sub', 'Paragraph', 'Penerapan hasil riset SPIS Lab untuk memberi manfaat langsung bagi masyarakat.', 'textarea'), f('abd.empty', 'Empty text', 'Belum ada kegiatan abdimas.'), f('abd.link', 'Documentation link text', 'Lihat dokumentasi'),
    ] },
  ] },
  { id: 'recruitment', title: 'Recruitment', sections: [
    { id: 'hero', title: 'Page header', fields: [
      f('rec.kicker', 'Small label', 'Recruitment'), f('rec.title', 'Title', 'Informasi Open Recruitment Asisten Lab'),
      f('rec.sub', 'Paragraph', 'Kesempatan bagi mahasiswa untuk terlibat langsung dalam riset dan aktivitas laboratorium SPIS.', 'textarea'),
      f('rec.open', 'Open status label', 'Dibuka'), f('rec.closed', 'Closed status label', 'Ditutup'),
    ] },
    { id: 'card', title: 'Recruitment card', fields: [
      f('rec.card_kicker', 'Small label on card', 'Semester ganjil · dibuka'), f('rec.btn', 'Register button', 'Daftar sekarang'), f('rec.status_link', 'Check status link', 'Sudah daftar? Cek status'),
      f('rec.req_title', 'Requirements title', 'Persyaratan'), f('rec.deadline', 'Deadline label', 'Batas pendaftaran'),
      f('rec.closed_text', 'Text when registration is closed', 'Pendaftaran sedang ditutup. Pantau Instagram @spislaboratory untuk info rekrutmen berikutnya.', 'textarea'),
      f('rec.none', 'Text when there is no recruitment', 'Belum ada informasi rekrutmen.'),
    ] },
    { id: 'divs', title: 'Highlights & divisions', fields: [
      f('rec.highlights', 'Highlights (used when the period has none)', [
        { title: 'Lab riset', text: 'SPIS adalah laboratorium riset — asisten terlibat langsung dalam penelitian dosen.' },
        { title: 'S1 & S2', text: 'Terbuka bagi mahasiswa S1 dan S2 yang tertarik pada pengolahan sinyal dan sistem cerdas.' },
        { title: 'KK SPICE', text: 'Dibimbing dosen Kelompok Keahlian Signal Processing, Information Security, and Computer Engineering.' },
      ], 'list', { item: [['title', 'Title'], ['text', 'Text', 'textarea']] }),
      f('rec.div_title', 'Divisions title', 'Divisi asisten'), f('rec.div_sub', 'Divisions paragraph', 'Asisten riset SPIS terbagi ke beberapa divisi. Inilah tim yang akan bekerja bersamamu.', 'textarea'),
    ] },
    { id: 'form', title: 'Registration form page', fields: [
      f('daftar.kicker', 'Small label', 'Formulir pendaftaran · asisten riset 26/27'), f('daftar.title', 'Title', 'Daftar jadi asisten riset SPIS'),
      f('daftar.sub', 'Paragraph', 'Isi formulir ini sampai selesai, sekitar 10 menit. Siapkan CV, transkrip, KTM, pas foto, motivation letter, twibbon, dan screenshot story Instagram.', 'textarea'),
      f('daftar.chips', 'Header chips', ['± 10 menit', 'Tanpa akun'], 'list', { item: [['value', 'Text']], simple: true }),
      f('daftar.next', 'Next button', 'Lanjut →'), f('daftar.prev', 'Back button', '← Kembali'), f('daftar.submit', 'Submit button', 'Kirim pendaftaran ✓'),
      f('daftar.review_title', 'Last step title', 'Tinjau & kirim'), f('daftar.review_sub', 'Last step text', 'Periksa lagi jawabanmu. Setelah dikirim, data tidak bisa diubah.'),
      f('daftar.required_err', 'Required-field message', 'Masih ada pertanyaan wajib yang belum diisi.'),
      f('daftar.done_title', 'Title after submit', 'Pendaftaran terkirim!'),
      f('daftar.btn_status', 'Check status button', 'Cek status'), f('daftar.btn_home', 'Home button', 'Ke beranda'),
      f('daftar.closed_title', 'Title when closed', 'Pendaftaran sedang ditutup'),
    ] },
    { id: 'status', title: 'Status check page', fields: [
      f('status.title', 'Title', 'Cek status pendaftaran'), f('status.sub', 'Paragraph', 'Masukkan nomor pendaftaran dan NIM. Tidak perlu akun atau password.', 'textarea'),
      f('status.no', 'Number label', 'Nomor pendaftaran'), f('status.nim', 'NIM label', 'NIM'), f('status.btn', 'Button', 'Cek status →'),
      f('status.hint', 'Hint', 'Lupa nomor? Cari email dari SPIS Laboratory dengan subjek "Nomor pendaftaran".'),
      f('status.s1', 'Step 1', 'Berkas diterima'), f('status.s2', 'Step 2', 'Seleksi berkas'), f('status.s2d', 'Step 2 note', 'Ditinjau tim asisten'),
      f('status.s3', 'Step 3', 'Wawancara'), f('status.s3d', 'Step 3 note', 'Jadwal dikirim lewat email & WhatsApp'),
      f('status.s4', 'Step 4', 'Pengumuman'), f('status.s4d', 'Step 4 note', 'Diumumkan di website & Instagram @spislaboratory'),
    ] },
  ] },
  { id: 'organigram', title: 'Organigram', sections: [
    { id: 'texts', title: 'Page texts', fields: [
      f('org.kicker', 'Small label', 'Organigram'), f('org.title', 'Title', 'Struktur organisasi laboratorium'),
      f('org.sub', 'Paragraph', 'Arahkan kursor ke salah satu kotak untuk menyalakan jalur sinyalnya sampai ke kepala laboratorium.', 'textarea'),
      f('org.dosen', 'Dosen box label', 'Dosen'), f('org.coordinator_label', 'Coordinator role', 'Koordinator Asisten'),
      f('org.divisions', 'Division order', DIVISIONS, 'list', { item: [['value', 'Division name']], simple: true, hint: 'Names must match the Division field in Dosen & Asisten.' }),
    ] },
  ] },
  { id: 'people', title: 'Dosen & Asisten', sections: [
    { id: 'texts', title: 'Page texts', fields: [
      f('people.kicker', 'Small label', 'Dosen & Asisten'), f('people.title', 'Title', 'Orang-orang SPIS'),
      f('people.sub', 'Paragraph', 'Dosen pembina dan asisten riset Signal Processing for Intelligent System Laboratory.', 'textarea'),
      f('people.tab_asisten', 'Assistants tab', 'Asisten'), f('people.tab_dosen', 'Dosen tab', 'Dosen'),
    ] },
    { id: 'profile', title: 'Profile page', fields: [
      f('profile.back', 'Back link', '← Dosen & Asisten'), f('profile.pubs_title', 'Publications title', 'Pencapaian di SPIS Lab'),
      f('profile.pubs_label', 'Publication count label', 'Publikasi di SPIS'), f('profile.range_label', 'Year range label', 'Rentang tahun'),
      f('profile.no_bio', 'Text when bio is empty', 'Anggota SPIS Laboratory, Telkom University.'), f('profile.no_pubs', 'Text when no publications', 'Belum ada publikasi yang tercatat.'),
    ] },
  ] },
  { id: 'projects', title: 'Projects', sections: [
    { id: 'list', title: 'List page', fields: [
      f('proj.kicker', 'Small label', 'Projects'), f('proj.title', 'Title', 'Alat & teknologi SPIS Lab'),
      f('proj.sub', 'Paragraph', 'Katalog alat, instrumen, dan sistem yang telah dikembangkan oleh SPIS Laboratory.', 'textarea'),
      f('proj.all', '“All” filter', 'Semua'), f('proj.view', 'Card link text', 'View project'), f('proj.empty', 'Empty text', 'Belum ada proyek.'),
      f('proj.categories', 'Category filter order', [], 'list', { item: [['value', 'Category']], simple: true, hint: 'Leave empty to use categories from the project data.' }),
    ] },
    { id: 'detail', title: 'Detail page', fields: [
      f('project.back', 'Back link', '← Semua proyek'), f('project.overview', 'Overview title', 'Overview'), f('project.purpose', 'Purpose title', 'Purpose / Function'),
      f('project.how', 'How it works title', 'How it works'), f('project.apps', 'Applications title', 'Applications'), f('project.specs', 'Specifications title', 'Specifications'),
      f('project.outputs', 'Outputs title', 'Outputs'), f('project.pubs', 'Related publications title', 'Related publications'), f('project.docs', 'Documentation title', 'Documentation'),
      f('project.m_category', 'Category label', 'Kategori'), f('project.m_year', 'Year label', 'Tahun'), f('project.m_status', 'Status label', 'Status'),
      f('project.m_dev', 'Developer label', 'Pengembang'), f('project.m_sup', 'Supervisor label', 'Pembimbing'),
    ] },
  ] },
  { id: 'lab', title: 'Lab Activities', sections: [
    { id: 'texts', title: 'Page texts', fields: [
      f('lab.kicker', 'Small label', 'Lab activities'), f('lab.title', 'Title', 'Kegiatan & fasilitas lab'),
      f('lab.sub', 'Paragraph', 'Ruang riset SPIS di Gedung Bangkit, Telkom University. Klik foto untuk memperbesar.', 'textarea'),
      f('lab.tab_fas', 'Facilities tab', 'Fasilitas'), f('lab.tab_keg', 'Activities tab', 'Kegiatan'),
      f('lab.empty_title', 'Empty title', 'Belum ada foto'), f('lab.empty_text', 'Empty text', 'Foto dan video yang diunggah asisten lewat panel admin akan muncul di sini.', 'textarea'),
      f('lab.close', 'Close preview button', 'TUTUP'),
    ] },
  ] },
];

export const CONTENT_DEFAULTS = Object.fromEntries(CONTENT.flatMap((g) => g.sections.flatMap((s) => s.fields.map((x) => [x.key, x.def]))));
