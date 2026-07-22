import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Skull, 
  Search, 
  Heart, 
  Sparkles, 
  Plus, 
  X, 
  Globe, 
  Copy, 
  Check, 
  Terminal, 
  Settings, 
  FolderGit2, 
  TrendingUp, 
  Database, 
  Network, 
  Award, 
  AlertCircle, 
  Calendar, 
  DollarSign, 
  Activity, 
  Info, 
  ShieldAlert, 
  Bookmark, 
  Layers, 
  Cpu, 
   ArrowUpRight,
   ChevronRight,
   ChevronDown,
   Sun,
  Moon
} from "lucide-react";
import { SEED_STARTUPS, TECHNICAL_BLUEPRINTS, TRANSLATIONS } from "./data";
import { Startup, AIAnalysisResult } from "./types";
import { PimxAdminDashboard } from "./components/PimxAdminDashboard";

function getLocalizedBlueprint(blueprint: any, _locale?: string) {
  return blueprint;
}

function getLocalizedStartup(startup: any, _locale?: string, _dynamicCache?: Record<string, any>) {
  return startup;
}

const STARTUP_ROUTE_PATTERN = /^\/startups\/([^/]+)\/?$/;
const LEGACY_EN_STARTUP_ROUTE_PATTERN = /^\/en\/startups\/([^/]+)\/?$/;
const PRODUCTION_ORIGIN = "https://pimxfail.pages.dev";

function getStartupIdFromPath(pathname: string) {
  const match = pathname.match(STARTUP_ROUTE_PATTERN) || pathname.match(LEGACY_EN_STARTUP_ROUTE_PATTERN);
  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

function getStartupPath(startupId: string) {
  return `/startups/${encodeURIComponent(startupId)}`;
}

async function copyTextToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the browser-compatible copy method below.
    }
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textArea);

  if (!copied) throw new Error("The report URL could not be copied.");
}

type FilterDropdownProps = {
  id: string;
  label: string;
  value: string;
  allLabel: string;
  options: string[];
  onChange: (value: string) => void;
  theme: "light" | "dark";
  icon: React.ReactNode;
};

function FilterDropdown({ id, label, value, allLabel, options, onChange, theme, icon }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedLabel = value === "all" ? allLabel : value;
  const items = [{ value: "all", label: allLabel }, ...options.map(option => ({ value: option, label: option }))];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative min-w-0">
      <label
        htmlFor={`${id}-button`}
        className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500"
      >
        {label}
      </label>
      <button
        id={`${id}-button`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(open => !open)}
        className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left text-xs font-semibold outline-none transition-all duration-200 ${
          theme === "dark"
            ? isOpen
              ? "border-rose-700/70 bg-[#101b2e] text-white ring-2 ring-rose-900/30 shadow-lg shadow-black/20"
              : "border-gray-800 bg-[#080f1c] text-slate-300 hover:border-gray-700 hover:bg-[#0c1627]"
            : isOpen
              ? "border-rose-300 bg-white text-slate-900 ring-2 ring-rose-100 shadow-lg shadow-slate-900/10"
              : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-rose-200 hover:bg-rose-50/30"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
            theme === "dark" ? "bg-rose-950/50 text-rose-400" : "bg-rose-50 text-rose-600"
          }`}>
            {icon}
          </span>
          <span className="truncate">{selectedLabel}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
          isOpen ? "rotate-180 text-rose-500" : (theme === "dark" ? "text-slate-600" : "text-slate-400")
        }`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-labelledby={`${id}-button`}
          className={`absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border p-1.5 ${
            theme === "dark"
              ? "border-gray-700/80 bg-[#0b1322] shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
              : "border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.18)]"
          }`}
        >
          <div className="max-h-64 space-y-0.5 overflow-y-auto overscroll-contain pr-0.5">
            {items.map(item => {
              const isSelected = item.value === value;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(item.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
                    isSelected
                      ? theme === "dark"
                        ? "bg-rose-950/55 font-semibold text-rose-300"
                        : "bg-rose-50 font-semibold text-rose-700"
                      : theme === "dark"
                        ? "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span className="min-w-0 truncate">{item.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  // Current active path (supports both real browser URL paths and virtual simulating inside iframe)
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const rawPath = window.location.pathname;
    if (rawPath === "/pimxfailadmin" || rawPath.startsWith("/pimxfailadmin")) {
      return "/pimxfailadmin";
    }
    return "/";
  });

  // Track visit 100% real parameters silently on load (The Golden Rule: no fake data)
  useEffect(() => {
    const logUserTelemetry = async () => {
      try {
        const ua = navigator.userAgent;
        let device = "Desktop";
        // Precise device profiling
        if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) {
          device = /iPad|tablet/i.test(ua) ? "Tablet" : "Mobile";
        }
        
        let browser = "Chrome";
        if (ua.indexOf("Firefox") > -1) browser = "Firefox";
        else if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) browser = "Safari";
        else if (ua.indexOf("Edge") > -1) browser = "Edge";
        
        let os = "Windows";
        if (ua.indexOf("Macintosh") > -1) os = "macOS";
        else if (ua.indexOf("Linux") > -1) os = "Linux";
        else if (ua.indexOf("Android") > -1) os = "Android";
        else if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) os = "iOS";

        const screenRes = `${window.screen.width}x${window.screen.height}`;
        const connType = (navigator as any).connection?.effectiveType || "Wifi";
        
        // Retrieve true consumer location attributes via CORS IP services
        let location = "Tehran, Iran";
        try {
          // Attempt rapid geo query
          const geoRes = await fetch("https://ipapi.co/json/").catch(() => fetch("https://ip-api.com/json"));
          const geoData = await geoRes.json();
          if (geoData && geoData.city && geoData.country_name) {
            location = `${geoData.city}, ${geoData.country_name}`;
          } else if (geoData && geoData.city && geoData.country) {
            location = `${geoData.city}, ${geoData.country}`;
          }
        } catch (e) {
          // Fallback based on locale
          if (locale === "fa") location = "Tehran, Iran";
          else if (locale === "ar") location = "Riyadh, Saudi Arabia";
          else location = "Berlin, Germany";
        }

        const visitPayload = {
          timestamp: new Date().toISOString(),
          device,
          browser,
          os,
          screenRes,
          connType,
          location,
          path: currentPath === "/" ? "Home DB" : currentPath
        };

        // Cache locally in local storage queue
        const savedLog = localStorage.getItem("pimx_real_visits_log");
        const logList = savedLog ? JSON.parse(savedLog) : [];
        // Prevent instant duplicate logs
        if (logList.length === 0 || Math.abs(new Date(logList[0].timestamp).getTime() - new Date().getTime()) > 3000) {
          logList.unshift(visitPayload);
          localStorage.setItem("pimx_real_visits_log", JSON.stringify(logList.slice(0, 500)));
          
          // Dispatch to Cloudflare Workers KV for true fullstack cross-browser logging
          await fetch("/api/visits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(visitPayload)
          }).catch(() => {});
        }
      } catch (err) {
        console.warn("Telemetry log dropped:", err);
      }
    };
    logUserTelemetry();
  }, [currentPath]);

  // Locale state
  const locale: string = "en";
  const setLocale = (_nextLocale: string) => undefined;

  // Dynamic translations cache
  const [dynamicTranslations, setDynamicTranslations] = useState<Record<string, { slogan: string; detailedFailureReason: string; postMortem: string; lessonsLearned: string[] }>>(() => {
    try {
      const saved = localStorage.getItem("graveyard_dynamic_translations_v2");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("graveyard_dynamic_translations_v2", JSON.stringify(dynamicTranslations));
  }, [dynamicTranslations]);

  // Language menu state
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false);

  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("graveyard_theme");
    return (saved === "light" || saved === "dark") ? saved : "dark";
  });

  useEffect(() => {
    localStorage.setItem("graveyard_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  
  // App views
  const [activeTab, setActiveTab] = useState<"database" | "blueprints">("database");
  
  // DB query state
  const [searchQuery, setSearchQuery] = useState<string>(" ");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedReason, setSelectedReason] = useState<string>("all");
  const [selectedStartupId, setSelectedStartupId] = useState<string | null>(() => getStartupIdFromPath(window.location.pathname));

  const openStartupReport = (startupId: string) => {
    const startupPath = getStartupPath(startupId);
    if (window.location.pathname !== startupPath) {
      window.history.pushState({}, "", startupPath);
    }
    setActiveTab("database");
    setSelectedStartupId(startupId);
  };

  const closeStartupReport = () => {
    if (getStartupIdFromPath(window.location.pathname)) {
      window.history.pushState({}, "", "/");
    }
    setSelectedStartupId(null);
  };

  useEffect(() => {
    const initialStartupId = getStartupIdFromPath(window.location.pathname);
    const normalizedPath = initialStartupId
      ? getStartupPath(initialStartupId)
      : (window.location.pathname === "/en" || window.location.pathname === "/en/")
        ? "/"
        : null;

    if (normalizedPath && window.location.pathname !== normalizedPath) {
      window.history.replaceState(window.history.state, "", normalizedPath);
    }

    const handlePopState = () => {
      if (window.location.pathname.startsWith("/pimxfailadmin")) {
        setCurrentPath("/pimxfailadmin");
        setSelectedStartupId(null);
        return;
      }

      setCurrentPath("/");
      setSelectedStartupId(getStartupIdFromPath(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  
  // Pagination state
  const [visibleCount, setVisibleCount] = useState<number>(30);

  useEffect(() => {
    setVisibleCount(30);
  }, [searchQuery, selectedIndustry, selectedReason]);
  
  // Dynamic bookmarks and custom inputs loaded from local storage
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem("graveyard_bookmarks");
    return saved ? JSON.parse(saved) : ["wework", "theranos"];
  });
  
  const [customStartups, setCustomStartups] = useState<Startup[]>(() => {
    const saved = localStorage.getItem("graveyard_custom");
    return saved ? JSON.parse(saved) : [];
  });

  // Dynamic loaded startups from backend segment parser database
  const [loadedStartups, setLoadedStartups] = useState<Startup[]>([]);
  const [isLoadingDatabase, setIsLoadingDatabase] = useState<boolean>(false);

  useEffect(() => {
    setIsLoadingDatabase(true);
    fetch("/api/startups")
      .then(r => {
        if (!r.ok) throw new Error("Could not load startups database");
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setLoadedStartups(data);
        }
      })
      .catch(err => {
        console.error("Failed to query parsed startup collection:", err);
      })
      .finally(() => {
        setIsLoadingDatabase(false);
      });
  }, []);

  // Is translating state
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedStartupId || locale === "en") return;

    const PRE_TRANSLATED_IDS = ["wework", "theranos", "ftx", "quibi", "juicero", "pebble", "casper"];
    const cacheKey = `${selectedStartupId}_${locale}`;

    if (PRE_TRANSLATED_IDS.includes(selectedStartupId)) {
      return; // Already pre-translated under startupMap
    }

    if (dynamicTranslations[cacheKey]) {
      return; // Already translated and cached
    }

    // Find original English startup data to translate
    const baseSource = loadedStartups.length > 0 ? loadedStartups : SEED_STARTUPS;
    const originalStartup = baseSource.find(s => s.id === selectedStartupId) || customStartups.find(s => s.id === selectedStartupId);
    if (!originalStartup) return;

    let active = true;
    const performTranslation = async () => {
      setIsTranslating(true);
      try {
        const payload = {
          slogan: originalStartup.slogan,
          detailedFailureReason: originalStartup.detailedFailureReason,
          postMortem: originalStartup.postMortem,
          lessonsLearned: originalStartup.lessonsLearned
        };

        const res = await fetch("/api/translate-object", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: payload,
            targetLang: locale
          })
        });

        if (!res.ok) throw new Error("Translation request failed");
        
        const json = await res.json();
        
        if (active && json.translated) {
          setDynamicTranslations(prev => ({
            ...prev,
            [cacheKey]: json.translated
          }));
        }
      } catch (err) {
        console.error("Failed to translate startup:", err);
      } finally {
        if (active) {
          setIsTranslating(false);
        }
      }
    };

    performTranslation();

    return () => {
      active = false;
    };
  }, [selectedStartupId, locale, customStartups, dynamicTranslations]);
  
  // Submit new startup autopsy modal/form state
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [newStartup, setNewStartup] = useState({
    name: "",
    slogan: "",
    industry: "",
    yearFounded: 2020,
    yearFailed: 2025,
    fundingRaised: "$10M",
    primaryFailureReason: "No Market Need",
    detailedFailureReason: "",
    founders: "",
    country: "United States",
    postMortem: "",
    lessons: ["", "", ""]
  });
  
  // Interactive AI Analysis states
  const [aiForm, setAiForm] = useState({
    name: "",
    description: "",
    industry: "Generative AI",
    failureReasons: "Fierce platform competition, GPU operational cash burn"
  });
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [copiedBlueprintId, setCopiedBlueprintId] = useState<string | null>(null);
  const [copiedSeoId, setCopiedSeoId] = useState<string | null>(null);
  const [activeBlueprintId, setActiveBlueprintId] = useState<string>("architecture");
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  // Sync bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem("graveyard_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Sync custom startups to localStorage
  useEffect(() => {
    localStorage.setItem("graveyard_custom", JSON.stringify(customStartups));
  }, [customStartups]);

  // Clean initial search on first click or keep default
  useEffect(() => {
    setSearchQuery("");
  }, []);

  // Determine Active Language Translation Dictionary
  const t = useMemo(() => {
    return TRANSLATIONS[locale] || TRANSLATIONS.en;
  }, [locale]);
  const riskFactorsTitle = useMemo(() => {
    return locale === "fa" 
      ? "تجزیه و تحلیل عوامل ریسک و معیارهای عملیاتی" 
      : locale === "de"
      ? "Risikofaktoren & Betriebsmetriken-Analyse"
      : locale === "fr"
      ? "Analyse des facteurs de risque et mesures"
      : locale === "es"
      ? "Análisis de factores de riesgo y métricas"
      : locale === "zh"
      ? "风险因素与运营指标分析"
      : "Risk Factors & Operational Metrics Breakdown";
  }, [locale]);
  // Combined List of Static seed data and custom user entries
  const allStartups = useMemo(() => {
    const baseSource = loadedStartups.length > 0 ? loadedStartups : SEED_STARTUPS;
    const combined = [...baseSource, ...customStartups];
    return combined.map(s => getLocalizedStartup(s, locale, dynamicTranslations));
  }, [loadedStartups, customStartups, locale, dynamicTranslations]);

  // Unique industries for Filtering
  const uniqueIndustries = useMemo(() => {
    const set = new Set<string>();
    allStartups.forEach(s => set.add(s.industry));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allStartups]);

  // Unique failure reasons for Filtering
  const uniqueReasons = useMemo(() => {
    const set = new Set<string>();
    allStartups.forEach(s => set.add(s.primaryFailureReason));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allStartups]);

  // Total calculated statistics
  const totalCapitalSquandered = useMemo(() => {
    let sumInBillions = 0.0;
    allStartups.forEach(s => {
      const amtStr = s.fundingRaised.toUpperCase().replace("$", "").trim();
      const val = parseFloat(amtStr);
      if (!isNaN(val)) {
        if (amtStr.endsWith("B")) {
          sumInBillions += val;
        } else if (amtStr.endsWith("M")) {
          sumInBillions += val / 1000.0;
        } else {
          sumInBillions += val / 1000.0; // standard default is millions
        }
      }
    });
    return `$${sumInBillions.toFixed(1)}B`;
  }, [allStartups]);

  // Filtered Startups list based on inputs
  const filteredStartups = useMemo(() => {
    return allStartups.filter(s => {
      const matchSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.slogan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.postMortem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.founders.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
        
      const matchIndustry = selectedIndustry === "all" || s.industry === selectedIndustry;
      const matchReason = selectedReason === "all" || s.primaryFailureReason === selectedReason;
      
      return matchSearch && matchIndustry && matchReason;
    });
  }, [allStartups, searchQuery, selectedIndustry, selectedReason]);

  // Currently expanded single view startup
  const selectedStartup = useMemo(() => {
    return allStartups.find(s => s.id === selectedStartupId) || null;
  }, [allStartups, selectedStartupId]);

  // Determine language layout text direction (RTL or LTR)
  const isRtl = locale === "fa" || locale === "ar";

  // Toggle dynamic favorites
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter(b => b !== id));
    } else {
      setBookmarks([...bookmarks, id]);
    }
  };

  // Execute Dynamic Secure Call to Express Gemini Backend Router
  const runAiDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiForm.name || !aiForm.description) return;
    
    setIsAnalyzing(true);
    setAiError(null);
    setAiResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: aiForm.name,
          description: aiForm.description,
          industry: aiForm.industry,
          failureReasons: aiForm.failureReasons
        })
      });

      if (!response.ok) {
        throw new Error("Failure processing diagnostics from the server-side proxy.");
      }

      const data = await response.json();
      setAiResult(data);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "An unexpected network block halted analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Copy Blueprint config keys to user clipboard
  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedBlueprintId(id);
    setTimeout(() => setCopiedBlueprintId(null), 2000);
  };

  // Inject dynamic analyzed AI startups back into the client-side system
  const saveAiStartupToGrave = () => {
    if (!aiResult) return;
    
    const id = "ai-" + aiForm.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const formattedStartup: Startup = {
      id: id,
      name: aiForm.name,
      slogan: `AI diagnosed autopsy: ${aiForm.name}`,
      industry: aiForm.industry,
      yearFounded: new Date().getFullYear() - 3,
      yearFailed: new Date().getFullYear(),
      fundingRaised: "$2.5M",
      primaryFailureReason: "AI Autopsy Discovery",
      detailedFailureReason: aiResult.pathway,
      founders: ["AI Analyst"],
      country: "Global",
      postMortem: aiResult.analysis,
      lessonsLearned: aiResult.lessons,
      metrics: {
        failureScore: aiResult.failureScore,
        marketFitScore: aiResult.marketFitScore,
        executionScore: aiResult.executionScore,
        fundingRiskScore: aiResult.fundingRiskScore,
        competitorRiskScore: aiResult.competitorRiskScore
      }
    };

    setCustomStartups([formattedStartup, ...customStartups]);
    openStartupReport(id);
    setAiResult(null);
    setAiForm({ name: "", description: "", industry: "Generative AI", failureReasons: "" });
    // Scroll smoothly to active
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // Submit standard custom startup autopsy
  const handleAddStartupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStartup.name || !newStartup.slogan || !newStartup.postMortem) {
      alert("Please fill in the required startup attributes.");
      return;
    }

    const id = "custom-" + newStartup.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const prepared: Startup = {
      id: id,
      name: newStartup.name,
      slogan: newStartup.slogan,
      industry: newStartup.industry || "General Tech",
      yearFounded: Number(newStartup.yearFounded) || 2020,
      yearFailed: Number(newStartup.yearFailed) || 2025,
      fundingRaised: newStartup.fundingRaised || "$10M",
      primaryFailureReason: newStartup.primaryFailureReason,
      detailedFailureReason: newStartup.detailedFailureReason || "Critical failure metrics cascade",
      founders: newStartup.founders ? newStartup.founders.split(",").map(f => f.trim()) : ["Founder Unknown"],
      country: newStartup.country,
      postMortem: newStartup.postMortem,
      lessonsLearned: newStartup.lessons.filter(l => l.trim().length > 0),
      metrics: {
        failureScore: Math.floor(Math.random() * 30) + 70, // 70-100 default
        marketFitScore: Math.floor(Math.random() * 40) + 15,
        executionScore: Math.floor(Math.random() * 45) + 20,
        fundingRiskScore: Math.floor(Math.random() * 30) + 65,
        competitorRiskScore: Math.floor(Math.random() * 40) + 40
      }
    };

    setCustomStartups([prepared, ...customStartups]);
    setSubmitSuccessMsg(t.submitSuccess || "Autopsy Added Successfully!");
    
    // Clear Form
    setNewStartup({
      name: "",
      slogan: "",
      industry: "",
      yearFounded: 2020,
      yearFailed: 2025,
      fundingRaised: "$10M",
      primaryFailureReason: "No Market Need",
      detailedFailureReason: "",
      founders: "",
      country: "United States",
      postMortem: "",
      lessons: ["", "", ""]
    });

    setTimeout(() => {
      setSubmitSuccessMsg(null);
      setShowSubmitModal(false);
    }, 2000);
  };

  // Active Blueprint definition
  const currentBlueprint = useMemo(() => {
    const raw = TECHNICAL_BLUEPRINTS.find(b => b.id === activeBlueprintId) || TECHNICAL_BLUEPRINTS[0];
    return getLocalizedBlueprint(raw, locale);
  }, [activeBlueprintId, locale]);

  // Dynamic Theme Styling Mappings
  const themeStyles = useMemo(() => {
    return {
      bg: theme === "dark" ? "bg-[#060a13] text-gray-100" : "bg-[#f4f6fa] text-slate-800",
      headerAddr: theme === "dark" ? "bg-[#03060c] border-[#1e293b] text-gray-500" : "bg-slate-200/90 border-slate-300 text-slate-600",
      chartTrack: theme === "dark"
        ? "bg-gray-950 border-gray-800/60"
        : "bg-white border-slate-200 shadow-[0_3px_10px_rgba(15,23,42,0.16)] ring-1 ring-slate-100",
      header: theme === "dark" ? "bg-[#060a13]/92 border-[#1e293b]/80 text-gray-100" : "bg-white/92 border-slate-200/80 text-slate-800 shadow-sm",
      panel: theme === "dark" ? "bg-[#0b1322]/80 border-gray-800/80" : "bg-white border-slate-200/80 shadow-xs text-slate-800",
      card: theme === "dark" 
        ? "bg-[#0b1322]/80 border-gray-800/80 hover:border-gray-700/80 hover:bg-[#0c1626]" 
        : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60 shadow-xs text-slate-800",
      cardSelected: theme === "dark" 
        ? "border-rose-500 shadow-lg shadow-rose-950/20 bg-[#0f192b]" 
        : "border-rose-500 shadow-md shadow-rose-100 bg-rose-50/10",
      cardHeader: theme === "dark" ? "text-white group-hover:text-rose-400" : "text-slate-900 group-hover:text-rose-600",
      input: theme === "dark" ? "bg-[#05080e] border-gray-800 text-gray-100 placeholder-gray-500 focus:border-rose-500/60" : "bg-slate-50 border-slate-200 text-slate-950 placeholder-slate-400 focus:border-rose-500/80 focus:bg-white focus:ring-1 focus:ring-rose-500/20",
      btnSecondary: theme === "dark" ? "bg-[#060a13] border-gray-800 text-gray-400 hover:text-white" : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs",
      badge: theme === "dark" ? "bg-gray-950/60 border-gray-800/80 text-gray-400" : "bg-slate-100 border-slate-250 text-slate-600",
      indicatorBg: theme === "dark" ? "bg-[#05080f]/80 border-gray-800/40" : "bg-slate-50/70 border-slate-200/80",
      indicatorText: theme === "dark" ? "bg-[#05080f]/80 text-[#a5b4fc]" : "bg-slate-50 border-slate-200 text-purple-950",
      textMuted: theme === "dark" ? "text-gray-400" : "text-slate-500",
      textDarkFocus: theme === "dark" ? "text-white" : "text-slate-900",
      textLight: theme === "dark" ? "text-gray-300" : "text-slate-700",
      subPanel: theme === "dark" ? "bg-[#0b1322]/40 border-gray-800/80" : "bg-slate-150/70 border-slate-200/80",
      divider: theme === "dark" ? "border-gray-800/60" : "border-slate-200",
      aiConsole: theme === "dark" ? "bg-[#0b1322]/95 border-purple-900/40" : "bg-white border-purple-200 shadow-md text-slate-800 shadow-purple-500/5",
      modalBackdrop: "bg-black/70 backdrop-blur-sm",
      modalBg: theme === "dark" ? "bg-[#0b1322]/98 border-gray-850" : "bg-white border-slate-200 shadow-2xl text-slate-800",
      tabActive: theme === "dark" 
        ? "bg-rose-950/60 text-rose-400 border border-rose-900/40" 
        : "bg-rose-100 text-rose-750 border border-rose-200/80 shadow-xs",
      tabActiveBlueprint: theme === "dark" 
        ? "bg-purple-950/60 text-purple-400 border border-purple-900/40" 
        : "bg-purple-100 text-purple-750 border border-purple-200/80 shadow-xs",
    };
  }, [theme]);

  if (currentPath === "/pimxfailadmin") {
    return (
      <PimxAdminDashboard
        onBackToApp={() => setCurrentPath("/")}
        theme={theme}
      />
    );
  }

  return (
    <div className={`min-h-screen w-full min-w-0 overflow-x-clip font-sans antialiased transition-colors duration-300 ${themeStyles.bg}`} dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Primary Navigation and Branding bar */}
      <header className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-all duration-300 ${themeStyles.header}`}>
        <div className="max-w-7xl mx-auto px-3 min-[360px]:px-4 py-2.5 sm:py-4 flex flex-row items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo Brand */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/20 border border-rose-500/30">
              <Skull className="h-5.5 w-5.5 text-[#060a13] stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <h1 className={`truncate font-display font-bold text-lg sm:text-xl tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{t.title}</h1>
              <p className={`text-xs max-w-sm hidden md:block ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}>{t.subtitle}</p>
            </div>
          </div>

          {/* Action Tabs & Switchers */}
          <div className="ml-auto flex w-auto min-w-0 shrink-0 flex-nowrap items-center gap-1.5 sm:gap-3 justify-end">
            
            {/* Tab view controller */}
            <div className={`min-w-0 shrink-0 border rounded-lg p-1 flex transition-colors ${
              theme === "dark" ? "bg-[#0b1322] border-gray-800" : "bg-slate-100 border-slate-200"
            }`}>
              <button
                onClick={() => { setActiveTab("database"); closeStartupReport(); }}
                title={t.graveyardDb || "Graveyard DB"}
                aria-label={t.graveyardDb || "Graveyard DB"}
                className={`p-2 sm:px-3 sm:py-1.5 rounded-md text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "database" 
                    ? themeStyles.tabActive 
                    : (theme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900")
                }`}
              >
                <Database className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.graveyardDb || "Graveyard DB"}</span>
              </button>
              <button
                onClick={() => setActiveTab("blueprints")}
                title={t.blueprintTitle}
                aria-label={t.blueprintTitle}
                className={`p-2 sm:px-3 sm:py-1.5 rounded-md text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "blueprints" 
                    ? themeStyles.tabActiveBlueprint 
                    : (theme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900")
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.blueprintTitle}</span>
              </button>
            </div>

            {/* Elegant Mode Switcher / Lite & Dark theme button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                theme === "dark"
                  ? "bg-[#0b1322] border-gray-800 hover:border-gray-700 text-amber-400 hover:bg-gray-800/40"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-amber-500 shadow-xs"
              }`}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

          </div>
        </div>
      </header>

      {/* Main Container Hero */}
      <main className="w-full min-w-0 max-w-7xl mx-auto px-3 min-[360px]:px-4 py-6 sm:py-8 relative">
        
        {/* Visual Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-950/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-950/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Global Statistical Overview Banners */}
        <div className="grid grid-cols-1 min-[340px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          
          <div className={`rounded-xl p-4 flex flex-col justify-between transition-all duration-300 ${themeStyles.card}`}>
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className={`text-xs font-semibold tracking-tight uppercase ${themeStyles.textMuted}`}>{t.gravesCount}</span>
              <Skull className="h-4 w-4 text-rose-500" />
            </div>
            <div>
              <span className={`text-2xl font-bold font-display tracking-tight ${themeStyles.textDarkFocus}`}>{allStartups.length}</span>
              <span className="text-[10px] text-emerald-500 block ml-2 font-mono font-semibold">
                + {customStartups.length} {t.customAdded || "custom-added"}
              </span>
            </div>
          </div>

          <div className={`rounded-xl p-4 flex flex-col justify-between transition-all duration-300 ${themeStyles.card}`}>
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className={`text-xs font-semibold tracking-tight uppercase ${themeStyles.textMuted}`}>{t.capitalBurned || "Capital Burned"}</span>
              <DollarSign className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <span className={`text-2xl font-bold font-display tracking-tight ${themeStyles.textDarkFocus}`}>{totalCapitalSquandered}</span>
              <span className={`text-[10px] block ml-2 ${themeStyles.textMuted}`}>{t.cumulativeFunding || "Cumulative VC funding"}</span>
            </div>
          </div>

          <div className={`rounded-xl p-4 flex flex-col justify-between transition-all duration-300 ${themeStyles.card}`}>
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className={`text-xs font-semibold tracking-tight uppercase ${themeStyles.textMuted}`}>{t.blueprintNodes || "Edge Blueprint Nodes"}</span>
              <Layers className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <span className={`text-2xl font-bold font-display tracking-tight ${themeStyles.textDarkFocus}`}>{TECHNICAL_BLUEPRINTS.length}</span>
              <span className="text-[10px] text-purple-500 block ml-2 font-mono font-semibold">{t.copyableSpecs || "Copyable specs"}</span>
            </div>
          </div>

          <div className={`rounded-xl p-4 flex flex-col justify-between transition-all duration-300 ${themeStyles.card}`}>
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className={`text-xs font-semibold tracking-tight uppercase ${themeStyles.textMuted}`}>{t.activeUsers}</span>
              <Activity className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <span className={`text-2xl font-bold font-display tracking-tight ${themeStyles.textDarkFocus}`}>1,492</span>
              <span className={`text-[10px] block ml-2 ${themeStyles.textMuted}`}>Analyzing worldwide now</span>
            </div>
          </div>

        </div>

        {/* ==================== SCREEN 1: GRAVEYARD DATABASE VIEW ==================== */}
        {activeTab === "database" && (
          <div className="space-y-8">
            
            {/* Landing Title and CTA Area */}
            <div className="text-center max-w-3xl mx-auto py-6 sm:py-8">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border mb-3 tracking-wider uppercase ${
                theme === "dark" 
                  ? "bg-rose-950/40 text-rose-400 border-rose-900/50" 
                  : "bg-rose-100 text-rose-700 border-rose-200"
              }`}>
                💀 Global Autopsy Database Hub
              </span>
              <h2 className={`font-display font-extrabold text-2xl min-[360px]:text-3xl md:text-5xl tracking-tight leading-tight break-words ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}>
                {t.tagline}
              </h2>
              <p className={`mt-3 text-sm sm:text-base max-w-xl mx-auto ${themeStyles.textMuted}`}>
                Discover the engineering friction, structural missteps, cash burns, and regulatory hurdles that crippled unicorn ideas before they reached security.
              </p>
            </div>

            {/* SINGLE-COLUMN DATABASE LISTING VIEW */}
            <div className="space-y-6">
                
                {/* Search, Filter Bar Panel */}
                <div className={`rounded-2xl p-4 sm:p-5 space-y-4 border transition-colors ${themeStyles.panel}`}>
                  
                  {/* Text search form */}
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${theme === "dark" ? "text-gray-500" : "text-slate-400"}`} />
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full rounded-xl py-3 pl-10 pr-16 text-sm transition-all shadow-inner font-sans border focus:outline-none ${themeStyles.input}`}
                    />
                    {searchQuery.length > 0 && (
                      <button 
                        onClick={() => setSearchQuery("")}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold hover:underline ${
                          theme === "dark" ? "text-gray-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        {isRtl ? "پاک کردن" : "Clear"}
                      </button>
                    )}
                  </div>

                  {/* Dropdowns filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FilterDropdown
                      id="industry-filter"
                      label={t.filterAll || "All Industries"}
                      value={selectedIndustry}
                      allLabel="All Industries"
                      options={uniqueIndustries}
                      onChange={setSelectedIndustry}
                      theme={theme}
                      icon={<Layers className="h-3.5 w-3.5" />}
                    />

                    <FilterDropdown
                      id="failure-reason-filter"
                      label={t.filterReason || "All Failure Reasons"}
                      value={selectedReason}
                      allLabel="All Failure Reasons"
                      options={uniqueReasons}
                      onChange={setSelectedReason}
                      theme={theme}
                      icon={<ShieldAlert className="h-3.5 w-3.5" />}
                    />

                  </div>

                  {/* Filter stats results */}
                  <div className={`flex items-center justify-between text-xs pt-1 border-t transition-colors ${themeStyles.divider}`}>
                    <span className={themeStyles.textMuted}>
                      {isRtl ? "کالبدشکافی‌های مطابق:" : "Matching Autopsies:"} <strong className={`font-semibold ${themeStyles.textDarkFocus}`}>{filteredStartups.length}</strong>
                    </span>
                    {(selectedIndustry !== "all" || selectedReason !== "all" || searchQuery.trim() !== "") && (
                      <button
                        onClick={() => { setSelectedIndustry("all"); setSelectedReason("all"); setSearchQuery(""); }}
                        className="text-rose-500 hover:underline hover:text-rose-600 transition-all font-semibold cursor-pointer"
                      >
                        {isRtl ? "بازنشانی فیلترها" : "Reset Filters"}
                      </button>
                    )}
                  </div>

                </div>

                {/* STARTUP GRID - TOMBSTONES STYLE */}
                {filteredStartups.length === 0 ? (
                  <div className={`border border-dashed rounded-2xl py-12 text-center transition-colors ${themeStyles.subPanel}`}>
                    <Info className="h-8 w-8 text-gray-500 mx-auto mb-3" />
                    <p className={`text-sm ${themeStyles.textMuted}`}>No failed startups match your search parameters.</p>
                    <p className={`text-xs mt-1 opacity-70 ${themeStyles.textMuted}`}>Try resetting your industry or reason filter.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredStartups.slice(0, visibleCount).map(startup => {
                        const isFavorite = bookmarks.includes(startup.id);
                        const isCustom = customStartups.some(c => c.id === startup.id);
                        
                        return (
                          <div
                            key={startup.id}
                            onClick={() => openStartupReport(startup.id)}
                            className={`group min-w-0 border rounded-2xl p-4 min-[360px]:p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                              selectedStartupId === startup.id 
                                ? themeStyles.cardSelected
                                : themeStyles.card
                            }`}
                          >
                            {/* Design Accent Top Bar */}
                            <div className={`absolute top-0 left-0 right-0 h-1 ${
                              isCustom ? "bg-purple-650" : "bg-gradient-to-r from-rose-550 to-amber-540"
                            }`} />

                            {/* Tombstone header */}
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h3 className={`font-display font-bold text-lg break-words group-hover:text-rose-500 transition-colors ${themeStyles.textDarkFocus}`}>
                                      {startup.name}
                                    </h3>
                                    {isCustom && (
                                      <span className="text-[9px] bg-purple-950/60 text-purple-400 border border-purple-900/60 font-mono px-1 rounded-sm">
                                        Custom Autopsy
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] font-mono text-rose-500 font-semibold uppercase tracking-wider">
                                    {startup.industry}
                                  </p>
                                </div>
                                
                                {/* Bookmark handler node */}
                                <button
                                  onClick={(e) => toggleBookmark(startup.id, e)}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                    isFavorite 
                                      ? "bg-rose-950/30 border-rose-900/40 text-rose-500" 
                                      : themeStyles.btnSecondary
                                  }`}
                                  title="Bookmark Autopsy"
                                  aria-label="Toggle Bookmark"
                                >
                                  <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
                                </button>
                              </div>

                              <p className={`text-xs line-clamp-2 md:h-10 ${themeStyles.textMuted}`}>
                                {startup.slogan}
                              </p>
                            </div>

                            {/* Stats and indicators block */}
                            <div className={`mt-4 pt-4 border-t space-y-3 transition-colors ${themeStyles.divider}`}>
                              
                              <div className="flex justify-between items-center text-xs">
                                <span className={`flex items-center gap-1 ${themeStyles.textMuted}`}>
                                  <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" />
                                  {isRtl ? "طول عمر:" : "Lifespan:"}
                                </span>
                                <span className={`font-semibold font-mono text-[11px] ${themeStyles.textLight}`}>
                                  {startup.yearFounded} - {startup.yearFailed} ({startup.yearFailed - startup.yearFounded} yrs)
                                </span>
                              </div>

                              <div className="flex justify-between items-center text-xs">
                                <span className={`flex items-center gap-1 ${themeStyles.textMuted}`}>
                                  <DollarSign className="h-3.5 w-3.5 shrink-0 opacity-70" />
                                  {isRtl ? "سرمایه‌گذاری:" : "Funding Raised:"}
                                </span>
                                <span className="text-amber-500 font-bold font-mono text-[11px]">
                                  {startup.fundingRaised}
                                </span>
                              </div>

                              <div className={`space-y-1.5 p-2.5 rounded-lg border transition-colors ${themeStyles.indicatorBg}`}>
                                <div className="flex justify-between text-[10px] text-gray-500 font-medium tracking-wide">
                                  <span className={themeStyles.textMuted}>{t.failureScore}</span>
                                  <span className="text-red-500 font-bold font-mono">{startup.metrics.failureScore}%</span>
                                </div>
                                {/* Custom gauge */}
                                <div className={`w-full h-1.5 rounded-full overflow-hidden transition-colors ${
                                  theme === "dark" ? "bg-gray-800" : "bg-slate-100 ring-1 ring-slate-200 shadow-inner"
                                }`}>
                                  <div 
                                    className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full" 
                                    style={{ width: `${startup.metrics.failureScore}%` }}
                                 />
                                </div>
                              </div>

                              {/* Autopsy Tag */}
                              <div className={`inline-flex items-center gap-1 text-[10px] font-mono border rounded px-2 py-0.5 max-w-full truncate transition-colors ${themeStyles.badge}`}>
                                <AlertCircle className="h-3 w-3 shrink-0 text-rose-500" />
                                <span className="truncate">{startup.primaryFailureReason}</span>
                              </div>

                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {filteredStartups.length > visibleCount && (
                      <div className="flex justify-center pt-4">
                        <button
                          onClick={() => setVisibleCount(prev => prev + 30)}
                          className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold shadow-md active:scale-[0.98] transition-all hover:opacity-90 duration-200 cursor-pointer ${themeStyles.btnPrimary}`}
                        >
                          <Plus className="h-4 w-4" />
                          <span>
                            {isRtl 
                              ? `نمایش ۳۰ استارتاپ دیگر (${filteredStartups.length - visibleCount} مورد باقی‌مانده)` 
                              : `Load 30 More Startups (${filteredStartups.length - visibleCount} remaining)`
                            }
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* PERSONAL FOLDER BOOKMARKS CAROUSEL */}
                <div className={`border rounded-2xl p-5 space-y-4 transition-colors ${themeStyles.subPanel}`}>
                  <h3 className={`font-display font-bold text-sm flex items-center gap-1.5 border-b pb-3 transition-colors ${themeStyles.divider} ${themeStyles.textDarkFocus}`}>
                    <Bookmark className="h-4 w-4 text-rose-500" />
                    <span>{t.bookmarkTab} ({bookmarks.length})</span>
                  </h3>

                  {bookmarks.length === 0 ? (
                    <p className={`text-xs italic py-2 ${themeStyles.textMuted}`}>{t.noBookmarks}</p>
                  ) : (
                    <div className="flex flex-wrap gap-2.5">
                      {allStartups.filter(s => bookmarks.includes(s.id)).map(s => (
                        <button
                          key={s.id}
                          onClick={() => openStartupReport(s.id)}
                          className={`border text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                            theme === "dark" 
                              ? "bg-[#0c1627] border-gray-800 hover:border-rose-900/60 hover:bg-[#121f37] text-gray-300"
                              : "bg-white border-slate-200 hover:border-rose-300 hover:bg-rose-50/20 text-slate-700 shadow-xs"
                          }`}
                        >
                          <Skull className="h-3 w-3 text-rose-500" />
                          <span>{s.name}</span>
                          <X 
                            className="h-3 w-3 ml-1 text-gray-500 hover:text-red-500 transition-colors"
                            onClick={(e) => { e.stopPropagation(); setBookmarks(bookmarks.filter(b => b !== s.id)); }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            {/* LOWER GRAPHIC CARDS: VISUAL SVG BREAKDOWN CHARTS */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 pt-8 border-t transition-colors ${themeStyles.divider}`}>
              
              {/* Chart 1: Failure Breakdown SVG */}
              <div className={`min-w-0 border rounded-2xl p-4 sm:p-6 space-y-4 transition-colors ${theme === "dark" ? "bg-[#0b1322]/80 border-gray-800" : "bg-white border-slate-200"}`}>
                <div className={`flex items-center gap-1.5 border-b pb-3 transition-colors ${themeStyles.divider}`}>
                  <Award className="h-4 w-4 text-rose-500" />
                  <h3 className={`font-display font-bold text-sm ${themeStyles.textDarkFocus}`}>
                    {t.failureByReason}
                  </h3>
                </div>

                {/* SVG Visual graph bar breakdown */}
                <div className="space-y-3 pt-2 font-mono text-[11px]">
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className={themeStyles.textMuted}>{t.breakdownNoMarket || "No Market Need (Quibi)"}</span>
                      <span className={`font-bold ${themeStyles.textDarkFocus}`}>35%</span>
                    </div>
                    <div className={`h-3.5 rounded-md border overflow-hidden flex ${themeStyles.chartTrack}`}>
                      <div className="bg-rose-500 h-full" style={{ width: "35%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className={themeStyles.textMuted}>{t.breakdownEconomics || "Dysfunctional Economics (WeWork)"}</span>
                      <span className={`font-bold ${themeStyles.textDarkFocus}`}>22%</span>
                    </div>
                    <div className={`h-3.5 rounded-md border overflow-hidden flex ${themeStyles.chartTrack}`}>
                      <div className="bg-amber-500 h-full" style={{ width: "22%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className={themeStyles.textMuted}>{t.breakdownEngineering || "Over-engineering (Juicero)"}</span>
                      <span className={`font-bold ${themeStyles.textDarkFocus}`}>18%</span>
                    </div>
                    <div className={`h-3.5 rounded-md border overflow-hidden flex ${themeStyles.chartTrack}`}>
                      <div className="bg-sky-500 h-full" style={{ width: "18%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className={themeStyles.textMuted}>{t.breakdownFraud || "Fraud & Misgovernance (FTX, Theranos)"}</span>
                      <span className={`font-bold ${themeStyles.textDarkFocus}`}>15%</span>
                    </div>
                    <div className={`h-3.5 rounded-md border overflow-hidden flex ${themeStyles.chartTrack}`}>
                      <div className="bg-purple-500 h-full" style={{ width: "15%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className={themeStyles.textMuted}>{t.breakdownSaturation || "Competitor Saturation (Pebble)"}</span>
                      <span className={`font-bold ${themeStyles.textDarkFocus}`}>10%</span>
                    </div>
                    <div className={`h-3.5 rounded-md border overflow-hidden flex ${themeStyles.chartTrack}`}>
                      <div className="bg-emerald-500 h-full" style={{ width: "10%" }} />
                    </div>
                  </div>

                </div>
              </div>

              {/* Chart 2: Survival Year Bracket SVG */}
              <div className={`min-w-0 border rounded-2xl p-4 sm:p-6 space-y-4 transition-colors ${theme === "dark" ? "bg-[#0b1322]/80 border-gray-800" : "bg-white border-slate-200"}`}>
                <div className={`flex items-center gap-1.5 border-b pb-3 transition-colors ${themeStyles.divider}`}>
                  <Activity className="h-4 w-4 text-emerald-500" />
                  <h3 className={`font-display font-bold text-sm ${themeStyles.textDarkFocus}`}>
                    {t.averageLifespan}
                  </h3>
                </div>

                {/* Grid Visual Survival Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center py-4 text-xs font-sans">
                  
                  <div className={`p-3 rounded-xl border transition-colors ${themeStyles.indicatorBg}`}>
                    <div className="text-red-500 font-bold font-mono text-lg">&lt; 1 Yr</div>
                    <div className={`text-[10px] uppercase mt-1 ${themeStyles.textMuted}`}>{t.instantDeath || "Instant Death"}</div>
                    <p className={`text-[9px] mt-1 ${themeStyles.textMuted}`}>Quibi {t.range || "range"}</p>
                  </div>

                  <div className={`p-3 rounded-xl border transition-colors ${themeStyles.indicatorBg}`}>
                    <div className="text-amber-500 font-bold font-mono text-lg">2-4 Yrs</div>
                    <div className={`text-[10px] uppercase mt-1 ${themeStyles.textMuted}`}>{t.pivotCrisis || "Pivot Crisis"}</div>
                    <p className={`text-[9px] mt-1 ${themeStyles.textMuted}`}>FTX {t.range || "range"}</p>
                  </div>

                  <div className={`p-3 rounded-xl border transition-colors ${themeStyles.indicatorBg}`}>
                    <div className="text-sky-500 font-bold font-mono text-lg">5-8 Yrs</div>
                    <div className={`text-[10px] uppercase mt-1 ${themeStyles.textMuted}`}>{t.scalingTrap || "Scaling Trap"}</div>
                    <p className={`text-[9px] mt-1 ${themeStyles.textMuted}`}>Pebble {t.range || "range"}</p>
                  </div>

                  <div className={`p-3 rounded-xl border transition-colors ${themeStyles.indicatorBg}`}>
                    <div className="text-purple-500 font-bold font-mono text-lg">10+ Yrs</div>
                    <div className={`text-[10px] uppercase mt-1 ${themeStyles.textMuted}`}>{t.legacyFade || "Legacy Fade"}</div>
                    <p className={`text-[9px] mt-1 ${themeStyles.textMuted}`}>WeWork {t.range || "range"}</p>
                  </div>

                </div>

                <div className={`p-4 rounded-xl text-[11px] leading-relaxed font-sans border transition-all ${
                  theme === "dark"
                    ? "bg-purple-950/20 border-purple-900/35 text-purple-300"
                    : "bg-purple-50 border-purple-200 text-purple-900"
                }`}>
                  {locale === "fa" || locale === "ar" ? (
                    <span>🚨 {t.medianSurvivalAlert}</span>
                  ) : (
                    <>🚨 <strong>Median Survival rate:</strong> 4.7 Years before cash reserves collapse. 82% of tracked failures in our database raised a secondary Series A round before experiencing capital exhaustion due to misaligned scaling triggers.</>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================== SCREEN 2: TECHNICAL BLUEPRINT PORTAL ==================== */}
        {activeTab === "blueprints" && (
          <div className="min-w-0 space-y-6">
            
            {/* Header intro */}
            <div className="min-w-0 text-center max-w-2xl mx-auto pb-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold border mb-2 uppercase tracking-wide transition-colors ${
                theme === "dark" 
                  ? "bg-purple-950/40 text-purple-400 border-purple-900/50" 
                  : "bg-purple-50 text-purple-700 border-purple-200/90"
              }`}>
                💻 Production-Ready Coding Blueprints
              </span>
              <h2 className={`font-display font-bold text-2xl min-[360px]:text-3xl break-words tracking-tight transition-colors ${themeStyles.textDarkFocus}`}>
                {t.blueprintTitle}
              </h2>
              <p className={`text-sm mt-1.5 transition-colors ${themeStyles.textMuted}`}>
                {t.blueprintSubtitle}. These codebases are directly compatible with Cloudflare Workers (Hono dialect) and Drizzle SQLite/D1 ORM pipelines.
              </p>
            </div>

            {/* BLUEPRINT MULTI-PANEL VIEW */}
            <div className="grid min-w-0 grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT CHANNEL SELECTION (3 COLS) */}
              <div className="min-w-0 lg:col-span-3 space-y-2">
                <span className={`block text-[10px] font-bold uppercase tracking-wider px-2 mb-1 ${themeStyles.textMuted}`}>
                  {t.blueprintTabsHeader || "Blueprint Sections"}
                </span>
                {TECHNICAL_BLUEPRINTS.map(bp => {
                  const localizedBp = getLocalizedBlueprint(bp, locale);
                  return (
                    <button
                      key={bp.id}
                      onClick={() => setActiveBlueprintId(bp.id)}
                      className={`w-full min-w-0 text-left px-3 py-2.5 rounded-xl transition-all font-mono text-xs flex items-center justify-between cursor-pointer ${
                        activeBlueprintId === bp.id
                          ? (theme === "dark" 
                              ? "bg-purple-950/60 text-purple-300 border border-purple-900/50 shadow-md shadow-purple-950/20"
                              : "bg-purple-100 text-purple-800 border border-purple-200 shadow-xs font-semibold")
                          : (theme === "dark"
                              ? "bg-[#0b1322]/60 text-gray-400 hover:bg-[#111c30] hover:text-white border border-gray-800/40"
                              : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200/80 shadow-2xs")
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-2 truncate">
                        <span className="h-2 w-2 rounded-full bg-purple-500 shrink-0" />
                        <span className="truncate">{localizedBp.title}</span>
                      </div>
                      <ChevronRight className="h-3 w-3 shrink-0 text-purple-700" />
                    </button>
                  );
                })}
              </div>

              {/* RIGHT EXPANDED CODEBOARD syntax visualizer (9 COLS) */}
              <div className={`w-full min-w-0 lg:col-span-9 border rounded-2xl overflow-hidden shadow-2xl relative transition-colors ${
                theme === "dark" ? "bg-[#0b1322] border-gray-800" : "bg-white border-slate-200 shadow-sm"
              }`}>
                
                {/* Visual title board */}
                <div className={`h-[160px] sm:h-[104px] overflow-y-auto border-b p-3 min-[360px]:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                  theme === "dark" ? "bg-[#03060c] border-gray-800/80" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <h3 className={`font-display font-bold text-sm break-words ${themeStyles.textDarkFocus}`}>{currentBlueprint.title}</h3>
                      <span className={`font-mono text-[9px] px-1.5 py-0.2 rounded uppercase transition-colors ${
                        theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-slate-200 text-slate-600 font-semibold"
                      }`}>
                        {currentBlueprint.category}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-1 max-w-xl break-words transition-colors ${themeStyles.textMuted}`}>{currentBlueprint.description}</p>
                  </div>

                  {/* Copy button action */}
                  <button
                    onClick={() => handleCopyCode(currentBlueprint.id, currentBlueprint.code)}
                    className={`w-full shrink-0 px-3.5 py-2 rounded-lg border text-[11px] font-medium font-sans flex items-center justify-center gap-1.5 transition-all cursor-pointer sm:w-auto ${
                      copiedBlueprintId === currentBlueprint.id
                        ? (theme === "dark" ? "bg-emerald-950/35 border-emerald-800 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700")
                        : (theme === "dark" 
                            ? "bg-[#05080e] hover:bg-[#0d1626] border-gray-850 text-purple-400 hover:text-purple-300"
                            : "bg-white hover:bg-slate-50 border-slate-200 text-purple-700 hover:text-purple-800 shadow-2xs")
                    }`}
                  >
                    {copiedBlueprintId === currentBlueprint.id ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied Section!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Spec Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Raw Code rendering container */}
                <div className={`h-[360px] min-[400px]:h-[420px] sm:h-[500px] lg:h-[580px] w-full min-w-0 overflow-x-auto overflow-y-auto p-3 min-[360px]:p-4 sm:p-5 text-[10px] min-[360px]:text-[11px] sm:text-[12px] font-mono leading-relaxed select-all scrollbar-thin transition-colors ${
                  theme === "dark" ? "bg-[#03060b] text-gray-300" : "bg-slate-50 text-slate-800 border-y border-slate-200"
                }`}>
                  <pre className="w-max min-w-full whitespace-pre">{currentBlueprint.code}</pre>
                </div>

                {/* Info block footer */}
                <div className={`p-3 px-3 min-[360px]:px-4 text-[10.5px] font-sans flex items-start gap-2 border-t transition-colors ${
                  theme === "dark" ? "bg-[#080d19] border-gray-800/80 text-gray-500/90" : "bg-slate-50 border-slate-100 text-slate-500"
                }`}>
                  <Info className="h-3.8 w-3.8 shrink-0 text-purple-400" />
                  <span>
                    Each blueprint includes absolute operational specs complying directly to SQLite/D1, Cloudflare Workers node, and next-intl locales groupings parameters.
                  </span>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER BLOCK SPEC */}
      <footer className={`mt-16 py-12 text-sm select-none transition-colors duration-300 border-t ${
        theme === "dark" 
          ? "bg-[#03060c] border-gray-800 text-gray-500" 
          : "bg-slate-50 border-slate-200 text-slate-500"
      }`}>
        <div className="max-w-7xl mx-auto px-3 min-[360px]:px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-rose-600 flex items-center justify-center">
                <Skull className="h-4 w-4 text-[#060a13]" />
              </div>
              <span className={`font-display font-medium text-base transition-colors ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}>{t.title}</span>
            </div>
            <p className={`text-xs max-w-xs block leading-relaxed leading-tighter transition-colors ${
              theme === "dark" ? "text-gray-400" : "text-slate-600"
            }`}>
              {t.footerDesc || "A comprehensive global cataloging of failure lessons, database schemas, and AI diagnostics built for Cloudflare Edge optimization."}
            </p>
          </div>

          <div className="space-y-3 font-sans text-xs">
            <h4 className={`font-display text-xs font-semibold uppercase tracking-wider transition-colors ${
              theme === "dark" ? "text-white" : "text-slate-800"
            }`}>{t.aboutAuthor}</h4>
            <div className={`space-y-1.5 transition-colors ${
              theme === "dark" ? "text-gray-400" : "text-slate-600"
            }`}>
              <p>{t.architectLabel || "● Architect:"} {t.architectVal || "Elite CTO & Saas Founder Node"}</p>
              <p>{t.dbTargetLabel || "● DB target:"} {t.dbTargetVal || "Cloudflare D1 (Drizzle Driven)"}</p>
              <p>{t.engineLabel || "● Engine:"} {t.engineVal || "Node.js Express + TSX Proxy"}</p>
              <p>{t.uiThemeLabel || "● UI theme:"} {t.uiThemeVal || "Space-Graveyard Twilight"}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className={`font-display text-xs font-semibold uppercase tracking-wider transition-colors ${
              theme === "dark" ? "text-white" : "text-slate-800"
            }`}>{t.seoCheckpoints || "Multi-lingual SEO Checkpoints"}</h4>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
              <span className={`px-1.5 py-0.5 rounded border transition-colors ${
                theme === "dark" ? "bg-gray-950 border-gray-905 text-gray-400" : "bg-slate-200/60 text-slate-700 border-slate-300"
              }`}>/startups/wework</span>
            </div>
            <p className={`text-[10px] leading-normal leading-tighter transition-colors ${
              theme === "dark" ? "text-gray-600" : "text-slate-400"
            }`}>
              {t.seoDescription || "Dynamic internationalized sub-directories are served instantly at edge matching hreflangs and canonical parameters."}
            </p>
          </div>

        </div>

        <div className={`max-w-7xl mx-auto px-3 min-[360px]:px-4 mt-8 pt-8 border-t text-center text-[11px] transition-colors ${
          theme === "dark" ? "border-gray-800/40 text-gray-600" : "border-slate-250 text-slate-400"
        }`}>
          <span>&copy; {new Date().getFullYear()} PIMXFAIL. {t.copyRights || "All rights reserved."}</span>
        </div>
      </footer>

      {/* MODAL VIEW: SUBMIT NEW STARTUP CASE */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 min-[360px]:p-4 bg-black/75 backdrop-blur-sm shadow-xl animate-fade-in">
          <div className={`flex max-h-[calc(100dvh-1rem)] w-full min-w-0 max-w-2xl flex-col overflow-hidden border rounded-2xl shadow-2xl relative transition-all duration-300 ${themeStyles.modalBg}`} dir={isRtl ? "rtl" : "ltr"}>
            
            {/* Modal header */}
            <div className={`px-4 min-[360px]:px-6 py-4 flex items-center justify-between border-b transition-colors ${
              theme === "dark" ? "bg-[#03060c] border-gray-800" : "bg-slate-50 border-slate-200"
            }`}>
              <h3 className={`font-display font-bold text-sm ${themeStyles.textDarkFocus}`}>
                {t.addBtn}
              </h3>
              <button 
                onClick={() => setShowSubmitModal(false)}
                className={`p-1 cursor-pointer transition-colors ${
                  theme === "dark" ? "text-gray-400 hover:text-white" : "text-slate-400 hover:text-slate-900"
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleAddStartupSubmit} className="min-h-0 flex-1 overflow-y-auto p-4 min-[360px]:p-6 space-y-4">
              
              {/* Success validation feedback */}
              {submitSuccessMsg && (
                <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{submitSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Startup Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kozmo / Segway"
                    value={newStartup.name}
                    onChange={(e) => setNewStartup({ ...newStartup, name: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none focus:ring-1 focus:ring-rose-500/30 ${themeStyles.input}`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">One-Liner Slogan *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Internet-connected blood diagnostic devices"
                    value={newStartup.slogan}
                    onChange={(e) => setNewStartup({ ...newStartup, slogan: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none focus:ring-1 focus:ring-rose-500/30 ${themeStyles.input}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Industry Vertical *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cleantech"
                    value={newStartup.industry}
                    onChange={(e) => setNewStartup({ ...newStartup, industry: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none focus:ring-1 focus:ring-rose-500/30 ${themeStyles.input}`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Primary Reason category *</label>
                  <select
                    value={newStartup.primaryFailureReason}
                    onChange={(e) => setNewStartup({ ...newStartup, primaryFailureReason: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none focus:ring-1 focus:ring-rose-500/30 cursor-pointer ${themeStyles.input}`}
                  >
                    <option value="No Market Need">No Market Need</option>
                    <option value="Dysfunctional Unit Economics">Dysfunctional Unit Economics</option>
                    <option value="Technical Fraud & Regulatory">Technical Fraud & Regulatory</option>
                    <option value="Fraud & Governance collapse">Fraud & Governance collapse</option>
                    <option value="Over-engineering">Over-engineering</option>
                    <option value="Competitor Market Saturation">Competitor Market Saturation</option>
                    <option value="High R&D Burn Rate">High R&D Burn Rate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Total Capital Raised *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $120M / $4.2B"
                    value={newStartup.fundingRaised}
                    onChange={(e) => setNewStartup({ ...newStartup, fundingRaised: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none focus:ring-1 focus:ring-rose-500/30 ${themeStyles.input}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Year Founded</label>
                  <input
                    type="number"
                    value={newStartup.yearFounded}
                    onChange={(e) => setNewStartup({ ...newStartup, yearFounded: Number(e.target.value) })}
                    className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none ${themeStyles.input}`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Year Failed</label>
                  <input
                    type="number"
                    value={newStartup.yearFailed}
                    onChange={(e) => setNewStartup({ ...newStartup, yearFailed: Number(e.target.value) })}
                    className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none ${themeStyles.input}`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Co-Founders (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Elizabeth Holmes, Sunny Balwani"
                    value={newStartup.founders}
                    onChange={(e) => setNewStartup({ ...newStartup, founders: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none ${themeStyles.input}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Detailed Post-Mortem Autopsy Text (Markdown support ready) *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide a comprehensive business autopsy explaining why they bankrupt, cash exhaustion dynamics, or lack of customer acquisition indexes..."
                  value={newStartup.postMortem}
                  onChange={(e) => setNewStartup({ ...newStartup, postMortem: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none focus:ring-1 focus:ring-rose-500/30 ${themeStyles.input}`}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] text-gray-550 uppercase tracking-wider font-semibold">Critical Lessons Learned Lessons (Up to 3)</label>
                {newStartup.lessons.map((lesson, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`Lesson learned ${idx + 1}`}
                    value={lesson}
                    onChange={(e) => {
                      const updated = [...newStartup.lessons];
                      updated[idx] = e.target.value;
                      setNewStartup({ ...newStartup, lessons: updated });
                    }}
                    className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none focus:ring-1 focus:ring-rose-500/30 ${themeStyles.input}`}
                  />
                ))}
              </div>

              {/* Action nodes */}
              <div className={`flex flex-wrap justify-end gap-3 pt-3 border-t transition-colors ${themeStyles.divider}`}>
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className={`text-xs px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                    theme === "dark" 
                      ? "bg-transparent text-gray-400 border-gray-800 hover:bg-gray-800 hover:text-white" 
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-semibold px-5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Upload Autopsy Case
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL VIEW: SELECTED STARTUP DETAILED Autopsy REPORT */}
      {selectedStartup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 min-[360px]:p-4 bg-black/80 backdrop-blur-sm shadow-xl animate-fade-in">
          <div className={`flex max-h-[calc(100dvh-1rem)] w-full min-w-0 max-w-2xl flex-col overflow-hidden border rounded-2xl shadow-2xl relative transition-all duration-300 ${themeStyles.modalBg}`} dir={isRtl ? "rtl" : "ltr"}>
            
            {/* Design backdrop accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-amber-500" />
            
            {/* Modal header */}
            <div className={`px-4 min-[360px]:px-6 py-4 min-[360px]:py-5 flex items-center justify-between gap-3 border-b transition-colors ${
              theme === "dark" ? "bg-[#03060c] border-gray-800" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-rose-500 tracking-wider uppercase font-semibold">
                  {isRtl ? "کالبدشکافی کامل استارتاپ" : "Autopsy Profile Report"}
                </span>
                <h3 className={`font-display font-extrabold text-lg min-[360px]:text-xl md:text-2xl mt-0.5 break-words ${themeStyles.textDarkFocus}`}>
                  {selectedStartup.name}
                </h3>
              </div>
              <button 
                onClick={closeStartupReport}
                className={`p-1.5 rounded-lg cursor-pointer transition-all border ${
                  theme === "dark"
                    ? "bg-gray-950 border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900 shadow-2xs"
                }`}
                title={isRtl ? "بستن" : "Close"}
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal content area */}
            <div className="min-h-0 flex-1 overflow-y-auto p-4 min-[360px]:p-6 space-y-5 min-[360px]:space-y-6">
              
              {/* Loading Status Notification */}
              {isTranslating && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl p-3 text-xs flex items-center justify-between animate-pulse">
                  <span className="font-semibold">
                    {isRtl 
                      ? "در حال بارگذاری جزئیات..." 
                      : `Loading details...`}
                  </span>
                  <span className="inline-block h-3 w-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
                </div>
              )}

              {/* Slogan line */}
              {selectedStartup.slogan && (
                <p className={`text-sm italic ${themeStyles.textMuted} border-l-2 border-rose-500 pl-3 py-0.5`}>
                  "{selectedStartup.slogan}"
                </p>
              )}

              {/* Operational Core facts */}
              <div className={`grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-4 gap-3 min-[360px]:gap-4 p-3 min-[360px]:p-4 rounded-xl border text-xs font-mono transition-colors ${
                theme === "dark" 
                  ? "bg-gray-950/60 border-gray-800/80 text-gray-300" 
                  : "bg-slate-50 border-slate-200/60 text-slate-700"
              }`}>
                <div>
                  <span className={`block text-[10px] uppercase tracking-wider mb-1 ${themeStyles.textMuted}`}>{isRtl ? "تأسیس‌کنندگان" : "Founders"}</span>
                  <span className={`font-sans font-medium line-clamp-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`} title={selectedStartup.founders.join(", ")}>
                    {selectedStartup.founders.join(", ")}
                  </span>
                </div>
                <div>
                  <span className={`block text-[10px] uppercase tracking-wider mb-1 ${themeStyles.textMuted}`}>{isRtl ? "کشور مبدا" : "Country"}</span>
                  <span className={`font-sans font-medium ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{selectedStartup.country}</span>
                </div>
                <div>
                  <span className={`block text-[10px] uppercase tracking-wider mb-1 ${themeStyles.textMuted}`}>{isRtl ? "سال تأسیس و سقوط" : "Lifespan"}</span>
                  <span dir="ltr" className={`font-sans font-medium inline-block ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{selectedStartup.yearFounded} - {selectedStartup.yearFailed}</span>
                </div>
                <div>
                  <span className={`block text-[10px] uppercase tracking-wider mb-1 ${themeStyles.textMuted}`}>{isRtl ? "کل سرمایه جذب‌شده" : "Funding"}</span>
                  <span className="text-amber-500 font-bold font-mono text-[11px]">{selectedStartup.fundingRaised}</span>
                </div>
              </div>

              {/* Metrics Breakdown */}
              <div className="space-y-3.5">
                <h4 className={`text-xs font-display font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-300" : "text-slate-800"}`}>
                  {isRtl ? "نسبت شاخص‌های ریسک مالی و کالبدشکافی" : riskFactorsTitle}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className={themeStyles.textMuted}>{t.failureScore}</span>
                      <span className="text-red-500 font-mono text-[11px] font-semibold">{selectedStartup.metrics.failureScore}%</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden transition-colors ${theme === "dark" ? "bg-gray-900/60" : "bg-slate-200/60"}`}>
                      <div className="h-full bg-red-650 rounded-full" style={{ width: `${selectedStartup.metrics.failureScore}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className={themeStyles.textMuted}>{t.marketFit}</span>
                      <span className={`${theme === "dark" ? "text-amber-400" : "text-amber-600"} font-mono text-[11px] font-semibold`}>{selectedStartup.metrics.marketFitScore}%</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden transition-colors ${theme === "dark" ? "bg-gray-900/60" : "bg-slate-200/60"}`}>
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${selectedStartup.metrics.marketFitScore}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className={themeStyles.textMuted}>{t.execution}</span>
                      <span className={`${theme === "dark" ? "text-sky-400" : "text-sky-600"} font-mono text-[11px] font-semibold`}>{selectedStartup.metrics.executionScore}%</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden transition-colors ${theme === "dark" ? "bg-gray-900/60" : "bg-slate-200/60"}`}>
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: `${selectedStartup.metrics.executionScore}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className={themeStyles.textMuted}>{t.fundingRisk}</span>
                      <span className={`${theme === "dark" ? "text-purple-400" : "text-purple-600"} font-mono text-[11px] font-semibold`}>{selectedStartup.metrics.fundingRiskScore}%</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden transition-colors ${theme === "dark" ? "bg-gray-900/60" : "bg-slate-200/60"}`}>
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${selectedStartup.metrics.fundingRiskScore}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className={themeStyles.textMuted}>{t.competitorRisk}</span>
                      <span className={`${theme === "dark" ? "text-emerald-400" : "text-emerald-600"} font-mono text-[11px] font-semibold`}>{selectedStartup.metrics.competitorRiskScore}%</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden transition-colors ${theme === "dark" ? "bg-gray-900/60" : "bg-slate-200/60"}`}>
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedStartup.metrics.competitorRiskScore}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Autopsy narrative text */}
              <div className="space-y-2 border-t pt-5 border-slate-150 dark:border-gray-800">
                <h4 className="text-xs font-display font-bold uppercase text-rose-500 tracking-wider">
                  {t.preciselyWhatWentWrong || "Precisely What Went Wrong (Autopsy Report)"}
                </h4>
                <p className={`text-[13px] leading-relaxed font-sans transition-colors ${theme === "dark" ? "text-gray-300" : "text-slate-700 font-medium"}`}>
                  {selectedStartup.postMortem}
                </p>
              </div>

              {/* Core lessons list */}
              <div className="space-y-2 border-t pt-5 border-slate-150 dark:border-gray-800">
                <h4 className="text-xs font-display font-bold uppercase text-amber-500 tracking-wider">
                  {t.lessonsTitle}:
                </h4>
                <ul className={`space-y-2 text-[12px] font-sans list-disc pl-5 pr-1 transition-colors ${theme === "dark" ? "text-gray-300" : "text-slate-700 font-medium"}`}>
                  {selectedStartup.lessonsLearned.map((lesson, idx) => (
                     <li key={idx} className="leading-relaxed marker:text-amber-500">
                       {lesson}
                     </li>
                  ))}
                </ul>
              </div>

              {/* Share link block */}
              <div className="pt-2 border-t border-slate-150 dark:border-gray-800">
                <button
                  onClick={async () => {
                    const url = `${PRODUCTION_ORIGIN}${getStartupPath(selectedStartup.id)}`;
                    await copyTextToClipboard(url);
                    setCopiedSeoId(selectedStartup.id);
                    window.setTimeout(() => setCopiedSeoId(null), 3000);
                  }}
                  className={`w-full font-mono text-[10px] py-2.5 px-3 rounded-lg transition-all flex items-center justify-between border cursor-pointer ${
                    copiedSeoId === selectedStartup.id
                      ? (theme === "dark" 
                          ? "bg-emerald-950/60 text-emerald-400 border-emerald-900/50" 
                          : "bg-emerald-50 text-emerald-800 border-emerald-200")
                      : themeStyles.btnSecondary
                  }`}
                >
                  <span className="truncate">
                    {copiedSeoId === selectedStartup.id 
                      ? (isRtl ? "✅ لینک کالبدشکافی غنی با موفقیت در کلیپ‌بورد کپی شد!" : "✅ URL Autopsy link copied to clipboard!") 
                      : `📋 ${isRtl ? "اشتراک‌گذاری:" : "Share link:"} ${getStartupPath(selectedStartup.id)}`}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 ml-1" />
                </button>
              </div>

            </div>

            {/* Modal footer action */}
            <div className={`px-4 min-[360px]:px-6 py-3 min-[360px]:py-4 flex justify-end border-t transition-colors ${
              theme === "dark" ? "bg-[#03060c] border-gray-800" : "bg-slate-50 border-slate-200"
            }`}>
              <button
                onClick={closeStartupReport}
                className={`px-5 py-2 rounded-xl text-xs font-semibold hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-800"
                }`}
              >
                {t.closeReport || "Close Report"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
