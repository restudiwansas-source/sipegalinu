import { useState } from "react";
import { FileCode2, FileText, UploadCloud } from "lucide-react";
import { uploadBlockFiles, getBlocks } from "../../services/db";
import { useAppStore } from "../../store/appStore";

export default function UploadBlockForm() {
  const [kodeBlok,setKodeBlok]=useState("");
  const [namaBlok,setNamaBlok]=useState("");
  const [htmlFile,setHtmlFile]=useState(null);
  const [pdfFile,setPdfFile]=useState(null);
  const [loading,setLoading]=useState(false);
  const { setBlocks,setToast } = useAppStore();

  async function submit(e){
    e.preventDefault();
    if(!kodeBlok || !namaBlok || !htmlFile || !pdfFile) return setToast("Lengkapi kode, nama, HTML, dan PDF.");
    setLoading(true);
    const result = await uploadBlockFiles({ kodeBlok,namaBlok,htmlFile,pdfFile });
    setLoading(false);
    setToast(result.message);
    if(result.success){
      setKodeBlok("");setNamaBlok("");setHtmlFile(null);setPdfFile(null);
      const data = await getBlocks(); setBlocks(data);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-zinc-800"><h2 className="text-2xl font-black">Upload Blok Baru</h2><p className="text-zinc-400 text-sm mt-1">1 blok wajib terdiri dari file HTML interaktif dan PDF offline.</p></div>
      <div className="p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4"><Input placeholder="Kode Blok, contoh: 001" value={kodeBlok} onChange={setKodeBlok}/><Input placeholder="Nama Blok, contoh: Blok 001 Sukapancar" value={namaBlok} onChange={setNamaBlok}/></div>
        <div className="grid md:grid-cols-2 gap-4"><FileBox icon={<FileCode2/>} title="Peta Interaktif HTML" accept=".html" file={htmlFile} onChange={setHtmlFile}/><FileBox icon={<FileText/>} title="PDF Offline" accept=".pdf" file={pdfFile} onChange={setPdfFile}/></div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex gap-4"><div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400"><UploadCloud/></div><div><h3 className="font-black">Format upload</h3><p className="text-zinc-400 text-sm mt-1">HTML masuk bucket maps, PDF masuk bucket pdfs, lalu URL otomatis tersimpan ke table blocks.</p></div></div>
        <button disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-2xl p-4 font-black">{loading ? "Uploading..." : "Upload Blok"}</button>
      </div>
    </form>
  );
}
function Input({value,onChange,placeholder}){return <input className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 outline-none" value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder}/>;}
function FileBox({icon,title,accept,file,onChange}){return <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5"><div className="flex items-center gap-3 mb-4"><div className="text-emerald-400">{icon}</div><div><h3 className="font-black">{title}</h3><p className="text-zinc-400 text-xs">Upload file {accept}</p></div></div><input type="file" accept={accept} onChange={(e)=>onChange(e.target.files?.[0] || null)} className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 text-sm"/>{file && <p className="text-emerald-400 text-sm mt-3">{file.name}</p>}</div>}
