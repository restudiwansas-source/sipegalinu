import { useState } from "react";
import { loginUser } from "../services/auth";
import { useAppStore } from "../store/appStore";

export default function Login() {
  const { setUser, setToast } = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setLoading(true);

    const result = await loginUser(email, password);

    setLoading(false);

    if (!result.success) {
      setToast(result.message);
      return;
    }

    setUser(result.user);

  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-5">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-5"
      >
        <div className="text-center">
          <h1 className="text-3xl font-black text-white">
            SIPEGALINU
          </h1>

          <p className="text-zinc-400 mt-2">
            Sistem Peta Digital Lintas User
          </p>
        </div>

        <label className="block">
          <span className="block text-sm text-zinc-400 mb-2">
            Email
          </span>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 text-white"
            placeholder="admin@sipegalinu.id"
          />
        </label>

        <label className="block">
          <span className="block text-sm text-zinc-400 mb-2">
            Password
          </span>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 text-white"
            placeholder="••••••••"
          />
        </label>

        <button
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-2xl p-4 font-black text-white"
        >
          {loading ? "Masuk..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}