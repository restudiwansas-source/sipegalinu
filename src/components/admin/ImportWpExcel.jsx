import { useState } from "react";
import { importWajibPajakExcel } from "../../services/db";
import { useAppStore } from "../../store/appStore";

export default function ImportWpExcel() {
  const { blocks, setToast } = useAppStore();

  const [kodeBlok, setKodeBlok] = useState("001");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    if (!file || !kodeBlok) {
      setToast("Pilih blok dan file Excel terlebih dahulu.");
      return;
    }

    setLoading(true);

    const result = await importWajibPajakExcel({
      file,
      kodeBlok,
    });

    setLoading(false);
    setToast(result.message);

    if (result.success) {
      setFile(null);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-5"
    >
      <div>
        <h2 className="text-2xl font-black">
          Import Data WP Excel
        </h2>

        <p className="text-zinc-400 text-sm mt-1">
          Import data wajib pajak real per blok dari file Excel.
        </p>
      </div>

      <label className="block">
        <span className="block text-xs uppercase font-black tracking-widest text-zinc-400 mb-2">
          Pilih Blok
        </span>

        <select
          value={kodeBlok}
          onChange={(e) => setKodeBlok(e.target.value)}
          className="input-admin"
        >
          {blocks.map((b) => (
            <option key={b.id} value={b.kode_blok}>
              Blok {b.kode_blok} - {b.nama_blok}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="block text-xs uppercase font-black tracking-widest text-zinc-400 mb-2">
          File Excel WP
        </span>

        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 text-white"
        />
      </label>

      {file && (
        <div className="text-emerald-400 text-sm">
          File dipilih: {file.name}
        </div>
      )}

      <button
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-2xl p-4 font-black"
      >
        {loading ? "Mengimport..." : "Import Data WP"}
      </button>
    </form>
  );
}