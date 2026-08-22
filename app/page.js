import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WaveformBars, WaveformTrace } from "@/components/waveform";

export const revalidate = 0;

const FOCUS_AREAS = [
  {
    code: "01",
    title: "Radar & Sonar Signal Processing",
    desc: "Pengolahan sinyal untuk deteksi, estimasi, dan pelacakan objek pada sistem radar dan sonar.",
  },
  {
    code: "02",
    title: "Biosignal & Speech Processing",
    desc: "Ekstraksi informasi dari sinyal biomedis dan suara untuk aplikasi kesehatan dan interaksi cerdas.",
  },
  {
    code: "03",
    title: "Adaptive & Intelligent Sensing",
    desc: "Algoritma adaptif untuk sistem sensor yang memahami dan merespons lingkungan secara mandiri.",
  },
  {
    code: "04",
    title: "Machine Learning for Signals",
    desc: "Penerapan pembelajaran mesin dan deep learning pada data sinyal berdimensi tinggi.",
  },
];

export default async function HomePage() {
  const supabase = createClient();

  const [{ data: achievements }, { data: openRecruitment }, { data: members }] =
    await Promise.all([
      supabase
        .from("achievements")
        .select("*")
        .order("year", { ascending: false })
        .limit(3),
      supabase
        .from("recruitment")
        .select("*")
        .eq("is_open", true)
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("members")
        .select("*")
        .order("order_index", { ascending: true })
        .limit(4),
    ]);

  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-ink text-paper">
          <div className="absolute inset-0 bg-grid-dark bg-grid opacity-60" />
          <div className="container-lab relative py-24 md:py-32">
            <p className="eyebrow-dark mb-6">
              CH.01 — TELKOM UNIVERSITY · FAKULTAS TEKNIK ELEKTRO
            </p>
            <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] md:text-6xl">
              Signal Processing for{" "}
              <span className="text-signal">Intelligent System</span>{" "}
              Laboratory
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-light md:text-lg">
              SPIS Lab mengembangkan teori, algoritma, dan sistem pengolahan
              sinyal untuk mendukung sensor cerdas, riset, dan pembelajaran —
              dari radar, biosignal, hingga speech processing.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/tentang"
                className="bg-signal px-6 py-3 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:bg-white"
              >
                Tentang Lab
              </Link>
              <Link
                href="/rekrutmen"
                className="border border-slate-light px-6 py-3 font-mono text-xs uppercase tracking-wider text-paper transition-colors hover:border-signal hover:text-signal"
              >
                Info Rekrutmen
              </Link>
            </div>

            <div className="mt-20 flex items-end justify-between border-t border-line-dark pt-8">
              <WaveformBars className="h-12 w-40 md:h-16 md:w-64" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-slate-light">
                Est. Kelompok Keahlian SPICE
              </span>
            </div>
          </div>
        </section>

        {/* FOKUS RISET */}
        <section className="container-lab py-20 md:py-28">
          <p className="eyebrow mb-3">Fokus Riset</p>
          <h2 className="max-w-xl font-display text-2xl font-semibold text-ink md:text-3xl">
            Empat arah riset utama laboratorium
          </h2>

          <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
            {FOCUS_AREAS.map((f) => (
              <div key={f.code} className="bg-white p-8">
                <span className="font-mono text-xs text-maroon">{f.code}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PENCAPAIAN TERBARU */}
        <section className="bg-paper-2 py-20 md:py-28">
          <div className="container-lab">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">Pencapaian Terbaru</p>
                <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
                  Publikasi &amp; pendanaan riset
                </h2>
              </div>
              <Link
                href="/pencapaian"
                className="font-mono text-xs uppercase tracking-wider text-maroon underline underline-offset-4"
              >
                Lihat semua →
              </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {achievements && achievements.length > 0 ? (
                achievements.map((item) => (
                  <div key={item.id} className="card-lab p-6">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-signal-dim">
                      {item.type === "publikasi" ? "Publikasi" : "Pendanaan Riset"}
                      {item.year ? ` · ${item.year}` : ""}
                    </span>
                    <h3 className="mt-3 font-display text-base font-semibold leading-snug text-ink">
                      {item.title}
                    </h3>
                    {item.venue && (
                      <p className="mt-2 text-sm text-slate">{item.venue}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate">
                  Belum ada data pencapaian. Asisten dapat menambahkannya
                  lewat dashboard admin.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* REKRUTMEN CTA */}
        {openRecruitment && openRecruitment.length > 0 && (
          <section className="relative overflow-hidden bg-maroon text-paper">
            <div className="container-lab flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-white/70">
                  Pendaftaran Dibuka
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
                  {openRecruitment[0].title}
                </h2>
              </div>
              <Link
                href="/rekrutmen"
                className="whitespace-nowrap border border-white px-6 py-3 font-mono text-xs uppercase tracking-wider transition-colors hover:bg-white hover:text-maroon"
              >
                Lihat Detail →
              </Link>
            </div>
          </section>
        )}

        {/* TIM PREVIEW */}
        <section className="container-lab py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">Orang di Balik Lab</p>
              <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
                Dosen &amp; Asisten
              </h2>
            </div>
            <Link
              href="/tim"
              className="font-mono text-xs uppercase tracking-wider text-maroon underline underline-offset-4"
            >
              Lihat semua →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {members && members.length > 0 ? (
              members.map((m) => (
                <div key={m.id}>
                  <div className="aspect-square w-full overflow-hidden bg-paper-2">
                    {m.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.photo_url}
                        alt={m.name}
                        className="h-full w-full object-cover grayscale transition-all hover:grayscale-0"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-light">
                        <WaveformBars className="h-8 w-16" />
                      </div>
                    )}
                  </div>
                  <p className="mt-3 font-display text-sm font-semibold text-ink">
                    {m.name}
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-slate-light">
                    {m.position || m.category}
                  </p>
                </div>
              ))
            ) : (
              <p className="col-span-full text-sm text-slate">
                Profil dosen dan asisten akan tampil di sini setelah
                ditambahkan lewat dashboard admin.
              </p>
            )}
          </div>
        </section>

        <div className="relative h-16 overflow-hidden bg-ink text-signal/40">
          <WaveformTrace className="absolute inset-0 h-full w-[200%] animate-drift" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
