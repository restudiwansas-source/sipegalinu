import { supabase } from "./supabase";

function sanitize(value) {
  try {
    const text = JSON.stringify(value || {});
    return JSON.parse(
      text
        .replace(/access_token[^,}"]+/gi, "access_token_REDACTED")
        .replace(/refresh_token[^,}"]+/gi, "refresh_token_REDACTED")
        .replace(/token=[^&"]+/gi, "token=REDACTED")
        .replace(/signature=[^&"]+/gi, "signature=REDACTED")
    );
  } catch {
    return {};
  }
}

export async function logAppError({ level = "error", module = "unknown", message = "", context = {}, userEmail = "" }) {
  try {
    if (!supabase) return;

    await supabase.from("app_logs").insert({
      level,
      module,
      message: String(message || "").slice(0, 500),
      safe_context: sanitize(context),
      user_email: userEmail || null,
    });
  } catch (err) {
    console.warn("Log error gagal disimpan:", err);
  }
}