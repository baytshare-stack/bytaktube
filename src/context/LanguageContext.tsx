"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ar";

interface Translations {
  [key: string]: { en: string; ar: string };
}

const translations: Translations = {
  "home": { en: "Home", ar: "الرئيسية" },
  "map": { en: "Map Search", ar: "الخريطة" },
  "shorts": { en: "Shorts", ar: "فيديوهات قصيرة" },
  "saved": { en: "Saved", ar: "المحفوظات" },
  "signIn": { en: "Sign In", ar: "تسجيل الدخول" },
  "createChannel": { en: "Creator Studio", ar: "ستوديو المبدعين" },
  "logout": { en: "Log Out", ar: "تسجيل الخروج" },
  "searchPlaceholder": { en: "Search properties...", ar: "ابحث عن عقارات..." },
  "clickToLogout": { en: "Click to logout", ar: "انقر لتسجيل الخروج" },
  "yourChannel": { en: "Your Channel", ar: "قناتك" },
  "creatorStudio": { en: "Creator Studio", ar: "ستوديو المبدعين" },
  "createAgentChannel": { en: "Create an Agent Channel", ar: "إنشاء قناة وكيل عقاري" }
};

interface LanguageContextProps {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("aura_lang");
    if (saved === "ar" || saved === "en") {
      setLanguage(saved);
    } else {
      const browserLang = navigator.language;
      if (browserLang.includes("ar")) {
        setLanguage("ar");
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = language;
      localStorage.setItem("aura_lang", language);
    }
  }, [language, mounted]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "ar" : "en");
  };

  const t = (key: string): string => {
    if (!translations[key]) return key;
    return translations[key][language];
  };

  if (!mounted) return null;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
