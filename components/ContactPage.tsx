"use client";

import { brand } from "@/lib/content";
import { useLang } from "./LanguageProvider";

export function ContactPage() {
  const { t } = useLang();
  const wa = `https://wa.me/${brand.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello — I would like to discuss a website or digital marketing engagement.")}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <p className="text-sm font-semibold tracking-[0.2em] uppercase text-accent">{t.tagline}</p>
      <h1 className="mt-4 text-3xl font-bold md:text-5xl">{t.contactTitle}</h1>
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
        <p>{t.whatsapp}: +{brand.whatsapp}</p>
        <p className="mt-2">{t.email}: {brand.email}</p>
        <p className="mt-6 text-sm font-semibold tracking-[0.2em] uppercase text-accent">{t.heroKicker}</p>
      </div>
    </div>
  );
}
