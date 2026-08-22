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
    <div>
      <p className="eyebrow mb-2">Kelola</p>
      <h1 className="font-display text-2xl font-semibold text-ink">Akun Asisten</h1>
      <p className="mt-2 max-w-xl text-sm text-slate">
        Tambah atau hapus akun yang boleh login ke panel pengelola ini.
        Setiap akun baru akan langsung bisa dipakai untuk login.
      </p>
      <div className="mt-8">
        <AkunManager initialAccounts={accounts} currentUserId={user?.id} />
      </div>
    </div>
  );
}
