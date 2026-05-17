import * as XLSX from "xlsx";
import { supabase } from "./supabase";
import {
  demoBlocks,
  defaultSettings,
  defaultMenus,
  defaultRoles,
  demoUsers,
} from "../data";
import { cleanKodeBlok } from "../utils/format";

/* =========================
   BLOCKS
========================= */
export async function getBlocks() {
  if (!supabase) return demoBlocks;

  const { data, error } = await supabase
    .from("blocks")
    .select("*")
    .order("kode_blok", { ascending: true });

  if (error) {
    console.error("Gagal mengambil blocks:", error);
    return demoBlocks;
  }

  return data?.length ? data : demoBlocks;
}

export async function uploadBlockFiles({ kodeBlok, namaBlok, htmlFile, pdfFile }) {
  if (!supabase) {
    return { success: false, message: "Supabase belum dikonfigurasi." };
  }

  if (!kodeBlok || !namaBlok || !htmlFile || !pdfFile) {
    return {
      success: false,
      message: "Kode blok, nama blok, HTML dan PDF wajib diisi.",
    };
  }

  const kode = cleanKodeBlok(kodeBlok);
  const htmlPath = `blocks/${kode}/interactive.html`;
  const pdfPath = `blocks/${kode}/offline.pdf`;

  try {
    await supabase.storage.from("maps").remove([htmlPath]);
    await supabase.storage.from("pdfs").remove([pdfPath]);

    const htmlText = await htmlFile.text();
    const htmlBlob = new Blob([htmlText], {
      type: "text/html;charset=utf-8",
    });

    const { error: htmlError } = await supabase.storage
      .from("maps")
      .upload(htmlPath, htmlBlob, {
        upsert: true,
        cacheControl: "0",
        contentType: "text/html;charset=utf-8",
      });

    if (htmlError) throw htmlError;

    const { error: pdfError } = await supabase.storage
      .from("pdfs")
      .upload(pdfPath, pdfFile, {
        upsert: true,
        cacheControl: "0",
        contentType: "application/pdf",
      });

    if (pdfError) throw pdfError;

    const htmlUrl = supabase.storage
      .from("maps")
      .getPublicUrl(htmlPath).data.publicUrl;

    const pdfUrl = supabase.storage
      .from("pdfs")
      .getPublicUrl(pdfPath).data.publicUrl;

    const { error: dbError } = await supabase.from("blocks").upsert(
      {
        kode_blok: kode,
        nama_blok: namaBlok,
        interactive_map: `${htmlUrl}?v=${Date.now()}`,
        offline_pdf: `${pdfUrl}?v=${Date.now()}`,
      },
      { onConflict: "kode_blok" }
    );

    if (dbError) throw dbError;

    return {
      success: true,
      message: "Upload blok berhasil.",
      htmlUrl,
      pdfUrl,
    };
  } catch (error) {
    console.error("Upload gagal:", error);
    return {
      success: false,
      message: error.message || "Upload gagal.",
    };
  }
}

/* =========================
   SETTINGS
   UUID SAFE
========================= */
export async function getSettings() {
  if (!supabase) return defaultSettings;

  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return defaultSettings;
  }

  return {
    ...defaultSettings,
    ...data,
  };
}

export async function saveSettings(settings) {
  if (!supabase) {
    return {
      success: false,
      message: "Supabase belum dikonfigurasi.",
    };
  }

  try {
    const payload = {
      ...settings,
      updated_at: new Date().toISOString(),
    };

    delete payload.id;
    delete payload.created_at;

    const { data: existing, error: findError } = await supabase
      .from("settings")
      .select("id")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (findError) throw findError;

    let result;

    if (existing?.id) {
      result = await supabase
        .from("settings")
        .update(payload)
        .eq("id", existing.id);
    } else {
      result = await supabase
        .from("settings")
        .insert(payload);
    }

    if (result.error) throw result.error;

    return {
      success: true,
      message: "Pengaturan berhasil disimpan.",
    };
  } catch (error) {
    console.error("Gagal menyimpan settings:", error);

    return {
      success: false,
      message: error.message || "Gagal menyimpan pengaturan.",
    };
  }
}

/* =========================
   LOGO UPLOAD
========================= */
export async function uploadLogoFile(file) {
  if (!supabase) {
    return {
      success: false,
      message: "Supabase belum dikonfigurasi.",
    };
  }

  if (!file) {
    return {
      success: false,
      message: "File logo belum dipilih.",
    };
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      message: "Logo harus berformat PNG, JPG, atau JPEG.",
    };
  }

  try {
    const ext = file.name.split(".").pop();
    const fileName = `logo-${Date.now()}.${ext}`;
    const filePath = `branding/${fileName}`;

    const { error } = await supabase.storage
      .from("logos")
      .upload(filePath, file, {
        upsert: true,
        cacheControl: "0",
        contentType: file.type,
      });

    if (error) throw error;

    const publicUrl = supabase.storage
      .from("logos")
      .getPublicUrl(filePath).data.publicUrl;

    return {
      success: true,
      message: "Logo berhasil diupload.",
      url: `${publicUrl}?v=${Date.now()}`,
    };
  } catch (error) {
    console.error("Upload logo gagal:", error);

    return {
      success: false,
      message: error.message || "Upload logo gagal.",
    };
  }
}

/* =========================
   MENUS
========================= */
export async function getMenus() {
  if (!supabase) return defaultMenus;

  const { data, error } = await supabase
    .from("menus")
    .select("*")
    .order("order_no", { ascending: true });

  if (error || !data?.length) {
    return defaultMenus;
  }

  return data;
}

export async function saveMenu(menu) {
  if (!supabase) {
    return {
      success: false,
      message: "Supabase belum dikonfigurasi.",
    };
  }

  const { error } = await supabase
    .from("menus")
    .upsert(menu, { onConflict: "id" });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Menu berhasil disimpan.",
  };
}

export async function deleteMenu(id) {
  if (!supabase) {
    return {
      success: false,
      message: "Supabase belum dikonfigurasi.",
    };
  }

  const { error } = await supabase
    .from("menus")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Menu berhasil dihapus.",
  };
}

/* =========================
   ROLES
========================= */
export async function getRoles() {
  if (!supabase) return defaultRoles;

  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .order("id", { ascending: true });

  if (error || !data?.length) {
    return defaultRoles;
  }

  return data;
}

export async function saveRole(role) {
  if (!supabase) {
    return {
      success: false,
      message: "Supabase belum dikonfigurasi.",
    };
  }

  const { error } = await supabase
    .from("roles")
    .upsert(role, { onConflict: "id" });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Role berhasil disimpan.",
  };
}

/* =========================
   USERS LOCAL PROFILE TABLE
========================= */
export async function getUsers() {
  if (!supabase) return demoUsers;

  const { data, error } = await supabase
    .from("app_users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return demoUsers;
  }

  return data;
}

export async function saveUser(user) {
  if (!supabase) {
    return {
      success: false,
      message: "Supabase belum dikonfigurasi.",
    };
  }

  const payload = {
    ...user,
    avatar: user.avatar || (user.name?.[0] || "U").toUpperCase(),
    active: user.active ?? true,
  };

  const { error } = await supabase
    .from("app_users")
    .upsert(payload, { onConflict: "username" });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "User berhasil disimpan.",
  };
}

export async function deleteUser(id) {
  if (!supabase) {
    return {
      success: false,
      message: "Supabase belum dikonfigurasi.",
    };
  }

  const { error } = await supabase
    .from("app_users")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "User berhasil dihapus.",
  };
}

/* =========================
   WAJIB PAJAK REAL DATA
========================= */
export async function getWajibPajak(kodeBlok = null) {
  if (!supabase) return [];

  let query = supabase
    .from("wajib_pajak")
    .select("*")
    .order("nop", { ascending: true });

  if (kodeBlok) {
    query = query.eq("kode_blok", kodeBlok);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Gagal mengambil data WP:", error);
    return [];
  }

  return data || [];
}

export async function importWajibPajakExcel({ file, kodeBlok }) {
  if (!supabase) {
    return {
      success: false,
      message: "Supabase belum dikonfigurasi.",
    };
  }

  if (!file || !kodeBlok) {
    return {
      success: false,
      message: "File Excel dan kode blok wajib diisi.",
    };
  }

  try {
    const buffer = await file.arrayBuffer();

    const workbook = XLSX.read(buffer, {
      type: "array",
    });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
    });

    const payload = rows
      .filter((row) => row[0] && String(row[0]).includes("32.08"))
      .map((row) => ({
        kode_blok: kodeBlok,
        nop: String(row[0]).trim(),
        tahun: Number(row[1]) || 2026,
        nama_wp: String(row[2] || "").trim(),
        alamat: String(row[3] || "").trim(),
        luas_tanah: Number(row[4]) || 0,
        luas_bangunan: Number(row[5]) || 0,
        desa: String(row[6] || "").trim(),
        tanggal_data: String(row[7] || "").trim(),
        pajak: Number(String(row[8] || "0").replace(/[^\d]/g, "")) || 0,
        status_bayar: "belum",
      }));

    if (!payload.length) {
      return {
        success: false,
        message: "Data WP tidak ditemukan dalam file Excel.",
      };
    }

    const { error } = await supabase
      .from("wajib_pajak")
      .upsert(payload, {
        onConflict: "kode_blok,nop",
      });

    if (error) throw error;

    return {
      success: true,
      message: `Berhasil import ${payload.length} data wajib pajak.`,
      total: payload.length,
    };
  } catch (error) {
    console.error("Import Excel gagal:", error);

    return {
      success: false,
      message: error.message || "Import Excel gagal.",
    };
  }
}