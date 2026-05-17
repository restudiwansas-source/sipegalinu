import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";

export default function SearchablePdfViewer({ url }) {
  const canvasRef = useRef(null);
  const textLayerRef = useRef(null);
  const viewerRef = useRef(null);

  const renderTaskRef = useRef(null);

  const [pdf, setPdf] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [zoom, setZoom] = useState(1.8);
  const [rotation, setRotation] = useState(0);

  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    async function loadPdf() {
      if (!url) return;

      setLoading(true);
      setPdf(null);
      setMatches([]);
      setCurrentMatch(0);
      setPageNum(1);
      setZoom(1.8);
      setRotation(0);

      try {
        const cleanUrl = url.split("#")[0];

        const task = pdfjsLib.getDocument({
          url: cleanUrl,
          withCredentials: false,
        });

        const loadedPdf = await task.promise;

        setPdf(loadedPdf);
        setTotalPages(loadedPdf.numPages);
        setPageNum(1);
      } catch (error) {
        console.error("Gagal memuat PDF:", error);
      }

      setLoading(false);
    }

    loadPdf();
  }, [url]);

  useEffect(() => {
    renderPage();
  }, [pdf, pageNum, zoom, rotation, matches, currentMatch, query]);

  useEffect(() => {
    function handleResize() {
      renderPage();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [pdf, pageNum, zoom, rotation, matches, currentMatch, query]);

  async function renderPage() {
    if (!pdf || !canvasRef.current || !textLayerRef.current) return;

    try {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }

      const page = await pdf.getPage(pageNum);

      const containerWidth =
        viewerRef.current?.clientWidth || window.innerWidth;

      const baseViewport = page.getViewport({
        scale: 1,
        rotation,
      });

      const fitScale = Math.max(
        0.3,
        (containerWidth - 24) / baseViewport.width
      );

      const finalScale = fitScale * zoom;

      const viewport = page.getViewport({
        scale: finalScale,
        rotation,
      });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);

      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, viewport.width, viewport.height);

      const renderTask = page.render({
        canvasContext: context,
        viewport,
      });

      renderTaskRef.current = renderTask;

      await renderTask.promise;

      renderTaskRef.current = null;

      const textContent = await page.getTextContent();

      const textLayer = textLayerRef.current;
      textLayer.innerHTML = "";
      textLayer.style.width = `${viewport.width}px`;
      textLayer.style.height = `${viewport.height}px`;

      const q = query.trim().toLowerCase();

      textContent.items.forEach((item, index) => {
        const span = document.createElement("span");

        const tx = pdfjsLib.Util.transform(
          viewport.transform,
          item.transform
        );

        const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);

        const text = String(item.str || "");
        const textLower = text.toLowerCase();

        span.textContent = text;
        span.dataset.page = pageNum;
        span.dataset.index = index;

        span.style.position = "absolute";
        span.style.left = `${tx[4]}px`;
        span.style.top = `${tx[5] - fontHeight}px`;
        span.style.fontSize = `${fontHeight}px`;
        span.style.fontFamily = "sans-serif";
        span.style.whiteSpace = "pre";
        span.style.lineHeight = "1";
        span.style.color = "transparent";
        span.style.cursor = "text";

        const isMatch = q && textLower.includes(q);

        const isCurrent =
          matches[currentMatch]?.page === pageNum &&
          matches[currentMatch]?.index === index;

        if (isMatch) {
          span.style.background = isCurrent
            ? "rgba(255, 120, 0, 0.82)"
            : "rgba(255, 230, 0, 0.65)";

          span.style.border = isCurrent
            ? "2px solid rgba(255, 80, 0, 0.95)"
            : "1px solid rgba(180, 150, 0, 0.8)";

          span.style.borderRadius = "4px";
          span.style.padding = "1px 2px";
          span.style.color = "rgba(0,0,0,0.01)";
        }

        textLayer.appendChild(span);
      });

      setTimeout(() => {
        const active = textLayer.querySelector(
          `span[data-page="${pageNum}"][data-index="${matches[currentMatch]?.index}"]`
        );

        if (active) {
          active.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        }
      }, 220);
    } catch (error) {
      if (error?.name !== "RenderingCancelledException") {
        console.error("Render PDF gagal:", error);
      }
    }
  }

  async function runSearch(e) {
    e?.preventDefault?.();

    if (!pdf || !query.trim()) {
      setMatches([]);
      setCurrentMatch(0);
      return;
    }

    setSearching(true);

    const q = query.trim().toLowerCase();
    const found = [];

    try {
      for (let page = 1; page <= pdf.numPages; page++) {
        const pdfPage = await pdf.getPage(page);
        const textContent = await pdfPage.getTextContent();

        textContent.items.forEach((item, index) => {
          const text = String(item.str || "");

          if (text.toLowerCase().includes(q)) {
            found.push({
              page,
              index,
              text,
            });
          }
        });
      }

      setMatches(found);
      setCurrentMatch(0);

      if (found.length) {
        setZoom(2.8);
        setPageNum(found[0].page);
      }
    } catch (error) {
      console.error("Pencarian gagal:", error);
    }

    setSearching(false);
  }

  function nextResult() {
    if (!matches.length) return;

    const next = (currentMatch + 1) % matches.length;

    setCurrentMatch(next);
    setPageNum(matches[next].page);
    setZoom((z) => Math.max(z, 2.8));
  }

  function prevResult() {
    if (!matches.length) return;

    const prev =
      currentMatch - 1 < 0 ? matches.length - 1 : currentMatch - 1;

    setCurrentMatch(prev);
    setPageNum(matches[prev].page);
    setZoom((z) => Math.max(z, 2.8));
  }

  function zoomIn() {
    setZoom((z) => Math.min(8, z + 0.4));
  }

  function zoomOut() {
    setZoom((z) => Math.max(0.8, z - 0.4));
  }

  function resetZoom() {
    setZoom(1.8);
  }

  function rotate90() {
    setRotation((r) => (r + 90) % 360);
  }

  function rotate180() {
    setRotation((r) => (r + 180) % 360);
  }

  function resetRotation() {
    setRotation(0);
  }

  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center text-zinc-500">
        PDF belum tersedia
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-zinc-200">
      <div className="bg-zinc-950 text-white p-2 space-y-2 border-b border-zinc-800">
        <form onSubmit={runSearch} className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama / NOP / nomor persil..."
            className="flex-1 h-10 rounded-xl bg-zinc-800 border border-zinc-700 px-3 text-sm outline-none"
          />

          <button
            type="submit"
            disabled={searching}
            className="h-10 px-4 rounded-xl bg-[var(--green-mid)] text-white text-xs font-black disabled:opacity-50"
          >
            {searching ? "Cari..." : "Cari"}
          </button>
        </form>

        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={zoomOut}
            className="shrink-0 h-9 px-3 rounded-xl bg-zinc-800 text-white text-xs font-black"
          >
            - Zoom
          </button>

          <button
            onClick={resetZoom}
            className="shrink-0 h-9 px-3 rounded-xl bg-zinc-800 text-white text-xs font-black"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            onClick={zoomIn}
            className="shrink-0 h-9 px-3 rounded-xl bg-zinc-800 text-white text-xs font-black"
          >
            + Zoom
          </button>

          <div className="h-6 w-px bg-zinc-700 shrink-0" />

          <button
            onClick={rotate90}
            className="shrink-0 h-9 px-3 rounded-xl bg-blue-700 text-white text-xs font-black"
          >
            Putar 90°
          </button>

          <button
            onClick={rotate180}
            className="shrink-0 h-9 px-3 rounded-xl bg-blue-700 text-white text-xs font-black"
          >
            Putar 180°
          </button>

          <button
            onClick={resetRotation}
            className="shrink-0 h-9 px-3 rounded-xl bg-zinc-800 text-white text-xs font-black"
          >
            Rotasi {rotation}°
          </button>

          <div className="h-6 w-px bg-zinc-700 shrink-0" />

          <button
            onClick={() => setPageNum((p) => Math.max(1, p - 1))}
            disabled={pageNum <= 1}
            className="shrink-0 h-9 px-3 rounded-xl bg-zinc-800 text-white text-xs font-black disabled:opacity-40"
          >
            Hal Sebelumnya
          </button>

          <div className="shrink-0 text-xs font-black text-zinc-300">
            Hal {pageNum}/{totalPages || "-"}
          </div>

          <button
            onClick={() => setPageNum((p) => Math.min(totalPages, p + 1))}
            disabled={pageNum >= totalPages}
            className="shrink-0 h-9 px-3 rounded-xl bg-zinc-800 text-white text-xs font-black disabled:opacity-40"
          >
            Hal Berikutnya
          </button>

          {matches.length > 0 && (
            <>
              <div className="h-6 w-px bg-zinc-700 shrink-0" />

              <button
                onClick={prevResult}
                className="shrink-0 h-9 px-3 rounded-xl bg-yellow-600 text-white text-xs font-black"
              >
                Hasil Sebelumnya
              </button>

              <div className="shrink-0 text-xs font-black text-yellow-300">
                {currentMatch + 1}/{matches.length}
              </div>

              <button
                onClick={nextResult}
                className="shrink-0 h-9 px-3 rounded-xl bg-yellow-600 text-white text-xs font-black"
              >
                Hasil Berikutnya
              </button>
            </>
          )}
        </div>
      </div>

      <div ref={viewerRef} className="flex-1 overflow-auto p-2 bg-zinc-300">
        {loading ? (
          <div className="text-center text-zinc-600 py-10">
            Memuat PDF...
          </div>
        ) : (
          <div className="relative mx-auto bg-white shadow-xl w-fit">
            <canvas ref={canvasRef} className="block" />

            <div
              ref={textLayerRef}
              className="absolute top-0 left-0 pointer-events-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}