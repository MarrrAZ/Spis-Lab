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
    <div>
      <p className="eyebrow mb-2">Kelola</p>
      <h1 className="font-display text-2xl font-semibold text-ink">Organigram</h1>
      <p className="mt-2 max-w-xl text-sm text-slate">
        Susun struktur organisasi dengan memilih orang dari daftar{" "}
        <strong>Dosen &amp; Asisten</strong> dan menentukan tingkatannya.
      </p>
      <div className="mt-8">
        <OrganigramManager initialEntries={entries ?? []} members={members ?? []} />
      </div>
    </div>
  );
}
