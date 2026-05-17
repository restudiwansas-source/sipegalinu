import { useEffect, useMemo, useState } from "react";
import { Maximize2, X } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { getWajibPajak } from "../../services/db";
import { formatRp } from "../../utils/format";

export default function DataPanel() {
  const { blocks, selectedBlock, setSelectedBlock, setToast } = useAppStore();

  const [dataWp, setDataWp] = useState([]);
  const [query, setQuery] = useState("");
  const [filterBlok, setFilterBlok] = useState("semua");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  async function loadData(kodeBlok = null) {
    setLoading(true);

    const data = await getWajibPajak(
      kodeBlok && kodeBlok !== "semua" ? kodeBlok : null
    );

    setDataWp(data);
    setLoading(false);

    if (!data.length) {
      setToast("Data WP belum tersedia untuk filter ini.");
    }
  }

  useEffect(() => {
    loadData(null);
  }, []);

  useEffect(() => {
    if (selectedBlock?.kode_blok) {
      setFilterBlok(selectedBlock.kode_blok);
      loadData(selectedBlock.kode_blok);
    }
  }, [selectedBlock?.kode_blok]);

  const filtered = useMemo(() => {
    return dataWp.filter((item) => {
      const q = query.toLowerCase();

      const matchSearch =
        !q ||
        String(item.nop || "").toLowerCase().includes(q) ||
        String(item.nama_wp || "").toLowerCase().includes(q) ||
        String(item.alamat || "").toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "semua"
          ? true
          : String(item.status_bayar || "belum") === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [dataWp, query, statusFilter]);

  async function handleFilterBlok(kode) {
    setFilterBlok(kode);

    if (kode !== "semua") {
      const block = blocks.find((b) => b.kode_blok === kode);

      if (block) {
        setSelectedBlock(block);
      }
    }

    await loadData(kode);
  }

  const totalPajak = filtered.reduce(
    (sum, item) => sum + Number(item.pajak || 0),
    0
  );

  const totalLuasTanah = filtered.reduce(
    (sum, item) => sum + Number(item.luas_tanah || 0),
    0
  );

  const DataList = () => (
    <>
      {loading && (
        <div className="text-center text-[var(--text-light)] py-10">
          Memuat data wajib pajak...
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center text-[var(--text-light)] py-10">
          Data tidak ditemukan
        </div>
      )}

      {!loading &&
        filtered.map((item) => (
          <button
            key={item.id}
            onClick={() => setDetail(item)}
            className="w-full text-left bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition flex gap-3"
          >
            <div className="flex-1">
              <div className="text-[10px] font-black text-[var(--text-light)]">
                NOP: {item.nop}
              </div>

              <div className="font-black text-[var(--text-dark)] mt-1">
                {item.nama_wp}
              </div>

              <div className="text-xs text-[var(--text-light)] mt-1">
                📍 {item.alamat}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <Badge>Blok {item.kode_blok}</Badge>

                <Badge gold>
                  {formatRp(item.pajak)}
                </Badge>

                <Badge>
                  {Number(item.luas_tanah || 0).toLocaleString("id-ID")} m²
                </Badge>

                <Badge danger={item.status_bayar !== "lunas"}>
                  {item.status_bayar === "lunas" ? "✅ Lunas" : "❌ Belum"}
                </Badge>
              </div>
            </div>

            <div className="text-2xl text-[var(--text-light)] self-center">
              ›
            </div>
          </button>
        ))}
    </>
  );

  return (
    <section className="h-full flex flex-col bg-[var(--cream)]">
      <div className="bg-white p-4 shadow-sm flex items-center justify-between gap-3">
        <div>
          <h3 className="font-black text-[var(--text-dark)]">
            📊 Data Wajib Pajak Real
          </h3>

          <p className="text-xs text-[var(--text-light)] mt-1">
            Data bersumber dari Excel yang diimport ke Supabase
          </p>
        </div>

        <button
          onClick={() => setFullscreen(true)}
          className="px-3 py-2 rounded-xl bg-[var(--green-mid)] text-white text-xs font-black flex items-center gap-2"
        >
          <Maximize2 size={15} />
          Fullscreen
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 p-3 bg-white border-b border-[var(--cream-dark)]">
        <Stat title="Total Data" value={filtered.length} />
        <Stat
          title="Luas Tanah"
          value={`${totalLuasTanah.toLocaleString("id-ID")} m²`}
        />
        <Stat title="Total Pajak" value={formatRp(totalPajak)} />
      </div>

      <div className="bg-white p-3 border-b border-[var(--cream-dark)]">
        <div className="flex items-center gap-2 bg-[var(--cream)] border border-[var(--cream-dark)] rounded-xl p-3">
          <span>🔍</span>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama WP, NOP, alamat..."
            className="bg-transparent outline-none flex-1 text-sm"
          />
        </div>
      </div>

      <div className="bg-white flex gap-2 p-3 overflow-x-auto border-b border-[var(--cream-dark)]">
        <Chip
          active={filterBlok === "semua"}
          onClick={() => handleFilterBlok("semua")}
        >
          Semua Blok
        </Chip>

        {blocks.map((b) => (
          <Chip
            key={b.id}
            active={filterBlok === b.kode_blok}
            onClick={() => handleFilterBlok(b.kode_blok)}
          >
            Blok {b.kode_blok}
          </Chip>
        ))}

        <Chip
          active={statusFilter === "semua"}
          onClick={() => setStatusFilter("semua")}
        >
          Semua Status
        </Chip>

        <Chip
          active={statusFilter === "lunas"}
          onClick={() => setStatusFilter("lunas")}
        >
          ✅ Lunas
        </Chip>

        <Chip
          active={statusFilter === "belum"}
          onClick={() => setStatusFilter("belum")}
        >
          ❌ Belum
        </Chip>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <DataList />
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-[9999] bg-[var(--cream)] flex flex-col">
          <div className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4">
            <div className="text-white">
              <div className="font-black text-sm">
                Data Wajib Pajak
              </div>

              <div className="text-xs text-zinc-400">
                Mode Fullscreen — {filtered.length} data
              </div>
            </div>

            <button
              onClick={() => setFullscreen(false)}
              className="w-10 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
            >
              <X size={22} />
            </button>
          </div>

          <div className="bg-white p-3 border-b border-[var(--cream-dark)]">
            <div className="flex items-center gap-2 bg-[var(--cream)] border border-[var(--cream-dark)] rounded-xl p-3">
              <span>🔍</span>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nama WP, NOP, alamat..."
                className="bg-transparent outline-none flex-1 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 bg-white border-b border-[var(--cream-dark)]">
            <Stat title="Total Data" value={filtered.length} />
            <Stat
              title="Luas Tanah"
              value={`${totalLuasTanah.toLocaleString("id-ID")} m²`}
            />
            <Stat title="Total Pajak" value={formatRp(totalPajak)} />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <DataList />
          </div>
        </div>
      )}

      {detail && (
        <DetailModal
          item={detail}
          onClose={() => setDetail(null)}
        />
      )}
    </section>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-[var(--cream)] rounded-2xl p-3">
      <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider">
        {title}
      </div>

      <div className="text-sm sm:text-lg font-black text-[var(--text-dark)] mt-1">
        {value}
      </div>
    </div>
  );
}

function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-full text-xs font-black border ${
        active
          ? "bg-[var(--green-mid)] text-white border-[var(--green-mid)]"
          : "bg-[var(--cream)] text-[var(--text-light)] border-[var(--cream-dark)]"
      }`}
    >
      {children}
    </button>
  );
}

function Badge({ children, gold, danger }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-black ${
        danger
          ? "bg-red-100 text-red-700"
          : gold
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {children}
    </span>
  );
}

function DetailModal({ item, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 z-[10000] flex items-end"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-[28px] w-full max-h-[88vh] overflow-y-auto p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-11 h-1 bg-gray-300 rounded-full mx-auto mb-5" />

        <div className="text-xs font-black text-[var(--text-light)]">
          NOP: {item.nop}
        </div>

        <h3 className="text-2xl font-black text-[var(--text-dark)] mt-1">
          {item.nama_wp}
        </h3>

        <p className="text-sm text-[var(--text-light)] mt-1">
          {item.alamat}
        </p>

        <div className="mt-5 p-4 rounded-2xl bg-[var(--cream)] flex items-center gap-3">
          <span
            className={`w-3 h-3 rounded-full ${
              item.status_bayar === "lunas"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />

          <b>
            {item.status_bayar === "lunas"
              ? "LUNAS"
              : "BELUM BAYAR"}
          </b>

          <span className="ml-auto text-xs text-[var(--text-light)]">
            Tahun {item.tahun}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <Info label="Kode Blok" value={item.kode_blok} />
          <Info label="Pajak" value={formatRp(item.pajak)} />

          <Info
            label="Luas Tanah"
            value={`${Number(item.luas_tanah || 0).toLocaleString("id-ID")} m²`}
          />

          <Info
            label="Luas Bangunan"
            value={`${Number(item.luas_bangunan || 0).toLocaleString("id-ID")} m²`}
          />

          <Info label="Desa" value={item.desa || "-"} />
          <Info label="Tanggal Data" value={item.tanggal_data || "-"} />
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-[var(--green-mid)] text-[var(--green-mid)] rounded-xl p-3 font-black"
          >
            Tutup
          </button>

          <button className="flex-1 bg-[var(--green-mid)] text-white rounded-xl p-3 font-black">
            Cetak Detail
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-[var(--cream)] rounded-xl p-3">
      <div className="text-[10px] uppercase font-black text-[var(--text-light)]">
        {label}
      </div>

      <div className="font-black text-[var(--text-dark)] mt-1">
        {value}
      </div>
    </div>
  );
}