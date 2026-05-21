import { useEffect, useState } from "react";
import { runSystemDiagnostics, getLatestAppLogs } from "../../services/diagnostics";

export default function MaintenancePanel() {
  const [checks, setChecks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  async function refreshMaintenance() {
    setLoading(true);

    try {
      const result = await runSystemDiagnostics();
      setChecks(result);

      const latestLogs = await getLatestAppLogs(25);
      setLogs(latestLogs);
    } catch (error) {
      console.error("Maintenance gagal:", error);
    }

    setLoading(false);
  }

  useEffect(() => {
    refreshMaintenance();
  }, []);

  return (
    <div className="p-4 space-y-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black">🛠️ Maintenance Center</h2>
          <p className="text-xs text-zinc-400">
            Diagnostik aman tanpa menampilkan token, password, atau signed URL.
          </p>
        </div>

        <button
          onClick={refreshMaintenance}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-[var(--green-mid)] text-white text-xs font-black disabled:opacity-50"
        >
          {loading ? "Memeriksa..." : "Refresh"}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {checks.map((item) => (
          <div
            key={item.name}
            className={`rounded-2xl p-4 border ${
              item.status === "OK"
                ? "bg-green-950/40 border-green-700"
                : "bg-red-950/40 border-red-700"
            }`}
          >
            <div className="text-xs text-zinc-400">{item.name}</div>
            <div className="font-black mt-1">
              {item.status === "OK" ? "✅ Normal" : "❌ Error"}
            </div>
            <div className="text-xs mt-1 text-zinc-300">{item.message}</div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
        <div className="p-4 border-b border-zinc-800">
          <h3 className="font-black">Log Error Terakhir</h3>
          <p className="text-xs text-zinc-400">Hanya admin/superuser yang bisa membaca log.</p>
        </div>

        <div className="divide-y divide-zinc-800">
          {logs.length === 0 && (
            <div className="p-4 text-sm text-zinc-400">Belum ada log error.</div>
          )}

          {logs.map((log) => (
            <div key={log.id} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-black text-sm">
                  {log.level?.toUpperCase()} — {log.module || "unknown"}
                </div>
                <div className="text-[10px] text-zinc-500">
                  {new Date(log.created_at).toLocaleString("id-ID")}
                </div>
              </div>

              <div className="text-xs text-zinc-300 mt-1">{log.message}</div>

              {log.user_email && (
                <div className="text-[10px] text-zinc-500 mt-1">
                  User: {log.user_email}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}