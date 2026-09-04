"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell, Field, inputClass } from "@/components/AdminShell";
import { createTask, deleteTask, listCategories, listTasks, updateTask } from "@/lib/firestore";
import type { Category, Task, TaskStatus } from "@/lib/types";

const empty = {
  title: "",
  description: "",
  categoryId: "",
  status: "planned" as TaskStatus,
};

export default function TasksAdmin() {
  const [items, setItems] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function refresh() {
    const [tasks, cats] = await Promise.all([listTasks(), listCategories()]);
    setItems(tasks);
    setCategories(cats.filter((c) => c.type !== "project"));
  }

  useEffect(() => {
    refresh().catch((err: Error) => setError(err.message));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (editing) await updateTask(editing, form);
      else await createTask(form);
      setForm(empty);
      setEditing(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Tasks</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-3xl border border-slate-100 bg-white p-5 md:grid-cols-2">
        <Field label="Title">
          <input className={inputClass} required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Description">
          <textarea className={inputClass} rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
        <Field label="Status">
          <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}>
            <option value="planned">Planned</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </Field>
        {error ? <p className="text-red-300 md:col-span-2">{error}</p> : null}
        <div className="flex gap-2 md:col-span-2">
          <button className="rounded-full bg-accent px-4 py-2 font-semibold text-white">{editing ? "Update" : "Create task"}</button>
          {editing ? (
            <button type="button" onClick={() => { setEditing(null); setForm(empty); }}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
      <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-soft text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{item.title}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    className="mr-3 text-accent hover:underline"
                    onClick={() => {
                      setEditing(item.id);
                      setForm({
                        title: item.title,
                        description: item.description,
                        categoryId: item.categoryId,
                        status: item.status,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-300"
                    onClick={() => {
                      if (confirm("Delete this task?")) deleteTask(item.id).then(refresh);
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
