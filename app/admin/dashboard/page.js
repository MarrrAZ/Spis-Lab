import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = createClient();

  const [members, achievements, abdimas, recruitment, accounts] = await Promise.all([
    supabase.from("members").select("id", { count: "exact", head: true }),
    supabase.from("achievements").select("id", { count: "exact", head: true }),
    supabase.from("abdimas").select("id", { count: "exact", head: true }),
    supabase.from("recruitment").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  const cards = [
    { label: "Dosen & Asisten", count: members.count ?? 0, href: "/admin/tim" },
    { label: "Pencapaian", count: achievements.count ?? 0, href: "/admin/pencapaian" },
    { label: "Kegiatan Abdimas", count: abdimas.count ?? 0, href: "/admin/abdimas" },
    { label: "Info Rekrutmen", count: recruitment.count ?? 0, href: "/admin/rekrutmen" },
    { label: "Akun Asisten", count: accounts.count ?? 0, href: "/admin/akun" },
  ];

  return (
    <div>
      <p className="eyebrow mb-2">Dashboard</p>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Selamat datang di panel pengelola SPIS Lab
      </h1>
      <p className="mt-2 max-w-xl text-sm text-slate">
        Semua perubahan yang Anda simpan di sini akan langsung tampil di
        website publik.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="border border-line bg-white p-6 transition-colors hover:border-maroon"
          >
            <p className="font-mono text-3xl font-semibold text-ink">{c.count}</p>
            <p className="mt-2 font-mono text-xs uppercase tracking-wider text-slate-light">
              {c.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
