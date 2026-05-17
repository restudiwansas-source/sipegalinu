import { useState } from "react";
import { useAppStore } from "../../store/appStore";
import { saveRole, getRoles } from "../../services/db";

const empty = { id:"", label:"", can_upload:false, can_branding:false, can_manage_users:false, can_manage_roles:false, can_view_all_data:false };

export default function RoleManager() {
  const { roles, setRoles, setToast } = useAppStore();
  const [form,setForm] = useState(empty);

  async function save() {
    if (!form.id || !form.label) return setToast("ID dan label role wajib diisi.");
    const result = await saveRole(form);
    setToast(result.message);
    setRoles(await getRoles());
    setForm(empty);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-3">
        <h2 className="text-xl font-black">Daftar Role</h2>
        {roles.map((r)=><button key={r.id} onClick={()=>setForm(r)} className="w-full text-left bg-zinc-950 border border-zinc-800 rounded-2xl p-4"><b>{r.label}</b><p className="text-xs text-zinc-400">ID: {r.id}</p><p className="text-xs text-zinc-500">Upload: {r.can_upload ? "Ya" : "Tidak"} · User: {r.can_manage_users ? "Ya" : "Tidak"} · Branding: {r.can_branding ? "Ya" : "Tidak"}</p></button>)}
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4">
        <h2 className="text-xl font-black">Tambah / Edit Role</h2>
        <Input label="ID Role" value={form.id} onChange={(v)=>setForm({...form,id:v})}/>
        <Input label="Nama Role" value={form.label} onChange={(v)=>setForm({...form,label:v})}/>
        <Check label="Bisa Upload Blok" checked={form.can_upload} onChange={(v)=>setForm({...form,can_upload:v})}/>
        <Check label="Bisa Edit Branding & Theme" checked={form.can_branding} onChange={(v)=>setForm({...form,can_branding:v})}/>
        <Check label="Bisa Kelola User" checked={form.can_manage_users} onChange={(v)=>setForm({...form,can_manage_users:v})}/>
        <Check label="Bisa Kelola Role" checked={form.can_manage_roles} onChange={(v)=>setForm({...form,can_manage_roles:v})}/>
        <Check label="Bisa Lihat Semua Data" checked={form.can_view_all_data} onChange={(v)=>setForm({...form,can_view_all_data:v})}/>
        <button onClick={save} className="w-full bg-emerald-600 rounded-2xl p-4 font-black">Simpan Role</button>
      </div>
    </div>
  );
}
function Input({label,value,onChange}){return <label className="block"><span className="block text-xs uppercase font-black tracking-widest text-zinc-400 mb-2">{label}</span><input value={value} onChange={(e)=>onChange(e.target.value)} className="input-admin"/></label>}
function Check({label,checked,onChange}){return <label className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-2xl p-4"><input type="checkbox" checked={!!checked} onChange={(e)=>onChange(e.target.checked)}/><span>{label}</span></label>}
