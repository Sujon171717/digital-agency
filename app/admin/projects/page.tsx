"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell, Field, inputClass } from "@/components/AdminShell";
import { SitePreview } from "@/components/SitePreview";
import { createProject, deleteProject, listCategories, listProjects, updateProject } from "@/lib/firestore";
import type { Category, Project } from "@/lib/types";

const empty = {
  title: "",
  description: "",
  categoryId: "",
  liveUrl: "",
  featured: false,
  completed: false,
};

export default function ProjectsAdmin() {
  const [items, setItems] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const [projects, cats] = await Promise.all([listProjects(), listCategories()]);
    setItems(projects);
    setCategories(cats.filter((c) => c.type !== "task"));
  }

  useEffect(() => {
    refresh().catch((err: Error) => setError(err.message));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = { ...form, imageUrl: "" };
      if (editing) await updateProject(editing, payload);
      else await createProject(payload);
      setForm(empty);
      setEditing(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Projects</h1>
      <p className="mt-2 text-sm text-slate-500">
        Add a live website link. The public site will show a preview of that landing page automatically.
      </p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-3xl border border-slate-100 bg-white p-5 md:grid-cols-2">
        <Field label="Title">
          <input className={inputClass} required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Description">
          <textarea className={inputClass} rows={4} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <Field label="Category">
          <select className={inputClass} value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Live link">
          <input
            className={inputClass}
            type="url"
            required
            placeholder="https://"
            value={form.liveUrl}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Featured on homepage
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-4 text-sm md:col-span-2">
          <input className="h-5 w-5 accent-accent" type="checkbox" checked={form.completed} onChange={(e) => setForm({ ...form, completed: e.target.checked })} />
          <span><strong className="block text-slate-900">Completed order</strong><span className="text-slate-500">Include this project in the completed orders count.</span></span>
        </label>
        {error ? <p className="text-red-300 md:col-span-2">{error}</p> : null}
        <div className="flex gap-2 md:col-span-2">
          <button disabled={busy} className="rounded-full bg-accent px-4 py-2 font-semibold text-white disabled:opacity-40">
            {busy ? "Saving…" : editing ? "Update project" : "Create project"}
          </button>
          {editing ? (
            <button type="button" onClick={() => { setEditing(null); setForm(empty); }}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
      <div className="mt-8 grid gap-4">
        {items.map((item) => (
          <article key={item.id} className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center">
            <SitePreview url={item.liveUrl} title={item.title} className="h-20 w-full rounded-lg sm:w-32" />
            <div className="flex-1">
              <h2 className="font-medium">{item.title}</h2>
              <p className="text-sm text-slate-500">{item.liveUrl || "No live link"}</p>
              <p className={`mt-2 text-xs font-semibold uppercase tracking-[0.16em] ${item.completed ? "text-accent" : "text-slate-400"}`}>{item.completed ? "Completed order" : "In progress"}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <button
                className="text-accent hover:underline"
                onClick={() => {
                  setEditing(item.id);
                  setForm({
                    title: item.title,
                    description: item.description,
                    categoryId: item.categoryId,
                    liveUrl: item.liveUrl,
                    featured: item.featured,
                    completed: item.completed ?? false,
                  });
                }}
              >
                Edit
              </button>
              <button
                className="text-red-300"
                onClick={() => {
                  if (confirm("Delete this project?")) deleteProject(item.id).then(refresh);
                }}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
