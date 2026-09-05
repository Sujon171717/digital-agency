"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { arabicCopy, banglaCopy, copy } from "@/lib/content";

const translations = { ar: arabicCopy, en: copy, bn: banglaCopy } as const;
type Language = keyof typeof translations;

type Ctx = {
  t: (typeof translations)[Language];
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    const stored = window.localStorage.getItem("bst-language");
    if (stored === "ar" || stored === "bn" || stored === "en") setLanguage(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("bst-language", language);
  }, [language]);

  return <LanguageContext.Provider value={{ t: translations[language], language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
