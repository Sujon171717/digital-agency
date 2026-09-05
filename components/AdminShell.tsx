"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/tasks", label: "Tasks" },
  { href: "/admin/videos", label: "Video Editing" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/designs", label: "Poster & Banners" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, configured, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [loading, user, router]);

  if (loading) return <div className="grid min-h-screen place-items-center text-slate-400">Loading admin…</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-soft text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-56 border-r border-slate-200 bg-white p-4 md:block">
        <p className="mb-8 text-xs font-semibold tracking-[0.28em] text-accent">ADMIN</p>
        <nav className="grid gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-2 ${pathname === link.href ? "bg-accent text-white" : "text-slate-600 hover:bg-soft"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button type="button" onClick={() => logout()} className="mt-8 text-sm text-slate-400 hover:text-accent">
          Sign out
        </button>
        <Link href="/" className="mt-3 block text-sm text-slate-400 hover:text-accent">
          View site
        </Link>
      </aside>
      <div className="md:pl-56">
        <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 md:hidden">
          <p className="font-semibold">Admin</p>
          <button type="button" onClick={() => logout()}>
            Sign out
          </button>
        </header>
        <div className="flex gap-2 overflow-x-auto px-4 py-3 md:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full border border-slate-200 px-3 py-1 text-xs">
              {link.label}
            </Link>
          ))}
        </div>
        {!configured ? (
          <p className="m-4 rounded-xl border border-slate-200 bg-white p-4 text-sm">
            Add Firebase keys to `.env.local` before saving data.
          </p>
        ) : null}
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-slate-600">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-accent";
