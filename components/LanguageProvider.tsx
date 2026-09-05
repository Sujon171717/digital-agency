"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { banglaCopy, copy } from "@/lib/content";

const translations = { en: copy, bn: banglaCopy } as const;
type Language = keyof typeof translations;

type Ctx = {
  t: (typeof translations)[Language];
  language: Language;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("bst-language");
    if (stored === "bn" || stored === "en") setLanguage(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "bn" ? "bn" : "en";
    window.localStorage.setItem("bst-language", language);
  }, [language]);

  function toggleLanguage() {
    setLanguage((current) => (current === "en" ? "bn" : "en"));
  }

  return <LanguageContext.Provider value={{ t: translations[language], language, toggleLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
