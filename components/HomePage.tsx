"use client";

import { Children, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { isFirebaseConfigured } from "@/lib/firebase";
import { listCategories, listDesignAssets, listProjects, listReviews, listServices, listTasks, listVideos } from "@/lib/firestore";
import { brand } from "@/lib/content";
import type { Category, DesignAsset, Project, Review, Service, Task, VideoEntry } from "@/lib/types";
import { useLang } from "./LanguageProvider";
import { HeroPrism } from "./HeroPrism";
import { SitePreview } from "./SitePreview";
import { VideoGallery } from "./VideoGallery";
import { getDriveImageFallbackUrl, getDriveImageUrl } from "@/lib/video";

export function HomePage() {
  const { t, language } = useLang();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [designAssets, setDesignAssets] = useState<DesignAsset[]>([]);
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [active, setActive] = useState("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<DesignAsset | null>(null);

  useEffect(() => {
    if (!selectedReview && !selectedDesign) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedReview(null);
        setSelectedDesign(null);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedReview, selectedDesign]);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    Promise.all([listProjects(), listTasks(), listCategories(), listVideos(), listReviews(), listServices(), listDesignAssets()])
      .then(([p, tk, c, v, r, s, d]) => {
        setProjects(p);
        setTasks(tk.slice(0, 4));
        setCategories(c.filter((item) => item.type !== "task"));
        setVideos(v);
        setReviews(r);
        setServices(s);
        setDesignAssets(d);
      })
      .catch(() => undefined);
  }, []);

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    if (window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "";
  const visibleProjects = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.categoryId === active)),
    [projects, active],
  );
  const completedOrders = useMemo(
    () => projects.filter((project) => project.completed).length + videos.filter((video) => video.completed).length,
    [projects, videos],
  );
  const wa = `https://wa.me/${brand.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello — I would like to discuss a website or digital marketing engagement.")}`;

  return (
    <div className="overflow-x-clip">
      <section id="home" className="relative overflow-hidden border-b border-slate-200/80">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-[1.05fr_0.95fr] md:px-8 md:py-24 lg:gap-16">
          <div className="reveal-up">
            <p className="eyebrow mb-5">
              {t.heroKicker}
            </p>
            <h1 className={`font-display max-w-3xl leading-[0.98] text-foreground ${language !== "en" ? "text-4xl sm:text-[2.8rem] md:text-[3.5rem] lg:text-[4rem]" : "text-5xl sm:text-[3.4rem] md:text-[4.4rem] lg:text-[5rem]"}`}>
              {t.heroTitle}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 md:text-lg md:leading-8">{t.heroBody}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-accent"
              >
                {t.ctaPrimary}
              </a>
              <a
                href="#work"
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="border-b border-foreground/30 px-1 py-2 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
              >
                {t.ctaSecondary}
              </a>
            </div>
          </div>
          <div className="relative reveal-up [animation-delay:140ms]">
            <div className="blob -right-8 top-6 h-80 w-80 opacity-80" />
            <HeroPrism />
            <div className="absolute left-0 top-8 border border-foreground/10 bg-[#f7f7f3]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] shadow-sm">Web</div>
            <div className="absolute right-0 top-16 border border-foreground/10 bg-[#f7f7f3]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] shadow-sm">Ads</div>
            <div className="absolute bottom-10 left-6 border border-foreground/10 bg-[#f7f7f3]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] shadow-sm">SEO</div>
            <div className="absolute bottom-16 right-8 border border-foreground/10 bg-[#f7f7f3]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] shadow-sm">Brand</div>
          </div>
        </div>
        <div className="flex justify-center pb-12 text-center md:pb-16">
          <div className="flex flex-col items-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Track record</p>
            <CountUp value={completedOrders} />
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Completed orders</p>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-slate-100 bg-soft py-3">
        <p className="marquee whitespace-nowrap text-xs tracking-[0.45em] uppercase text-slate-400">
          {` ${brand.legalName} · Websites · Paid media · SEO · Brand · ${brand.tagline} · `.repeat(6)}
        </p>
      </div>

      <section id="services" className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div className="section-rule pt-5">
          <p className="eyebrow">What we do</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.03em] md:text-6xl">Built for the moment your customer decides.</h2>
          <p className="mt-5 max-w-2xl text-slate-600">{t.servicesIntro}</p>
        </div>
        <ServicesGrid services={services} />
      </section>

      <section className="mx-auto grid max-w-7xl gap-px border-y border-slate-200 bg-slate-200 md:grid-cols-3">
        <article className="bg-foreground p-8 text-white md:col-span-2 md:p-12">
          <p className="eyebrow text-accent/80">Our point of view</p>
          <h2 className={`mt-5 max-w-2xl font-semibold leading-tight ${language !== "en" ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"}`}>{t.focusTitle}</h2>
          <p className="mt-5 max-w-2xl leading-8 text-white/70">{t.focusBody}</p>
        </article>
        <article className="bg-soft p-8 md:p-12">
          <p className="eyebrow">Beyond the brief</p>
          <h2 className="mt-5 text-3xl font-semibold leading-tight">{t.legalTitle}</h2>
          <p className="mt-5 leading-8 text-slate-600">{t.legalBody}</p>
        </article>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div className="section-rule grid gap-10 pt-5 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">How we work</p>
            <h2 className={`mt-4 font-semibold leading-tight tracking-[-0.03em] ${language !== "en" ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"}`}>{t.teamTitle}</h2>
          </div>
          <p className={`max-w-2xl leading-9 text-slate-600 ${language !== "en" ? "text-base md:text-xl" : "text-xl md:text-2xl"}`}>{t.teamBody}</p>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div className="section-rule flex flex-col gap-5 pt-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className={`mt-4 font-semibold tracking-[-0.03em] ${language === "bn" ? "text-2xl md:text-4xl" : "text-3xl md:text-5xl"}`}>{t.projectsTitle}</h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-slate-500">Digital experiences, campaigns, and systems made to move a business forward.</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActive("all")}
            className={`border px-4 py-2 text-sm font-semibold ${active === "all" ? "border-accent bg-accent text-white" : "border-slate-300 text-slate-600"}`}
          >
            {t.allCategories}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActive(category.id)}
              className={`border px-4 py-2 text-sm font-semibold ${active === category.id ? "border-accent bg-accent text-white" : "border-slate-300 text-slate-600"}`}
            >
              {category.name}
            </button>
          ))}
        </div>
        {visibleProjects.length === 0 ? (
          <p className="mt-8 text-slate-400">{t.projectsEmpty}</p>
        ) : (
          <div className="mt-10">
            <CardSlider items={visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} category={categoryName(project.categoryId)} />
            ))} />
          </div>
        )}
      </section>

      {videos.length > 0 && (
        <section id="video-editing" className="mx-auto max-w-6xl px-4 pb-20">
          <p className="eyebrow">Motion and film</p>
          <h2 className={`mt-4 font-semibold tracking-[-0.03em] ${language === "bn" ? "text-2xl md:text-4xl" : "text-3xl md:text-5xl"}`}>Video Editing</h2>
          <div className="mt-8">
            <VideoGallery videos={videos} />
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section id="reviews" className="mx-auto max-w-6xl px-4 pb-20">
          <p className="eyebrow">Client perspective</p>
          <h2 className={`mt-4 font-semibold tracking-[-0.03em] ${language === "bn" ? "text-2xl md:text-4xl" : "text-4xl md:text-6xl"}`}>Reviews</h2>
          <div className="mt-8">
            <CardSlider cardClass="w-[280px] sm:w-[300px]" items={reviews.map((review) => (
              <button
                key={review.id}
                type="button"
                onClick={() => setSelectedReview(review)}
                aria-label="Open review image"
                className="group w-full max-w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={getDriveImageUrl(review.imageUrl) ?? review.imageUrl}
                  alt="Client review"
                  onError={(event) => {
                    const fallback = getDriveImageFallbackUrl(review.imageUrl);
                    if (fallback && event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
                  }}
                  className="h-52 w-full object-contain object-top"
                />
                <span className="block border-t border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 transition group-hover:text-accent">View full review</span>
              </button>
            ))} />
          </div>
        </section>
      )}

      {selectedReview ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/85 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Review image"
          onMouseDown={() => setSelectedReview(null)}
        >
          <div className="relative flex max-h-[94vh] max-w-5xl items-center justify-center" onMouseDown={(event) => event.stopPropagation()}>
            <img
              src={getDriveImageUrl(selectedReview.imageUrl) ?? selectedReview.imageUrl}
              alt="Client review enlarged"
              className="max-h-[88vh] max-w-full rounded-xl bg-white object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setSelectedReview(null)}
              aria-label="Close review image"
              className="absolute -right-2 -top-2 grid h-10 w-10 place-items-center rounded-full bg-white text-xl text-foreground shadow-lg transition hover:bg-accent hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      ) : null}

      {designAssets.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <p className="eyebrow">Visual identity</p>
          <h2 className={`mt-4 font-semibold tracking-[-0.03em] ${language !== "en" ? "text-2xl md:text-4xl" : "text-4xl md:text-6xl"}`}>Poster and Banner Design</h2>
          <div className="mt-8 grid gap-10">
            {(["poster", "banner"] as const).map((kind) => {
              const designs = designAssets.filter((asset) => asset.kind === kind);
              if (designs.length === 0) return null;
              return (
                <div key={kind}>
                  <h3 className="mb-4 text-xl font-semibold capitalize">{kind}s</h3>
                  <CardSlider items={designs.map((design) => (
                    <button
                      key={design.id}
                      type="button"
                      onClick={() => setSelectedDesign(design)}
                      aria-label={`Open ${kind} design`}
                      className="group w-full max-w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <img
                        src={getDriveImageUrl(design.imageUrl) ?? design.imageUrl}
                        alt={`${kind} design`}
                        onError={(event) => {
                          const fallback = getDriveImageFallbackUrl(design.imageUrl);
                          if (fallback && event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
                        }}
                        className="h-52 w-full object-cover"
                      />
                      <span className="block border-t border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 transition group-hover:text-accent">View full design</span>
                    </button>
                  ))} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {selectedDesign ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/85 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Design image"
          onMouseDown={() => setSelectedDesign(null)}
        >
          <div className="relative flex max-h-[94vh] max-w-5xl items-center justify-center" onMouseDown={(event) => event.stopPropagation()}>
            <img
              src={getDriveImageUrl(selectedDesign.imageUrl) ?? selectedDesign.imageUrl}
              alt={`${selectedDesign.kind} design enlarged`}
              className="max-h-[88vh] max-w-full rounded-xl bg-white object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setSelectedDesign(null)}
              aria-label="Close design image"
              className="absolute -right-2 -top-2 grid h-10 w-10 place-items-center rounded-full bg-white text-xl text-foreground shadow-lg transition hover:bg-accent hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      ) : null}

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

      <section id="contact" className="mx-auto max-w-7xl border-t border-slate-200 px-5 pb-28 pt-20 md:px-8">
        <div className="max-w-4xl">
          <p className="eyebrow">{brand.tagline}</p>
          <h2 className={`mt-5 font-display leading-[0.95] text-foreground ${language === "bn" ? "text-3xl md:text-5xl" : "text-4xl md:text-6xl"}`}>{t.contactTitle}</h2>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">{t.contactBody}</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-accent"
          >
            {t.sendWhatsApp}
          </a>
          <a
            href={`mailto:${brand.email}`}
            className="rounded-full border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-700 hover:border-accent hover:text-accent"
          >
            {t.sendEmail}
          </a>
        </div>
        <div className="mt-16 grid gap-4 border-t border-slate-200 pt-6 text-sm text-slate-600 sm:grid-cols-3">
          <p>WhatsApp: +{brand.whatsapp}</p>
          <p className="mt-2">Email: {brand.email}</p>
          <p className="mt-6 text-sm font-semibold tracking-[0.2em] uppercase text-accent">{t.heroKicker}</p>
        </div>
      </section>
    </div>
  );
}

function ServicesGrid({ services }: { services: Service[] }) {
  const { t, language } = useLang();
  const labels = services.length > 0
    ? services.map((service) => language === "ar" ? service.nameAr || service.name : language === "bn" ? service.nameBn || service.name : service.name)
    : t.services;
  return (
    <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {labels.map((label, index) => (
          <article
            key={label}
            className="group min-h-48 border border-slate-200 bg-[#fbfcf8] p-5 transition duration-300 hover:-translate-y-1 hover:border-accent hover:bg-accent hover:text-white hover:shadow-xl hover:shadow-accent/20"
          >
            <p className="text-[11px] font-semibold tracking-[0.3em] text-accent group-hover:text-white/70">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-10 max-w-xs text-lg font-semibold leading-6">{label}</h3>
            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-slate-400 group-hover:text-white/70">BST capability</p>
          </article>
      ))}
    </div>
  );
}

function CardSlider({ items, cardClass = "w-[280px] sm:w-[300px]" }: { items: ReactNode[]; cardClass?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shouldScroll = useRef(false);
  const cards = Children.toArray(items);

  useEffect(() => {
    if (!shouldScroll.current) return;
    shouldScroll.current = false;
    cardRefs.current[activeIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }, [activeIndex]);

  function move(direction: -1 | 1) {
    shouldScroll.current = true;
    setActiveIndex((current) => (current + direction + cards.length) % cards.length);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">{String(activeIndex + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => move(-1)} aria-label="Previous item" className="grid h-11 w-11 place-items-center rounded-full border border-slate-300 text-lg text-foreground transition hover:border-accent hover:bg-accent hover:text-white">←</button>
          <button type="button" onClick={() => move(1)} aria-label="Next item" className="grid h-11 w-11 place-items-center rounded-full border border-slate-300 text-lg text-foreground transition hover:border-accent hover:bg-accent hover:text-white">→</button>
        </div>
      </div>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cards.map((card, index) => (
          <div key={index} ref={(element) => { cardRefs.current[index] = element; }} className={`${cardClass} shrink-0 snap-start`}>
            {card}
          </div>
        ))}
      </div>
    </div>
  );
}

function CountUp({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const target = Math.max(value, 100);

  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    let frame = 0;
    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplayValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return <strong className="mt-2 text-6xl font-bold leading-none text-accent tabular-nums sm:text-7xl">{displayValue}+</strong>;
}

export function ProjectCard({ project, category }: { project: Project; category?: string }) {
  const { t } = useLang();

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-[#fbfcf8] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <SitePreview url={project.liveUrl} title={project.title} className="h-52" />
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-accent">
          <span>{category}</span>
          {project.featured ? <span>{t.featured}</span> : null}
        </div>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">{project.title}</h3>
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
