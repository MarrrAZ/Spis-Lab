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
    { label: "Achievement", count: achievements.count ?? 0, href: "/admin/pencapaian" },
    { label: "Abdimas Activity", count: abdimas.count ?? 0, href: "/admin/abdimas" },
    { label: "Recruitment Info", count: recruitment.count ?? 0, href: "/admin/rekrutmen" },
    { label: "Assistant Account", count: accounts.count ?? 0, href: "/admin/akun" },
  ];

  return (
    <div className="-m-6 rounded-lg bg-spis-deep p-6 text-white md:-m-10 md:p-10">
      <p className="eyebrow-light mb-2">Dashboard</p>
      <h1 className="font-display text-2xl font-semibold text-white">
        Selamat datang di admin panel SPIS Lab
      </h1>
      <p className="mt-2 max-w-xl text-sm text-white/70">
        Semua perubahan yang Anda simpan di sini akan langsung tampil di
        website publik.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-lg border border-spis-bright bg-spis p-6 transition-colors hover:border-white"
          >
            <p className="font-mono text-3xl font-semibold text-white">{c.count}</p>
            <p className="mt-2 font-mono text-xs uppercase tracking-wider text-white/60">
              {c.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
