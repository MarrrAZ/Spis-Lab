import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// PERINGATAN: hanya boleh dipakai di kode server (Server Actions / Route
// Handlers), TIDAK PERNAH di komponen client. Klien ini memakai Service
// Role Key yang bisa melewati semua RLS - dipakai khusus untuk fitur
// "Kelola Akun Asisten" (membuat & menghapus akun login).
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
