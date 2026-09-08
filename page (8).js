import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WaveformBars } from "@/components/waveform";

export const metadata = { title: "About — SPIS Lab" };

const NILAI = [
  { label: "Presisi", desc: "Setiap algoritma diuji dan divalidasi dengan metodologi yang ketat." },
  { label: "Kolaborasi", desc: "Riset lintas disiplin bersama kelompok keahlian dan mitra industri." },
  { label: "Dampak", desc: "Hasil riset diarahkan untuk pengabdian dan penerapan nyata di masyarakat." },
];

export default function TentangPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-white">
          <div className="container-lab py-20 md:py-28">
            <p className="eyebrow mb-4">About</p>
            <h1 className="max-w-2xl font-display text-3xl font-semibold leading-tight text-spis md:text-5xl">
              Apa itu SPIS Laboratory?
            </h1>
          </div>
        </section>

        <section className="border-t-4 border-spis bg-white">
          <div className="container-lab grid gap-12 py-20 md:grid-cols-[1.3fr_1fr] md:py-28">
            <div className="space-y-6 text-slate">
              <p className="text-lg leading-relaxed text-ink">
                <strong>Signal Processing for Intelligent System (SPIS) Laboratory</strong>{" "}
                adalah laboratorium riset di bawah Kelompok
                Keahlian Signal Processing, Information Security, and Computer
                Engineering (SPICE), Fakultas Teknik Elektro, Telkom University.
              </p>
              <p className="leading-relaxed">
                Lab ini berfokus pada pengembangan teori, algoritma, dan sistem
                pengolahan sinyal yang mendukung sistem cerdas dalam memahami,
                berinteraksi, dan beradaptasi terhadap lingkungannya — mencakup
                modalitas elektromagnetik, akustik, visual, dan sinyal biomedis.
                Riset di SPIS Lab menjembatani teori pengolahan sinyal klasik
                dengan pendekatan kecerdasan buatan modern.
              </p>
              <p className="leading-relaxed">
                Selain aktivitas riset, laboratorium ini juga membuka
                kesempatan asistensi riset bagi mahasiswa S1 dan S2 yang
                tertarik mendalami bidang pengolahan sinyal dan sistem cerdas.
              </p>
            </div>

            <div className="rounded-lg border border-spis bg-paper-2 p-8">
              <p className="eyebrow mb-4">Nilai Laboratorium</p>
              <div className="space-y-6">
                {NILAI.map((n) => (
                  <div key={n.label} className="border-t border-line pt-4 first:border-0 first:pt-0">
                    <p className="font-display text-sm font-semibold text-ink">{n.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t-4 border-spis bg-white py-16">
          <div className="container-lab flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="eyebrow mb-3">Naungan</p>
              <p className="font-display text-lg font-semibold text-ink">
                Kelompok Keahlian SPICE
              </p>
              <p className="mt-1 max-w-md text-sm text-slate">
                Signal Processing, Information Security, and Computer
                Engineering — Fakultas Teknik Elektro, Telkom University,
                Gedung Bangkit, Bandung.
              </p>
            </div>
            <WaveformBars className="h-14 w-48" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
