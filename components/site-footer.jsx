import Link from "next/link";
import { WaveformBars } from "@/components/waveform";

export function SiteFooter() {
  return (
    <footer className="border-t border-line-dark bg-ink text-paper">
      <div className="container-lab py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <WaveformBars className="h-6 w-14" />
            </div>
            <p className="font-display text-lg font-semibold">
              SPIS Laboratory
            </p>
            <p className="mt-2 max-w-xs text-sm text-slate-light">
              Signal Processing for Intelligent System Laboratory —
              Kelompok Keahlian SPICE, Fakultas Teknik Elektro,
              Telkom University.
            </p>
          </div>

          <div>
            <p className="eyebrow-dark mb-3">Jelajahi</p>
            <ul className="space-y-2 text-sm text-slate-light">
              <li><Link href="/tentang" className="hover:text-signal">Tentang Lab</Link></li>
              <li><Link href="/pencapaian" className="hover:text-signal">Pencapaian</Link></li>
              <li><Link href="/abdimas" className="hover:text-signal">Abdimas</Link></li>
              <li><Link href="/rekrutmen" className="hover:text-signal">Rekrutmen</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow-dark mb-3">Organisasi</p>
            <ul className="space-y-2 text-sm text-slate-light">
              <li><Link href="/organigram" className="hover:text-signal">Organigram</Link></li>
              <li><Link href="/tim" className="hover:text-signal">Dosen &amp; Asisten</Link></li>
              <li><Link href="/admin/login" className="hover:text-signal">Login Asisten</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow-dark mb-3">Kontak</p>
            <ul className="space-y-2 text-sm text-slate-light">
              <li>Gedung Bangkit, Telkom University</li>
              <li>Jl. Telekomunikasi, Terusan Buah Batu, Bandung 40257</li>
              <li>(022) 7566456</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line-dark pt-6 font-mono text-[11px] uppercase tracking-wider text-slate-light md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} SPIS Lab · Telkom University</span>
          <span>Kelompok Keahlian Signal Processing, Information Security &amp; Computer Engineering</span>
        </div>
      </div>
    </footer>
  );
}
