import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim()?.replace(/^["']|["']$/g, "");

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY harus diisi di environment variable.");
  }

  return createSupabaseServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Dipanggil dari Server Component, abaikan jika tidak bisa set cookies
        }
      },
    },
  });
}

