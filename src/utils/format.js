export function formatRp(value) {
  return new Intl.NumberFormat("id-ID", { style:"currency", currency:"IDR", maximumFractionDigits:0 }).format(value || 0);
}

export function cleanKodeBlok(value) {
  return String(value || "").trim().replace(/[^0-9A-Za-z_-]/g, "").padStart(3, "0");
}
