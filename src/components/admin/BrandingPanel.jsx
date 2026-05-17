import { useState } from "react";
import { Upload } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { saveSettings, uploadLogoFile } from "../../services/db";

export default function BrandingPanel() {
  const { settings, setSettings, setToast } = useAppStore();

  const [form, setForm] = useState(settings);
  const [logoFile, setLogoFile] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  async function handleUploadLogo() {
    if (!logoFile) {
      setToast("Pilih file logo terlebih dahulu.");
      return;
    }

    setLoadingLogo(true);

    const result = await uploadLogoFile(logoFile);

    setLoadingLogo(false);
    setToast(result.message);

    if (result.success) {
      const updated = {
        ...form,
        logo_url: result.url,
      };

      setForm(updated);
      setSettings(updated);
      setLogoFile(null);
    }
  }

  async function save() {
    setLoadingSave(true);

    setSettings(form);

    const result = await saveSettings(form);

    setLoadingSave(false);
    setToast(result.message || "Branding diperbarui");
  }

  return (
    <div className="max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-5">
      <div>
        <h2 className="text-2xl font-black">
          Branding Manager
        </h2>

        <p className="text-zinc-400 text-sm mt-1">
          Atur logo, nama aplikasi, subtitle, favicon, dan footer.
        </p>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5">
        <h3 className="font-black mb-4">
          Logo Aplikasi
        </h3>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="w-24 h-24 rounded-3xl bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
            {form.logo_url ? (
              <img
                src={form.logo_url}
                alt="Logo Aplikasi"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">🏛️</span>
            )}
          </div>

          <div className="flex-1 min-w-[240px] space-y-3">
            <input
              type="file"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 text-white"
            />

            {logoFile && (
              <div className="text-sm text-emerald-400">
                File dipilih: {logoFile.name}
              </div>
            )}

            <button
              type="button"
              onClick={handleUploadLogo}
              disabled={loadingLogo}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-2xl p-4 font-black flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              {loadingLogo ? "Mengupload Logo..." : "Upload Logo"}
            </button>
          </div>
        </div>
      </div>

      <Input
        label="Nama Aplikasi"
        value={form.app_name}
        onChange={(v) => setForm({ ...form, app_name: v })}
      />

      <Input
        label="Subtitle / Deskripsi"
        value={form.subtitle}
        onChange={(v) => setForm({ ...form, subtitle: v })}
      />

      <Input
        label="Footer"
        value={form.footer_text}
        onChange={(v) => setForm({ ...form, footer_text: v })}
      />

      <Input
        label="Logo URL Otomatis"
        value={form.logo_url || ""}
        onChange={(v) => setForm({ ...form, logo_url: v })}
      />

      <Input
        label="Favicon URL"
        value={form.favicon_url || ""}
        onChange={(v) => setForm({ ...form, favicon_url: v })}
      />

      <button
        onClick={save}
        disabled={loadingSave}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-2xl p-4 font-black"
      >
        {loadingSave ? "Menyimpan..." : "Simpan Branding"}
      </button>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase font-black tracking-widest text-zinc-400 mb-2">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-admin"
      />
    </label>
  );
}