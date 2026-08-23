import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const revalidate = 0;

const LAB_PHOTOS = [
  "/images/lab/lab-1.jpg",
  "/images/lab/lab-2.jpg",
  "/images/lab/lab-3.jpg",
  "/images/lab/lab-4.jpg",
];

const RESEARCH_INDEX = [
  { code: "01", title: "Radar", desc: "Deteksi, estimasi, dan pelacakan objek pada sistem radar & sonar." },
  { code: "02", title: "Biosignal", desc: "Ekstraksi informasi dari sinyal biomedis untuk aplikasi kesehatan." },
  { code: "03", title: "Speech Processing", desc: "Pemrosesan sinyal suara untuk interaksi & sistem cerdas." },
  { code: "04", title: "AI Signal Processing", desc: "Machine learning & deep learning pada data sinyal berdimensi tinggi." },
];

export default async function HomePage() {
  const supabase = createClient();

  const [{ data: achievements }, { data: openRecruitment }, { data: members }] =
    await Promise.all([
      supabase.from("achievements").select("*").order("year", { ascending: false }).limit(3),
      supabase.from("recruitment").select("*").eq("is_open", true).order("created_at", { ascending: false }).limit(1),
      supabase.from("members").select("*").order("order_index", { ascending: true }).limit(6),
    ]);

  const dosen = (members || []).filter((m) => m.category === "dosen");
  const asisten = (members || []).filter((m) => m.category === "asisten");
  const teamPreview = [...dosen, ...asisten].slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO — duotone photo, bold headline, real logo tagline */}
        <section className="relative overflow-hidden bg-spis-bright text-white">
          <div className="container-lab grid gap-10 py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-28">
            <div>
              <p className="eyebrow-light mb-6">
                Telkom University · Fakultas Teknik Elektro
              </p>
              <h1 className="font-display text-4xl font-bold leading-[1.08] md:text-5xl lg:text-[3.4rem]">
                Signal Processing for Intelligent Systems Laboratory
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70 md:text-lg">
                Riset radar, biosignal, dan speech processing — dari eksperimen
                di lab sampai publikasi. Kami membangun sistem sensor yang
                memahami dunia di sekitarnya.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/tentang"
                  className="bg-white px-6 py-3 font-mono text-xs uppercase tracking-wider text-spis-bright transition-colors hover:bg-spis-soft"
                >
                  About Lab
                </Link>
                <Link
                  href="/tim"
                  className="border border-white/40 px-6 py-3 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:border-white"
                >
                  About Us
                </Link>
              </div>
            </div>

            {/* duotone hero photo — swap src once real lab photo is provided */}
            <div className="duotone-photo aspect-[4/3] w-full rounded-lg md:aspect-square">
              <div className="flex h-full w-full items-center justify-center">
                <Image
                  src="/logo/spis-mark-white.png"
                  alt=""
                  width={180}
                  height={180}
                  className="h-24 w-24 opacity-30 md:h-32 md:w-32"
                />
              </div>
              <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest text-white/50">
                Foto lab · ganti dengan foto asli
              </span>
            </div>
          </div>
        </section>

        {/* ABOUT — About Lab (kiri) + About Us / asisten (kanan) */}
        <section className="bg-spis-bright text-white">
          <div className="container-lab grid gap-12 py-20 md:grid-cols-2 md:py-24">
            <div>
              <p className="eyebrow-light mb-4">About Lab</p>
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Laboratorium riset & praktikum di bawah Kelompok Keahlian SPICE
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">
                SPIS Laboratory mengembangkan teori dan algoritma pengolahan
                sinyal untuk berbagai bidang aplikasi — radar, biosignal, dan
                speech processing — memadukan riset dasar dengan praktikum dan
                kolaborasi mahasiswa di Fakultas Teknik Elektro, Telkom
                University.
              </p>
              <Link
                href="/tentang"
                className="mt-6 inline-block font-mono text-xs uppercase tracking-wider text-white underline underline-offset-4"
              >
                Selengkapnya tentang lab →
              </Link>
            </div>

            <div>
              <p className="eyebrow-light mb-4">About Us</p>
              <div className="space-y-3">
                {asisten.length > 0 ? (
                  asisten.slice(0, 3).map((m) => (
                    <Link
                      key={m.id}
                      href={`/tim/${m.id}`}
                      className="flex items-center gap-4 rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-spis-mid">
                        {m.photo_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.photo_url} alt={m.name} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{m.name}</p>
                        <p className="truncate font-mono text-[11px] text-white/50">
                          {[m.angkatan, m.jurusan].filter(Boolean).join(" · ") || m.position}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-white/60">
                    Profil asisten akan tampil di sini setelah ditambahkan lewat dashboard admin.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* LAB ACTIVITIES — foto nyata, energi aktif */}
        <section className="bg-spis-bright py-20 md:py-24">
          <div className="container-lab">
            <p className="eyebrow-light mb-3">Lab Activities</p>
            <h2 className="max-w-xl font-display text-2xl font-bold text-white md:text-3xl">
              Riset, kegiatan lab, dan kolaborasi tiap minggu
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {LAB_PHOTOS.map((src, i) => (
                <div key={src} className="aspect-square overflow-hidden rounded-lg bg-spis-deep">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Kegiatan lab SPIS ${i + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RESEARCH INDEX — chips editorial, bukan floating card */}
        <section className="bg-spis-bright py-20 md:py-24">
          <div className="container-lab">
            <p className="eyebrow-light mb-3">Research Index</p>
            <h2 className="max-w-xl font-display text-2xl font-bold text-white md:text-3xl">
              Empat arah riset utama laboratorium
            </h2>
            <div className="mt-10 flex flex-wrap gap-3">
              {RESEARCH_INDEX.map((r, i) => (
                <div
                  key={r.code}
                  className="rounded-lg px-5 py-4 text-white ring-1 ring-white/15"
                  style={{
                    backgroundColor: ["#0F2C66", "#0B2050", "#173768", "#4C7EBF"][i],
                  }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/60">
                    {r.code}
                  </p>
                  <p className="mt-1 font-heading text-sm font-bold">{r.title}</p>
                  <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-white/70">
                    {r.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TIM — klik untuk detail */}
        <section className="bg-spis-bright py-20 md:py-24">
          <div className="container-lab">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow-light mb-3">Orang di Balik Lab</p>
                <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                  Dosen &amp; Asisten
                </h2>
              </div>
              <Link href="/tim" className="font-mono text-xs uppercase tracking-wider text-white underline underline-offset-4">
                Lihat semua →
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
              {teamPreview.length > 0 ? (
                teamPreview.map((m) => (
                  <Link key={m.id} href={`/tim/${m.id}`} className="group">
                    <div className="aspect-square w-full overflow-hidden rounded-lg bg-white/10">
                      {m.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.photo_url}
                          alt={m.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-heading text-lg font-bold text-white/70">
                          {m.name?.[0]}
                        </div>
                      )}
                    </div>
                    <p className="mt-3 font-heading text-sm font-semibold text-white">
                      {m.name}
                    </p>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-white/60">
                      {m.position || m.category}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="col-span-full text-sm text-white/70">
                  Profil dosen dan asisten akan tampil di sini setelah ditambahkan lewat dashboard admin.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* PENCAPAIAN */}
        <section className="bg-spis-bright py-20 md:py-24">
          <div className="container-lab">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow-light mb-3">Pencapaian Terbaru</p>
                <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                  Publikasi &amp; pendanaan riset
                </h2>
              </div>
              <Link href="/pencapaian" className="font-mono text-xs uppercase tracking-wider text-white underline underline-offset-4">
                Lihat semua →
              </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {achievements && achievements.length > 0 ? (
                achievements.map((item) => (
                  <div key={item.id} className="rounded-lg bg-white p-6">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-spis-bright">
                      {item.type === "publikasi" ? "Publikasi" : "Pendanaan Riset"}
                      {item.year ? ` · ${item.year}` : ""}
                    </span>
                    <h3 className="mt-3 font-heading text-base font-semibold leading-snug text-ink">
                      {item.title}
                    </h3>
                    {item.venue && <p className="mt-2 text-sm text-slate">{item.venue}</p>}
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/70">
                  Belum ada data pencapaian. Asisten dapat menambahkannya lewat dashboard admin.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* REKRUTMEN CTA — aksen merah minim */}
        {openRecruitment && openRecruitment.length > 0 && (
          <section className="bg-spis-deep text-white">
            <div className="container-lab flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-white/70">
                  Pendaftaran Dibuka
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
                  {openRecruitment[0].title}
                </h2>
              </div>
              <Link
                href="/rekrutmen"
                className="whitespace-nowrap border border-white px-6 py-3 font-mono text-xs uppercase tracking-wider transition-colors hover:bg-white hover:text-spis-deep"
              >
                Lihat Detail →
              </Link>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
