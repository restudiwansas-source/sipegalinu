import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasValidEnv =
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith("http") &&
  !supabaseKey.includes("ISI_") &&
  !supabaseKey.startsWith("sb_secret");

export const supabase = hasValidEnv ? createClient(supabaseUrl, supabaseKey) : null;
export const isSupabaseReady = Boolean(supabase);

export function getSupabaseStatus() {
  if (!supabaseUrl || !supabaseKey) return "ENV belum diisi";
  if (!supabaseUrl.startsWith("http")) return "VITE_SUPABASE_URL harus https://xxx.supabase.co";
  if (supabaseKey.startsWith("sb_secret")) return "Jangan gunakan secret key. Gunakan publishable/anon key.";
  return "ready";
}
