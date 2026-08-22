import { createClient } from "@/lib/supabase/server";
import { AbdimasManager } from "@/components/admin/abdimas-manager";

export const revalidate = 0;

export default async function AdminAbdimasPage() {
  const supabase = createClient();
  const { data: abdimas } = await supabase
    .from("abdimas")
    .select("*")
    .order("activity_date", { ascending: false });

  return (
    <div>
      <p className="eyebrow mb-2">Kelola</p>
      <h1 className="font-display text-2xl font-semibold text-ink">Pengabdian Masyarakat</h1>
      <p className="mt-2 max-w-xl text-sm text-slate">
        Kegiatan yang ditambahkan di sini akan tampil di halaman publik{" "}
        <strong>Abdimas</strong>.
      </p>
      <div className="mt-8">
        <AbdimasManager initialItems={abdimas ?? []} />
      </div>
    </div>
  );
}
