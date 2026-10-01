import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const revalidate = 0;

const RESEARCH_INDEX = [
  { code: "01", title: "Radar", desc: "Deteksi, estimasi, dan pelacakan objek pada sistem radar & sonar." },
  { code: "02", title: "Biosignal", desc: "Ekstraksi informasi dari sinyal biomedis untuk aplikasi kesehatan." },
  { code: "03", title: "Speech Processing", desc: "Pemrosesan sinyal suara untuk interaksi & sistem cerdas." },
  { code: "04", title: "AI Signal Processing", desc: "Machine learning & deep learning pada data sinyal berdimensi tinggi." },
];

export default async function HomePage() {
  const supabase = createClient();

  const [{ data: achievements }, { data: openRecruitment }, { data: members }, { data: labPhotos }] =
    await Promise.all([
      supabase.from("achievements").select("*").order("year", { ascending: false }).limit(3),
      supabase.from("recruitment").select("*").eq("is_open", true).order("created_at", { ascending: false }).limit(1),
      supabase.from("members").select("*").order("order_index", { ascending: true }),
      supabase.from("lab_photos").select("*").order("order_index", { ascending: true }).limit(4),
    ]);

  const dosen = (members || []).filter((m) => m.category === "dosen");
  const asisten = (members || []).filter((m) => m.category === "asisten");
  const teamPreview = [...dosen, ...asisten].slice(0, 4);

  const achievementIds = (achievements ?? []).map((a) => a.id);
  const { data: achievementLinks } = achievementIds.length
    ? await supabase
        .from("achievement_members")
        .select("achievement_id, member_id")
        .in("achievement_id", achievementIds)
    : { data: [] };

  const memberNameById = new Map((members ?? []).map((m) => [m.id, m.name]));
  const achievementsWithAuthors = (achievements ?? []).map((a) => ({
    ...a,
    authorNames: (achievementLinks ?? [])
      .filter((l) => l.achievement_id === a.id)
      .map((l) => memberNameById.get(l.member_id))
      .filter(Boolean),
  }));

  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO — duotone photo, bold headline, real logo tagline */}
        <section className="relative overflow-hidden bg-paper">
          <div className="container-lab grid gap-10 py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-28">
            <div>
              <p className="eyebrow mb-6">
                Telkom University · Fakultas Teknik Elektro
              </p>
              <h1 className="font-display text-4xl font-bold leading-[1.08] text-spis md:text-5xl lg:text-[3.4rem]">
                Signal Processing for Intelligent Systems Laboratory
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-slate md:text-lg">
                Riset radar, biosignal, dan speech processing — dari eksperimen
                di lab sampai publikasi. Kami membangun sistem sensor yang
                memahami dunia di sekitarnya.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/tentang"
                  className="bg-spis-deep px-6 py-3 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:bg-spis"
                >
                  About Lab
                </Link>
                <Link
                  href="/organigram"
                  className="border border-spis px-6 py-3 font-mono text-xs uppercase tracking-wider text-spis transition-colors hover:bg-spis hover:text-white"
                >
                  About Us
                </Link>
              </div>
            </div>

            <div className="flex w-full items-center justify-center md:justify-end">
              <Image
                src="/logo/spis-logo-navy.png"
                alt="SPIS Laboratory"
                width={625}
                height={313}
                className="h-auto w-full max-w-md"
              />
            </div>
          </div>
        </section>

        {/* ABOUT — About Lab (kiri) + About Us / asisten (kanan) */}
        <section className="border-t-4 border-line bg-paper">
          <div className="container-lab grid gap-12 py-20 md:grid-cols-2 md:py-24">
            <div>
              <p className="eyebrow mb-4">About Lab</p>
              <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">
                Laboratorium riset di bawah Kelompok Keahlian SPICE
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate md:text-base">
                SPIS Laboratory mengembangkan teori dan algoritma pengolahan
                sinyal untuk berbagai bidang aplikasi — radar, biosignal, dan
                speech processing — memadukan riset dasar dengan
                kolaborasi mahasiswa di Fakultas Teknik Elektro, Telkom
                University.
              </p>
              <Link
                href="/tentang"
                className="mt-6 inline-block font-mono text-xs uppercase tracking-wider text-spis underline underline-offset-4"
              >
                Selengkapnya tentang lab →
              </Link>
            </div>

            <div>
              <p className="eyebrow mb-4">About Us</p>
              <div className="space-y-3">
                {asisten.length > 0 ? (
                  asisten.slice(0, 3).map((m) => (
                    <Link
                      key={m.id}
                      href={`/tim/${m.id}`}
                      className="flex items-center gap-4 rounded-lg border border-spis bg-paper-2 p-3 transition-colors hover:bg-spis-soft"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-spis-mid">
                        {m.photo_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.photo_url} alt={m.name} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{m.name}</p>
                        <p className="truncate font-mono text-[11px] text-slate-light">
                          {[m.angkatan, m.jurusan].filter(Boolean).join(" · ") || m.position}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-slate-light">
                    Profil asisten akan tampil di sini setelah ditambahkan lewat dashboard admin.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* LAB ACTIVITIES — foto nyata, energi aktif */}
        <section className="border-t-4 border-line bg-paper py-20 md:py-24">
          <div className="container-lab">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">Lab Activities</p>
                <h2 className="max-w-xl font-display text-2xl font-bold text-ink md:text-3xl">
                  Kegiatan Lab dan Fasilitas Lab
                </h2>
              </div>
              <Link href="/lab-activities" className="font-mono text-xs uppercase tracking-wider text-spis underline underline-offset-4">
                View All →
              </Link>
            </div>
            {labPhotos && labPhotos.length > 0 ? (
              <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                {labPhotos.map((photo) => (
                  <div key={photo.id} className="overflow-hidden rounded-lg border border-spis bg-white">
                    <div className="aspect-square w-full overflow-hidden">
                      {photo.media_type === "video" ? (
                        <video src={photo.video_url} controls className="h-full w-full bg-black object-cover" />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photo.photo_url} alt={photo.title || "Kegiatan lab SPIS"} className="h-full w-full object-cover" />
                      )}
                    </div>
                    {(photo.title || photo.description) && (
                      <div className="p-3">
                        {photo.title && (
                          <p className="truncate text-xs font-semibold text-ink">{photo.title}</p>
                        )}
                        {photo.description && (
                          <p className="mt-0.5 truncate text-xs text-slate-light">{photo.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-10 text-sm text-slate">
                Foto kegiatan dan fasilitas lab akan tampil di sini setelah ditambahkan lewat dashboard admin.
              </p>
            )}
          </div>
        </section>

        {/* RESEARCH INDEX — chips editorial, bukan floating card */}
        <section className="border-t-4 border-line bg-paper py-20 md:py-24">
          <div className="container-lab">
            <p className="eyebrow mb-3">Research Index</p>
            <h2 className="max-w-xl font-display text-2xl font-bold text-ink md:text-3xl">
              Empat arah riset utama laboratorium
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
              {RESEARCH_INDEX.map((r, i) => (
                <div
                  key={r.code}
                  className="rounded-lg border border-spis px-5 py-4 text-white"
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
        <section className="border-t-4 border-line bg-paper py-20 md:py-24">
          <div className="container-lab">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">Our People</p>
                <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">
                  Dosen &amp; Asisten
                </h2>
              </div>
              <Link href="/organigram" className="font-mono text-xs uppercase tracking-wider text-spis underline underline-offset-4">
                View All →
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
              {teamPreview.length > 0 ? (
                teamPreview.map((m) => (
                  <Link key={m.id} href={`/tim/${m.id}`} className="group">
                    <div className="aspect-square w-full overflow-hidden rounded-lg border border-spis bg-paper-2">
                      {m.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.photo_url}
                          alt={m.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-heading text-lg font-bold text-slate-light">
                          {m.name?.[0]}
                        </div>
                      )}
                    </div>
                    <p className="mt-3 font-heading text-sm font-semibold text-ink">
                      {m.name}
                    </p>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-slate-light">
                      {m.position || m.category}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="col-span-full text-sm text-slate">
                  Profil dosen dan asisten akan tampil di sini setelah ditambahkan lewat dashboard admin.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* PENCAPAIAN */}
        <section className="border-t-4 border-line bg-paper py-20 md:py-24">
          <div className="container-lab">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">Recent Achievement</p>
                <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">
                  Publikasi &amp; pendanaan riset
                </h2>
              </div>
              <Link href="/pencapaian" className="font-mono text-xs uppercase tracking-wider text-spis underline underline-offset-4">
                View All →
              </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {achievementsWithAuthors.length > 0 ? (
                achievementsWithAuthors.map((item) => (
                  <div key={item.id} className="rounded-lg border-2 border-spis bg-white p-6">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-spis-bright">
                      {item.type === "publikasi" ? "Publikasi" : "Pendanaan Riset"}
                      {item.year ? ` · ${item.year}` : ""}
                    </span>
                    <h3 className="mt-3 font-heading text-base font-semibold leading-snug text-ink">
                      {item.title}
                    </h3>
                    {item.venue && <p className="mt-2 text-sm text-slate">{item.venue}</p>}
                    {item.authorNames.length > 0 && (
                      <p className="mt-2 text-xs text-slate-light">{item.authorNames.join(", ")}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate">
                  Belum ada data pencapaian. Asisten dapat menambahkannya lewat dashboard admin.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* REKRUTMEN CTA — aksen navy pada tombol, bukan seluruh section */}
        {openRecruitment && openRecruitment.length > 0 && (
          <section className="border-t-4 border-line bg-paper">
            <div className="container-lab flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-slate-light">
                  Registration Open
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-ink md:text-3xl">
                  {openRecruitment[0].title}
                </h2>
              </div>
              <Link
                href="/rekrutmen"
                className="whitespace-nowrap bg-spis-deep px-6 py-3 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:bg-spis"
              >
                View Details →
              </Link>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
