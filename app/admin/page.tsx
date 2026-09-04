"use client";

import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";

export default function AdminHome() {
  const cards = [
    { href: "/admin/categories", title: "Categories", body: "Create groups for projects and tasks." },
    { href: "/admin/projects", title: "Projects", body: "Upload portfolio work with a live link and image." },
    { href: "/admin/tasks", title: "Tasks", body: "Publish work updates and campaign tasks." },
  ];

  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-slate-500">Manage everything that appears on the public site.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:border-accent">
            <h2 className="text-xl font-medium">{card.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{card.body}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
