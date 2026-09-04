"use client";

import { useEffect, useMemo, useState } from "react";
import { isFirebaseConfigured } from "@/lib/firebase";
import { listCategories, listProjects } from "@/lib/firestore";
import type { Category, Project } from "@/lib/types";
import { useLang } from "./LanguageProvider";
import { ProjectCard } from "./HomePage";

export function ProjectsPage() {
  const { t } = useLang();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [active, setActive] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    Promise.all([listProjects(), listCategories()])
      .then(([p, c]) => {
        setProjects(p);
        setCategories(c.filter((item) => item.type !== "task"));
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  const visible = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.categoryId === active)),
    [projects, active],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      <h1 className="text-5xl font-bold md:text-6xl">{t.projectsTitle}</h1>
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${active === "all" ? "bg-accent text-white" : "border border-slate-200 text-slate-600"}`}
        >
          {t.allCategories}
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActive(category.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${active === category.id ? "bg-accent text-white" : "border border-slate-200 text-slate-600"}`}
          >
            {category.name}
          </button>
        ))}
      </div>
      {error ? <p className="mt-6 text-red-500">{error}</p> : null}
      {visible.length === 0 ? (
        <p className="mt-12 text-slate-400">{t.projectsEmpty}</p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              category={categories.find((c) => c.id === project.categoryId)?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
