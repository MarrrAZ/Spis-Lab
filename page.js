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
    <div className="-m-6 rounded-lg bg-spis-deep p-6 text-white md:-m-10 md:p-10">
      <p className="eyebrow-light mb-2">Manage</p>
      <h1 className="font-display text-2xl font-semibold text-white">Achievement</h1>
      <p className="mt-2 max-w-xl text-sm text-white/70">
        Publikasi dan pendanaan riset yang ditambahkan di sini akan tampil di
        halaman publik <strong>Achievement</strong> dan beranda.
      </p>

      <div className="mt-8">
        <PencapaianManager initialItems={achievements ?? []} />
      </div>
    </div>
  );
}
