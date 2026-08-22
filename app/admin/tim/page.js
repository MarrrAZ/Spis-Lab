import { createClient } from "@/lib/supabase/server";
import { TimManager } from "@/components/admin/tim-manager";

export const revalidate = 0;

export default async function AdminTimPage() {
  const supabase = createClient();
  const { data: members } = await supabase
    .from("members")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <div>
      <p className="eyebrow mb-2">Kelola</p>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Dosen &amp; Asisten
      </h1>
      <p className="mt-2 max-w-xl text-sm text-slate">
        Data ini tampil di halaman publik <strong>Tim</strong> dan dipakai
        sebagai sumber foto pada halaman <strong>Organigram</strong>.
      </p>

      <div className="mt-8">
        <TimManager initialMembers={members ?? []} />
      </div>
    </div>
  );
}
