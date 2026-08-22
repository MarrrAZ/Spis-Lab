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
    <div>
      <p className="eyebrow mb-2">Kelola</p>
      <h1 className="font-display text-2xl font-semibold text-ink">Rekrutmen Asisten</h1>
      <p className="mt-2 max-w-xl text-sm text-slate">
        Info yang ditambahkan di sini akan tampil di halaman publik{" "}
        <strong>Rekrutmen</strong>. Jika ada info yang sedang dibuka, akan
        muncul juga sebagai banner di beranda.
      </p>
      <div className="mt-8">
        <RekrutmenManager initialItems={recruitment ?? []} />
      </div>
    </div>
  );
}
