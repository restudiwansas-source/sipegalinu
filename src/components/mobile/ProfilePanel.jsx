import { useAppStore } from "../../store/appStore";

export default function ProfilePanel() {
  const { user, blocks, settings, logout } = useAppStore();
  return (
    <section className="h-full overflow-y-auto bg-[var(--cream)] pb-6">
      <div className="bg-gradient-to-br from-[var(--green-dark)] to-[var(--green-mid)] p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-light)] mx-auto flex items-center justify-center text-3xl font-black text-[var(--green-deep)] shadow-lg mb-3">{user?.avatar}</div>
        <h3 className="text-white text-xl font-black">{user?.name}</h3><p className="text-white/60 mt-1"><span className="bg-[rgba(201,168,76,.25)] text-[var(--gold-light)] rounded-full px-4 py-1 text-xs font-black">{user?.role}</span></p>
      </div>
      <Section title="Informasi Akun"><Row icon="👤" title={user?.name} sub="Nama Lengkap" /><Row icon="🔑" title={user?.role} sub="Hak Akses" /><Row icon="🏘️" title="Desa Sukapancar" sub="Wilayah Kerja" /></Section>
      <Section title="Informasi Sistem"><Row icon="📋" title={`${blocks.length} Blok`} sub="Total blok wilayah" /><Row icon="🗺️" title={settings.app_name} sub={settings.subtitle} /><Row icon="⚙️" title="SiPegaLinu V4+" sub="Foundation Plus" /></Section>
      <div className="mx-4 text-center text-xs text-[var(--text-light)] mb-3">{settings.footer_text}</div>
      <button onClick={logout} className="mx-4 w-[calc(100%-32px)] p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-black">🚪 Keluar dari Aplikasi</button>
    </section>
  );
}
function Section({title,children}) { return <div className="bg-white rounded-[24px] m-4 overflow-hidden shadow-sm"><div className="p-4 border-b border-[var(--cream-dark)] text-xs font-black text-[var(--text-light)] uppercase tracking-widest">{title}</div>{children}</div>; }
function Row({icon,title,sub}) { return <div className="p-4 flex items-center gap-3 border-b border-[var(--cream-dark)] last:border-b-0"><div className="w-10 h-10 rounded-xl bg-[var(--cream)] flex items-center justify-center">{icon}</div><div><b className="block text-[var(--text-dark)]">{title}</b><span className="text-xs text-[var(--text-light)]">{sub}</span></div></div>; }
