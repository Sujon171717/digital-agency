"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell, Field, inputClass } from "@/components/AdminShell";
import { copy } from "@/lib/content";
import { createService, deleteService, listServices, updateService } from "@/lib/firestore";
import type { Service } from "@/lib/types";

const empty = { name: "", banglaName: "", englishName: "", slug: "" };

const defaultServices = copy.services.map((name) => ({
  name,
  banglaName: name,
  englishName: name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
}));

export default function ServicesAdmin() {
  const [items, setItems] = useState<Service[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function refresh() {
    const services = await listServices();
    const existingSlugs = new Set(services.map((service) => service.slug));
    const missingServices = defaultServices.filter((service) => !existingSlugs.has(service.slug));
    if (missingServices.length > 0) {
      await Promise.all(missingServices.map((service) => createService(service)));
      setItems(await listServices());
      return;
    }
    setItems(services);
  }

  useEffect(() => {
    refresh().catch((err: Error) => setError(err.message));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (editing) await updateService(editing, form);
      else await createService(form);
      setForm(empty);
      setEditing(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Services</h1>
      <p className="mt-2 text-sm text-slate-500">Manage the services shown in the public Services section. Existing services are imported automatically the first time this page loads.</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-3xl border border-slate-100 bg-white p-5 md:grid-cols-2">
        <Field label="Arabic name">
          <input className={inputClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
        </Field>
        <Field label="Bangla name">
          <input className={inputClass} required value={form.banglaName} onChange={(e) => setForm({ ...form, banglaName: e.target.value })} />
        </Field>
        <Field label="English name">
          <input className={inputClass} required value={form.englishName} onChange={(e) => setForm({ ...form, englishName: e.target.value })} />
        </Field>
        <Field label="Slug">
          <input className={inputClass} required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
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
              <th className="px-4 py-3">Arabic</th>
              <th className="px-4 py-3">Bangla</th>
              <th className="px-4 py-3">English</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.banglaName || item.name}</td>
                <td className="px-4 py-3">{item.englishName || item.name}</td>
                <td className="px-4 py-3 text-right">
                  <button className="mr-3 text-accent hover:underline" onClick={() => { setEditing(item.id); setForm({ name: item.name, banglaName: item.banglaName || item.name, englishName: item.englishName || item.name, slug: item.slug }); }}>
                    Edit
                  </button>
                  <button
                    className="text-red-300"
                    onClick={() => {
                      if (confirm("Delete this service?")) deleteService(item.id).then(refresh);
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
