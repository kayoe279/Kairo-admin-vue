import type { Database } from "@/types/database.types";
import { type SupabaseClientOptions, createClient } from "@supabase/supabase-js";

export const getSupabaseClient = (options?: SupabaseClientOptions<"public">) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "缺少 Supabase 环境变量。请在 .env 文件中设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY"
    );
  }

  const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    ...options,
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    },

    db: {
      schema: "public"
    }
  });

  return supabaseClient;
};

export const supabase = getSupabaseClient();
