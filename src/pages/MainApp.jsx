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