import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";
import { WaveformBars } from "@/components/waveform";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/pencapaian", label: "Pencapaian" },
  { href: "/admin/abdimas", label: "Abdimas" },
  { href: "/admin/rekrutmen", label: "Rekrutmen" },
  { href: "/admin/organigram", label: "Organigram" },
  { href: "/admin/tim", label: "Dosen & Asisten" },
  { href: "/admin/akun", label: "Kelola Akun" },
];

export default async function AdminLayout({ children }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen bg-paper-2">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-ink text-paper md:flex">
        <div className="border-b border-line-dark p-6">
          <WaveformBars className="h-8 w-20" />
          <p className="mt-4 font-display text-sm font-semibold">SPIS Lab</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-light">
            Panel Pengelola
          </p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2.5 font-mono text-xs uppercase tracking-wider text-slate-light transition-colors hover:bg-ink-2 hover:text-signal"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-line-dark p-4">
          <p className="truncate px-3 text-xs text-slate-light">{user?.email}</p>
          <form action={logout}>
            <button
              type="submit"
              className="mt-2 w-full px-3 py-2.5 text-left font-mono text-xs uppercase tracking-wider text-maroon hover:text-signal"
            >
              Keluar →
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <header className="border-b border-line bg-white md:hidden">
          <div className="flex items-center justify-between px-6 py-4">
            <p className="font-display text-sm font-semibold text-ink">SPIS Lab Admin</p>
            <form action={logout}>
              <button type="submit" className="font-mono text-xs text-maroon">
                Keluar
              </button>
            </form>
          </div>
          <nav className="flex gap-4 overflow-x-auto px-6 pb-4 font-mono text-[11px] uppercase tracking-wider text-slate">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
