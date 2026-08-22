import { createClient } from "@/lib/supabase/server";
import { PencapaianManager } from "@/components/admin/pencapaian-manager";

export const revalidate = 0;

export default async function AdminPencapaianPage() {
  const supabase = createClient();
  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .order("year", { ascending: false });

  return (
    <div>
      <p className="eyebrow mb-2">Kelola</p>
      <h1 className="font-display text-2xl font-semibold text-ink">Pencapaian</h1>
      <p className="mt-2 max-w-xl text-sm text-slate">
        Publikasi dan pendanaan riset yang ditambahkan di sini akan tampil di
        halaman publik <strong>Pencapaian</strong> dan beranda.
      </p>

      <div className="mt-8">
        <PencapaianManager initialItems={achievements ?? []} />
      </div>
    </div>
  );
}
