import { useAppStore } from "../../store/appStore";
import { getBlocks } from "../../services/db";

export default function BlocksManager() {
  const { blocks, setBlocks, setToast } = useAppStore();

  async function refresh() {
    const data = await getBlocks();
    setBlocks(data);
    setToast("Daftar blok diperbarui");
  }

  return (
    <div className="space-y-3">
      <button onClick={refresh} className="bg-emerald-600 rounded-2xl px-5 py-3 font-black">Refresh dari Supabase</button>
      {blocks.map((b)=><div key={b.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex justify-between"><div><b>{b.nama_blok}</b><p className="text-zinc-400 text-sm">Kode {b.kode_blok} · {b.luas || "-"}</p></div><span className="text-zinc-400">{b.offline_pdf ? "PDF ✓" : "PDF -"}</span></div>)}
    </div>
  );
}
