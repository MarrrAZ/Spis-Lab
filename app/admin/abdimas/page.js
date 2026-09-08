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
    <div className="-m-6 rounded-lg bg-spis-deep p-6 text-white md:-m-10 md:p-10">
      <p className="eyebrow-light mb-2">Manage</p>
      <h1 className="font-display text-2xl font-semibold text-white">Abdimas</h1>
      <p className="mt-2 max-w-xl text-sm text-white/70">
        Kegiatan yang ditambahkan di sini akan tampil di halaman publik{" "}
        <strong>Abdimas</strong>.
      </p>
      <div className="mt-8">
        <AbdimasManager initialItems={abdimas ?? []} />
      </div>
    </div>
  );
}
