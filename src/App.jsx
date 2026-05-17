import { useEffect, useState } from "react";

import LoginPage from "./pages/LoginPage";
import MainApp from "./pages/MainApp";
import AdminCenter from "./pages/AdminCenter";

import Toast from "./components/mobile/Toast";

import { getCurrentUser } from "./services/auth";
import {
  getBlocks,
  getSettings,
  getMenus,
  getRoles,
  getUsers,
} from "./services/db";

import { useAppStore } from "./store/appStore";

export default function App() {
  const {
    user,
    adminOpen,
    setUser,
    setBlocks,
    setSettings,
    setMenus,
    setRoles,
    setUsers,
  } = useAppStore();

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    boot();
  }, []);

  async function boot() {
    try {
      const currentUser = await getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
      }

      setBlocks(await getBlocks());
      setSettings(await getSettings());
      setMenus(await getMenus());
      setRoles(await getRoles());
      setUsers(await getUsers());
    } catch (error) {
      console.error(error);
    }

    setCheckingAuth(false);
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        Memuat aplikasi...
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LoginPage />
        <Toast />
      </>
    );
  }

  return (
    <>
      <MainApp />
      {adminOpen && <AdminCenter />}
      <Toast />
    </>
  );
}