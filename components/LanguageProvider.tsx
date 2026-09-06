"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { copy } from "@/lib/content";

const translations = {
  en: copy,
  bn: {
    ...copy,
    navHome: "হোম", navProjects: "কাজ", navContact: "যোগাযোগ", navAdmin: "অ্যাডমিন", navServices: "সেবাসমূহ", navReviews: "পর্যালোচনা", tagline: "ওয়েবসাইট, পারফরম্যান্স মার্কেটিং ও প্রবৃদ্ধির ব্যবস্থা।",
    menuOpen: "মেনু", menuClose: "বন্ধ", headerDescriptor: "স্বাধীন ডিজিটাল স্টুডিও / KSA + BD", heroKicker: "সৌদি আরব · বাংলাদেশ",
    heroTitle: "এমন একটি পেশাদার ডিজিটাল উপস্থিতি, যা গ্রাহকদের আকৃষ্ট করে এবং ব্যবসায় জয়ী করে।", heroBody: "আমরা রূপান্তর-কেন্দ্রিক ওয়েবসাইট তৈরি করি এবং বিজ্ঞাপন, SEO, সোশ্যাল মিডিয়া ও WhatsApp অটোমেশন পরিচালনা করি।",
    ctaPrimary: "ওয়েবসাইট নিয়ে কথা বলুন", ctaSecondary: "আমাদের কাজ দেখুন", offerTitle: "ওয়েবসাইট প্যাকেজ", offerBody: "আজীবন সহায়তাসহ একটি আধুনিক পেশাদার ওয়েবসাইট।", servicesTitle: "সক্ষমতা", servicesHeadline: "আপনার গ্রাহক সিদ্ধান্ত নেওয়ার মুহূর্তের জন্য তৈরি।", servicesIntro: "বর্ধনশীল ব্যবসার জন্য সম্পূর্ণ ডিজিটাল মার্কেটিং ও অনলাইন অবকাঠামো।",
    focusTitle: "প্রধান লক্ষ্য", focusBody: "আমরা এমন একটি পরিপাটি ওয়েবসাইট তৈরি করি যা বিশ্বাসযোগ্যতা বাড়ায় এবং নতুন লিডের নির্ভরযোগ্য উৎস তৈরি করে।", teamTitle: "সীমান্ত পেরিয়ে কাজ", teamBody: "সৌদি আরব ও বাংলাদেশের বিশেষজ্ঞরা কৌশল, প্রোডাকশন ও ক্যাম্পেইন পরিচালনায় একসঙ্গে কাজ করেন।",
    legalTitle: "আইনি সহায়তা", legalBody: "প্রয়োজনে লাইসেন্সপ্রাপ্ত বাংলাদেশি আইনজীবীদের মাধ্যমে পরামর্শ ও আইনি সহায়তা।", projectsTitle: "বিদ্যমান প্রকল্প", projectsEmpty: "অ্যাডমিন প্যানেল থেকে প্রকাশিত হলে পোর্টফোলিও এখানে দেখা যাবে।", contactTitle: "আলাপ শুরু করি", contactBody: "আপনার ব্যবসার লক্ষ্য জানান। আপনার বাজার অনুযায়ী ওয়েবসাইট, ক্যাম্পেইন বা প্রবৃদ্ধির পরিকল্পনা সাজাব।",
    sendWhatsApp: "WhatsApp-এ বার্তা", sendEmail: "ইমেইল করুন", footerNote: "সৌদি আরব ও বাংলাদেশে ডিজিটাল কৌশল, ওয়েবসাইট ও পেইড মিডিয়া।", allCategories: "সব", featured: "নির্বাচিত", whatWeDo: "আমরা যা করি", pointOfView: "আমাদের দৃষ্টিভঙ্গি", beyondBrief: "ব্রিফের বাইরে", howWeWork: "আমরা যেভাবে কাজ করি", selectedWork: "নির্বাচিত কাজ", workDescription: "ব্যবসাকে এগিয়ে নিতে তৈরি ডিজিটাল অভিজ্ঞতা, ক্যাম্পেইন ও সিস্টেম।", motionFilm: "মোশন ও চলচ্চিত্র", videoEditing: "ভিডিও এডিটিং", clientPerspective: "ক্লায়েন্টের মতামত", reviews: "পর্যালোচনা", posterBannerDesign: "পোস্টার ও ব্যানার ডিজাইন", posters: "পোস্টার", banners: "ব্যানার", viewFullDesign: "সম্পূর্ণ ডিজাইন দেখুন", viewFullReview: "সম্পূর্ণ পর্যালোচনা দেখুন", trackRecord: "সাফল্যের রেকর্ড", completedOrders: "সম্পন্ন অর্ডার", workTitle: "সাম্প্রতিক কার্যক্রম", capability: "BST সক্ষমতা", previous: "আগের", next: "পরের", switchLanguage: "ভাষা",
    whatsapp: "WhatsApp", email: "ইমেইল", showLess: "কম দেখুন", seeAllProjects: "সব প্রকল্প দেখুন", viewLive: "লাইভ সাইট দেখুন", viewDetails: "কেসের বিস্তারিত", web: "ওয়েব", ads: "বিজ্ঞাপন", seo: "SEO", brand: "ব্র্যান্ড", marquee: "ওয়েবসাইট · পেইড মিডিয়া · SEO · ব্র্যান্ড", services: ["পেশাদার ওয়েবসাইট তৈরি — ১,০০০ SAR", "Facebook মার্কেটিং", "YouTube মার্কেটিং", "Instagram মার্কেটিং", "ব্র্যান্ড পরিচয় ও গ্রাফিক ডিজাইন", "ভিডিও, Reels ও বিজ্ঞাপন তৈরি", "SEO ও Google Business অপ্টিমাইজেশন", "Google, Meta, TikTok ও Snapchat বিজ্ঞাপন", "WhatsApp মার্কেটিং ও অটোমেশন", "অ্যানালিটিক্স ও মাসিক রিপোর্ট", "সম্পূর্ণ ডিজিটাল মার্কেটিং প্রোগ্রাম", "Google Business Profile সেটআপ", "বাংলাদেশি আইনজীবীদের আইনি সহায়তা"],
  },
  ar: {
    ...copy,
    navHome: "الرئيسية", navProjects: "أعمالنا", navContact: "اتصل بنا", navAdmin: "الإدارة", navServices: "خدماتنا", navReviews: "آراء العملاء", tagline: "مواقع إلكترونية وتسويق بالأداء وأنظمة نمو.",
    menuOpen: "القائمة", menuClose: "إغلاق", headerDescriptor: "استوديو رقمي مستقل / السعودية + بنغلاديش", heroKicker: "المملكة العربية السعودية · بنغلاديش",
    heroTitle: "حضور رقمي احترافي يكسب العملاء.", heroBody: "نصمم مواقع تركز على التحويل وندير التسويق الرقمي الشامل، من الإعلانات وSEO إلى وسائل التواصل وأتمتة WhatsApp، لنساعد علامتك على كسب عملاء مؤهلين.",
    ctaPrimary: "اطلب موقعاً إلكترونياً", ctaSecondary: "شاهد أعمالنا", offerTitle: "باقة الموقع الإلكتروني", offerBody: "موقع احترافي حديث مع دعم مدى الحياة.", servicesTitle: "قدراتنا", servicesHeadline: "مصمم للحظة التي يقرر فيها عميلك.", servicesIntro: "تسويق رقمي وبنية تحتية متكاملة للأعمال الطموحة.",
    focusTitle: "التركيز الأساسي", focusBody: "نقدم موقعاً أنيقاً وجاهزاً للعملاء يعزز الثقة ويخلق قناة موثوقة للعملاء المحتملين.", teamTitle: "تنفيذ عابر للحدود", teamBody: "يتعاون متخصصون في السعودية وبنغلاديش في الاستراتيجية والإنتاج وإدارة الحملات، مع تواصل واضح وتنفيذ مسؤول.",
    legalTitle: "دعم قانوني", legalBody: "استشارات ومساعدة قانونية عبر محامين بنغلاديشيين مرخصين عند حاجة عملك.", projectsTitle: "أعمالنا الحالية", projectsEmpty: "ستظهر عناصر portfolio هنا بعد نشرها من لوحة الإدارة.", contactTitle: "لنبدأ محادثة", contactBody: "أخبرنا عن أهداف عملك. سنقترح موقعاً أو حملة أو خطة نمو تناسب سوقك.",
    sendWhatsApp: "راسلنا عبر WhatsApp", sendEmail: "راسل الفريق بالبريد", footerNote: "استراتيجية رقمية ومواقع وإعلانات مدفوعة في السعودية وبنغلاديش.", allCategories: "الكل", featured: "مميز", whatWeDo: "ماذا نقدم", pointOfView: "وجهة نظرنا", beyondBrief: "أبعد من المطلوب", howWeWork: "كيف نعمل", selectedWork: "أعمال مختارة", workDescription: "تجارب رقمية وحملات وأنظمة تحرك الأعمال إلى الأمام.", motionFilm: "الحركة والفيديو", videoEditing: "تحرير الفيديو", clientPerspective: "رأي العميل", reviews: "الآراء", posterBannerDesign: "تصميم الملصقات واللافتات", posters: "ملصقات", banners: "لافتات", viewFullDesign: "عرض التصميم كاملاً", viewFullReview: "عرض الرأي كاملاً", trackRecord: "سجل الإنجاز", completedOrders: "الطلبات المكتملة", workTitle: "النشاط الأخير", capability: "قدرات BST", previous: "السابق", next: "التالي", switchLanguage: "اللغة",
    whatsapp: "WhatsApp", email: "البريد الإلكتروني", showLess: "عرض أقل", seeAllProjects: "عرض كل المشاريع", viewLive: "زيارة الموقع", viewDetails: "تفاصيل الحالة", web: "ويب", ads: "إعلانات", seo: "SEO", brand: "علامة تجارية", marquee: "مواقع · إعلانات مدفوعة · SEO · علامة تجارية", services: ["تطوير موقع احترافي — ١٬٠٠٠ SAR", "تسويق Facebook", "تسويق YouTube", "تسويق Instagram", "هوية العلامة التجارية والتصميم الجرافيكي", "إنتاج الفيديو وReels والإعلانات", "تحسين SEO وGoogle Business", "إعلانات Google وMeta وTikTok وSnapchat", "تسويق WhatsApp والأتمتة", "التحليلات والتقارير الشهرية", "برامج التسويق الرقمي الشاملة", "إعداد Google Business Profile", "دعم قانوني من محامين بنغلاديشيين"],
  },
} as const;
type Language = keyof typeof translations;

type Ctx = {
  t: (typeof translations)[Language];
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    if (isAdmin) return;
    const stored = window.localStorage.getItem("bst-language") as Language | null;
    if (stored && stored in translations) setLanguage(stored);
  }, [isAdmin]);

  const activeLanguage = isAdmin ? "en" : language;

  useEffect(() => {
    document.documentElement.lang = activeLanguage;
    document.documentElement.dir = activeLanguage === "ar" ? "rtl" : "ltr";
    if (!isAdmin) window.localStorage.setItem("bst-language", activeLanguage);
  }, [activeLanguage, isAdmin]);

  return <LanguageContext.Provider value={{ t: translations[activeLanguage], language: activeLanguage, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
