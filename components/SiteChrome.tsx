"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { brand } from "@/lib/content";
import { BrandLogo } from "./BrandLogo";
import { useLang } from "./LanguageProvider";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", id === "home" ? "/" : `/#${id}`);
}

function SectionLink({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/") return;
    event.preventDefault();
    scrollToSection(id);
  }

  return (
    <a href={id === "home" ? "/#home" : `/#${id}`} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

export function SiteHeader() {
  const { t } = useLang();
  const pathname = usePathname();
  const [active, setActive] = useState("home");
  const links = [
    { id: "home", label: t.navHome },
    { id: "work", label: t.navProjects },
    { id: "contact", label: t.navContact },
  ];

  useEffect(() => {
    if (pathname !== "/") return;
    const ids = ["home", "work", "contact"];
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

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <SectionLink id="home" className="flex items-center">
          <BrandLogo className="h-12 w-auto sm:h-14" priority />
          <span className="sr-only">{brand.legalName}</span>
        </SectionLink>
        <nav className="flex items-center gap-1 text-sm font-medium text-slate-600 sm:gap-2">
          {links.map((link) => (
            <SectionLink
              key={link.id}
              id={link.id}
              className={`rounded-full px-4 py-2 ${
                pathname === "/" && active === link.id
                  ? "bg-accent text-white"
                  : "hover:text-accent"
              }`}
            >
              {link.label}
            </SectionLink>
          ))}
        </nav>
        <SectionLink
          id="contact"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1e8a80]"
        >
          {t.ctaPrimary}
        </SectionLink>
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
        <div className="flex items-center gap-4">
          <BrandLogo className="h-12 w-auto" />
          <p>
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
