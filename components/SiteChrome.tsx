"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { brand } from "@/lib/content";
import { BrandLogo } from "./BrandLogo";
import { useLang } from "./LanguageProvider";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionLink({
  id,
  children,
  className,
  onNavigate,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (pathname === "/") {
      event.preventDefault();
      scrollToSection(id);
    }
    onNavigate?.();
  }

  return (
    <a href="/" className={className} onClick={onClick}>
      {children}
    </a>
  );
}

export function SiteHeader() {
  const { t } = useLang();
  const pathname = usePathname();
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { id: "home", label: t.navHome },
    { id: "services", label: "Services" },
    { id: "work", label: t.navProjects },
    { id: "reviews", label: "Reviews" },
    { id: "contact", label: t.navContact },
  ];

  useEffect(() => {
    if (pathname !== "/") return;
    const ids = ["home", "services", "work", "reviews", "contact"];
    const onScroll = () => {
      const next = [...ids].reverse().find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        return el.getBoundingClientRect().top <= 140;
      });
      setActive(next ?? "home");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#f7f7f3]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 py-3 sm:flex-nowrap sm:gap-4 lg:px-8">
        <SectionLink id="home" className="flex min-w-0 items-center">
          <BrandLogo className="h-9 w-auto mix-blend-multiply sm:h-11" priority />
          <span className="sr-only">{brand.legalName}</span>
        </SectionLink>
        <p className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 lg:block">Independent digital studio / KSA + BD</p>
        <div className="flex items-center gap-2 sm:order-4">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="border border-slate-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-foreground sm:hidden"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
          <SectionLink
            id="contact"
            onNavigate={() => setMenuOpen(false)}
            className="rounded-full bg-foreground px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-accent sm:px-5 sm:py-2.5 sm:text-sm"
          >
            {t.ctaPrimary}
          </SectionLink>
        </div>
        <nav
          id="site-navigation"
          className={`${menuOpen ? "flex" : "hidden"} order-3 w-full flex-col items-stretch gap-1 border-t border-slate-200 pt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 sm:order-3 sm:flex sm:w-auto sm:flex-row sm:items-center sm:gap-2 sm:border-0 sm:p-0 sm:text-[11px]`}
        >
          {links.map((link) => (
            <SectionLink
              key={link.id}
              id={link.id}
              onNavigate={() => setMenuOpen(false)}
              className={`rounded-full px-3 py-2 sm:px-4 ${
                pathname === "/" && active === link.id
                  ? "text-accent"
                  : "hover:text-accent"
              }`}
            >
              {link.label}
            </SectionLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { t } = useLang();
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-slate-100 bg-soft">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <BrandLogo className="h-12 w-auto" />
          <p className="min-w-0 text-xs leading-5 sm:text-sm">
            {brand.legalName} · {t.footerNote}
          </p>
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <SectionLink id="work" className="hover:text-accent">
            {t.navProjects}
          </SectionLink>
          <SectionLink id="contact" className="hover:text-accent">
            {t.navContact}
          </SectionLink>
          <Link href="/admin/login" className="hover:text-accent">
            {t.navAdmin}
          </Link>
        </div>
      </div>
    </footer>
  );
}
