import { createClient } from "@/lib/supabase/server";
import { listAccounts } from "@/lib/actions/accounts";
import { AkunManager } from "@/components/admin/akun-manager";

export const revalidate = 0;

export default async function AdminAkunPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const accounts = await listAccounts();

  return (
    <div className="-m-6 rounded-lg bg-spis-deep p-6 text-white md:-m-10 md:p-10">
      <p className="eyebrow-light mb-2">Manage</p>
      <h1 className="font-display text-2xl font-semibold text-white">Assistant Account</h1>
      <p className="mt-2 max-w-xl text-sm text-white/70">
        Tambah atau hapus akun yang boleh login ke admin panel ini.
        Setiap akun baru akan langsung bisa dipakai untuk login.
      </p>
      <div className="mt-8">
        <AkunManager initialAccounts={accounts} currentUserId={user?.id} />
      </div>
    </div>
  );
}
