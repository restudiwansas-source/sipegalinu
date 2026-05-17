import { useEffect } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import MainApp from "./pages/MainApp.jsx";
import AdminCenter from "./pages/AdminCenter.jsx";
import Toast from "./components/mobile/Toast.jsx";
import { useAppStore } from "./store/appStore";
import { getBlocks, getSettings, getMenus, getRoles, getUsers } from "./services/db";

export default function App() {
  const { user, adminOpen, setBlocks, setSettings, setMenus, setRoles, setUsers } = useAppStore();

  useEffect(() => {
    async function boot() {
      setBlocks(await getBlocks());
      setSettings(await getSettings());
      setMenus(await getMenus());
      setRoles(await getRoles());
      setUsers(await getUsers());
    }
    boot();
  }, [setBlocks, setSettings, setMenus, setRoles, setUsers]);

  if (!user) return <><LoginPage /><Toast /></>;

  return <><MainApp />{adminOpen && <AdminCenter />}<Toast /></>;
}
