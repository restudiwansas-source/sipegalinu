import { useEffect, useMemo, useState } from "react";
import { FileText, Globe, Maximize2, X, Search } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import HtmlMapViewer from "../map/HtmlMapViewer";
import { getSignedPdfUrl, getWajibPajak } from "../../services/db";
import { formatRp } from "../../utils/format";

export default function PdfPanel() {
  const { blocks, selectedBlock, setSelectedBlock, setActiveTab } = useAppStore();

  const [fullscreenHtml, setFullscreenHtml] = useState(false);
  const [fullscreenPdf, setFullscreenPdf] = useState(false);
  const [searchMode, setSearchMode] = useState(false);

  const [signedPdfUrl, setSignedPdfUrl] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);

  const [wpData, setWpData] = useState([]);
  const [wpLoading, setWpLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWp, setSelectedWp] = useState(null);

  const block = selectedBlock || blocks?.[0];

  async function loadSignedPdfUrl(targetBlock = block) {
    if (!targetBlock?.offline_pdf && !targetBlock?.offline_pdf_path) {
      setSignedPdfUrl("");
      return "";
    }

    setPdfLoading(true);

    try {
      const source = targetBlock.offline_pdf_path || targetBlock.offline_pdf;
      const url = await getSignedPdfUrl(source, 3600);

      setSignedPdfUrl(url || "");
      return url || "";
    } catch (error) {
      console.error("Gagal membuat signed URL PDF:", error);
      setSignedPdfUrl("");
      return "";
    } finally {
      setPdfLoading(false);
    }
  }

  async function loadWpData(targetBlock = block) {
    if (!targetBlock?.kode_blok) {
      setWpData([]);
      return;
    }

    setWpLoading(true);

    try {
      const data = await getWajibPajak(targetBlock.kode_blok);
      setWpData(data || []);
    } catch (error) {
      console.error("Gagal memuat data WP:", error);
      setWpData([]);
    } finally {
      setWpLoading(false);
    }
  }

  useEffect(() => {
    if (block) {
      loadSignedPdfUrl(block);
      loadWpData(block);
      setSearchQuery("");
      setSelectedWp(null);
    }
  }, [block?.id, block?.kode_blok, block?.offline_pdf, block?.offline_pdf_path]);

  const filteredWp = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    if (!q) return wpData;

    return wpData.filter((item) => {
      return (
        String(item.nop || "").toLowerCase().includes(q) ||
        String(item.nama_wp || "").toLowerCase().includes(q) ||
        String(item.alamat || "").toLowerCase().includes(q) ||
        String(item.kode_blok || "").toLowerCase().includes(q)
      );
    });
  }, [wpData, searchQuery]);

  const totalPajak = filteredWp.reduce(
    (sum, item) => sum + Number(item.pajak || 0),
    0
  );

  const totalLuas = filteredWp.reduce(
    (sum, item) => sum + Number(item.luas_tanah || 0),
    0
  );

  async function openFullscreenPdf() {
    const url = await loadSignedPdfUrl(block);

    if (!url) {
      alert("URL PDF gagal dibuat.");
      return;
    }

    if (window.AndroidPdf && typeof window.AndroidPdf.openPdf === "function") {
      window.AndroidPdf.openPdf(url, block?.nama_blok || "PDF Peta");
      return;
    }

    setFullscreenPdf(true);
  }

  async function openSearchMode() {
    await loadWpData(block);
    setSearchMode(true);
  }

  if (!block) {
    return (
      <div className="w-full h-full flex items-center justify-center text-zinc-500 bg-[var(--cream)]">
        Belum ada data blok
      </div>
    );
  }

  return (
    <section className="h-full flex flex-col bg-[var(--cream)]">
      <div className="bg-white p-4 shadow-sm">
        <h3 className="font-black text-[var(--text-dark)]">
          📄 Peta Blok Resmi
        </h3>

        <p className="text-xs text-[var(--text-light)] mt-1">
          Pilih blok untuk membuka peta interaktif dan PDF offline
        </p>
      </div>

      <div className="bg-white border-b border-[var(--cream-dark)] flex gap-2 p-3 overflow-x-auto">
        {blocks.map((b) => (
          <button
            key={b.id}
            onClick={() => setSelectedBlock(b)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-black border ${
              block?.id === b.id
                ? "bg-[var(--green-mid)] text-white border-[var(--green-mid)]"
                : "bg-[var(--cream)] text-[var(--text-light)] border-[var(--cream-dark)]"
            }`}
          >
            Blok {b.kode_blok}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-white rounded-[24px] shadow-md overflow-hidden">
          <div className="bg-gradient-to-br from-[var(--green-dark)] to-[var(--green-mid)] p-4 text-white flex justify-between">
            <div>
              <h4 className="font-black">{block.nama_blok}</h4>

              <p className="text-white/65 text-xs mt-1">
                Kode wilayah 32.08.251.006.{block.kode_blok}
              </p>
            </div>

            <div className="text-3xl">🗺️</div>
          </div>

          <div className="grid grid-cols-2 border-b border-[var(--cream-dark)]">
            <Meta label="Nomor Blok" value={block.kode_blok} />

            <Meta
              label="Jumlah Objek"
              value={`${wpData.length || block.jumlah_objek || 0} unit`}
            />

            <Meta
              label="Total Pajak"
              value={formatRp(
                wpData.reduce((sum, item) => sum + Number(item.pajak || 0), 0)
              )}
            />

            <Meta
              label="Status"
              value={block.interactive_map ? "HTML tersedia" : "Belum upload"}
            />
          </div>

          <div className="p-4 flex gap-3">
            <button
              onClick={() => setActiveTab("peta")}
              className="flex-1 border-2 border-[var(--green-mid)] text-[var(--green-mid)] rounded-xl p-3 font-black"
            >
              🗺️ Lihat Peta
            </button>

            {block.interactive_map && (
              <button
                onClick={() => setFullscreenHtml(true)}
                className="flex-1 bg-[var(--gold)] text-[var(--green-deep)] rounded-xl p-3 font-black flex items-center justify-center gap-2"
              >
                <Maximize2 size={18} />
                Fullscreen HTML
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[24px] shadow-md overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[var(--cream-dark)]">
            <div className="flex items-center gap-2">
              <Globe size={20} className="text-cyan-600" />

              <h3 className="text-lg font-black text-[var(--text-dark)]">
                Preview Peta Interaktif HTML
              </h3>
            </div>

            {block.interactive_map && (
              <button
                onClick={() => setFullscreenHtml(true)}
                className="px-3 py-2 rounded-xl bg-[var(--green-mid)] text-white text-xs font-black flex items-center gap-2"
              >
                <Maximize2 size={15} />
                Fullscreen
              </button>
            )}
          </div>

          {block.interactive_map ? (
            <div className="h-[520px] bg-white">
              <HtmlMapViewer url={block.interactive_map} />
            </div>
          ) : (
            <div className="p-6 text-[var(--text-light)]">
              HTML interaktif belum tersedia
            </div>
          )}
        </div>

        <div className="bg-white rounded-[24px] shadow-md overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[var(--cream-dark)]">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-red-500" />

              <h3 className="text-lg font-black text-[var(--text-dark)]">
                PDF Offline
              </h3>
            </div>

            {block.offline_pdf && (
              <button
                onClick={openFullscreenPdf}
                className="px-3 py-2 rounded-xl bg-red-500 text-white text-xs font-black flex items-center gap-2"
              >
                <Maximize2 size={15} />
                Fullscreen
              </button>
            )}
          </div>

          {block.offline_pdf ? (
            <div className="m-4">
              <button
                onClick={openFullscreenPdf}
                className="mb-3 w-full bg-red-500 hover:bg-red-600 text-white rounded-xl p-3 font-black flex items-center justify-center gap-2"
              >
                <Maximize2 size={18} />
                Fullscreen PDF
              </button>

              <button
                onClick={openSearchMode}
                className="mb-3 w-full bg-yellow-500 hover:bg-yellow-600 text-[var(--green-deep)] rounded-xl p-3 font-black flex items-center justify-center gap-2"
              >
                <Search size={18} />
                Cari Persil / Nama / NOP
              </button>

              <div className="h-[560px] rounded-xl overflow-hidden border border-[var(--cream-dark)] bg-white relative">
                {pdfLoading ? (
                  <div className="w-full h-full flex items-center justify-center text-[var(--text-light)]">
                    Membuat akses PDF aman...
                  </div>
                ) : signedPdfUrl ? (
                  <PdfIframeProtected url={signedPdfUrl} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-red-500">
                    PDF gagal dimuat
                  </div>
                )}
              </div>

              <p className="text-xs text-[var(--text-light)] mt-3 text-center flex items-center justify-center gap-1">
                <Search size={13} />
                Di APK, tombol Fullscreen PDF membuka Native PDF Viewer tanpa popup.
              </p>
            </div>
          ) : (
            <div className="p-6 text-[var(--text-light)]">
              PDF offline belum tersedia
            </div>
          )}
        </div>
      </div>

      {fullscreenHtml && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
          <div className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4">
            <div className="text-white">
              <div className="font-black text-sm">{block.nama_blok}</div>

              <div className="text-xs text-zinc-400">
                Peta Interaktif Fullscreen
              </div>
            </div>

            <button
              onClick={() => setFullscreenHtml(false)}
              className="w-10 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 min-h-0 bg-white">
            <HtmlMapViewer url={block.interactive_map} />
          </div>
        </div>
      )}

      {fullscreenPdf && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
          <div className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4">
            <div className="text-white">
              <div className="font-black text-sm">{block.nama_blok}</div>

              <div className="text-xs text-zinc-400">
                PDF Offline Fullscreen
              </div>
            </div>

            <button
              onClick={() => setFullscreenPdf(false)}
              className="w-10 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 min-h-0 bg-white relative">
            {signedPdfUrl ? (
              <PdfIframeProtected url={signedPdfUrl} fullscreen />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-red-500">
                PDF gagal dimuat
              </div>
            )}
          </div>
        </div>
      )}

      {searchMode && (
        <div className="fixed inset-0 z-[9999] bg-[var(--cream)] flex flex-col">
          <div className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4">
            <div className="text-white">
              <div className="font-black text-sm">{block.nama_blok}</div>

              <div className="text-xs text-zinc-400">
                Cari Persil Ringan — Database WP
              </div>
            </div>

            <button
              onClick={() => setSearchMode(false)}
              className="w-10 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
            >
              <X size={22} />
            </button>
          </div>

          <div className="bg-white p-3 border-b border-[var(--cream-dark)]">
            <div className="flex items-center gap-2 bg-[var(--cream)] border border-[var(--cream-dark)] rounded-xl p-3">
              <Search size={17} className="text-[var(--text-light)]" />

              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama WP, NOP, alamat..."
                className="bg-transparent outline-none flex-1 text-sm"
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 bg-white border-b border-[var(--cream-dark)]">
            <Stat title="Hasil" value={filteredWp.length} />

            <Stat
              title="Luas"
              value={`${totalLuas.toLocaleString("id-ID")} m²`}
            />

            <Stat title="Pajak" value={formatRp(totalPajak)} />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {wpLoading && (
              <div className="text-center text-[var(--text-light)] py-10">
                Memuat data wajib pajak...
              </div>
            )}

            {!wpLoading && filteredWp.length === 0 && (
              <div className="text-center text-[var(--text-light)] py-10">
                Data tidak ditemukan
              </div>
            )}

            {!wpLoading &&
              filteredWp.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedWp(item)}
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

                      <Badge gold>{formatRp(item.pajak)}</Badge>

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
          </div>
        </div>
      )}

      {selectedWp && (
        <WpDetailModal
          item={selectedWp}
          onClose={() => setSelectedWp(null)}
          onOpenPdf={() => {
            setSelectedWp(null);
            setSearchMode(false);
            openFullscreenPdf();
          }}
        />
      )}
    </section>
  );
}

function PdfIframeProtected({ url, fullscreen = false }) {
  const [reloadKey, setReloadKey] = useState(0);
  const [viewMode, setViewMode] = useState("Fit");

  const viewerUrl = useMemo(() => {
    if (!url) return "";

    const cleanUrl = url.split("#")[0];

    return `${cleanUrl}#toolbar=1&navpanes=0&scrollbar=1&view=${viewMode}`;
  }, [url, viewMode, reloadKey]);

  function fitPage() {
    setViewMode("Fit");
    setReloadKey((n) => n + 1);
  }

  function fitWidth() {
    setViewMode("FitH");
    setReloadKey((n) => n + 1);
  }

  function fitHeight() {
    setViewMode("FitV");
    setReloadKey((n) => n + 1);
  }

  function reloadPdf() {
    setReloadKey((n) => n + 1);
  }

  return (
    <div className="w-full h-full relative bg-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[64px] bg-zinc-950 z-30 flex items-center gap-2 px-2 border-b border-zinc-800 overflow-x-auto">
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={fitPage}
            className={`h-9 px-3 rounded-xl text-white text-xs font-black ${
              viewMode === "Fit"
                ? "bg-[var(--green-mid)]"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            Fit Halaman
          </button>

          <button
            onClick={fitWidth}
            className={`h-9 px-3 rounded-xl text-white text-xs font-black ${
              viewMode === "FitH"
                ? "bg-[var(--green-mid)]"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            Fit Lebar
          </button>

          <button
            onClick={fitHeight}
            className={`h-9 px-3 rounded-xl text-white text-xs font-black ${
              viewMode === "FitV"
                ? "bg-[var(--green-mid)]"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            Fit Tinggi
          </button>

          <button
            onClick={reloadPdf}
            className="h-9 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-black"
          >
            Muat Ulang
          </button>
        </div>

        <div className="flex-1 text-right text-[10px] text-zinc-400 pr-2 min-w-[180px]">
          Mode tampilan: {viewMode}
        </div>
      </div>

      <iframe
        key={reloadKey}
        src={viewerUrl}
        title="PDF Offline"
        className="absolute left-0 right-0 bottom-0 top-[64px] w-full border-0 bg-white"
      />

      {fullscreen && (
        <div className="absolute bottom-3 left-3 right-3 z-30 pointer-events-none">
          <div className="bg-black/60 text-white text-[11px] rounded-xl px-3 py-2 text-center">
            Jika dibuka dari APK, PDF seharusnya dibuka oleh Native Android Viewer.
          </div>
        </div>
      )}
    </div>
  );
}

function WpDetailModal({ item, onClose, onOpenPdf }) {
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
              item.status_bayar === "lunas" ? "bg-green-500" : "bg-red-500"
            }`}
          />

          <b>{item.status_bayar === "lunas" ? "LUNAS" : "BELUM BAYAR"}</b>

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

          <button
            onClick={onOpenPdf}
            className="flex-1 bg-red-500 text-white rounded-xl p-3 font-black"
          >
            Buka PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-[var(--cream)] rounded-2xl p-3">
      <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider">
        {title}
      </div>

      <div className="text-sm sm:text-lg font-black text-[var(--text-dark)] mt-1">
        {typeof value === "number" ? value.toLocaleString("id-ID") : value}
      </div>
    </div>
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

function Meta({ label, value }) {
  return (
    <div className="p-3 border-r border-b border-[var(--cream-dark)]">
      <div className="text-[10px] text-[var(--text-light)] uppercase font-black tracking-wider">
        {label}
      </div>

      <div className="text-sm font-black text-[var(--text-dark)] mt-1">
        {value}
      </div>
    </div>
  );
}