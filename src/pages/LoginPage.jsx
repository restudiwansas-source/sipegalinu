import { useState } from "react";
import { useAppStore } from "../store/appStore";

export default function LoginPage() {
  const { setUser, settings, users, roles } = useAppStore();
  const [role, setRole] = useState("admin");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  function pickRole(roleId) {
    setRole(roleId);
    const u = users.find((x) => x.role_key === roleId);
    if (u) {
      setUsername(u.username);
      setPassword(u.password || "");
    }
  }

  function submit(e) {
    e.preventDefault();
    const u = users.find((x) => x.username === username && x.role_key === role && x.active !== false);
    if (!u) return setError("User tidak ditemukan, role salah, atau akun nonaktif.");
    if ((u.password || "") !== password) return setError("Password salah.");
    const roleData = roles.find((r) => r.id === u.role_key);
    setUser({ ...u, role: roleData?.label || u.role_key, permissions: roleData || {} });
  }

  return (
    <div className="login-screen">
      <form onSubmit={submit} className="login-card">
        <div className="text-center mb-7">
          <div className="w-[72px] h-[72px] mx-auto rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-light)] flex items-center justify-center text-3xl shadow-lg mb-4">
            {settings.logo_url ? <img src={settings.logo_url} className="w-full h-full rounded-full object-cover" /> : "🏛️"}
          </div>
          <h1 className="text-white text-2xl font-black tracking-wide">{settings.app_name}</h1>
          <p className="text-white/50 text-xs uppercase tracking-[2px] mt-1">{settings.subtitle}</p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,.45)] to-transparent mb-7" />

        <label className="block text-white/60 text-xs font-bold tracking-widest uppercase mb-2">Username</label>
        <input className="input-dark mb-4" value={username} onChange={(e)=>setUsername(e.target.value)} />

        <label className="block text-white/60 text-xs font-bold tracking-widest uppercase mb-2">Password</label>
        <input className="input-dark mb-4" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />

        <label className="block text-white/60 text-xs font-bold tracking-widest uppercase mb-2">Akses Sebagai</label>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {roles.map((r)=>(
            <button type="button" key={r.id} onClick={()=>pickRole(r.id)} className={`p-3 rounded-xl text-xs font-bold border transition ${role===r.id ? "border-[var(--gold)] bg-[rgba(201,168,76,.16)] text-[var(--gold-light)]" : "border-white/10 bg-white/5 text-white/50"}`}>
              {r.label}
            </button>
          ))}
        </div>

        <button className="w-full p-4 rounded-xl bg-gradient-to-br from-[var(--gold)] to-[var(--gold-light)] text-[var(--green-deep)] font-black shadow-lg">MASUK →</button>
        {error && <div className="mt-4 p-3 text-center rounded-xl bg-red-500/20 text-red-200 border border-red-400/30 text-sm">{error}</div>}
        <p className="text-center text-white/30 text-xs mt-5 leading-relaxed">User demo bisa diatur dari Admin Center → User Manager.</p>
      </form>
    </div>
  );
}
