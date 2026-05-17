import { Settings } from "lucide-react";
import { useAppStore } from "../../store/appStore";

export default function Topbar() {
  const { user, settings, setAdminOpen } = useAppStore();

  return (
    <header className="topbar safe-top" style={{ background: `linear-gradient(135deg, ${settings.header_color || "#1a3a2a"}, var(--green-mid))` }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--gold)] to-[var(--gold-light)] flex items-center justify-center shadow-md overflow-hidden">
          {settings.logo_url ? <img src={settings.logo_url} className="w-full h-full object-cover" /> : "🏛️"}
        </div>
        <div className="text-white">
          <h2 className="text-sm font-black tracking-wide leading-tight">{settings.app_name}</h2>
          <p className="text-[10px] opacity-70">{settings.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {user?.permissions?.can_branding && (
          <button onClick={() => setAdminOpen(true)} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <Settings size={17} />
          </button>
        )}
        <div className="flex items-center gap-2 bg-white/10 rounded-full py-1 pl-1 pr-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-light)] text-[var(--green-deep)] flex items-center justify-center text-xs font-black">{user?.avatar || "U"}</div>
          <span className="text-white text-xs font-bold">{user?.name?.split(" ")[0]}</span>
        </div>
      </div>
    </header>
  );
}
