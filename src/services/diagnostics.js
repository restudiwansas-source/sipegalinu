import { supabase } from "./supabase";

export async function runSystemDiagnostics() {
  const checks = [];

  async function check(name, fn) {
    try {
      const result = await fn();
      checks.push({ name, status: "OK", message: result || "Normal" });
    } catch (error) {
      checks.push({ name, status: "ERROR", message: error.message || "Gagal" });
    }
  }

  await check("Supabase Client", async () => {
    if (!supabase) throw new Error("Supabase belum aktif");
    return "Terhubung";
  });

  await check("Auth Session", async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data?.session ? "Session aktif" : "Belum login";
  });

  await check("Table blocks", async () => {
    const { error, count } = await supabase.from("blocks").select("*", { count: "exact", head: true });
    if (error) throw error;
    return `${count || 0} data`;
  });

  await check("Table wajib_pajak", async () => {
    const { error, count } = await supabase.from("wajib_pajak").select("*", { count: "exact", head: true });
    if (error) throw error;
    return `${count || 0} data`;
  });

  await check("Storage pdfs", async () => {
    const { error } = await supabase.storage.from("pdfs").list("", { limit: 1 });
    if (error) throw error;
    return "Bucket dapat diakses";
  });

  await check("Storage maps", async () => {
    const { error } = await supabase.storage.from("maps").list("", { limit: 1 });
    if (error) throw error;
    return "Bucket dapat diakses";
  });

  return checks;
}

export async function getLatestAppLogs(limit = 20) {
  const { data, error } = await supabase
    .from("app_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}