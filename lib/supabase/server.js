import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Dipakai di Server Components, Server Actions, dan Route Handlers.
// Menggunakan anon key + cookie sesi user yang sedang login, sehingga
// mengikuti aturan Row Level Security (RLS) apa adanya.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Dipanggil dari Server Component (bukan Server Action) - aman diabaikan
            // karena sesi akan tetap disegarkan oleh middleware.
          }
        },
      },
    }
  );
}
