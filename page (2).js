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
    <div className="-m-6 rounded-lg bg-spis-deep p-6 text-white md:-m-10 md:p-10">
      <p className="eyebrow-light mb-2">Manage</p>
      <h1 className="font-display text-2xl font-semibold text-white">
        Dosen &amp; Asisten
      </h1>
      <p className="mt-2 max-w-xl text-sm text-white/70">
        Data ini tampil di halaman publik <strong>Team</strong> dan dipakai
        sebagai sumber foto pada halaman <strong>Organigram</strong>.
      </p>

      <div className="mt-8">
        <TimManager initialMembers={members ?? []} />
      </div>
    </div>
  );
}
