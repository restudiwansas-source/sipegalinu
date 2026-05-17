import { Home, Map, FileText, Database, User } from "lucide-react";
import { useAppStore } from "../../store/appStore";

const iconMap = {
  "🏠": Home,
  "🗺️": Map,
  "📄": FileText,
  "📊": Database,
  "👤": User
};

export default function TabBar() {
  const { activeTab, setActiveTab, menus, user } = useAppStore();

  const roleKey = user?.role_key;
  const visibleMenus = menus
    .filter((m) => m.enabled !== false)
    .filter((m) => !m.allowed_roles || m.allowed_roles.includes(roleKey))
    .sort((a,b) => Number(a.order_no || 0) - Number(b.order_no || 0));

  return (
    <nav className="tabbar safe-bottom">
      {visibleMenus.map((m) => {
        const Icon = iconMap[m.icon] || Home;
        return (
          <button key={m.id} onClick={() => setActiveTab(m.id)} className={`tab-item ${activeTab === m.id ? "active" : ""}`}>
            <Icon size={18} className="mx-auto mb-1" />
            <span className="text-[10px] font-black tracking-wide">{m.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
