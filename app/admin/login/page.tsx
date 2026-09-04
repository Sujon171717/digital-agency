"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { inputClass } from "@/components/AdminShell";

export default function AdminLoginPage() {
  const { login, configured, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/admin");
  }, [loading, user, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Admin login</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in with the admin email for this site.</p>
        {!configured ? (
          <p className="mt-4 rounded-lg border border-slate-200 bg-soft p-3 text-sm text-slate-700">
            Firebase keys are missing. Copy `.env.example` to `.env.local` first.
          </p>
        ) : (
          <p className="mt-4 text-xs leading-5 text-slate-400">
            If login fails with a configuration error, enable Authentication in{" "}
            <a
              href="https://console.firebase.google.com/project/mcq-decoder/authentication/providers"
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              Firebase Console
            </a>
            , then turn on Email/Password.
          </p>
        )}
        <div className="mt-6 grid gap-4">
          <input className={inputClass} type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={inputClass} type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button disabled={busy || !configured} className="rounded-full bg-accent py-2 font-semibold text-white hover:bg-[#1e8a80] disabled:opacity-40">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
