"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell, Field, inputClass } from "@/components/AdminShell";
import { createCategory, deleteCategory, listCategories, updateCategory } from "@/lib/firestore";
import type { Category, CategoryType } from "@/lib/types";

const empty = { name: "", slug: "", type: "both" as CategoryType };

export default function CategoriesAdmin() {
  const [items, setItems] = useState<Category[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function refresh() {
    setItems(await listCategories());
  }

  useEffect(() => {
    refresh().catch((err: Error) => setError(err.message));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (editing) await updateCategory(editing, form);
      else await createCategory(form);
      setForm(empty);
      setEditing(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Categories</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-3xl border border-slate-100 bg-white p-5 md:grid-cols-2">
        <Field label="Name">
          <input className={inputClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
        </Field>
        <Field label="Slug">
          <input className={inputClass} required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </Field>
        <Field label="Used for">
          <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CategoryType })}>
            <option value="both">Projects & tasks</option>
            <option value="project">Projects only</option>
            <option value="task">Tasks only</option>
          </select>
        </Field>
        {error ? <p className="text-red-300 md:col-span-2">{error}</p> : null}
        <div className="flex gap-2 md:col-span-2">
          <button className="rounded-full bg-accent px-4 py-2 font-semibold text-white">{editing ? "Update" : "Create"}</button>
          {editing ? (
            <button type="button" className="text-slate-400" onClick={() => { setEditing(null); setForm(empty); }}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
      <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-soft text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3 text-right">
                  <button className="mr-3 text-accent hover:underline" onClick={() => { setEditing(item.id); setForm({ name: item.name, slug: item.slug, type: item.type }); }}>
                    Edit
                  </button>
                  <button
                    className="text-red-300"
                    onClick={() => {
                      if (confirm("Delete this category?")) deleteCategory(item.id).then(refresh);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
