import Topbar from "../components/layout/Topbar.jsx";
import TabBar from "../components/layout/TabBar.jsx";
import BerandaPanel from "../components/mobile/BerandaPanel.jsx";
import MapPanel from "../components/map/MapPanel.jsx";
import PdfPanel from "../components/pdf/PdfPanel.jsx";
import DataPanel from "../components/data/DataPanel.jsx";
import ProfilePanel from "../components/mobile/ProfilePanel.jsx";
import { useAppStore } from "../store/appStore";

export default function MainApp() {
  const { activeTab } = useAppStore();
  return (
    <div className="app-shell">
      <Topbar />
      <TabBar />
      <main className="panel">
        {activeTab === "beranda" && <BerandaPanel />}
        {activeTab === "peta" && <MapPanel />}
        {activeTab === "pdf" && <PdfPanel />}
        {activeTab === "data" && <DataPanel />}
        {activeTab === "profil" && <ProfilePanel />}
      </main>
    </div>
  );
}
