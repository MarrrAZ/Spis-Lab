import { createClient } from "@/lib/supabase/server";
import { RekrutmenManager } from "@/components/admin/rekrutmen-manager";

export const revalidate = 0;

export default async function AdminRekrutmenPage() {
  const supabase = createClient();
  const { data: recruitment } = await supabase
    .from("recruitment")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="-m-6 rounded-lg bg-spis-deep p-6 text-white md:-m-10 md:p-10">
      <p className="eyebrow-light mb-2">Manage</p>
      <h1 className="font-display text-2xl font-semibold text-white">Recruitment</h1>
      <p className="mt-2 max-w-xl text-sm text-white/70">
        Info yang ditambahkan di sini akan tampil di halaman publik{" "}
        <strong>Recruitment</strong>. Jika ada info yang sedang dibuka, akan
        muncul juga sebagai banner di beranda.
      </p>
      <div className="mt-8">
        <RekrutmenManager initialItems={recruitment ?? []} />
      </div>
    </div>
  );
}
