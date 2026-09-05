"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isFirebaseConfigured } from "@/lib/firebase";
import { getProject } from "@/lib/firestore";
import type { Project } from "@/lib/types";
import { useLang } from "./LanguageProvider";
import { SitePreview } from "./SitePreview";

export function ProjectDetail({ id }: { id: string }) {
  const { t } = useLang();
  const [project, setProject] = useState<Project | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setMissing(true);
      return;
    }
    getProject(id)
      .then((item) => {
        setProject(item);
        if (!item) setMissing(true);
      })
      .catch(() => setMissing(true));
  }, [id]);

  if (missing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <p className="text-slate-500">{t.projectsEmpty}</p>
        <Link href="/" className="mt-4 inline-block text-accent">
          ← {t.navProjects}
        </Link>
      </div>
    );
  }

  if (!project) return <div className="px-4 py-20 text-center text-slate-400">Loading…</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-sm font-medium text-slate-400 hover:text-accent">
        ← {t.navProjects}
      </Link>
      <SitePreview url={project.liveUrl} title={project.title} className="mt-8 h-80 rounded-3xl" />
      <h1 className="mt-8 text-5xl font-bold">{project.title}</h1>
      <p className="mt-5 whitespace-pre-wrap leading-8 text-slate-500">{project.description}</p>
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-[#1e8a80]"
        >
          {t.viewLive}
        </a>
      ) : null}
    </div>
  );
}
