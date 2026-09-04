"use client";

import { createContext, useContext } from "react";
import { copy } from "@/lib/content";

type Ctx = {
  t: typeof copy;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return <LanguageContext.Provider value={{ t: copy }}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
