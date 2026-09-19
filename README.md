# Website SPIS Lab — Panduan Lengkap (Untuk Pemula)

Website ini dibangun dengan **Next.js** (kode) + **Supabase** (database,
login, penyimpanan foto) + **Vercel** (tempat website di-online-kan).

> **Catatan penting:** Sejak repo ini dipisah, project ini **hanya berisi
> website publik** (read-only, tanpa login sama sekali). Sistem login
> asisten & admin panel sekarang ada di **project terpisah**
> (`spis-lab-admin`, deploy ke `asisten.spis-laboratory.vercel.app`).
> Keduanya connect ke **Supabase project yang sama**, jadi konten yang
> diubah lewat admin panel otomatis muncul di sini — tidak perlu
> langkah sinkronisasi tambahan.

Ikuti langkah 1–7 secara berurutan. Semua gratis untuk skala website
laboratorium seperti ini.

---

## Ringkasan Fitur

- **Halaman publik** (bisa diakses siapa saja): Beranda, Tentang,
  Pencapaian (publikasi & pendanaan riset), Abdimas, Rekrutmen,
  Organigram, dan Tim (Dosen & Asisten).
- Tidak ada login atau admin panel di project ini — semua itu ada di
  project `spis-lab-admin` yang terpisah.

---

## Langkah 1 — Buat Project Supabase (Database)

1. Buka **[supabase.com](https://supabase.com)** → **Start your project**
   → daftar (bisa pakai akun GitHub/Google).
2. Klik **New Project**.
   - Name: `spis-lab`
   - Database Password: buat kata sandi, **simpan di tempat aman**.
   - Region: pilih **Southeast Asia (Singapore)** agar paling cepat diakses dari Indonesia.
3. Tunggu ± 2 menit sampai project selesai dibuat.
4. Di sidebar kiri, klik ikon **SQL Editor** → **New query**.
5. Buka file `supabase/schema.sql` dari folder proyek ini, salin
   **seluruh isinya**, tempel ke SQL Editor, lalu klik **Run**.
   Ini akan membuat semua tabel, aturan keamanan, dan tempat
   penyimpanan foto secara otomatis.
6. **(Opsional)** Jika ingin website langsung terisi contoh data supaya
   tidak kosong: buka **New query** lagi, salin isi `supabase/seed.sql`,
   tempel, lalu **Run**. Data contoh ini nanti bisa Anda ubah/hapus
   lewat dashboard admin.

## Langkah 2 — Ambil Kunci API Supabase

1. Di sidebar kiri, klik ikon **Settings (gerigi)** → **API**.
2. Catat 3 nilai berikut (akan dipakai di Langkah 5):
   - **Project URL** → contoh: `https://xxxxxxx.supabase.co`
   - **anon public** key (kunci panjang di bagian "Project API keys")
   - **service_role** key (klik "Reveal" untuk melihatnya — **JANGAN
     pernah dibagikan ke publik atau dimasukkan ke kode yang di-upload
     ke GitHub publik**)

## Langkah 3 — Siapkan Kode di GitHub

Vercel akan mengambil kode dari GitHub untuk di-deploy.

1. Buka **[github.com](https://github.com)** → daftar akun jika belum punya.
2. Klik tombol **+** di kanan atas → **New repository**.
   - Repository name: `spis-lab`
   - Pilih **Private** (agar kode tidak terlihat publik)
   - Klik **Create repository**
3. Di halaman repo kosong tadi, klik link **"uploading an existing file"**.
4. Buka folder proyek `spis-lab` ini di komputer Anda, **seleksi semua
   file dan folder di dalamnya** (bukan folder `spis-lab` itu sendiri,
   tapi isinya), lalu **drag-and-drop** ke halaman GitHub tersebut.
5. Tunggu sampai semua file selesai ter-upload, lalu klik
   **Commit changes**.

> Catatan: file `.env.local` sengaja **tidak** disertakan (lihat
> `.gitignore`) karena berisi kunci rahasia — kunci akan dimasukkan
> langsung di pengaturan Vercel pada Langkah 5, bukan di dalam kode.

## Langkah 4 — Buat Akun Vercel

1. Buka **[vercel.com](https://vercel.com)** → **Sign Up** → pilih
   **Continue with GitHub** supaya otomatis terhubung.

## Langkah 5 — Deploy ke Vercel

1. Di dashboard Vercel, klik **Add New** → **Project**.
2. Cari repository `spis-lab` yang tadi dibuat → klik **Import**.
3. Sebelum klik Deploy, buka bagian **Environment Variables** dan
   tambahkan 2 baris berikut (Name di kiri, Value di kanan) — isi
   Value dengan nilai dari Langkah 2:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL dari Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |

   (`SUPABASE_SERVICE_ROLE_KEY` **tidak** dibutuhkan di sini — itu cuma
   dipakai di project `spis-lab-admin`.)

4. Klik **Deploy** dan tunggu ± 1–2 menit.
5. Setelah selesai, Vercel akan memberi Anda link seperti
   `https://spis-lab.vercel.app` — **inilah link yang Anda bagikan ke
   publik.**

## Langkah 6 — Membuat Akun Admin Pertama

Akun asisten hanya bisa dibuat lewat dashboard admin — tapi untuk
akun yang **pertama**, belum ada siapa pun yang bisa login untuk
membuatkannya. Jadi akun pertama dibuat manual, sekali saja, langsung
dari Supabase:

1. Di dashboard Supabase project Anda, buka **Authentication** → **Users**
   → klik **Add user** → **Create new user**.
   - Email: email asisten pertama (misalnya ketua lab/koordinator)
   - Password: buat kata sandi awal
   - Centang **Auto Confirm User** → klik **Create user**
2. Buka **SQL Editor** → **New query**, tempel perintah berikut (ganti
   email di dalam tanda kutip dengan email yang baru saja didaftarkan),
   lalu **Run**:

   ```sql
   insert into public.profiles (id, full_name, email)
   select id, 'Nama Lengkap Anda', email
   from auth.users
   where email = 'email-yang-baru-didaftarkan@contoh.com';
   ```

3. Sekarang buka `https://asisten.spis-laboratory.vercel.app` dan login
   dengan email + password tadi.
4. Setelah berhasil login, akun asisten **berikutnya** cukup dibuat
   lewat menu **Kelola Akun** di dashboard — tidak perlu lagi lewat
   Supabase secara manual.

## Langkah 7 — Mulai Isi Konten

Login ke `https://asisten.spis-laboratory.vercel.app`, lalu lewat menu di sidebar:

- **Dosen & Asisten** — isi profil beserta foto (isi ini dulu, karena
  Organigram mengambil data dari sini).
- **Pencapaian, Abdimas, Rekrutmen** — tambahkan sesuai kebutuhan.
- **Organigram** — pilih orang dari daftar Dosen & Asisten lalu
  tentukan jabatan & tingkatannya.

Setiap perubahan yang disimpan akan langsung tampil di website publik.

---

## Menjalankan di Komputer Sendiri (opsional, untuk pengembangan lanjutan)

Jika suatu saat ingin mengubah desain/kode lebih jauh (disarankan
pakai **Claude Code**, karena proyek ini akan terus berkembang):

```bash
npm install
cp .env.local.example .env.local   # lalu isi dengan kunci dari Langkah 2
npm run dev
```

Buka `http://localhost:3000`.

---

## Tentang Desain

Identitas visual website ini sengaja dibangun dari dunia pengolahan
sinyal itu sendiri, bukan template generik:

- **Warna**: navy gelap ala layar osiloskop (`#0B1220`) dipadukan
  cyan sinyal (`#29E6C6`) untuk nuansa riset/teknis, serta maroon
  (`#8C1524`) sebagai aksen institusional khas Telkom University.
- **Tipografi**: *Space Grotesk* (judul, tegas & teknis), *Inter*
  (isi, mudah dibaca), *IBM Plex Mono* (label kecil & data — memberi
  kesan "pembacaan instrumen").
- **Elemen khas**: garis gelombang sinyal (waveform) yang muncul di
  hero dan sebagai pembatas antar-bagian — merepresentasikan bidang
  riset lab secara langsung, bukan sekadar hiasan.

Semua warna/font ini bisa diubah lewat `tailwind.config.js` dan
`app/layout.js` bila suatu saat ingin disesuaikan lagi.
