import ImportWpExcel from "../components/admin/ImportWpExcel.jsx";
import { useState } from "react";
import { X, LayoutDashboard, Upload, Image, Palette, Users, Database, Menu, Shield } from "lucide-react";
import UploadBlockForm from "../components/upload/UploadBlockForm.jsx";
import BrandingPanel from "../components/admin/BrandingPanel.jsx";
import ThemePanel from "../components/admin/ThemePanel.jsx";
import MenuManager from "../components/admin/MenuManager.jsx";
import RoleManager from "../components/admin/RoleManager.jsx";
import UserManager from "../components/admin/UserManager.jsx";
import BlocksManager from "../components/admin/BlocksManager.jsx";
import { useAppStore } from "../store/appStore";
import { getSupabaseStatus } from "../services/supabase";

const menu = [
  ["importwp", Database, "Import WP"],
  ["dashboard",LayoutDashboard,"Dashboard"],
  ["upload",Upload,"Upload Blok"],
  ["branding",Image,"Branding"],
  ["theme",Palette,"Theme"],
  ["menus",Menu,"Menu Manager"],
  ["roles",Shield,"Role Manager"],
  ["users",Users,"User Manager"],
  ["blocks",Database,"Block Manager"]
];

export default function AdminCenter() {
  const [active,setActive] = useState("dashboard");
  const { setAdminOpen } = useAppStore();

  return (
    <div className="admin-overlay">
      <div className="admin-panel">
        <aside className="w-72 bg-zinc-950 border-r border-zinc-800 hidden md:flex flex-col">
          <div className="p-6 border-b border-zinc-800"><h2 className="text-2xl font-black">ADMIN CENTER</h2><p className="text-zinc-400 text-sm mt-1">SiPegaLinu Control</p></div>
          <div className="p-4 space-y-2 overflow-y-auto">{menu.map(([id,Icon,label])=><button key={id} onClick={()=>setActive(id)} className={`w-full p-4 rounded-2xl flex items-center gap-3 font-bold ${active===id ? "bg-emerald-600" : "bg-zinc-900 hover:bg-zinc-800"}`}><Icon size={18}/>{label}</button>)}</div>
        </aside>
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-18 p-5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <div><h1 className="text-xl font-black">{menu.find((m)=>m[0]===active)?.[2]}</h1><p className="text-xs text-zinc-400">Supabase: {getSupabaseStatus()}</p></div>
            <button onClick={()=>setAdminOpen(false)} className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center"><X size={20}/></button>
          </header>
          <div className="md:hidden flex gap-2 p-3 overflow-x-auto bg-zinc-900 border-b border-zinc-800">{menu.map(([id,Icon,label])=><button key={id} onClick={()=>setActive(id)} className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold ${active===id ? "bg-emerald-600" : "bg-zinc-800"}`}>{label}</button>)}</div>
          <section className="flex-1 overflow-y-auto p-5 bg-zinc-950">
            {active==="dashboard" && <Dashboard/>}
            {active==="upload" && <UploadBlockForm/>}
            {active==="branding" && <BrandingPanel/>}
            {active==="theme" && <ThemePanel/>}
            {active==="menus" && <MenuManager/>}
            {active==="roles" && <RoleManager/>}
            {active==="users" && <UserManager/>}
            {active==="blocks" && <BlocksManager/>}
            {active === "importwp" && <ImportWpExcel />}
          </section>
        </main>
      </div>
    </div>
  );
}
function Dashboard(){const {blocks,user,users,roles,menus}=useAppStore();return <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4"><AdminStat title="Total Blok" value={blocks.length}/><AdminStat title="Total User" value={users.length}/><AdminStat title="Total Role" value={roles.length}/><AdminStat title="Menu Aktif" value={menus.filter(m=>m.enabled).length}/><AdminStat title="Login" value={user?.role}/></div>}
function AdminStat({title,value}){return <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"><div className="text-zinc-400 text-xs uppercase font-black tracking-widest">{title}</div><div className="text-2xl font-black mt-3">{value}</div></div>}
