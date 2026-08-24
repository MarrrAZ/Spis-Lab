import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/pencapaian", label: "Achievement" },
  { href: "/admin/abdimas", label: "Abdimas" },
  { href: "/admin/rekrutmen", label: "Recruitment" },
  { href: "/admin/organigram", label: "Organigram" },
  { href: "/admin/tim", label: "Dosen & Asisten" },
  { href: "/admin/akun", label: "Manage Account" },
];

export default async function AdminLayout({ children }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen bg-spis-deep">
      <aside className="hidden w-64 shrink-0 flex-col bg-spis text-white md:flex">
        <div className="border-b border-white/10 p-6">
          <Image
            src="/logo/spis-full-white.png"
            alt="SPIS Lab"
            width={180}
            height={45}
            className="h-7 w-auto"
          />
          <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-white/50">
            Admin Panel
          </p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded px-3 py-2.5 font-mono text-xs uppercase tracking-wider text-white/70 transition-colors hover:bg-spis-bright hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="truncate px-3 text-xs text-white/50">{user?.email}</p>
          <form action={logout}>
            <button
              type="submit"
              className="mt-2 w-full px-3 py-2.5 text-left font-mono text-xs uppercase tracking-wider text-white/70 hover:text-white"
            >
              Logout →
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <header className="border-b border-spis bg-spis md:hidden">
          <div className="flex items-center justify-between px-6 py-4">
            <Image
              src="/logo/spis-full-white.png"
              alt="SPIS Lab"
              width={150}
              height={38}
              className="h-6 w-auto"
            />
            <form action={logout}>
              <button type="submit" className="font-mono text-xs text-white">
                Logout
              </button>
            </form>
          </div>
          <nav className="flex gap-4 overflow-x-auto px-6 pb-4 font-mono text-[11px] uppercase tracking-wider text-white/70">
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
