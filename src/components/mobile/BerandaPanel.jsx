import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "../../store/appStore";
import { supabase } from "../../services/supabase";

export default function BerandaPanel() {
  const { user, blocks, setSelectedBlock, setActiveTab, settings } = useAppStore();

  const [wpStats, setWpStats] = useState({});
  const [totalObjek, setTotalObjek] = useState(0);

  useEffect(() => {
    loadRealStats();
  }, []);

  async function fetchAllWajibPajak() {
    const pageSize = 1000;
    let from = 0;
    let allRows = [];

    while (true) {
      const { data, error } = await supabase
        .from("wajib_pajak")
        .select("kode_blok")
        .range(from, from + pageSize - 1);

      if (error) throw error;

      const rows = data || [];
      allRows = [...allRows, ...rows];

      if (rows.length < pageSize) break;
      from += pageSize;
    }

    return allRows;
  }

  async function loadRealStats() {
    try {
      const data = await fetchAllWajibPajak();

      const stats = {};
      let grandTotal = 0;

      data.forEach((row) => {
        const kode = String(row.kode_blok || "").trim();
        if (!kode) return;

        if (!stats[kode]) stats[kode] = 0;

        stats[kode] += 1;
        grandTotal += 1;
      });

      setWpStats(stats);
      setTotalObjek(grandTotal);
    } catch (err) {
      console.error("REAL BERANDA ERROR:", err);
      setWpStats({});
      setTotalObjek(0);
    }
  }

  const totalBlokAktif = useMemo(() => {
    return Object.values(wpStats).filter((jumlah) => Number(jumlah) > 0).length;
  }, [wpStats]);

  return (
    <section className="h-full overflow-y-auto p-4 bg-[var(--cream)]">
      <div className="rounded-[24px] p-6 mb-4 text-white relative overflow-hidden bg-gradient-to-br from-[var(--green-dark)] to-[var(--green-mid)]">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl opacity-10">
          🏡
        </div>

        <h3 className="text-xl font-black">
          Selamat Datang, {user?.name?.split(" ")[0] || "User"}
        </h3>

        <p className="text-white/75 text-sm mt-2 leading-relaxed">
          {settings?.app_name || "SiPegaLinu V1.0"}
          <br />
          {settings?.subtitle || "(Sistem Peta Digital Lintas User) By Diones Project"}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <Stat title="Total Blok" value={totalBlokAktif || 0} sub="Blok berisi data" />

        <Stat title="Objek Data" value={totalObjek || 0} sub="Realtime Supabase" gold />

        <Stat title="Role" value={user?.role || "Administrator"} sub="Hak akses" info />

        <Stat title="Mode" value="V4+" sub="Foundation Plus" warn />
      </div>

      <h4 className="text-xs font-black text-[var(--text-light)] tracking-widest uppercase mb-3">
        📦 Data Per Blok
      </h4>

      <div className="space-y-3 pb-6">
        {blocks.map((b) => {
          const kode = String(b.kode_blok || "").trim();
          const jumlahReal = wpStats[kode] || 0;

          return (
            <button
              key={b.id}
              onClick={() => {
                setSelectedBlock(b);
                setActiveTab("pdf");
              }}
              className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 text-left">
                <div
                  style={{ background: b.color || "#2d5a3d" }}
                  className="w-11 h-11 rounded-xl text-white flex items-center justify-center text-lg"
                >
                  🗺️
                </div>

                <div>
                  <div className="font-black text-[var(--text-dark)]">
                    {b.nama_blok}
                  </div>

                  <div className="text-xs text-[var(--text-light)]">
                    Kode blok {b.kode_blok} · {b.luas || "Belum diisi"}
                  </div>
                </div>
              </div>

              <div className="bg-[var(--green-accent)] text-white px-3 py-1 rounded-full text-xs font-black">
                {Number(jumlahReal).toLocaleString("id-ID")}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Stat({ title, value, sub, gold, info, warn }) {
  const border = gold
    ? "border-[var(--gold)]"
    : info
    ? "border-[var(--info)]"
    : warn
    ? "border-[var(--warning)]"
    : "border-[var(--green-accent)]";

  const displayValue =
    typeof value === "number"
      ? value.toLocaleString("id-ID")
      : value || "-";

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${border}`}>
      <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider">
        {title}
      </div>

      <div className="text-2xl font-black text-[var(--text-dark)] mt-1">
        {displayValue}
      </div>

      <div className="text-[11px] text-[var(--text-light)]">
        {sub}
      </div>
    </div>
  );
}