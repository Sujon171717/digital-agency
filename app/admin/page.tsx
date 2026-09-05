"use client";

import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";

export default function AdminHome() {
  const cards = [
    { href: "/admin/services", title: "Services", body: "Manage the services shown on the public site." },
    { href: "/admin/projects", title: "Projects", body: "Publish portfolio work with a live website link. The landing page preview is generated automatically." },
    { href: "/admin/tasks", title: "Tasks", body: "Publish work updates and campaign tasks." },
    { href: "/admin/videos", title: "Video Editing", body: "Showcase previous video editing work from YouTube or Google Drive." },
    { href: "/admin/designs", title: "Poster & Banners", body: "Add poster and banner designs from Google Drive." },
  ];

  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-slate-500">Manage everything that appears on the public site.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
