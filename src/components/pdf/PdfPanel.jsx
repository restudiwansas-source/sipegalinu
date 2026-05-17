import { useState } from "react";
import { FileText, Globe, Maximize2, X } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import HtmlMapViewer from "../map/HtmlMapViewer";
import ProtectedPdfViewer from "./ProtectedPdfViewer";

export default function PdfPanel() {
  const { blocks, selectedBlock, setSelectedBlock, setActiveTab } = useAppStore();

  const [fullscreenHtml, setFullscreenHtml] = useState(false);
  const [fullscreenPdf, setFullscreenPdf] = useState(false);

  const block = selectedBlock || blocks?.[0];

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
            <Meta label="Jumlah Objek" value={`${block.jumlah_objek || 0} unit`} />
            <Meta label="Luas Area" value={block.luas || "-"} />
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
                onClick={() => setFullscreenPdf(true)}
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
                onClick={() => setFullscreenPdf(true)}
                className="mb-3 w-full bg-red-500 hover:bg-red-600 text-white rounded-xl p-3 font-black flex items-center justify-center gap-2"
              >
                <Maximize2 size={18} />
                Fullscreen PDF
              </button>

              <div className="h-[560px] rounded-xl overflow-hidden border border-[var(--cream-dark)] bg-zinc-700">
                <ProtectedPdfViewer url={block.offline_pdf} />
              </div>

              <p className="text-xs text-[var(--text-light)] mt-3 text-center">
                Gunakan tombol search pada viewer untuk mencari nama, NOP, atau nomor persil.
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

          <div className="flex-1 min-h-0 bg-zinc-700">
            <ProtectedPdfViewer url={block.offline_pdf} />
          </div>
        </div>
      )}
    </section>
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