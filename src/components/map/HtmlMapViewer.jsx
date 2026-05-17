import { useEffect, useState } from "react";

export default function HtmlMapViewer({ url }) {
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!url) return;

    async function loadHtml() {
      try {
        setError("");
        setHtml("");

        const cleanUrl = url.split("?")[0] + "?v=" + Date.now();

        const res = await fetch(cleanUrl);

        if (!res.ok) {
          throw new Error("Gagal mengambil file HTML");
        }

        const text = await res.text();

        const fixedHtml = text.replace(
          "<head>",
          `<head>
            <base href="${cleanUrl}">
          `
        );

        setHtml(fixedHtml);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }

    loadHtml();
  }, [url]);

  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center text-zinc-500">
        Peta interaktif belum tersedia
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!html) {
    return (
      <div className="w-full h-full flex items-center justify-center text-zinc-500">
        Memuat peta interaktif...
      </div>
    );
  }

  return (
    <iframe
      title="Peta Interaktif"
      srcDoc={html}
      className="w-full h-full border-0 bg-white"
      allow="geolocation; fullscreen"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
    />
  );
}