import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="bg-spis text-white">
      <div className="container-lab py-14">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr_1fr]">
          <div>
            <Image
              src="/logo/spis-full-white.png"
              alt="SPIS Lab"
              width={200}
              height={50}
              className="mb-4 h-8 w-auto"
            />
            <p className="max-w-xs text-sm text-white/60">
              Signal Processing for Intelligent System Laboratory —
              Kelompok Keahlian SPICE, Fakultas Teknik Elektro,
              Telkom University.
            </p>
          </div>

          <div>
            <p className="eyebrow-light mb-3">Jelajahi</p>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/tentang" className="hover:text-white">Tentang Lab</Link></li>
              <li><Link href="/pencapaian" className="hover:text-white">Pencapaian</Link></li>
              <li><Link href="/abdimas" className="hover:text-white">Abdimas</Link></li>
              <li><Link href="/rekrutmen" className="hover:text-white">Rekrutmen</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow-light mb-3">Sosial</p>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a href="https://www.instagram.com/spislaboratory/" target="_blank" rel="noreferrer" className="hover:text-white">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/spis-laboratory/" target="_blank" rel="noreferrer" className="hover:text-white">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow-light mb-3">Organisasi</p>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/organigram" className="hover:text-white">Organigram</Link></li>
              <li><Link href="/organigram" className="hover:text-white">Dosen &amp; Asisten</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow-light mb-3">Kontak</p>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Gedung Bangkit, Telkom University</li>
              <li>Jl. Telekomunikasi, Terusan Buah Batu, Bandung 40257</li>
              <li>(022) 7566456</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 font-mono text-[11px] uppercase tracking-wider text-white/50 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} SPIS Lab · Telkom University</span>
          <span>Kelompok Keahlian Signal Processing, Information Security &amp; Computer Engineering</span>
        </div>
      </div>
    </footer>
  );
}
