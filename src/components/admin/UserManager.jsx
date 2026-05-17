import { useState } from "react";
import { useAppStore } from "../../store/appStore";
import { saveUser, deleteUser, getUsers } from "../../services/db";

const empty = { username:"", password:"", name:"", role_key:"petugas", avatar:"", active:true };

export default function UserManager() {
  const { users, roles, setUsers, setToast } = useAppStore();
  const [form,setForm] = useState(empty);

  async function save() {
    if (!form.username || !form.password || !form.name) return setToast("Username, password, dan nama wajib diisi.");
    const result = await saveUser(form);
    setToast(result.message);
    setUsers(await getUsers());
    setForm(empty);
  }

  async function remove(id) {
    if (!confirm("Hapus user ini?")) return;
    const result = await deleteUser(id);
    setToast(result.message);
    setUsers(await getUsers());
  }

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-3">
        <h2 className="text-xl font-black">Daftar User</h2>
        {users.map((u)=><div key={u.id || u.username} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex justify-between gap-3"><button onClick={()=>setForm(u)} className="text-left"><b>{u.name}</b><p className="text-xs text-zinc-400">@{u.username} · {u.role_key} · {u.active ? "Aktif" : "Nonaktif"}</p></button><button onClick={()=>remove(u.id)} className="px-3 py-2 rounded-xl bg-red-600 text-xs font-bold">Hapus</button></div>)}
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4">
        <h2 className="text-xl font-black">Tambah / Edit User</h2>
        <Input label="Username" value={form.username} onChange={(v)=>setForm({...form,username:v})}/>
        <Input label="Password" value={form.password || ""} onChange={(v)=>setForm({...form,password:v})}/>
        <Input label="Nama Lengkap" value={form.name} onChange={(v)=>setForm({...form,name:v})}/>
        <Input label="Avatar Huruf" value={form.avatar || ""} onChange={(v)=>setForm({...form,avatar:v})}/>
        <label className="block"><span className="block text-xs uppercase font-black tracking-widest text-zinc-400 mb-2">Role</span><select value={form.role_key} onChange={(e)=>setForm({...form,role_key:e.target.value})} className="input-admin">{roles.map((r)=><option key={r.id} value={r.id}>{r.label}</option>)}</select></label>
        <label className="flex gap-2 items-center"><input type="checkbox" checked={form.active !== false} onChange={(e)=>setForm({...form,active:e.target.checked})}/> User aktif</label>
        <button onClick={save} className="w-full bg-emerald-600 rounded-2xl p-4 font-black">Simpan User</button>
      </div>
    </div>
  );
}
function Input({label,value,onChange}){return <label className="block"><span className="block text-xs uppercase font-black tracking-widest text-zinc-400 mb-2">{label}</span><input value={value} onChange={(e)=>onChange(e.target.value)} className="input-admin"/></label>}
