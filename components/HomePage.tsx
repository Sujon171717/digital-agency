"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { isFirebaseConfigured } from "@/lib/firebase";
import { listCategories, listProjects, listTasks } from "@/lib/firestore";
import { brand, services } from "@/lib/content";
import type { Category, Project, Task } from "@/lib/types";
import { useLang } from "./LanguageProvider";
import { HeroPrism } from "./HeroPrism";
import { ScrollGallery } from "./ScrollGallery";

export function HomePage() {
  const { t } = useLang();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [active, setActive] = useState("all");

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    Promise.all([listProjects(), listTasks(), listCategories()])
      .then(([p, tk, c]) => {
        setProjects(p);
        setTasks(tk.slice(0, 4));
        setCategories(c.filter((item) => item.type !== "task"));
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const timer = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, []);

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "";
  const visibleProjects = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.categoryId === active)),
    [projects, active],
  );
  const wa = `https://wa.me/${brand.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello — I would like to discuss a website or digital marketing engagement.")}`;

  return (
    <div className="overflow-x-clip">
      <section id="home" className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div>
            <p className="mb-4 text-sm font-semibold tracking-[0.2em] uppercase text-accent">
              {t.heroKicker}
            </p>
            <h1 className="text-5xl font-bold leading-[1.1] text-slate-900 md:text-6xl">
              Welcome <span className="text-accent">!</span>
              <span className="mt-2 block">{t.heroTitle}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">{t.heroBody}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#contact"
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  window.history.replaceState(null, "", "/#contact");
                }}
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-[#1e8a80]"
              >
                {t.ctaPrimary}
              </a>
              <a
                href="#work"
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  window.history.replaceState(null, "", "/#work");
                }}
                className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-accent hover:text-accent"
              >
                {t.ctaSecondary}
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="blob -right-8 top-6 h-80 w-80" />
            <HeroPrism />
            <div className="absolute left-2 top-8 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold shadow-md">Web</div>
            <div className="absolute right-4 top-16 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold shadow-md">Ads</div>
            <div className="absolute bottom-10 left-6 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold shadow-md">SEO</div>
            <div className="absolute bottom-16 right-8 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold shadow-md">Brand</div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-slate-100 bg-soft py-3">
        <p className="marquee whitespace-nowrap text-xs tracking-[0.45em] uppercase text-slate-400">
          {` ${brand.legalName} · Websites · Paid media · SEO · Brand · ${brand.tagline} · `.repeat(6)}
        </p>
      </div>

      <ScrollGallery />

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-4xl font-bold md:text-5xl">{t.servicesTitle}</h2>
        <p className="mt-3 max-w-2xl text-slate-500">{t.servicesIntro}</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.label} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-[11px] tracking-[0.3em] text-accent">{service.icon}</p>
              <h3 className="mt-4 text-base font-semibold leading-6">{service.label}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-3">
        <article className="rounded-3xl bg-accent p-8 text-white md:col-span-2">
          <h2 className="text-4xl font-bold">{t.focusTitle}</h2>
          <p className="mt-4 max-w-2xl leading-8 text-white/90">{t.focusBody}</p>
        </article>
        <article className="rounded-3xl bg-soft p-8">
          <h2 className="text-3xl font-bold">{t.legalTitle}</h2>
          <p className="mt-4 leading-8 text-slate-600">{t.legalBody}</p>
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm md:p-12">
          <h2 className="text-4xl font-bold">{t.teamTitle}</h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-500">{t.teamBody}</p>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-4xl font-bold md:text-5xl">{t.projectsTitle}</h2>
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
        {visibleProjects.length === 0 ? (
          <p className="mt-8 text-slate-400">{t.projectsEmpty}</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} category={categoryName(project.categoryId)} />
            ))}
          </div>
        )}
      </section>

      {tasks.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <h2 className="text-4xl font-bold">{t.workTitle}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {tasks.map((task) => (
              <article key={task.id} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-[11px] tracking-[0.28em] uppercase text-accent">{task.status.replace("_", " ")}</p>
                <h3 className="mt-3 text-xl font-semibold">{task.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{task.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section id="contact" className="mx-auto max-w-3xl px-4 pb-24">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-accent">{brand.tagline}</p>
        <h2 className="mt-4 text-5xl font-bold md:text-6xl">{t.contactTitle}</h2>
        <p className="mt-6 text-lg leading-8 text-slate-500">{t.contactBody}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-[#1e8a80]"
          >
            {t.sendWhatsApp}
          </a>
          <a
            href={`mailto:${brand.email}`}
            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-accent hover:text-accent"
          >
            {t.sendEmail}
          </a>
        </div>
        <div className="mt-12 rounded-3xl bg-soft p-8 text-slate-600">
          <p>WhatsApp: +{brand.whatsapp}</p>
          <p className="mt-2">Email: {brand.email}</p>
          <p className="mt-6 text-sm font-semibold tracking-[0.2em] uppercase text-accent">{t.heroKicker}</p>
        </div>
      </section>
    </div>
  );
}

export function ProjectCard({ project, category }: { project: Project; category?: string }) {
  const { t } = useLang();

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      {project.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.imageUrl}
          alt={project.title}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="grid h-48 place-items-center bg-soft text-xs tracking-[0.4em] text-slate-400">WORK</div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 text-[11px] tracking-[0.2em] uppercase text-accent">
          <span>{category}</span>
          {project.featured ? <span>{t.featured}</span> : null}
        </div>
        <h3 className="mt-3 text-xl font-semibold">{project.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-slate-500">{project.description}</p>
        <div className="mt-5 flex gap-4 text-sm font-medium">
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
              {t.viewLive}
            </a>
          ) : null}
          <Link href={`/projects/${project.id}`} className="text-slate-500 hover:text-accent">
            {t.viewDetails}
          </Link>
        </div>
      </div>
    </article>
  );
}
