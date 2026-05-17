import { useState } from "react";
import { useAppStore } from "../../store/appStore";
import { saveSettings } from "../../services/db";

export default function ThemePanel() {
  const { settings, setSettings, setToast } = useAppStore();
  const [form,setForm] = useState(settings);

  async function save() {
    setSettings(form);
    const result = await saveSettings(form);
    setToast(result.message || "Theme tersimpan");
  }

  return (
    <div className="max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
      <h2 className="text-2xl font-black">Theme & Layout</h2>
      <p className="text-zinc-400 text-sm">Atur warna utama dan mode layout aplikasi.</p>
      <Color label="Header Color" value={form.header_color} onChange={(v)=>setForm({...form,header_color:v})}/>
      <Color label="Sidebar Color" value={form.sidebar_color} onChange={(v)=>setForm({...form,sidebar_color:v})}/>
      <Color label="Background Color" value={form.background_color} onChange={(v)=>setForm({...form,background_color:v})}/>
      <Color label="Accent Color" value={form.accent_color} onChange={(v)=>setForm({...form,accent_color:v})}/>
      <label className="block"><span className="block text-xs uppercase font-black tracking-widest text-zinc-400 mb-2">Layout Mode</span><select value={form.layout_mode} onChange={(e)=>setForm({...form,layout_mode:e.target.value})} className="input-admin"><option value="mobile_tabs">Mobile Tabs</option><option value="sidebar_desktop">Sidebar Desktop</option><option value="hybrid">Hybrid</option></select></label>
      <button onClick={save} className="w-full bg-emerald-600 rounded-2xl p-4 font-black">Simpan Theme</button>
    </div>
  );
}
function Color({label,value,onChange}){return <label className="block"><span className="block text-xs uppercase font-black tracking-widest text-zinc-400 mb-2">{label}</span><div className="flex gap-3"><input type="color" value={value || "#000000"} onChange={(e)=>onChange(e.target.value)} className="w-16 h-12 rounded-xl bg-zinc-800 border border-zinc-700"/><input value={value || ""} onChange={(e)=>onChange(e.target.value)} className="input-admin"/></div></label>}
