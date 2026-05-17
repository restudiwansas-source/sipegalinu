export const defaultSettings = {
  app_name: "SiPegaLinu",
  subtitle: "Sistem Peta Digital Lintas User",
  footer_text: "© 2026 SiPegaLinu · Desa Sukapancar",
  logo_url: "",
  favicon_url: "",
  header_color: "#1a3a2a",
  sidebar_color: "#0f2419",
  background_color: "#f5f0e8",
  accent_color: "#c9a84c",
  layout_mode: "mobile_tabs"
};

export const defaultMenus = [
  { id: "beranda", label: "BERANDA", icon: "🏠", enabled: true, order_no: 1, allowed_roles: ["admin","petugas","kades","wajibpajak"] },
  { id: "peta", label: "PETA", icon: "🗺️", enabled: true, order_no: 2, allowed_roles: ["admin","petugas","kades","wajibpajak"] },
  { id: "pdf", label: "PETA BLOK", icon: "📄", enabled: true, order_no: 3, allowed_roles: ["admin","petugas","kades","wajibpajak"] },
  { id: "data", label: "DATA", icon: "📊", enabled: true, order_no: 4, allowed_roles: ["admin","petugas","kades"] },
  { id: "profil", label: "PROFIL", icon: "👤", enabled: true, order_no: 5, allowed_roles: ["admin","petugas","kades","wajibpajak"] }
];

export const defaultRoles = [
  { id: "admin", label: "Admin", can_upload: true, can_branding: true, can_manage_users: true, can_manage_roles: true, can_view_all_data: true },
  { id: "petugas", label: "Petugas", can_upload: false, can_branding: false, can_manage_users: false, can_manage_roles: false, can_view_all_data: true },
  { id: "kades", label: "Kades", can_upload: false, can_branding: false, can_manage_users: false, can_manage_roles: false, can_view_all_data: true },
  { id: "wajibpajak", label: "Wajib Pajak", can_upload: false, can_branding: false, can_manage_users: false, can_manage_roles: false, can_view_all_data: false }
];

export const demoUsers = [
  { id: "u-admin", username: "admin", password: "admin123", name: "Administrator", role_key: "admin", avatar: "A", active: true },
  { id: "u-petugas", username: "petugas", password: "petugas123", name: "Petugas Lapangan", role_key: "petugas", avatar: "P", active: true },
  { id: "u-kades", username: "kades", password: "kades123", name: "Kepala Desa", role_key: "kades", avatar: "K", active: true },
  { id: "u-wp", username: "wajibpajak", password: "wp123", name: "Wajib Pajak", role_key: "wajibpajak", avatar: "W", active: true }
];

export const demoBlocks = [
  { id:"demo-001", kode_blok:"001", nama_blok:"Blok 001 Sukapancar", jumlah_objek:117, luas:"±5 Ha", color:"#2d5a3d", lat:-7.1327, lng:108.1730, interactive_map:"/maps/blok001/interactive.html", offline_pdf:"" },
  { id:"demo-002", kode_blok:"002", nama_blok:"Blok 002", jumlah_objek:144, luas:"±6 Ha", color:"#3d8b5e", lat:-7.1305, lng:108.1765, interactive_map:"", offline_pdf:"" },
  { id:"demo-003", kode_blok:"003", nama_blok:"Blok 003", jumlah_objek:162, luas:"±7 Ha", color:"#5ab47e", lat:-7.1365, lng:108.1775, interactive_map:"", offline_pdf:"" }
];

export function createDemoObjects(blocks = demoBlocks) {
  const names = ["H. Suryana","Ibu Enih Sumarni","Bapak Dedi Kurnia","Hj. Rohaeti","Bapak Ujang Saepudin","Ibu Nani Heryani","H. Asep Rahmat","Ibu Tini Suryani","Bapak Cecep Hermawan","H. Maman Suherman"];
  const data = [];
  let no = 1;
  blocks.forEach((b) => {
    for (let i=1;i<=8;i++) {
      const njop = (100 + i * 37) * 1000000;
      data.push({
        id:`${b.kode_blok}-${i}`,
        nop:`32.08.251.006.${b.kode_blok}.${String(i).padStart(4,"0")}.0`,
        nama:names[(no-1)%names.length],
        blok:b.kode_blok,
        alamat:`Kp. Sukapancar RT.0${(i%3)+1}, Blok ${b.kode_blok}`,
        luas_tanah:60+i*23,
        luas_bangunan:35+i*7,
        njop,
        pbb:Math.floor(njop*.001),
        lunas:i%3!==0,
        tahun:2026
      });
      no++;
    }
  });
  return data;
}
