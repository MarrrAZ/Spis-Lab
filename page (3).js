import { createClient } from "@/lib/supabase/server";
import { OrganigramManager } from "@/components/admin/organigram-manager";

export const revalidate = 0;

export default async function AdminOrganigramPage() {
  const supabase = createClient();
  const [{ data: entries }, { data: members }] = await Promise.all([
    supabase
      .from("organigram")
      .select("*, members(*)")
      .order("level", { ascending: true })
      .order("order_index", { ascending: true }),
    supabase.from("members").select("*").order("name", { ascending: true }),
  ]);

  return (
    <div className="-m-6 rounded-lg bg-spis-deep p-6 text-white md:-m-10 md:p-10">
      <p className="eyebrow-light mb-2">Manage</p>
      <h1 className="font-display text-2xl font-semibold text-white">Organigram</h1>
      <p className="mt-2 max-w-xl text-sm text-white/70">
        Susun struktur organisasi dengan memilih orang dari daftar{" "}
        <strong>Dosen &amp; Asisten</strong> dan menentukan posisinya.
      </p>
      <div className="mt-8">
        <OrganigramManager initialEntries={entries ?? []} members={members ?? []} />
      </div>
    </div>
  );
}
