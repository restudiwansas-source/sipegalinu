import { useState } from "react";
import { useAppStore } from "../../store/appStore";
import { saveMenu, deleteMenu, getMenus } from "../../services/db";

const empty = { id:"", label:"", icon:"🏠", enabled:true, order_no:10, allowed_roles:["admin"] };

export default function MenuManager() {
  const { menus, roles, setMenus, setToast } = useAppStore();
  const [form,setForm] = useState(empty);

  function edit(m) { setForm({ ...m, allowed_roles: m.allowed_roles || [] }); }

  async function save() {
    if (!form.id || !form.label) return setToast("ID dan label menu wajib diisi.");
    const result = await saveMenu(form);
    setToast(result.message);
    const data = await getMenus();
    setMenus(data);
    setForm(empty);
  }

  async function remove(id) {
    if (!confirm("Hapus menu ini?")) return;
    const result = await deleteMenu(id);
    setToast(result.message);
    setMenus(await getMenus());
  }

  function toggleRole(roleId) {
    const set = new Set(form.allowed_roles || []);
    set.has(roleId) ? set.delete(roleId) : set.add(roleId);
    setForm({ ...form, allowed_roles:[...set] });
  }

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-3">
        <h2 className="text-xl font-black">Daftar Menu</h2>
        {menus.map((m)=><div key={m.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex justify-between gap-3"><div><b>{m.icon} {m.label}</b><p className="text-xs text-zinc-400">ID: {m.id} · Order: {m.order_no} · {m.enabled ? "Aktif" : "Nonaktif"}</p><p className="text-xs text-zinc-500">Role: {(m.allowed_roles || []).join(", ")}</p></div><div className="flex gap-2"><button onClick={()=>edit(m)} className="px-3 py-2 rounded-xl bg-blue-600 text-xs font-bold">Edit</button><button onClick={()=>remove(m.id)} className="px-3 py-2 rounded-xl bg-red-600 text-xs font-bold">Hapus</button></div></div>)}
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4">
        <h2 className="text-xl font-black">Tambah / Edit Menu</h2>
        <Input label="ID Menu" value={form.id} onChange={(v)=>setForm({...form,id:v})}/>
        <Input label="Label Menu" value={form.label} onChange={(v)=>setForm({...form,label:v})}/>
        <Input label="Icon Emoji" value={form.icon} onChange={(v)=>setForm({...form,icon:v})}/>
        <Input label="Urutan" type="number" value={form.order_no} onChange={(v)=>setForm({...form,order_no:Number(v)})}/>
        <label className="flex gap-2 items-center"><input type="checkbox" checked={form.enabled} onChange={(e)=>setForm({...form,enabled:e.target.checked})}/> Aktifkan menu</label>
        <div><div className="text-xs uppercase font-black tracking-widest text-zinc-400 mb-2">Akses Role</div><div className="flex flex-wrap gap-2">{roles.map((r)=><button key={r.id} type="button" onClick={()=>toggleRole(r.id)} className={`px-3 py-2 rounded-xl text-xs font-bold ${form.allowed_roles?.includes(r.id) ? "bg-emerald-600" : "bg-zinc-800"}`}>{r.label}</button>)}</div></div>
        <button onClick={save} className="w-full bg-emerald-600 rounded-2xl p-4 font-black">Simpan Menu</button>
      </div>
    </div>
  );
}
function Input({label,value,onChange,type="text"}){return <label className="block"><span className="block text-xs uppercase font-black tracking-widest text-zinc-400 mb-2">{label}</span><input type={type} value={value} onChange={(e)=>onChange(e.target.value)} className="input-admin"/></label>}
