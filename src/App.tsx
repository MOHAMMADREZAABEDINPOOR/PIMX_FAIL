import React, { useState, useEffect, useMemo } from "react";
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
  Sun,
  Moon
} from "lucide-react";
import { SEED_STARTUPS, TECHNICAL_BLUEPRINTS, TRANSLATIONS } from "./data";
import { Startup, AIAnalysisResult } from "./types";
import { PimxAdminDashboard } from "./components/PimxAdminDashboard";

function getLocalizedBlueprint(bp: any, locale: string) {
  const l = locale || "en";
  if (l === "en") return bp;

  const blueprintLocales: Record<string, Record<string, { title: string; category: string; description: string }>> = {
    fa: {
      "architecture": {
        title: "معماری سیستم",
        category: "زیرساخت لبه (Edge)",
        description: "جریان چندلایه درخواست‌های جهانی، شامل رندر لبه، پروکسی‌های مسیریاب API و حافظه‌های کش محلی بهینه‌شده برای کلودفلر."
      },
      "folder-structure": {
        title: "ساختار پوشه‌ها",
        category: "سازماندهی پایگاه کد",
        description: "ساختار آماده تولید برای مونو ریپو مبتنی بر Turborepo یا ساختار هیبریدی استاندارد شامل تنظیمات صفحات کلودفلر، ورکرز و دریزل."
      },
      "drizzle-schema": {
        title: "طرحواره دریزل (Drizzle)",
        category: "طرحواره پایگاه داده",
        description: "طرحواره‌های امن TypeScript ترکیب‌کننده پایگاه‌های داده مستقر در لبه کلودفلر با استفاده از قواعد نحوی Drizzle-ORM."
      },
      "sql-schema": {
        title: "طرحواره SQL",
        category: "SQL خام",
        description: "کدهای ساختار جداول SQL خام بهینه‌شده به همراه کدهای ایندکس و قیدهای کلید خارجی برای SQLite لبه."
      },
      "migration-files": {
        title: "فایل‌های مهاجرت (Migration)",
        category: "سوابق تغییرات دیتابیس",
        description: "فایل‌های تراکنش ترتیبی مهاجرت دیتابیس برای ساختن جداول اولیه و بارگذاری رکوردهای سمبلیک."
      },
      "api-design": {
        title: "طراحی API",
        category: "اندپوینت رابط‌های شبکه",
        description: "ساخت نقطه دسترسی‌های وب ردیف اول با کارایی بالا با فریم‌ورک Hono برای تضمین تاخیر کمتر از ۱۰ میلی‌ثانیه."
      },
      "cloudflare-config": {
        title: "پیکربندی کلودفلر",
        category: "پیکربندی DevOps",
        description: "فایل wrangler.toml نهایی برای تخصیص محیط‌های R2، متغیرهای محیطی لبه و اتصال‌های امن دیتابیس D1."
      },
      "deployment-instructions": {
        title: "راهنمای استقرار",
        category: "پیش‌برد پروژه نهایی",
        description: "دستورالعمل خط لوله سی‌آی سی‌دی برای انتشار آنی پروژه روی بستر کلودفلر پیجز."
      },
      "mvp-roadmap": {
        title: "نقشه راه محصول کمینه (MVP)",
        category: "مدیریت استراتژیک محصول",
        description: "توسعه مرحله به مرحله پروژه برای راه‌اندازی این سیستم در کمتر از ۴۸ ساعت."
      }
    },
    ar: {
      "architecture": {
        title: "بنية النظام الهيكلية",
        category: "بنية الحافة التحتية (Edge)",
        description: "تدفق الطلبات العالمي متعدد الطبقات، مع تسليط الضوء على عرض الحافة، ووكلاء توجيه واجهة برمجة التطبيقات، والتخزين المؤقت المحلي."
      },
      "folder-structure": {
        title: "هيكل المجلدات والأدلة",
        category: "تنظيم قاعدة الكود",
        description: "هيكل الإنتاج لمستودع Turborepo أو هيكل هجين قياسي لـ Cloudflare Pages و Drizzle."
      },
      "drizzle-schema": {
        title: "مخطط دريزل (Drizzle)",
        category: "مخطط قاعدة البيانات",
        description: "مخطط TS آمن للنوع يجمع بين ترحيلات Drizzle-ORM لتناسق متين."
      },
      "sql-schema": {
        title: "مخطط SQL الخام",
        category: "لغة SQL الخام",
        description: "صيغة إنشاء DDL SQL خام محسنة لخدمة شروط فهارس الجداول وقواعد الاستعلام لسرعة خارقة."
      },
      "migration-files": {
        title: "ملفات الهجرة (Migration)",
        category: "سجل التغييرات",
        description: "ملفات الترحيل التسلسلية لإنشاء الجداول والتحميل الأولي للبيانات."
      },
      "api-design": {
        title: "تصميم واجهة برمجة التطبيقات",
        category: "نقاط نهاية الشبكة",
        description: "نقاط وصول ويب عالية الأداء تضمن استجابة في أقل من 10 مللي ثانية باستخدام Hono."
      },
      "cloudflare-config": {
        title: "إعدادات كلاودفلير",
        category: "إعدادات DevOps",
        description: "ملف wrangler.toml لتخصيص بيئة R2 وقاعدة البيانات D1."
      },
      "deployment-instructions": {
        title: "تعليمات النشر",
        category: "سير عمل النشر",
        description: "خطوات النشر التلقائي عبر CI/CD لرفع المشروع على Cloudflare Pages."
      },
      "mvp-roadmap": {
        title: "خارطة طريق MVP",
        category: "إدارة المنتج",
        description: "خطوات مكثفة لتشغيل وإطلاق المشروع في أقل من 48 ساعة."
      }
    },
    de: {
      "architecture": {
        title: "Systemarchitektur",
        category: "Edge-Infrastruktur",
        description: "Mehrschichtiger globaler Anforderungsfluss mit Edge-Rendering, API-Router-Proxies und lokalen Caches."
      },
      "folder-structure": {
        title: "Ordnerstruktur",
        category: "Codebase-Organisation",
        description: "Produktionsbereite Monorepo-Struktur für Cloudflare Pages, Workers und Drizzle."
      },
      "drizzle-schema": {
        title: "Drizzle-Schema",
        category: "Datenbankschema",
        description: "Typsicheres Schema für Cloudflare D1 mit Drizzle-ORM."
      },
      "sql-schema": {
        title: "SQL-Schema",
        category: "Rohes SQL",
        description: "Optimierte DDL-SQL-Tabellenerstellung mit Indizes und Fremdschlüsseln für SQLite Edge."
      },
      "migration-files": {
        title: "Migrationsdateien",
        category: "Änderungshistorie",
        description: "Sequenzielle Migrationsdateien für Tabellenerstellung und erste Seed-Daten."
      },
      "api-design": {
        title: "API-Design",
        category: "Netzwerk-Endpunkte",
        description: "Hono-basierte Web-Schnittstellen mit extrem geringer Latenz (< 10 ms)."
      },
      "cloudflare-config": {
        title: "Cloudflare-Konfiguration",
        category: "DevOps-Konfiguration",
        description: "wrangler.toml für Cloudflare Workers, R2 und D1-Datenbankverbindungen."
      },
      "deployment-instructions": {
        title: "Bereitstellungsanleitung",
        category: "Deployment-Workflow",
        description: "CI/CD-Pipeline zur automatischen Veröffentlichung auf Cloudflare Pages."
      },
      "mvp-roadmap": {
        title: "MVP-Roadmap",
        category: "Produktmanagement",
        description: "Phasenentwicklungsplan für einen stabilen Produkt-Launch in unter 48 Stunden."
      }
    },
    zh: {
      "architecture": {
        title: "系统架构",
        category: "边缘(Edge)基础设施",
        description: "全球多阶段请求流，涵盖边缘端渲染、API 路由代理以及经过优化的本地缓存策略。"
      },
      "folder-structure": {
        title: "目录文件结构",
        category: "源码管理组织",
        description: "用于 Cloudflare Pages 及 Drizzle 的高效多包(Monorepo)代码包组织规则。"
      },
      "drizzle-schema": {
        title: "Drizzle 表结构",
        category: "数据库表结构",
        description: "通过 Drizzle-ORM 管理的适用于边缘端 Cloudflare D1 极速 TypeScript 类型安全表定义。"
      },
      "sql-schema": {
        title: "原始 SQL 语句",
        category: "纯 SQL 代码",
        description: "为边缘 SQLite 数据库做了深度优化的 DDL 建表语句、关联索引及外键定义。"
      },
      "migration-files": {
        title: "数据库迁移文件",
        category: "数据演变历史",
        description: "包含基础表创建和初始系统内置状态历史变动数据的系列 SQL 文件。"
      },
      "api-design": {
        title: "API 接口设计",
        category: "网络接口路由",
        description: "使用 Hono 框架构建的能保证单次往返延迟低于 10ms 的极速 API 终结点路由。"
      },
      "cloudflare-config": {
        title: "Cloudflare 配置",
        category: "DevOps 配置",
        description: "完整的 wrangler.toml 用于挂载边缘 D1 数据库、R2 资产目录及绑定全局环境变量。"
      },
      "deployment-instructions": {
        title: "生产级部署手册",
        category: "持续集成流水线",
        description: "为项目在 Cloudflare Pages 上自动触发 CI/CD 打包上线的自动化部署配置文件。"
      },
      "mvp-roadmap": {
        title: "极简生存产品路线图",
        category: "商业战略管理",
        description: "旨在保障应用在 48 小时内快速完成首装演练及全量上线迭代的行动步骤。"
      }
    },
    es: {
      "architecture": {
        title: "Arquitectura del Sistema",
        category: "Infraestructura Edge",
        description: "Flujo de solicitudes global utilizando renderizado en el borde y cachés locales."
      },
      "folder-structure": {
        title: "Estructura de Carpetas",
        category: "Organización de Código",
        description: "Estructura de producción para Cloudflare Pages y configuración de Drizzle."
      },
      "drizzle-schema": {
        title: "Esquema Drizzle",
        category: "Esquema de BD",
        description: "Esquema seguro en TypeScript para Cloudflare D1 con Drizzle-ORM."
      },
      "sql-schema": {
        title: "Esquema SQL",
        category: "SQL Puro",
        description: "DDL optimizado con índices y claves para SQLite en entornos Edge."
      },
      "migration-files": {
        title: "Archivos de Migración",
        category: "Historial de Cambios",
        description: "Transacciones ordenadas para la carga inicial de datos y tablas de origen."
      },
      "api-design": {
        title: "Diseño de API",
        category: "Endpoints de Red",
        description: "Acceso web de alta velocidad mediante Hono con latencia ínfima (<10ms)."
      },
      "cloudflare-config": {
        title: "Configuración Cloudflare",
        category: "Ajustes DevOps",
        description: "Archivo wrangler.toml para asociar datos R2 y base distribuida D1."
      },
      "deployment-instructions": {
        title: "Guía de Despliegue",
        category: "Flujo de Trabajo",
        description: "Automatización vía CI/CD para implementar la solución en Cloudflare Pages."
      },
      "mvp-roadmap": {
        title: "Mapa de Ruta MVP",
        category: "Gestión de Producto",
        description: "Pasos ordenados para compilar y desplegar una MVP robusta en 48 horas."
      }
    },
    fr: {
      "architecture": {
        title: "Architecture Système",
        category: "Infrastructure Edge",
        description: "Flux de requêtes global multicouche comprenant le rendu Edge et le cache local."
      },
      "folder-structure": {
        title: "Structure des Dossiers",
        category: "Organisation Code",
        description: "Structure optimisée pour Cloudflare Pages, Workers et intégration Drizzle."
      },
      "drizzle-schema": {
        title: "Schéma Drizzle",
        category: "Schéma de Base de Données",
        description: "Schéma TypeScript robuste et sécurisé pour Cloudflare D1 avec Drizzle-ORM."
      },
      "sql-schema": {
        title: "Schéma SQL Brut",
        category: "SQL Natif",
        description: "Création de tables DDL optimisée avec clés et index pour SQLite Edge."
      },
      "migration-files": {
        title: "Fichiers de Migration",
        category: "Historique DB",
        description: "Migrations ordonnées pour l'étape initiale et chargement de données."
      },
      "api-design": {
        title: "Design de l'API",
        category: "Points d'Entrée Réseau",
        description: "Interfaces API haute vélocité avec Hono assurant un ping < 10ms."
      },
      "cloudflare-config": {
        title: "Configuration Cloudflare",
        category: "Paramètres DevOps",
        description: " wrangler.toml complet pour paramétrer R2, D1 et l'environnement d'exécution."
      },
      "deployment-instructions": {
        title: "Instructions de Déploiement",
        category: "Flux de Production",
        description: "Pipeline CI/CD standard pour propulser le projet sur Cloudflare Pages."
      },
      "mvp-roadmap": {
        title: "Feuille de Route MVP",
        category: "Gestion de Projet",
        description: "Étapes optimisées pour concevoir et lancer le produit en moins de 48 heures."
      }
    },
    it: {
      "architecture": {
        title: "Architettura di Sistema",
        category: "Infrastruttura Edge",
        description: "Flusso di richieste globali con rendering Edge distribuito e cache locali."
      },
      "folder-structure": {
        title: "Struttura Cartelle",
        category: "Organizzazione Progetto",
        description: "Dossier pronti all'uso per monorepo con Cloudflare Pages e Drizzle."
      },
      "drizzle-schema": {
        title: "Schema Drizzle",
        category: "Database Schema",
        description: "Esquema TypeScript tipizzata per database Cloudflare D1 via Drizzle-ORM."
      },
      "sql-schema": {
        title: "Schema SQL",
        category: "Comandi SQL Nativo",
        description: "Codice SQL DDL di creazione con vincoli e indici ottimizzato per SQLite Edge."
      },
      "migration-files": {
        title: "File Migrazione",
        category: "Cronologia DB",
        description: "File ordinati e sicuri per implementare riforme di tabelle e dati d'avvio."
      },
      "api-design": {
        title: "Architettura API",
        category: "Interfacce Router",
        description: "Endpoint web progettati con Hono per pings fulminei inferiori a 10ms."
      },
      "cloudflare-config": {
        title: "Configurazione Cloudflare",
        category: "Impostazioni DevOps",
        description: "wrangler.toml ottimizzato per aggregare storage R2 e istanza D1."
      },
      "deployment-instructions": {
        title: "Istruzioni di Rilascio",
        category: "Workflow di Rilascio",
        description: "Integrazione continua CI/CD per distribuire istantaneamente su Cloudflare Pages."
      },
      "mvp-roadmap": {
        title: "Tabella di Marcia MVP",
        category: "Product Management",
        description: "Workflow accelerato per collaudare e lanciare l'applicazione in 48 ore."
      }
    },
    ru: {
      "architecture": {
        title: "Архитектура Системы",
        category: "Инфраструктура на Edge",
        description: "Глобальный поток сетевых запросов с Edge-рендерингом и быстрым кэшированием."
      },
      "folder-structure": {
        title: "Структура Папок",
        category: "Организация Кода",
        description: "Оптимальная структура для Cloudflare Pages, Workers и Drizzle ORM."
      },
      "drizzle-schema": {
        title: "Схема Drizzle",
        category: "Схема базы данных",
        description: "Типизированная схема TypeScript для Cloudflare D1 через Drizzle-ORM."
      },
      "sql-schema": {
        title: "Схема SQL",
        category: "Чистый SQL код",
        description: "Запросы SQL DDL с индексами и ограничениями для SQLite на Edge."
      },
      "migration-files": {
        title: "Файлы Миграций",
        category: "История Базы Данных",
        description: "Последовательные миграции для создания таблиц и заполнения начальными данными."
      },
      "api-design": {
        title: "Проектирование API",
        category: "Сетевые Эндпоинты",
        description: "Маршрутизация Hono для обеспечения сверхбыстрого отклика менее 10 мс."
      },
      "cloudflare-config": {
        title: "Конфигурация Cloudflare",
        category: "Настройки DevOps",
        description: "Структура wrangler.toml для привязки ресурсов R2, тарифов D1 и секретов."
      },
      "deployment-instructions": {
        title: "Инструкция Деплоя",
        category: "Развертывание Продукта",
        description: "Сценарий автоматической сборки CI/CD для развертывания на Cloudflare Pages."
      },
      "mvp-roadmap": {
        title: "План развития MVP",
        category: "Управление Продуктом",
        description: "Пошаговое руководство для создания и запуска рабочего решения за 48 часов."
      }
    },
    el: {
      "architecture": {
        title: "Αρχιτεκτονική Συστήματος",
        category: "Υποδομή Edge",
        description: "Πολυεπίπεδη ροή παγκόσμιων αιτημάτων με Edge rendering και τοπική προσωρινή αποθήκευση."
      },
      "folder-structure": {
        title: "Δομή Φακέλων",
        category: "Οργάνωση Κώδικα",
        description: "Δομή monorepo παραγωγής για Cloudflare Pages, Workers και Drizzle."
      },
      "drizzle-schema": {
        title: "Σχήμα Drizzle",
        category: "Σχήμα Βάσης Δεδομένων",
        description: "Τυποποιημένο σχήμα TypeScript για Cloudflare D1 με χρήση Drizzle-ORM."
      },
      "sql-schema": {
        title: "Σχήμα SQL",
        category: "Καθαρό SQL",
        description: "Βελτιστοποιημένο DDL SQL με ευρετήρια και εξωτερικά κλειδιά για SQLite Edge."
      },
      "migration-files": {
        title: "Αρχεία Μετανάστευσης",
        category: "Ιστορικό Αλλαγών",
        description: "Διαδοχικά αρχεία migration για δημιουργία πινάκων και αρχική φόρτωση δεδομένων."
      },
      "api-design": {
        title: "Σχεδιασμός API",
        category: "Σημεία Πρόσβασης Δικτύου",
        description: "Διεπαφές υψηλής απόδοσης με Hono που εγγυώνται χαμηλή καθυστέρηση (<10ms)."
      },
      "cloudflare-config": {
        title: "Ρύθμιση Cloudflare",
        category: "Διαμόρφωση DevOps",
        description: "Αρχείο wrangler.toml για σύνδεση R2 και βάσης δεδομένων D1."
      },
      "deployment-instructions": {
        title: "Οδηγίες Ανάπτυξης",
        category: "Ροή Εργασίας Ανάπτυξης",
        description: "Αυτοματοποιημένη διαδικασία CI/CD για δημοσίευση στο Cloudflare Pages."
      },
      "mvp-roadmap": {
        title: "Οδικός Χάρτης MVP",
        category: "Διαχείριση Προϊόντος",
        description: "Σχέδιο σταδιακής ανάπτυξης για εκκίνηση σε λιγότερο από 48 ώρες."
      }
    }
  };

  const localizedMap = blueprintLocales[l];
  if (localizedMap && localizedMap[bp.id]) {
    return { ...bp, ...localizedMap[bp.id] };
  }

  return bp;
}

function getLocalizedStartup(startup: any, locale: string, dynamicCache?: Record<string, any>) {
  const l = locale || "en";

  // Dynamic Dictionaries mapped from English to 10 Site Locales
  const industryTable: Record<string, Record<string, string>> = {
    "Real Estate Tech": {
      fa: "فناوری املاک و اسکان",
      ar: "تكنولوجيا العقارات والمساحات",
      de: "Immobilientechnologie",
      zh: "房地产科技",
      es: "Tecnología Inmobiliaria",
      fr: "Biens Immobiliers / Tech",
      it: "Tecnologia Immobiliare",
      ru: "Технологии Недвижимости",
      el: "Τεχνολογία Ακινήτων"
    },
    "Healthcare / Biotech": {
      fa: "پزشکی و زیست‌فناوری",
      ar: "الرعاية الصحية والتقنية الحيوية",
      de: "Gesundheitswesen / Biotechnologie",
      zh: "医疗健康与生物科技",
      es: "Salud y Biotecnología",
      fr: "Santé / Biotech",
      it: "Salute e Biotecnologia",
      ru: "Медицина / Биотехнологии",
      el: "Υγεία / Βιοτεχνολογία"
    },
    "Cryptocurrency / Fintech": {
      fa: "رمز ارز و فناوری مالی",
      ar: "العملات الرقمية والتقنية المالية",
      de: "Kryptowährung / Fintech",
      zh: "加密货币与金融科技",
      es: "Criptomonedas / Fintech",
      fr: "Crypto / Fintech",
      it: "Criptovalute / Fintech",
      ru: "Криптовалюты / Финтех",
      el: "Κρυπτονομίσματα / Χρηματοοικονομική Τεχνολογία"
    },
    "Social Media / Web Video": {
      fa: "رسانه‌های اجتماعی و پخش ویدیو",
      ar: "وسائل التواصل الاجتماعي وبث الفيديو",
      de: "Soziale Medien / Webvideo",
      zh: "社交媒体及网络视频",
      es: "Redes Sociales y Video Web",
      fr: "Réseaux Sociaux / Vidéo Web",
      it: "Social Media / Video Web",
      ru: "Соцсети и Видеоплатформы",
      el: "Μέσα Κοινωνικής Δικτύωσης / Διαδικτυακό Βίντεο"
    },
    "Hardware / Consumer Biotech": {
      fa: "ابزارهای بیوتکنولوژی مصرف‌کننده",
      ar: "أجهزة التكنولوجيا الحيوية الاستهلاكية",
      de: "Hardware / Verbraucher-Biotech",
      zh: "硬件及消费级生物科技",
      es: "Biotecnología de Consumo",
      fr: "Biotechnologie Grand Public",
      it: "Biotecnologia di Consumo / Hardware",
      ru: "Потребительские Биотехнологии",
      el: "Υλικό / Καταναλωτική Βιοτεχνολογία"
    },
    "Hardware / Consumer IoT": {
      fa: "سخت‌افزار و اینترنت اشیاء",
      ar: "الأجهزة الذكية وإنترنت الأشياء",
      de: "Hardware / Verbraucher-IoT",
      zh: "消费者物联网硬件",
      es: "IoT de Consumo y Hardware",
      fr: "Objets Connectés / Hardware",
      it: "IoT di Consumo / Hardware",
      ru: "Hardware / Потребительский Интернет Вещей",
      el: "Υλικό / Καταναλωτικό Διαδίκτυο των Πραγμάτων"
    },
    "Hardware / Toy Robotics": {
      fa: "سخت‌افزار و رباتیک اسباب‌بازی",
      ar: "الروبوتات الاستهلاكية وتكنولوجيا الألعاب",
      de: "Hardware / Spielzeug-Robotik",
      zh: "硬件与玩具机器人",
      es: "Robótica de Juguete y Hardware",
      fr: "Robotique de Jouet / Hardware",
      it: "Robotica Giocattolo / Hardware",
      ru: "Hardware / Робототехника",
      el: "Υλικό / Ρομποτική Παιχνιδιών"
    },
    "Fintech / Payments": {
      fa: "فناوری پرداخت مالی",
      ar: "التكنولوجيا المالية بوابات الدفع",
      de: "Fintech / Zahlungsverkehr",
      zh: "金融科技与支付基础设施",
      es: "Fintech / Pasarelas de Pago",
      fr: "Fintech / Paiements",
      it: "Fintech / Pagamenti",
      ru: "Финтех / Платежные системы",
      el: "Χρηματοοικονομική Τεχνολογία / Πληρωμές"
    },
    "PropTech / Construction": {
      fa: "فناوری ساخت‌وساز مسکن",
      ar: "تكنولوجيا البناء والعمران",
      de: "PropTech / Bauwesen",
      zh: "建筑及房产科技",
      es: "PropTech / Construcción",
      fr: "PropTech / Construction",
      it: "PropTech / Costruzioni",
      ru: "Бизнес Технологии в Строительстве",
      el: "Τεχνολογία Ακινήτων / Κατασκευές"
    },
    "Healthcare / Wearables": {
      fa: "ابزارهای پوشیدنی سلامت",
      ar: "الأجهزة الطبية القابلة للارتداء",
      de: "Gesundheitswesen / Wearables",
      zh: "医疗健康与可穿戴设备",
      es: "Salud / Dispositivos Usables",
      fr: "Santé / Objets Connectés",
      it: "Salute / Dispositivi Indossabili",
      ru: "Медицина / Носимые Устройства",
      el: "Υγεία / Φορετές Συσκευές"
    },
    "Micromobility / Logistics": {
      fa: "میکروموبیلیتی و لجستیک حمل‌ونقل",
      ar: "التنقل الصغير والخدمات اللوجستية",
      de: "Mikromobilität / Logistik",
      zh: "微型出行与物流",
      es: "Micromovilidad / Logística",
      fr: "Micromobilité / Logistique",
      it: "Micromobilità / Logistica",
      ru: "Микромобильность / Логистика",
      el: "Μικροκινητικότητα / Logistics"
    },
    "CleanTech / Electric Automotive": {
      fa: "خودروهای برقی و انرژی پاک",
      ar: "السيارات الكهربائية والطاقة النظيفة",
      de: "CleanTech / Elektrofahrzeuge",
      zh: "清洁能源与电动汽车",
      es: "CleanTech / Vehículos Eléctricos",
      fr: "CleanTech / Véhicules Électriques",
      it: "CleanTech / Auto Elettriche",
      ru: "Электромобили / Чистые Технологии",
      el: "Καθαρές Τεχνολογίες / Ηλεκτρικά Αυτοκίνητα"
    },
    "SaaS / Video Events": {
      fa: "نرم‌افزار ابری رویدادهای ویدیویی",
      ar: "برمجيات الأحداث والمؤتمرات الافتراضية",
      de: "SaaS / Video-Events",
      zh: "视频会议及活动 SaaS",
      es: "SaaS / Eventos Virtuales",
      fr: "SaaS / Webinaires et Événements",
      it: "SaaS / Eventi Video",
      ru: "SaaS / Онлайн Мероприятия",
      el: "SaaS / Διαδικτυακές Εκδηλώσεις Βίντεο"
    },
    "Fintech / Bookkeeping SaaS": {
      fa: "نرم‌افزار ابری حسابداری",
      ar: "برمجيات المحاسبة ومراقبة التكاليف",
      de: "Fintech / Buchhaltungs-SaaS",
      zh: "记账及财务 SaaS",
      es: "Fintech / SaaS Contable",
      fr: "Fintech / SaaS de Comptabilité",
      it: "Fintech / SaaS di Contabilità",
      ru: "Финтех / Облачная Бухгалтерия",
      el: "Χρηματοοικονομική Τεχνολογία / Λογιστικό SaaS"
    },
    "On-Demand Food Delivery": {
      fa: "ارسال فوری مواد غذایی",
      ar: "تطبيقات طلب وتوصيل الأغذية",
      de: "On-Demand Essenslieferung",
      zh: "即时外卖递送",
      es: "Entrega de Alimentos a la Carta",
      fr: "Livraison de Plats à la Demande",
      it: "Consegna Cibo On-Demand",
      ru: "Доставка Еды по Запросу",
      el: "Παράδοση Φαγητού κατά Παραγγελία"
    },
    "CleanTech / Solar Energy": {
      fa: "انرژی خورشیدی و فناوری پاک",
      ar: "الطاقة الشمسية وتكنولوجيا البيئة والبيوتک",
      de: "CleanTech / Solarenergie",
      zh: "清洁能源与太阳能科技",
      es: "CleanTech / Energía Solar",
      fr: "CleanTech / Énergie Solaire",
      it: "CleanTech / Energia Solare",
      ru: "Чистые Технологии / Солнечная Энергия",
      el: "Καθαρές Τεχνολογίες / Ηλιακή Ενέργεια"
    },
    "Consumer Hardware": {
      fa: "سخت‌افزار مصرف‌کننده و گجت‌ها",
      ar: "الأجهزة الإلكترونية الاستهلاكية",
      de: "Verbraucher-Hardware",
      zh: "消费级硬件",
      es: "Hardware de Consumo",
      fr: "Matériel de Consommation",
      it: "Hardware di Consumo",
      ru: "Потребительские Устройства",
      el: "Καταναλωτικό Υλικό"
    },
    "FoodTech / Smart Beverage": {
      fa: "فناوری هوشمند نوشیدنی و صنایع غذایی",
      ar: "تكنولوجيا الأغذية والمشروبات الذكية",
      de: "FoodTech / Intelligente Getränke",
      zh: "食品科技与智能饮品",
      es: "FoodTech / Bebidas Inteligentes",
      fr: "FoodTech / Boissons Intelligentes",
      it: "FoodTech / Bevande Intelligenti",
      ru: "Фудтех / Умные Напитки",
      el: "Τεχνολογία Τροφίμων / Έξυπνα Ποτά"
    },
    "Peer-to-Peer Automotive Marketplace": {
      fa: "بازارگاه خودرو همتا به همتا",
      ar: "سوق السيارات المستعملة التشاركي",
      de: "Peer-to-Peer Automobil-Marktplatz",
      zh: "汽车共享及交易平台",
      es: "Portal de Autos P2P",
      fr: "Marché Automobile P2P",
      it: "Mercato Auto Peer-to-Peer",
      ru: "P2P Авторынок",
      el: "Αγορά Αυτοκινήτων Peer-to-Peer"
    },
    "Consumer D2C / E-commerce": {
      fa: "تجارت الکترونیک مستقیم به مصرف‌کننده",
      ar: "التجارة الإلكترونية المباشرة للمستهلك",
      de: "D2C-E-Commerce & Konsumgüter",
      zh: "直销及电子商务",
      es: "Comercio D2C y Consumo",
      fr: "Commerces D2C & E-Commerce",
      it: "E-Commerce / D2C di Consumo",
      ru: "Прямые продажи D2C & E-commerce",
      el: "Άμεση Πώληση στον Καταναλωτή / Ηλεκτρονικό Εμπόριο"
    },
    "E-Commerce / Consumables": {
      fa: "تجارت الکترونیک و مصرف‌ کردنی‌ها",
      ar: "التجارة الإلكترونية والمواد الاستهلاكية",
      de: "E-Commerce / Verbrauchsgüter",
      zh: "电子商务 / 消费品",
      es: "E-Commerce / Consumibles",
      fr: "E-Commerce / Consommables",
      it: "E-Commerce / Consumabili",
      ru: "Электронная коммерция / Расходные материалы",
      el: "Ηλεκτρονικό Εμπόριο / Αναλώσιμα"
    }
  };

  const reasonTable: Record<string, Record<string, string>> = {
    "Dysfunctional Unit Economics": {
      fa: "اقتصاد ناکارآمد واحدها و سوزاندن نقدینگی",
      ar: "نموذج اقتصادي غير متوازن وهدر السيولة",
      de: "Dysfunktionale Unit Economics",
      zh: "畸形单位经济模型及资金空烧",
      es: "Economía Unitaria Disfuncional",
      fr: "Rentabilité Unitaire Défaillante",
      it: "Unit Economics Disfunzionali",
      ru: "Неэффективная юнит-экономика и сжигание капитала",
      el: "Δυσλειτουργική Οικονομία Μονάδας"
    },
    "Technical Fraud & Regulatory": {
      fa: "تقلب فنی و پیگردهای سخت قضایی",
      ar: "التلاعب التقني والملاحقات التنظيمية",
      de: "Technischer Betrug & Regulierung",
      zh: "技术造假与合规纠纷",
      es: "Fraude Técnico y Regulatorio",
      fr: "Fraude Technique & Réglementation",
      it: "Frode Tecnica e Normativa",
      ru: "Технический мошенничество и регуляторные запреты",
      el: "Τεχνική Απάτη & Ρυθμιστικά Πρόστιμα"
    },
    "Financial Fraud & Insolvency": {
      fa: "اختلاس، کلاهبرداری مالی و ورشکستگی",
      ar: "الاحتيال المالي وإساءة استخدام الصندوق المعرفي",
      de: "Finanzbetrug & Insolvenz",
      zh: "金融诈骗与破产清算",
      es: "Fraude Financiero e Insolvencia",
      fr: "Fraude Financière & Insolvabilité",
      it: "Frode Finanziaria e Insolvenza",
      ru: "Финансовое мошенничество и банкротство",
      el: "Χρηματοοικονομική Απάτη & Αφερεγγυότητα"
    },
    "Lack of Market Fit": {
      fa: "عدم تناسب کامل محصول با نیاز بازار",
      ar: "عدم ملاءمة الخدمة أو المنتج مع متطلبات السوق",
      de: "Mangelnder Market Fit",
      zh: "缺乏市场契合度",
      es: "Falta de Ajuste de Mercado",
      fr: "Absence d'Adéquation au Marché",
      it: "Mancanza di Product-Market Fit",
      ru: "Отсутствие рыночного соответствия (Product-Market Fit)",
      el: "Έλλειψη Προσαρμογής στην Αγορά"
    },
    "Product Over-engineering": {
      fa: "مهندسی بیش از حد پیچیده و گران‌قیمت",
      ar: "العجرفة الهندسية والمبالغة في ميزات النظام",
      de: "Produkt-Over-Engineering",
      zh: "产品过度工程设计",
      es: "Sobreingeniería de Producto",
      fr: "Sur-ingénierie du Produit",
      it: "Sovra-ingegnerizzazione del Prodotto",
      ru: "Избыточная техническая сложность продукта",
      el: "Υπερβολική Μηχανολογία Προϊόντος"
    },
    "Hardware Scaling & Margins": {
      fa: "چالش مقیاس‌دهی سخت‌افزاری و سود کم",
      ar: "عقبات تصنيع الأجهزة وضمان حواف الربح",
      de: "Hardware-Skalierung & Margen",
      zh: "硬件规模化与毛利挑战",
      es: "Escalabilidad de Hardware y Márgenes",
      fr: "Difficultés d'Échelle Hardware & Marges",
      it: "Scalabilità Hardware e Margini",
      ru: "Проблемы масштабирования и низкая маржа",
      el: "Κλιμάκωση Υλικού & Χαμηλά Περιθώρια"
    },
    "High Manufacturing Costs": {
      fa: "هزینه‌های بالای تولید و زنجیره تامین",
      ar: "ارتفاع مهول في تكاليف سلاسل الإمداد والتصنيع",
      de: "Hohe Herstellungskosten",
      zh: "制造和供应链成本昂贵",
      es: "Altos Costos de Fabricación",
      fr: "Coûts de Fabrication Élevés",
      it: "Costi di Produzione Elevati",
      ru: "Высокая себестоимость производства",
      el: "Υψηλό Κόστος Παραγωγής & Εφοδιαστικής Αλυσίδας"
    },
    "Unsustainable Cash Burn Rate": {
      fa: "نرخ بالای غیرقابل تحمل سوزاندن پول",
      ar: "معدل الحرق النقدي المتهور وغير المبرر",
      de: "Unnachhaltige Cash-Burn-Rate",
      zh: "无法维系的资本消耗率",
      es: "Quema de Efectivo Insostenible",
      fr: "Consommation excessive de Trésorerie",
      it: "Burn Rate Sostenibile Basso",
      ru: "Критическая скорость прожигания средств",
      el: "Μη Βιώσιμος Ρυθμός Κατανάλωσης Μετρητών"
    },
    "Macroeconomic Real Estate Collapse": {
      fa: "سقوط کلان اقتصادی بازار املاک",
      ar: "الأزمات العقارية الحادة في الاقتصاد الكلي",
      de: "Makroökonomischer Immobilienkollaps",
      zh: "宏观经济导致房地产崩盘",
      es: "Colapso del Sector Inmobiliario",
      fr: "Effondrement Immobilier Macroéconomique",
      it: "Collasso Macroeconomico Immobiliare",
      ru: "Макроэкономический обвал рынка недвижимости",
      el: "Μακροοικονομική Κατάρρευση Αγοράς Ακινήτων"
    },
    "Regulatory Compliance & Lawsuits": {
      fa: "موانع قانونی سازمان‌های رگولاتوری",
      ar: "الإخفاق في شروط الرخص والقضايا القانونية الكبرى",
      de: "Regulatorische Compliance & Klagen",
      zh: "监管合规不达标与诉讼纠纷",
      es: "Incumplimiento Regulatorio y Demandas",
      fr: "Problèmes de Conformité & Procès",
      it: "Problemi Normativi e Cause Legali",
      ru: "Судебные процессы и нарушение законов",
      el: "Ρυθμιστική Συμμόρφωση & Αγωγές"
    },
    "Unsustainable Customer Acquisition": {
      fa: "جذب مشتری غیرپایدار با هزینه بالا",
      ar: "ارتفاع كلفة كسب العملاء مقابل الأرباح",
      de: "Unnachhaltige Kundenakquise",
      zh: "难以为继的获客成本",
      es: "Adquisición de Clientes Insostenible",
      fr: "Coût d'Acquisition Client Insoutenable",
      it: "Costo di Acquisizione Clienti Insostenibile",
      ru: "Неудержимое удорожание привлечения клиентов",
      el: "Μη Βιώσιμο Κόστος Απόκτησης Πελατών"
    },
    "Atherosclerosis Infrastructure Shocks": {
      fa: "شوک زنجیره تامین و زیرساخت‌ها",
      ar: "أزمات توفر المكونات وصدمات النظام الاستشاري",
      de: "Infrastrukturschocks",
      zh: "基础设施重创与供应链脱节",
      es: "Crisis de Infraestructura y Suministro",
      fr: "Crise d'Infrastructure Industrielle",
      it: "Shock delle Infrastrutture",
      ru: "Инфраструктурные перебои и дефицит компонентов",
      el: "Σοκ Υποδομών & Ελλείψεις Προμηθειών"
    },
    "Premature Scaling & COVID Shifts": {
      fa: "مقیاس‌گذاری عجولانه و اتمام کرونا",
      ar: "التوسع المبكر والتغيرات السريعة كوفيد",
      de: "Vorzeitige Skalierung & COVID-Verschiebungen",
      zh: "盲目过早扩张与疫情后需求改变",
      es: "Escalamiento Prematuro y Cambios por COVID",
      fr: "Croissance Prématurée & Effets COVID",
      it: "Crescita Prematura e Cambiamenti COVID",
      ru: "Преждевременное расширение и изменение спроса из-за COVID",
      el: "Πρόωρη Κλιμάκωση & Αλλαγές COVID"
    },
    "Fraudulent Financial Reporting": {
      fa: "جعل دفاتر حسابداری و صورت‌های مالی",
      ar: "تزييف التقارير والتدفقات المالية الدفترية",
      de: "Betrügerische Finanzberichterstattung",
      zh: "财务造假与欺诈性报表",
      es: "Reportes Financieros Fraudulentos",
      fr: "Rapports Financiers Frauduleux",
      it: "Rendicontazione Finanziaria Fraudolenta",
      ru: "Фальсификация финансовой отчетности",
      el: "Δόλια Χρηματοοικονομική Αναφορά"
    },
    "High Food Waste & Gig Economy Costs": {
      fa: "ضایعات فراوان کالا و حاشیه سود منفی",
      ar: "هدر الموارد اللوجستية وانهيار القيمة المضافة",
      de: "Hohe Lebensmittelverschwendung & Gig-Economy-Kosten",
      zh: "高额食品浪费与零工经济成本负担",
      es: "Alto Desperdicio de Alimentos",
      fr: "Haute Perte Alimentaire & Coût de Main d'Oeuvre",
      it: "Sprechi Alimentari Elevati e Costi Gig-Economy",
      ru: "Огромный процент порчи продуктов и расходы на фрилансеров",
      el: "Υψηλή Σπατάλη Τροφίμων & Κόστος Gig Economy"
    },
    "Government Tariffs & Market Price Shifts": {
      fa: "تعرفه‌های تحمیلی دولتی و رقابت شدید",
      ar: "الرسوم والجمارك وتقلبات الأسعار الدولية الشرسة",
      de: "Zölle & Marktpreisverschiebungen",
      zh: "政府关税政策及全球市场价格波动",
      es: "Aranceles e Inestabilidad de Precios",
      fr: "Tarifs Douaniers & Variations des Prix",
      it: "Tariffe Governative e Oscillazioni dei Prezzi",
      ru: "Государственные пошлины и резкие колебания цен",
      el: "Κυβερνητικοί Δασμοί & Αλλαγές Τιμών Αγοράς"
    },
    "Niche Market Utility Trap": {
      fa: "گرفتاری در تله کاربری بازار فرعی کوچک",
      ar: "الوقوع في شباك الأسواق والمنافذ المحدودة جداً",
      de: "Nischenmarkt-Nutzlichkeitsfalle",
      zh: "过度小众的市场实用性陷阱",
      es: "Trampa de Utilidad de Mercado de Nicho",
      fr: "Piège du Marché de Niche",
      it: "Trappola della Nicchia di Mercato",
      ru: "Ловушка узконишевой полезности",
      el: "Παγίδα Χρησιμότητας Εξειδικευμένης Αγοράς"
    },
    "Hardware R&D delays": {
      fa: "تاخیرهای اتمام توسعه و آزمایش سخت‌افزار",
      ar: "تأخيرات في عمليات البحث والتطوير الهندسي المكلف",
      de: "Verzögerungen in der Hardware-F&E",
      zh: "硬件研发周期多番延误",
      es: "Retrasos en el Desarrollo de Hardware",
      fr: "Retards R&D Matériel",
      it: "Ritardi in R&S Hardware",
      ru: "Задержки в разработке и тестировании оборудования",
      el: "Donanım Araştırma Geliştirme Süreçlerinin Gecikmesi"
    },
    "Uncurbed Fraud & Logistics Overhead": {
      fa: "کلاهبرداری و سربارهای پرهزینه لجستیک",
      ar: "عمليات احتيال وفساد وتضخم التكلفة التشغيلية للأسطول",
      de: "Ungebremster Betrug & Logistik-Overhead",
      zh: "欺诈高发与高昂的物流管理支出",
      es: "Fraude y Sobrecarga Logística",
      fr: "Fraudes incontrôlées & Surcharge Logistique",
      it: "Frodi Incontrollate e Sovraccarico Logistico",
      ru: "Убытки от краж и завышенные затраты на логистику",
      el: "Kontrol Edilemeyen Dolandırıcılık / Lojistik Masrafları"
    },
    "High Customer Acquisition Cost (CAC) vs LTV": {
      fa: "هزینه جذب غیرمنطقی مشتری در قبال ارزش دوره بقا",
      ar: "الإنفاق المفرط لجلب المستخدم وضعف القيمة الحياتية للمستخدم",
      de: "Hohe Kundenakquisitionskosten (CAC) vs. LTV",
      zh: "获客成本(CAC)严重超出客户生命周期价值(LTV)",
      es: "Alto CAC vs. Valor de Vida del Cliente (LTV)",
      fr: "CAC excessif comparé à la LTV",
      it: "Alto Costo di Acquisizione Clienti (CAC) rispetto ad LTV",
      ru: "Слишком высокая стоимость привлечения (CAC) относительно LTV",
      el: "Aşırı Yüksek CAC / Kullanıcı Değeri (LTV) Uyuşmazlığı"
    },
    "Fraud & Governance collapse": {
      fa: "کلاهبرداری و فروپاشی حاکمیت شرکتی",
      ar: "الاحتيال وإساءة إدارة الحوكمة المؤسسية",
      de: "Betrug & Governance-Zusammenbruch",
      zh: "欺诈与公司管理崩盘",
      es: "Colapso de Gobernanza y Fraude",
      fr: "Fraude & Effondrement de la Gouvernance",
      it: "Frode e Collasso della Governance",
      ru: "Мошенничество и крах управления советом директоров",
      el: "Yolsuzluk ve Yönetim Kurulu Çöküşü"
    },
    "No Market Need": {
      fa: "عدم نیاز بازار به خدمات یا کالا",
      ar: "عدم ملاءمة الخدمة وتفوق الخيارات البديلة",
      de: "Kein Marktbedarf",
      zh: "无明确市场需求",
      es: "Sin Necesidad de Mercado",
      fr: "Pas de Besoin du Marché",
      it: "Nessun Bisogno di Mercato",
      ru: "Отсутствие реальной потребности рынка",
      el: "Pazar İhtiyacının Olmaması"
    },
    "Over-engineering": {
      fa: "مهندسی و طراحی فنی بیش از حد بیهوده",
      ar: "التكلف الهندسي وتضخم تكلفة التطوير دون جدوى",
      de: "Over-Engineering",
      zh: "过度工程设计",
      es: "Sobreingeniería",
      fr: "Sur-ingénierie",
      it: "Ingegnerizzazione Eccessiva",
      ru: "Избыточная сложность разработки",
      el: "Aşırı Mühendislik / Gereksiz Teknik Detat"
    },
    "Competitor Market Saturation": {
      fa: "اشباع شدید بازار توسط ورود رقبا",
      ar: "اكتساح السوق ومنافسة شرائح العمالقة الكبار",
      de: "Marktsättigung durch Wettbewerber",
      zh: "竞争对手饱和施压",
      es: "Saturación Competitiva del Mercado",
      fr: "Saturation Concurrentielle du Marché",
      it: "Saturazione sul Mercato dei Competitor",
      ru: "Высокая конкуренция и пресыщение рынка",
      el: "Rakip Yoğunluğu ve Pazarın Doyması"
    },
    "High R&D Burn Rate": {
      fa: "نرخ هدررفت بودجه تحقیق و توسعه (R&D)",
      ar: "الحرق المتسارع لنفقات الأبحاث والتطوير التقني",
      de: "Hohe F&E-Burn-Rate",
      zh: "高昂研发资金消耗",
      es: "Quema de I+D Extrema",
      fr: "Consommation R&D Élevée",
      it: "Alto Burn Rate in R&S",
      ru: "Чрезмерные расходы на исследования",
      el: "Aşırı Yüksek Ar-Ge Giderleri"
    },
    "Astronomical Burn Rate": {
      fa: "نرخ سوزاندن نجومی سرمایه خطرپذیر",
      ar: "حرق نقدي فلكي متجاوز لحجم الأصول",
      de: "Astronomische Burn-Rate",
      zh: "天文级资金空烧率",
      es: "Quema de Capital Astronómica",
      fr: "Consommation de trésorerie Astronomique",
      it: "Burn Rate Astronomico",
      ru: "Астрономические темпы сжигания денег",
      el: "Astronotik Hızda Nakit Sıkışması"
    },
    "Over-expansion & Supply chain": {
      fa: "توسعه عجولانه و اخلال زنجیره تامین",
      ar: "اندفاع التوسع السريع وأمراض سلاسل الإمداد فجأة",
      de: "Überarbeitung & Lieferkette",
      zh: "盲目过度扩张与供应链受阻",
      es: "Sobreexpansión y Cadena de Suministro",
      fr: "Surexpansion & Logistique",
      it: "Sovra-espansione e Catena di Spedizione",
      ru: "Чрезмерное расширение и логистический хаос",
      el: "Kontrolsüz Aşırı Büyüme ve Tedarik Zinciri Sorunları"
    },
    "Regulatory & Unit Economics": {
      fa: "موانع قانونی سازمان‌های رگولاتوری",
      ar: "البيئة الرقابية والضوابط الاقتصادية السيئة",
      de: "Regulierung & Unit Economics",
      zh: "合规监管与单位经济劣势",
      es: "Regulación y Economía Unitaria",
      fr: "Réglementation & Rentabilité",
      it: "Regolamentazione e Unit Economics",
      ru: "Сложности регулирования и плохая юнит-экономика",
      el: "Regülasyonlar ve Kötü Birim Ekonomisi"
    },
    "Infrastructure Burn Rate": {
      fa: "سوزاندن سرمایه در بخش زیرساخت فنی پیچیده",
      ar: "معدل استهلاك ميزانيات البناء السحابي المستمر",
      de: "Infrastruktur-Burn-Rate",
      zh: "基础设施维护资金重负",
      es: "Quema de Infraestructura",
      fr: "Frais d'Infrastructure Lourdes",
      it: "Budget di Infrastruttura Elevato",
      ru: "Слишком дорогая инфраструктура",
      el: "Aşırı Pahalı Bulut / Sunucu Giderleri"
    },
    "Transient Market Need": {
      fa: "نیاز گذرا و ناپایدار بازار",
      ar: "حاجة سوقية مؤقتة زالت بزوال الظروف المساهمة",
      de: "Vorübergehender Marktbedarf",
      zh: "短暂的伪市场需求",
      es: "Necesidad de Mercado Pasajera",
      fr: "Marché Éphémère",
      it: "Bisogno di Mercato Transitorio",
      ru: "Быстропроходящий временный интерес аудитории",
      el: "Kısa Süreli Geçici Tüketici Talebi"
    },
    "Over-engineering & Management": {
      fa: "مهندسی بیش از حد پیچیده همراه با مدیریت ضعیف",
      ar: "المبالغة في الخصائص الهندسية مع غياب التوجيه السليم",
      de: "Over-Engineering & Management",
      zh: "过度工程和管理不善",
      es: "Sobreingeniería y Gestión Ineficiente",
      fr: "Sur-ingénierie et Gestion Défaillante",
      it: "Ingegnerizzazione Eccessiva e Gestione Carente",
      ru: "Избыточное усложнение продукта и плохое руководство",
      el: "Gereksiz Aşırı Mühendislik ve Yönetim Zaafiyeti"
    }
  };

  const countryTable: Record<string, Record<string, string>> = {
    "United States": {
      fa: "ایالات متحده آمریکا",
      ar: "الولايات المتحدة الأمريكية",
      de: "Vereinigte Staaten",
      zh: "美国",
      es: "Estados Unidos",
      fr: "États-Unis",
      it: "Stati Uniti",
      ru: "США",
      el: "Amerika Birleşik Devletleri"
    },
    "United Kingdom": {
      fa: "بریتانیا",
      ar: "المملكة المتحدة",
      de: "Vereinigtes Königreich",
      zh: "英国",
      es: "Reino Unido",
      fr: "Royaume-Uni",
      it: "Regno Unito",
      ru: "Великобритания",
      el: "Birleşik Krallık"
    },
    "Bahamas": {
      fa: "باهاما",
      ar: "جزر البهاما",
      de: "Bahamas",
      zh: "巴哈马",
      es: "Bahamas",
      fr: "Bahamas",
      it: "Bahamas",
      ru: "Багамы",
      el: "Bahamalar"
    },
    "Australia": {
      fa: "استرالیا",
      ar: "أستراليا",
      de: "Australien",
      zh: "澳大利亚",
      es: "Australia",
      fr: "Australie",
      it: "Australia",
      ru: "Австралия",
      el: "Avustralya"
    },
    "Canada / US": {
      fa: "کانادا / آمریکا",
      ar: "كندا / الولايات المتحدة",
      de: "Kanada / USA",
      zh: "加拿大 / 美国",
      es: "Canadá / EE. UU.",
      fr: "Canada / États-Unis",
      it: "Canada / USA",
      ru: "Канада / США",
      el: "Kanada / ABD"
    },
    "Israel / US": {
      fa: "اسرائیل / آمریکا",
      ar: "إسرائيل / الولايات المتحدة",
      de: "Israel / USA",
      zh: "以色列 / 美国",
      es: "Israel / EE. UU.",
      fr: "Israël / États-Unis",
      it: "Israele / USA",
      ru: "Израиль / США",
      el: "İsrail / ABD"
    }
  };

  // 10-Language custom overrides for the major startups
  const startupMap: Record<string, Record<string, { slogan: string; detailedFailureReason: string; postMortem: string; lessonsLearned: string[] }>> = {
    wework: {
      fa: {
        slogan: "ارائه‌دهنده فضاهای کار اشتراکی که ادعای ارتقای سطح هوشیاری و آگاهی جهان را داشت.",
        detailedFailureReason: "رهبری سمی، تعهدات مالی بلندمدت فاقد پشتوانه و سوزاندن نجومی سرمایه‌های دریافتی.",
        postMortem: "وی‌ورک شیوه کار مدرن را دگرگون ساخت اما به شدت از عدم انطباق بین دارایی و بدهی رنج می‌برد. آنها قراردادهای اجاره بلندمدت ۱۵ الی ۲۰ ساله امضا می‌کردند در حالی که فضا را به صورت اشتراک‌های کوتاه‌مدت ماهانه به مشتریان واگذار می‌کردند. با بروز رکورد اقتصادی، تعهدات نجومی پابرجا ماند و شرکت میلیاردها دلار را به همراه رفتارهای جاه‌طلبانه هدر داد تا بالاخره ورشکست شد.",
        lessonsLearned: [
          "از برندسازی بیهوده دارایی‌های فیزیکی سنگین به عنوان استارت‌آپ‌های نرم‌افزارهای پربازده بپرهیزید.",
          "باید از کنترل کامل رای‌دهی مطلق توسط یک تک بنیان‌گذار بی‌مسئولیت خودداری شود.",
          "پایداری و توازن مالی سرمایه تحت تعهدات بلندمدت را جدی بگیرید."
        ]
      },
      ar: {
        slogan: "مزود مساحات العمل المشتركة الذي ادعى الارتقاء بالوعي الكوني للبشرية.",
        detailedFailureReason: "إدارة كارزمية سامة، والتزامات مالية طويلة الأجل فاقدة للملاءمة الملائمة والائتمان المالي السليم.",
        postMortem: "أحدثت WeWork ثورة في المكاتب ولكنها عانت من عدم توافق حاد في هيكل الأصول. تعاقدت على إيجارات طويلة الأجل من ١٥ إلى ٢٠ سنة، بينما قدمت اشتراكات شهرية قصيرة الأجل للزبائن. عند حدوث تراجع في نسب الإشغال، ظلت الديون مستقرة وأدت إلى تصفية الشركة والبدء في إجراءات الحماية من الإفلاس.",
        lessonsLearned: [
          "تجنب تسويق عمليات الأصول المادية عالية التدخل والمخاطر العقارية كبرمجيات لتقييم وهمي.",
          "يجب أن تمنع معايير الحوكمة السيطرة والصلاحيات المطلقة للمؤسس المفرد.",
          "احرص على الموازنة والربط المحاسبي السليم للقروض قصيرة الاستحقاق مع الفترات الحياتية للزبائن."
        ]
      },
      de: {
        slogan: "Anbieter von Coworking Spaces, der behauptete, das globale Bewusstsein zu erhöhen.",
        detailedFailureReason: "Toxische Führung, unbesicherte langfristige Mietverbindlichkeiten und astronomischer Cash Burn.",
        postMortem: "WeWork veränderte die Art des Arbeitens grundlegend, litt jedoch unter einem massiven Missverhältnis zwischen Vermögenswerten und Verbindlichkeiten. Sie schlossen langfristige Mietverträge über 15 bis 20 Jahre ab, vermieteten die Flächen jedoch flexibel monatlich unter. Als die Belegung einbrach, blieben die Schulden bestehen, was in die Insolvenz führte.",
        lessonsLearned: [
          "Vermeiden Sie es, kapitalintensive Immobilien-Geschäfte betrügerisch als margenstarke Software zu deklarieren.",
          "Gründer-Stimmrechtsmehrheiten ohne Aufsichtsrat-Kontrollen sind hochgradig riskant.",
          "Passen Sie langfristige Zahlungsverpflichtungen strikt an volatile Umsatzmuster an."
        ]
      },
      zh: {
        slogan: "共享办公空间巨头，曾声称要提升“世界的人类意识水平”。",
        detailedFailureReason: "有毒的创始人作风、缺乏财务支撑的长周期租约、极其疯狂的 VC 资金空烧行为。",
        postMortem: "WeWork 的理念彻底重构了现代办公空间，但在财务上存在致命的“期限错配”——租入地产使用的是 15 到 20 年的长租期合约，而转租给会员使用的则是按月支付的短周期会员合同。经济滑坡或估值泡沫破灭时，长租负债如重山压至，而弹性收入瞬间崩溃，最终耗尽巨额投资宣告破产重组。",
        lessonsLearned: [
          "切勿将高资产、高自营物理负荷的重资产地产生意包装成轻资产、高产出的科技软件股来获取泡沫估值。",
          "坚决避免让单个联合发起人掌控具有最高表决权的“超级投票权”而缺乏独立董事监督。",
          "牢牢控制中小型租约期限和现金流，与负债杠杆周期进行精准财务匹配。"
        ]
      },
      es: {
        slogan: "Proveedor de espacios de cotrabajo que afirmaba elevar la conciencia global del mundo.",
        detailedFailureReason: "Liderazgo tóxico, compromisos de arrendamiento a largo plazo insostenibles y quema extrema de capital.",
        postMortem: "WeWork revolucionó las oficinas pero sufrió un desajuste severo en su balance. Firmaron arrendamientos de 15 a 20 años pero alquilaban por suscripción mensual flexible. Cuando la ocupación se contrajo, los pasivos colapsaron la empresa.",
        lessonsLearned: [
          "No comercialice un negocio inmobiliario físico pesado como si fuera software de alto margen.",
          "El control absoluto de voto por parte del fundador sin supervisión de un directorio formal es peligroso.",
          "Equilibre rigurosamente las obligaciones fijas a largo plazo con el flujo de efectivo variable."
        ]
      },
      fr: {
        slogan: "Fournisseur d'espaces de coworking qui prétendait élever la conscience mondiale.",
        detailedFailureReason: "Management toxique, baux commerciaux de long terme disproportionnés, et gaspillage colossal de cash.",
        postMortem: "WeWork a popularisé le travail collaboratif mais a souffert d'un déséquilibre actif-passif fatal. L'entreprise signait des baux de 15 à 20 ans tout en louant ses espaces sous forme d'abonnements flexibles mensuels. Lors du ralentissement économique, la dette est restée fixe tandis que le taux d'occupation s'effondrait.",
        lessonsLearned: [
          "Ne maquillez pas un business immobilier lourd et complexe en entreprise logicielle SaaS à haute marge.",
          "Le contrôle de vote absolu du fondateur sans gouvernance indépendante mène dans le mur.",
          "Une saine gestion de trésorerie impose de lier rationnellement baux d'emprunt et abonnements clients."
        ]
      },
      it: {
        slogan: "Fornitore di spazi di coworking che sosteneva di voler elevare la consapevolezza del mondo.",
        detailedFailureReason: "Leadership tossica, banni a lungo termine non coperti e tassi di burn rate stratosferici.",
        postMortem: "WeWork ha cambiato gli uffici ma è andata in crisi per via del mismatch finanziario. Ha firmato contratti di affitto a lungo termine di 15-20 anni, mentre affittava a cadenza mensile flessibile. Al calare del mercato la struttura è crollata.",
        lessonsLearned: [
          "Evitare di mascherare l'immobiliare fisico ad altissimo costo come azienda software ad alte prestazioni.",
          "Evitare di delegare tutto il potere decisionale a un singolo fondatore senza un consiglio di controllo.",
          "Coordinare perfettamente la cassa per far fronte ai debiti di locazione strutturali."
        ]
      },
      ru: {
        slogan: "Провайдер коворкинг-пространств, заявлявший о миссии по повышению уровня сознания человечества.",
        detailedFailureReason: "Токсичное руководство, долгосрочные арендные обязательства без покрытия и рекордная скорость прожигания денег.",
        postMortem: "WeWork перевернула индустрию коворкинга, но пострадала от несоответствия активов и пассивов. Нанимая помещения на 15-20 лет по длинным обязательствам, они сдавали их по коротким месячным договорам.",
        lessonsLearned: [
          "Прекратите позиционировать тяжелые физические активы недвижимости как высокомаржинальное ПО.",
          "Отрицайте возможность обладания единоличного контроля компании одним лишь основателем.",
          "Согласуйте долгосрочные обязательства с колеблющимися краткосрочными доходами."
        ]
      },
      el: {
        slogan: "İnsanlığın kozmik bilincini yükselttiğini iddia eden ortak çalışma alanı sağlayıcısı.",
        detailedFailureReason: "Zehirli liderlik tarzı, güvencesiz uzun vadeli kira borçları ve akıl almaz harcama oranları.",
        postMortem: "WeWork ofis dünyasını modernleştirdi ancak finansal vade uyuşmazlığı yaşadı. 15-20 yıllık uzun vadeli kiralama kontratları imzalarken, tüketiciye aylık esnek üyelik veriyorlardı. Ekonomik daralmada borçlar sabit kaldı ve iflas ettiler.",
        lessonsLearned: [
          "Yüksek maliyetli emlak operasyonlarını yüksek çarpanlı yazılım şirketi gibi sunmaktan kaçının.",
          "Denetim mekanizması ya da bağımsız yönetim kurulu olmadan kurucuya mutlak yetki vermeyin.",
          "Uzun vadeli sabit yükümlülüklerinizi nakit akışlarınız ile dikkatli koordine edin."
        ]
      }
    },
    theranos: {
      fa: {
        slogan: "یک شرکت فناوری زیستی که ادعا می‌کرد آزمایش خون را تنها با یک قطره خون دگرگون می‌کند.",
        detailedFailureReason: "جعل و دست‌کاری اسناد آزمایشات، عدم افشای حقایق و ساخت دستگاه فرضی فاقد کارکرد.",
        postMortem: "ترانوس وعده اجرای ده‌ها تست کلینیکی زیستی به وسیله دستگاه اختصاصی 'ادیسون' خود را داد. این فناوری هرگز به صورت پایدار و ایمن کار نکرد. بنیان‌گذار آن فرهنگ به شدت پنهان‌کارانه‌ای ایجاد کرد تا اینکه خبرنگاری راز این تقلب بزرگ را برملا کرد.",
        lessonsLearned: [
          "داستان‌سرایی و سناریونویسی رویایی هرگز نمی‌تواند جایگزین تحقیقات علمی همکارانه حقیقی شود.",
          "هیئت مدیره حتماً باید شامل کارشناسان تخصصی جهت راستی‌آزمایی فنی محصولات باشد.",
          "فضای سمی پنهان‌کاری نشانگر جدی وجود کلاهبرداری سیستماتیک است."
        ]
      },
      ar: {
        slogan: "شركة تقنيات حيوية واعدة ادعت إجراء فحوصات طبية كبرى باستخدام قطرة دم واحدة.",
        detailedFailureReason: "تزييف كلي لقدرات ومخرجات الأجهزة المصنعة، وحجب مطلق للمعلومات، وانتهاكات سريرية خطيرة.",
        postMortem: "قدمت ثيرانوس وعوداً بتسهيل مئات الفحوص الكيميائية والسريرية بجهازها الصغير 'إيديسون'. في الواقع، لم تعمل التقنية بأمان إطلاقاً. عجلت الإدارة السرية وقمع الموظفين بكشف الصحافة للأدلة المزيفة ومحاكمة هولمز قانونياً.",
        lessonsLearned: [
          "لا يمكن للقصص الحماسية والمثيرة للمشاعر أن تلغي غياب حقائق البحث العلمي المنهجي المقبول.",
          "يجب دعم مجلس الإدارة بخبراء مختصين وقادرين على قياس المخرجات وجودتها بشكل وثيق ومستقل.",
          "السرية والملاحقة القضائية للموظفين مؤشران على غياب الشفافية وتوفر عناصر الاحتيال."
        ]
      },
      de: {
        slogan: "Biotech-Unternehmen, das versprach, Bluttests mit nur einem einzigen Tropfen zu revolutionieren.",
        detailedFailureReason: "Manipulation von Testergebnissen, Täuschung von Investoren und fehlerhafte Technologie.",
        postMortem: "Theranos behauptete, Hunderte von klinischen Tests auf einem proprietären 'Edison'-Gerät durchführen zu können. Die Technologie funktionierte nie. Gründerin Elizabeth Holmes schuf eine Kultur extremer Geheimhaltung, bis die Täuschung entlarvt wurde.",
        lessonsLearned: [
          "Ein tolles Narrativ kann niemals gründliche, geprüfte wissenschaftliche Forschung ersetzen.",
          "Aufsichtsräte im Deep-Tech-Bereich benötigen zwingend Fachexperten zur Überprüfung.",
          "Verschwiegenheitswahn und die Verfolgung von Whistleblowern sind Warnsignale für systemischen Betrug."
        ]
      },
      zh: {
        slogan: "宣称能仅靠一滴血就能颠覆全球血液检测技术的生物科技公司。",
        detailedFailureReason: "篡改及伪造测试数据、极力隐瞒内部真相，机器存在严重的技术缺陷且并无实质功能。",
        postMortem: "Theranos 曾向投资人和大众承诺，其专利微型血检设备“爱迪生（Edison）”只需在指尖采集一滴血便能低成本快速检测出数百项健康指标。事实上，其核心技术根本不具备真实工作能力，报告结果大都通过私下采购商业设备代检得出。创始人用神秘莫测的高压保密文化压制员工，最终被媒体扒下谎言外衣，锒铛入狱。",
        lessonsLearned: [
          "激情澎湃的商业故事叙事，永远无法替代严谨科学的临床同行评审与方法学实证。",
          "深科技（Deep Tech）领域的企业董事会成员必须引入具备核心工程资质和行业审查经验的研究人员。",
          "内部极端的秘密作风、打压异议员工，往往是管理失职和系统性欺瞒的关键预警信号。"
        ]
      },
      es: {
        slogan: "Compañía de biotecnología que prometía revolucionar los análisis de sangre con una sola gota.",
        detailedFailureReason: "Falsificación de datos, ocultamiento deliberado de información y tecnología inexistente.",
        postMortem: "Theranos prometía realizar cientos de exámenes utilizando su dispositivo Edison. Sin embargo, el aparato nunca funcionó de forma segura. La fundadora Elizabeth Holmes generó una cultura de espionaje corporativo y acoso hasta que fue expuesta.",
        lessonsLearned: [
          "La narrativa de marketing nunca reemplazará el rigor científico y la revisión de pares.",
          "Una junta de directores necesita especialistas para validar tecnologías complejas.",
          "El secreto excesivo y la persecución de empleados suelen encubrir fraudes estructurales."
        ]
      },
      fr: {
        slogan: "Une entreprise prétendant révolutionner les examens médicaux grâce à une unique goutte de sang.",
        detailedFailureReason: "Falsification des résultats, opacité drastique et absence de technologie fonctionnelle.",
        postMortem: "Theranos affirmait réaliser des centaines d'examens médicaux avec sa machine propriétaire 'Edison'. En réalité, la technologie n'a jamais fonctionné. Elizabeth Holmes a bâti une culture hermétique de secret de défense, menaçant ses salariés jusqu'à ce que le scandale éclate.",
        lessonsLearned: [
          "Le storytelling théâtral et le narcissisme ne supplanteront jamais la validation par les pairs scientifiques.",
          "Le conseil d'administration doit compter des experts capables de comprendre le cœur de la technologie.",
          "L'omerta d'entreprise et l'intimidation sont de parfaits signaux d'alarme quant à la fraude."
        ]
      },
      it: {
        slogan: "Azienda biotech che prometteva di rivoluzionare i test del sangue con una sola goccia.",
        detailedFailureReason: "Contraffazione sistematica dei dati di laboratorio e macchina Edison clinicamente inefficace.",
        postMortem: "Theranos millantava l'esecuzione di centinaia di esami tramite il mini laboratorio compatto 'Edison'. In realtà, non ha mai funzionato in condizioni reali. Elizabeth Holmes ha imposto assoluto silenzio aziendale sino alle rivelazioni d'inchiesta.",
        lessonsLearned: [
          "Le storie entusiastiche sulla stampa non surclasseranno mai i riscontri dei test scientifici certificati.",
          "La governance necessita di medici e scienziati per indagare i prodotti.",
          "La segretezza quasi militare spesso indica problemi strutturali da nascondere."
        ]
      },
      ru: {
        slogan: "Биотехническая компания, обещавшая совершить революцию в медицине, делая анализы по одной капле крови.",
        detailedFailureReason: "Фальсификация результатов тестов, тотальное сокрытие правды и неработающий прибор 'Эдисон'.",
        postMortem: "Theranos обещала перевернуть клиническую диагностику созданием аппарата 'Edison'. Но технологии компании были мифом. Элизабет Холмс поддерживала культуру строгой тайны и давления на персонал, пока обман не вскрыл Уолл-стрит джорнал.",
        lessonsLearned: [
          "Красивые речи и пиар никогда не заменят проверенных публикаций в научных журналах.",
          "Совет директоров обязан состоять из профильных ученых, а не генералов и политиков.",
          "Культ жесткой таинственности и преследование за критику — верный знак мошенничества."
        ]
      },
      el: {
        slogan: "Bir damla kan ile laboratuvar testlerini baştan yaratmayı vaat eden biyoteknoloji firması.",
        detailedFailureReason: "Test raporlarını taklit etme, yatırımcıyı manipüle etme ve çalışmayan cihaz prototipi.",
        postMortem: "Theranos, 'Edison' adını verdiği mini-cihaz ile yüzlerce klinik test yapabileceğini vadetti. Gerçekte teknoloji hiçbir zaman güvenli çalışmadı. Elizabeth Holmes, gerçek açığa çıkana kadar şirket içinde aşırı gizlilik ve baskı politikası uyguladı.",
        lessonsLearned: [
          "Pazarlama odaklı büyük hikayeler asla hakemli gerçek bilimsel araştırmaların yerini tutamaz.",
          "Derin teknoloji yatırımlarında yönetim kurullarında teknik yeterliliğe sahip profesörler bulunmalıdır.",
          "Gizlilik takıntısı ve içeriden sızan bilgileri şiddetle kovuşturma, sistemik hilelerin göstergesidir."
        ]
      }
    },
    ftx: {
      fa: {
        slogan: "یکی از بزرگترین صرافی‌های رمزارز جهان که به دست بنیان‌گذارش نابود شد.",
        detailedFailureReason: "استفاده غیرقانونی از سرمایه‌های کاربران صرافی جهت معاملات پرریسک در صندوق آلامدا ریسرچ.",
        postMortem: "این صرافی میلیاردها دلار از سپرده‌های کاربران را مخفیانه به صندوق پوشش ریسک خود هدایت کرد تا سرمایه مشتریان را هدر دهد. زمانی که کاربران تقاضای برداشت دارایی کردند، صرافی با کسری مواجه شد و پرونده جنایی فدرال باز شد.",
        lessonsLearned: [
          "تفکیک و عدم دست‌اندازی به دارایی‌ها و وجوه کاربران باید به طور مطلق رعایت شود.",
          "ادعای نیکوکاری موثر هرگز توجیهی برای نبود ساختارهای حاکمیت مالی و حسابرسی نیست.",
          "به صرافی‌های بدون نظارت رگولاتوری شفاف و دوردست اعتماد نکنید."
        ]
      },
      ar: {
        slogan: "واحدة من أكبر منصات تداول الأصول الرقمية والعملات المشفرة في العالم تحطمت بسبب احتيال مباشر.",
        detailedFailureReason: "استغلال غير قانوني وتسييل مباشر لأموال الزبائن لتغطية مضاربات عالية المخاطر في صندوق ألاميدا.",
        postMortem: "وجهت FTX سرًا ودون إذن مليارات الدولارات من أرصدة وودائع عملائها لتغطية خسائر فادحة في Alameda Research. ومع تسرب الأخبار وطلب الزبائن سحب الودائع، ظهرت فجوة مالية هائلة أودت بالشركة للسقوط السريع والسجن الفيدرالي لسام بانكمان.",
        lessonsLearned: [
          "الفصل التام للذمة المالية وأرصدة المودعين يجب أن يكون خطاً أحمر لا يقبل المساس قانونياً.",
          "شهرة المؤسس وحملاته الإعلامية لا تعفي من المحاسبة والتدقيق المالي الخارجي المستقل.",
          "الحذر الشديد من منصات التداول الخارجية والخاضعة لرقابة ضعيفة أو غير واضحة."
        ]
      },
      de: {
        slogan: "Eine der größten Krypto-Börsen der Welt, die durch kriminelle Machenschaften zusammenbrach.",
        detailedFailureReason: "Veruntreuung von Kundengeldern zur Deckung riskanter Wetten durch Alameda Research.",
        postMortem: "FTX leitete klammheimlich Milliarden von Kundendepots an seinen Hedgefonds Alameda Research weiter, um dort Verluste auszugleichen. Als die Kunden massenweise Abhebungen forderten, fehlte die Liquidität völlig, was Sam Bankman-Fried ins Gefängnis brachte.",
        lessonsLearned: [
          "Eine strikte, gesetzliche Trennung von Kunden- und Eigenmitteln ist unverhandelbar.",
          "Personenkult und philanthropische Selbstdarstellung ersetzen keine externe, unabhängige Buchprüfung.",
          "Verlassen Sie sich niemals auf unregulierte Offshore-Börsen ohne transparente Strukturen."
        ]
      },
      zh: {
        slogan: "曾是全球最大的加密货币交易所之一，因核心人物挪用客户资产进行高风险投机而轰然崩塌。",
        detailedFailureReason: "私下非法动用和挪用交易所用户的巨额储蓄，向 Alameda Research 风险账号输入资金进行高倍率交易。",
        postMortem: "FTX 瞒着储户，暗中将数十亿美元的客户资金输送给关联的量化投资基金 Alameda Research，以弥补其交易亏损。在遭遇行业流动性恐慌、用户发起集中式挤兑时，交易所巨额资产缺口败露，创始人 Sam Bankman-Fried 因欺诈罪被捕，公司迅速进入清算。",
        lessonsLearned: [
          "独立托管客户资产是最基本的底线，客户本金绝对不能与运营或量化资金账户发生交叉混用。",
          "对创业领袖的造神、光鲜的媒体公关，绝不能凌驾于合规的外部独立审计和治理结构之上。",
          "对于缺乏强监管机制的离岸加密市场交易所应保持本能的风险警惕，远离不透明实体。"
        ]
      },
      es: {
        slogan: "Una de las bolsas de criptomonedas más grandes del mundo que colapsó debido a un fraude masivo.",
        detailedFailureReason: "Uso ilegal de los saldos de clientes de la bolsa para financiar operaciones riesgosas en Alameda Research.",
        postMortem: "FTX transfirió miles de millones de fondos de clientes en secreto para cubrir pérdidas en su fondo hermano Alameda Research. El pánico provocó retiros que expusieron un déficit masivo.",
        lessonsLearned: [
          "La segregación de fondos de clientes debe ser una regla absoluta respaldada por contables.",
          "El altruismo de marketing no justifica la falta de un comité de auditorías externas.",
          "Desconfíe de exchanges offshore no regulados con escasa transparencia institucional."
        ]
      },
      fr: {
        slogan: "L'une des plus grandes plateformes de cryptomonnaies au monde, détruite par son fondateur.",
        detailedFailureReason: "Utilisation frauduleuse des dépôts des clients pour renflouer le hedge-fund Alameda Research.",
        postMortem: "FTX a secrètement détourné des milliards de dollars issus des comptes de ses clients pour boucher les pertes abyssales de son fonds jumeau Alameda. Un retrait massif de panique à mis la fraude à nu, menant à la faillite instantanée et à l'incarcération de Bankman-Fried.",
        lessonsLearned: [
          "La ségrégation totale des fonds clients par rapport aux fonds propres est un principe non-négociable.",
          "Les dons philanthropiques et le sponsoring ne sauraient camoufler l'absence d'auditeurs financiers.",
          "Méfiance à l'égard des bourses offshore non régulées et dénuées de contrôles statutaires."
        ]
      },
      it: {
        slogan: "Uno degli exchange di criptovalute più estesi al mondo, fallito per ammanchi colossali.",
        detailedFailureReason: "Uso inappropriato dei depositi fiduciari inviati ad Alameda Research per coprire scommesse speculative.",
        postMortem: "FTX ha dirottato all'insaputa degli utenti diversi miliardi di depositi verso il fondo Alameda. All'emergere dei debito e con la corsa ai prelievi è scattato un vuoto di cassa irrecuperabile.",
        lessonsLearned: [
          "La separazione netta dei beni dei correntisti deve essere certificata in blockchain o audit costanti.",
          "Il marketing filantropico del CEO non esime dalla revisione di bilancio ordinaria.",
          "Prestare attenzione alle entità che operano in paradisi fiscali privi di trasparenza rionale."
        ]
      },
      ru: {
        slogan: "Одна из крупнейших криптовалютных бирж в мире, рухнувшая из-за преступных действий руководства.",
        detailedFailureReason: "Незаконный перевод средств клиентов для покрытия спекулятивных убытков хедж-фонда Alameda Research.",
        postMortem: "FTX тайно и без разрешения переводила миллиарды долларов депозитов пользователей для спасения аффилированного фонда Alameda. Когда клиенты начали массово забирать активы, биржа признала неплатежеспособность.",
        lessonsLearned: [
          "Разделение средств пользователей и капитала биржи должно быть абсолютным и контролируемым инвесторами.",
          "Имидж благотворителя и спонсора стадионов не заменяет наличие внешних аудиторов из Big Four.",
          "Избегайте незарегистрированных и офшорных финансовых сервисов."
        ]
      },
      el: {
        slogan: "Zirvedeyken kurucusunun hileli işlemleri yüzünden bir günde batan dünyanın en büyük kripto borsalarından biri.",
        detailedFailureReason: "Kullanıcıların borsadaki emanet paralarını Alameda Research fonunun riskli işlemleri için yasadışı kullanma.",
        postMortem: "FTX, kullanıcılarının borsadaki milyarlarca dolarlık nakit ve kripto mevduatını gizlice Alameda Research adlı kardeş hedge fonuna aktardı. Alameda bu parayı batırınca borsada likidite açığı çıktı ve kurucu Sam Bankman-Fried tutuklandı.",
        lessonsLearned: [
          "Müşteri fonlarının şirket operasyonel hesaplarından kesin olarak ayrılması anayasal düzeyde esastır.",
          "Kurucu imajı ve medya popülaritesi, denetleme eksiklikleri ve bağımsız rapor açığını gizleyemez.",
          "Regüle edilmeyen, off-shore bölgelerde kurulu uzak borsa modellerine temkinli yaklaşılmalıdır."
        ]
      }
    },
    quibi: {
      fa: {
        slogan: "یک پلتفرم پخش ویدئوی موبایل با سرمایه گذاری ۱.۷۵ میلیارد دلاری برای تماشای ویدئوهای ۱۰ دقیقه‌ای در حال حرکت.",
        detailedFailureReason: "شکست محض در جذب ترافیک، محدودیت‌های فنی برای عدم اجازه اشتراک‌گذاری محتوا و اصرار بر محتوای پرهزینه.",
        postMortem: "کویبی تلاش داشت با تولید محتوای پرهزینه هالیوودی برای تماشا در گوشی‌های همراه رقابت کند. آنها لایه وب را نادیده گرفتند و کاربران حق نداشتند از ویدئوها عکس بگیرند یا به اشتراک بگذارند. تنها ۶ ماه پس از رونمایی شرکت شکست خود را اعلام کرد.",
        lessonsLearned: [
          "شناسایی دقیق رفتارهای واقعی کاربران هدف بر فرضیات سنتی هالیوود اولویت دارد.",
          "قابلیت‌های بنیادی ویروسی شدن و تسهیل اشتراک‌گذاری محتوا موتور توسعه پلتفرم‌های موفق رسانه‌ای است.",
          "تامین مالی بیش از حد سنگین قبل از اعتبارسنجی اولیه به سرعت سبب سقوط می‌شود."
        ]
      },
      ar: {
        slogan: "منصة فيديو عبر الموبايل مدعومة بـ ١.٧٥ مليار دولار، لتقديم مقاطع فاخرة قصيرة من ١٠ دقائق.",
        detailedFailureReason: "الفشل الذريع في جلب الاهتمام، ومنع المستخدمين من التقاط الصور أو تشارك المقتطفات وإصرار على الكلفة العالية.",
        postMortem: "حاولت Quibi صناعة محتوى هوليوودي فاخر مخصص للمشاهدة السريعة أثناء التنقل. لكن غياب القدرة على الميادين المجتمية ومشاركة الفيديوهات أدى إلى موت فوري بعد ستة أشهر فقط من التدشين الرسمي والمكلف.",
        lessonsLearned: [
          "دراسة السوك الفعلي والحيوي للمستخدم أهم بكثير من افتراضات الاستوديوهات الكبرى.",
          "إتاحة مشاركة المحتوى بحرية الركيزة الأساسية للنمو والانتشار في منصات الترفيه الحديثة.",
          "جلب مبالغ استثمارية مهولة وتكديس النفقات قبل اختبار ملاءمة السوق الحقيقية يعجل بالانهيار."
        ]
      },
      de: {
        slogan: "Mobiles Streaming-Portal mit 1,75 Mrd. USD Budget für 10-Minuten-Häppchen.",
        detailedFailureReason: "Ignoranz des Nutzersystems, Verbot von Screenshots und extrem teure Eigenproduktionen.",
        postMortem: "Quibi versuchte, teure Hollywood-Inhalte für Mobiltelefone zu etablieren. Sie ignorierten Webschnittstellen komplett und verboten das Teilen von Ausschnitten. Sechs Monate nach Launch gaben sie auf.",
        lessonsLearned: [
          "Nutzerdaten der Zielgruppe sind wichtiger als tradierte Hollywood-Studioannahmen.",
          "Internetteilerlaubnis und Viralität sind elementare Motoren jeder Medienplattform.",
          "Finanzexzesse vor der Produktvalidierung beschleunigen tödliche Krisen."
        ]
      },
      zh: {
        slogan: "耗资高达 17.5 亿美元构建的移动端短视频点播平台，主打 10 分钟以内的好莱坞品质短片。",
        detailedFailureReason: "运营极其惨淡，技术上甚至无脑禁止用户截图或转发分享，盲目堆砌高成本精品内容。",
        postMortem: "Quibi 寄希望于通过生产极高成本的好莱坞规格影视内容，专供年轻人在公交车或排队碎片化时间里观看。然而他们忽视了现代互联网社交需求——用户被禁止进行截图、做 Gif 图或者分享到推特，极大扼杀了病毒传播。仅仅 6 个月便宣布关停并遣散员工。",
        lessonsLearned: [
          "洞察用户真实互联网行为，远比影视制片厂高管闭门凭空勾勒出泛娱乐画像更重要。",
          "允许轻量化截图、二创与去中心化自由分发是所有数字流媒体发展的基本要素。",
          "在核心产品缺乏初步市场黏性（Product Retention）前疯狂筹资、大手笔铺张将导致自毁。"
        ]
      },
      es: {
        slogan: "Plataforma de video móvil respaldada por $1.75 mil millones para episodios de 10 minutos.",
        detailedFailureReason: "Falta total de engagement, restricciones absurdas para compartir capturas e insistencia de costos fijos.",
        postMortem: "Quibi intentó competir produciendo contenido de costo de cine Hollywood para móviles. Bloquearon las capturas, despidiendo la viralidad básica. Cerraron tras seis meses.",
        lessonsLearned: [
          "Los datos de comportamiento real importan más que los gustos de los jefes tradicionales.",
          "La viralidad abierta y las capacidades de compartir son obligatorios en las redes sociales.",
          "Un exceso de capital pre-feedback precipita fallas de escala drásticas."
        ]
      },
      fr: {
        slogan: "Service vidéo mobile ayant levé 1,75 milliard de dollars pour diffuser des mini-séries de 10 minutes.",
        detailedFailureReason: "Refus d'intégrer le partage sur les réseaux, blocage des captures d'écran, et coûts de fabrication hollywoodiens.",
        postMortem: "Quibi a voulu produire des formats très chers à regarder uniquement en mobilité. Mais l'absence d'application web et l'interdiction technique de capturer ou partager l'image ont tué la viralité. Clap de fin après 6 mois seulement.",
        lessonsLearned: [
          "Comprendre les comportements réels des mobinautes prévaut sur les dogmes classiques d'Hollywood.",
          "Le partage de contenus et le droit à l'écho social sont les piliers des plateformes d'aujourd'hui.",
          "Gaspiller son capital en production gargantuesque avant de valider l'usage mène à l'iceberg."
        ]
      },
      it: {
        slogan: "Piattaforma di canali video per smartphone, bruciando 1,75 miliardi per clip da 10 minuti.",
        detailedFailureReason: "Pessimo riscontro dei consumatori e restrizione tecnica per vietare screenshot e viralità.",
        postMortem: "Quibi voleva vendere mini-episodi di fattura hollywoodiana per chi aspetta l'autobus. Ha però bloccato la diffusione social e lo screening, firmando la resa in soli 6 mesi.",
        lessonsLearned: [
          "I feedback dell'utenza reale sono sovrani rispetto alle riunioni dei vecchi produttori.",
          "Consentire la condivisione spontanea è il cardine dello streaming di successo.",
          "Troppi capitali investiti al buio impediscono un adattamento agile del prodotto."
        ]
      },
      ru: {
        slogan: "Мобильная видеоплатформа с бюджетом в 1.75 млрд долларов, предлагавшая 10-минутные премиум-видео.",
        detailedFailureReason: "Провал удержания аудитории, запреты на скриншоты и безумная цена продакшена.",
        postMortem: "Quibi создавала премиальный сериал-контент для просмотра на бегу. Но они отключили веб-интерфейс и заблокировали возможность делиться цитатами или гифками. Закрылась через полгода.",
        lessonsLearned: [
          "Изучайте реальное юзер-поведение миллениалов вместо кабинетных фантазий.",
          "Вирусные механики и свобода репостов — фундамент любого успешного медиа.",
          "Избыточное финансирование до проверки ценности губительно расслабляет менеджмент."
        ]
      },
      el: {
        slogan: "Mobil kullanıcıların seyahatte izlemesi için 1.75 milyar dolar bütçeyle kurulan 10 dakikalık yayın platformu.",
        detailedFailureReason: "İzleyici genelini yakalayamama, teknik olarak ekran resmi almayı yasaklama ve aşırı yapım maliyeti.",
        postMortem: "Quibi, hareket halindeyken izlenecek pahalı Hollywood tarzı mini diziler üretmeye odaklandı. Ancak tarayıcı erişimini kapatmaları ve ekran resmi alıp paylaşmayı yasaklamaları viralliği öldürdü ve batmalarına yol açtı.",
        lessonsLearned: [
          "Gerçek kullanıcı alışkanlıklarını analiz etmek klasik stüdyo varsayımlarından çok daha kıymetlidir.",
          "İçeriğin sosyal platformlarda serbestçe paylaşılamaması modern mecralar için intihardır.",
          "Pazar validationu gerçekleşmeden yapılan devasa fonlamalar hızlıca çöküşü getirir."
        ]
      }
    },
    juicero: {
      fa: {
        slogan: "یک دستگاه آبمیوه‌گیری فشرده متصل به وای‌فای با قیمت ۷۰۰ دلاری که از کیسه‌های میوه اختصاصی استفاده می‌کرد.",
        detailedFailureReason: "محصول به غایت مهندسی شده بیهوده که اثبات شد کیسه‌های آن را می‌توان با دست خالی نیز فشرد.",
        postMortem: "جویسرو دستگاهی بسیار گران‌قیمت با فشارهای بالا تولید کرد تا کیسه‌های اختصاصی را فشار دهد. بلومبرگ ویدئویی منتشر کرد که نشان می‌داد افراد بدون نیاز به دستگاه آبمیوه‌گیری می‌توانند کیسه را با دست بفشارند که محصول را کاملاً مضحک جلوه داد و فروش را صفر کرد.",
        lessonsLearned: [
          "جلوگیری از مهندسی بیش از حد محصولات در مواردی که راه‌حل‌های ساده دستی وجود دارند.",
          "تحمیل سیستم پکیجینگ انحصاری نیازمند ارائه ارزش افزوده‌ای فراتر از ادعاهای بازاریابی است.",
          "کاهش قیمت و تعادل هزینه‌های سخت‌افزاری را قبل از مقیاس‌گذاری انبوه بررسی کنید."
        ]
      },
      ar: {
        slogan: "آلة عصر ذكية متصلة بالإنترنت قيمتها ٧٠٠ دولار مصاحبة لأكياس الفاكهة الحصرية والمسبقة التعبئة.",
        detailedFailureReason: "جهاز مصمم بمهندسة فائقة وتكلفة باهظة دون وجود عوائد إنتاجية، وثبت جدوى العصر باليد المجردة.",
        postMortem: "وفرت جوسيرو عصارة مكلفة ذات هيدروليك يطبق ضغط عالي جداً. انتشر تقرير بلومبرغ يوضح أن المستخدم بإمكانه عصر الأكياس الحصرية باليد وبسرعة وجودة مماثلة ودون الآلة، مما أحرج المنتج وفجر المبيعات والسخرية الاجتماعية.",
        lessonsLearned: [
          "تجنب المبالغة الطائشة في هندسة الحلول البسيطة وتوليد تكاليف دون تقديم إضافة حقيقية.",
          "تأمين متجر مغلق وأكياس اشتراكات يتطلب ابتكاراً يوفر راحة أعلى من الخيارات البديلة السريعة.",
          "اختبار النماذج الأولية مع المستهلكين لقياس الرغبة في الدفع قبل مقايضة خطوط الإنتاج واللوجستيات."
        ]
      },
      de: {
        slogan: "WLAN-basierte Saftpresse für 700 USD, die spezielle Bio-Beutel auspresste.",
        detailedFailureReason: "Extrem überentwickeltes Gerät, dessen Beutel man auch genauso gut mit bloßen Händen auspressen konnte.",
        postMortem: "Juicero fertigte eine hochtechnologisierte, schwere Presse mit hohem Pressdruck an. Ein viral gegangenes Testvideo zeigte, dass ein gewöhnlicher Anwender die Beutel mit den Händen genauso schnell entleeren konnte, was das Produkt zur Farce machte.",
        lessonsLearned: [
          "Vermeiden Sie technisches Over-Engineering, wenn manuelle Low-Tech-Alternativen bestehen.",
          "Ein geschlossenes Abo-Kartell erfordert echten, nicht bloß werblichen Kundennutzen.",
          "Preiskalkulationen bei Hardware müssen vor dem Aufbau von Produktionslinien auf Herz und Nieren geprüft werden."
        ]
      },
      zh: {
        slogan: "一台售价高达 700 美元、需联网 Wi-Fi 的压榨式高端智能果汁榨汁机。",
        detailedFailureReason: "过度精密的无效硬件工程结构，事实证明只要用手捏一下专用蔬果包便能获得同等出汁率。",
        postMortem: "Juicero 倾力设计了一台机械力极强的巨型挤压机，并宣称必须施加高吨位压力才能榨干其特制真空保鲜果蔬包。彭博社在评测中演示了单手捏压上述包装也能倒挤一碗一模一样的果汁，让榨汁机化身互联网超级笑柄，资金迅速枯竭倒闭。",
        lessonsLearned: [
          "不要为了高阶科技的技术噱头而过度工程，用千元机挤压一个只要双手就能完成的简单流程是愚昧的。",
          "绑定专有商业闭环并不能免除对实际功用性价比的研究，消费者对智商税的脱粉非常迅速。",
          "在建立高固定制造开销与长制造周期流水线前，应该极度严密测试对该硬件定价的容受边界。"
        ]
      },
      es: {
        slogan: "Exprimidor con wifi de $700 que utilizaba sobres de fruta cerrados patentados.",
        detailedFailureReason: "Producto sobreingenierizado que demostró poder vaciarse manualmente sin problemas.",
        postMortem: "Juicero fabricó una prensa de diseño sumamente complejo. Bloomberg reveló un video donde los sobres se exprimían a mano con igual rendimiento, convirtiendo la empresa en motivo de ridículo de Silicon Valley.",
        lessonsLearned: [
          "Evite gastar esfuerzos en hardware que ofrece la misma productividad que una presión manual sencilla.",
          "El modelo de cartucho cerrado no resiste si no hay un verdadero ahorro de tiempo real.",
          "Evite fijar infraestructuras pesadas de fabricación antes de certificar la comodidad pragmática."
        ]
      },
      fr: {
        slogan: "Une presse à jus connectée en Wi-Fi à 700 $ nécessitant des recharges de fruits propriétaires.",
        detailedFailureReason: "Machine horriblement sur-développée alors qu'un simple pressage manuel manuel suffisait.",
        postMortem: "Juicero a conçu un appareil lourd exerçant des tonnes de pression pour broyer des sachets hermétiques. Bloomberg a démontré en vidéo que presser le sachet à deux mains permettait d'en extraire le jus tout aussi vite sans la machine, tuant les ventes.",
        lessonsLearned: [
          "Dites non à l'excès d'ingénierie quand des alternatives manuelles gratuites existent.",
          "Créer un monopole de recharge suppose d'offrir une valeur ajoutée indiscutable pour l'abonné.",
          "Testez l'acceptabilité commerciale réelle du prix de la machine avant de d'investir les chaînes d'assemblage."
        ]
      },
      it: {
        slogan: "Spremiagrumi Wi-Fi da 700 dollari vincolato a buste di frutta esclusive.",
        detailedFailureReason: "Tecnologia iper-ingegnerizzata, inutile dato che le buste poteva essere strizzate a mano.",
        postMortem: "Juicero lanciò una pressa pesantissima in alluminio idraulico ad alta pressione. In seguito video sul web mostrarono che con le sole mani si otteneva la medesima quantità sbeffeggiando il valore del macchinario.",
        lessonsLearned: [
          "Non sviluppare circuiti costosi per compiti risolvibili a costo nullo con la sola forza umana.",
          "La barriera d'ingresso degli abbonamenti deve facilitare il lavoro, non obbligare ad acquisti ridicoli.",
          "Prezzi hardware sconsiderati richiedono un'attenta validazione in fase MVP."
        ]
      },
      ru: {
        slogan: "Высокотехнологичный соковыжималка за 700 долларов, работающая на эксклюзивных порционных пакетах фруктовой смеси.",
        detailedFailureReason: "Абсурдно сложный прибор, пакеты из-под которого можно было выдавить руками в стакан.",
        postMortem: "Juicero привлекла 120 млн долларов на создание соковыжималки, сжимающей пакеты с силой, достаточной для поднятия автомобиля. Когда вышло вирусное видео прессы Bloomberg, показавшее, что выжать пакет руками проще, у компании кончились продажи.",
        lessonsLearned: [
          "Не усложняйте инженерию там, где процесс оптимизируется обычным ручным сжатием.",
          "Блокировка потребления внешними ключами не спасет проект, если нет пользы для клиента.",
          "Тестируйте юзабилити и адекватность цены до развертывания фабричных линий."
        ]
      },
      el: {
        slogan: "Özel meyve püre paketlerini sıkmak için kurulan, 700 dolar fiyat etiketine sahip akıllı taze meyve suyu sıkacağı.",
        detailedFailureReason: "Hassas mühendislikle üretilen ancak içindeki meyve paketlerinin elle de çok rahat sıkılabildiği skandal tasarım.",
        postMortem: "Juicero, içerisindeki özel kilitli paketleri sıkmak için hidrolik basınç uygulayan çok pahalı bir makine üretti. Bloomberg'in yayınladığı videoda insanların bu paketleri el gücüyle sıkarak aynı miktarda suyu elde ettiğini göstermesi satışları bitirdi.",
        lessonsLearned: [
          "Elle yapılabilecek basit ve masrafsız işlemler için gereksiz yere karmaşık cihaz tasarlamayın.",
          "Kapalı ve abonelikli sarf malzemesi sistemleri, müşteriye gerçekten hayatı kolaylaştıran bir pratiklik sunmalıdır.",
          "Fabrikasyon aşamasına geçmeden önce cihaz maliyetini felsefi düzeyde pazarla tartın."
        ]
      }
    },
    pebble: {
      fa: {
        slogan: "پیشگام ساعت‌های هوشمند با صفحه نمایش جوهر الکترونیک و باتری ۷ روزه.",
        detailedFailureReason: "اشباع شدید بازار توسط ورود غول‌های فناوری (اپل و سامسونج) و اصرار بر فناوری نمایشگر سیاه و سفید.",
        postMortem: "پبل اولین ساعت هوشمند را با جلب سرمایه مردمی گسترده ساخت. با ورود اپل واچ سلیقه بازار به سمت صفحات نمایش رنگی و لمسی چرخید و پبل قادر به همراهی با نوآوری‌های نرم‌افزاری رقبای چند میلیارد دلاری نبود.",
        lessonsLearned: [
          "مایکروسرویس‌ها و پلتفرم‌های کوچک به ندرت می‌توانند در حوزه سخت‌افزارهای یکپارچه با لایف‌استایل در درازمدت با غول‌ها رقابت کنند.",
          "به طور مستمر همگام با تحولات نمایشگری و ترجیحات کاربران تغییر جهت دهید.",
          "انعطاف در قیمت‌گذاری در بازار‌های تحت بمباران سخت‌افزاری حیاتی است."
        ]
      },
      ar: {
        slogan: "رائجة الساعات الذكية ذات شاشة الحبر الإلكتروني الـ e-paper والبطارية التي تدوم لسبعة أيام كاملة.",
        detailedFailureReason: "احتلال السوق وتدفق الأجهزة متعددة الإمكانات من عمالقة التقنية (آبل وسامسونج) وقصر الساشات الأحادية.",
        postMortem: "حققت بيبل شهرة كاسحة بتمويل جماعي كبير، لكن دخول آبل لسوق الساعات الذكية بشاشات واضحة ملونة ومتحركة حول دفة رغبات الزبائن لجانب البرامج والتطبيقات المتطورة التي لم تجارها ميزانيات Pebble المحدودة.",
        lessonsLearned: [
          "قد لا تتمكن الشركات المصنعة الصغيرة من الصمود طويلاً أمام استهداف حاسم للمنظومة التكنولوجية المكتملة من الكبار.",
          "المرونة والقدرة على مواكبة شاشات اللمس الرسومية متطلب أساسي في عالم الساعات.",
          "الحرص على توفير هوامش أرباح تمكن من مجاراة مناورات الأسعار من المنافسين الأثرياء."
        ]
      },
      de: {
        slogan: "Pionier der Smartwatches mit E-Paper-Display und 7-Tage-Akkulaufzeit.",
        detailedFailureReason: "Marktsättigung durch Tech-Giganten (Apple/Samsung) und Festhalten an monochromen Displays.",
        postMortem: "Pebble baute die erste funktionale Smartwatch per sensationellem Crowdfunding. Als Apple in den Markt eintrat, verschoben sich die Vorlieben hin zu hellen Touchscreens, die Pebble finanziell nicht kopieren konnte.",
        lessonsLearned: [
          "Nischen-Hardwareanbieter können langfristig selten gegen globale Ökosystem-Marken konkurrieren.",
          "Reagieren Sie agil auf visuelle Trends und technologische Quantensprünge der Konkurrenz.",
          "Vermeiden Sie es, sich nur auf Crowdfunding-Erfolge ohne stabilen Anschluss-Investitionsrahmen zu stützen."
        ]
      },
      zh: {
        slogan: "智能手表领域的先行探路者，主打极省电的电子墨水（e-paper）屏以及长达 7 天的超长续航。",
        detailedFailureReason: "面临苹果、三星等万亿级手机软硬件巨头的垂直入局压榨，偏执于黑白屏幕与低阶芯片方案。",
        postMortem: "Pebble 借着在 Kickstarter 上狂砍数千万美元众筹记录的光环，开辟了智能可穿戴手表时代。当 Apple Watch 携全彩 Retina 触控大屏、成熟的 WatchOS 独立生态入圈，消费者极快被丰富的应用程序功能所夺走眼球。Pebble 在资金规模上难以阻遏，在产品迭代滞后时资金链断裂被迫被 Fitbit 低价贱卖入驻。",
        lessonsLearned: [
          "垂直可穿戴性智能硬件由于其贴身属性，终会沦为覆盖整个数字生活底层生态平台的附属竞争，小厂在资金规模差悬殊时难以存活。",
          "不可抱残守缺，在消费者屏幕和硬件性能需求产生趋势转向时必须快速升级，而不是固步自封自演高傲自赏。",
          "众筹虽然提供了惊人的第一批启动资金，但并不能提供能够支撑全天候多产品研发流水线的深厚底层资本池。"
        ]
      },
      es: {
        slogan: "Pionero de relojes inteligentes con pantalla de tinta electrónica y batería de 7 días.",
        detailedFailureReason: "Competidores gigantes de tecnología (Apple y Samsung) inundaron el segmento con pantallas color.",
        postMortem: "Pebble construyó la categoría gracias a un crowdfunding estelar en Kickstarter. Tras la entrada del Apple Watch, las tendencias exigieron pantallas táctiles dinámicas de alta potencia.",
        lessonsLearned: [
          "Pequeños fabricantes de hardware no pueden sobrevivir ante ecosistemas cautivos de gigantes de telefonía.",
          "Actualice rápidamente las pantallas ante demandas de los consumidores antes de perder cuotas.",
          "Conserve flujo para responder a movimientos de precios agresivos de sus rivales."
        ]
      },
      fr: {
        slogan: "Pionnier des montres connectées doté d'un écran e-paper et d'une batterie de 7 jours.",
        detailedFailureReason: "Arrivée d'Apple et de Samsung sur le marché, et refus de migrer vers des écrans tactiles couleur.",
        postMortem: "Pebble a inventé la montre connectée grâce au financement participatif. Avec la sortie de l'Apple Watch, l'intérêt s'est tourné vers les dalles tactiles réactives et colorées, impossibles à égaler pour Pebble faute de budget de développement.",
        lessonsLearned: [
          "Un constructeur isolé résiste rarement face à l'écosystème matériel global d'un géant des télécoms.",
          "Adaptez agilement votre chaîne d'approvisionnement d'écrans pour suivre les sauts technologiques.",
          "Le crowdfunding crée le premier élan mais exige des capital-risqueurs solides pour stabiliser le navire."
        ]
      },
      it: {
        slogan: "Pioniere degli smartwatch con schermo e-paper a basso consumo e 7 giorni di autonomia.",
        detailedFailureReason: "Invasione della fascia wearable da parte di Apple Watch e Samsung e limite degli schermi mono.",
        postMortem: "Pebble raccolse cifre record su Kickstarter per produrre il suo orologio. All'ingresso di Apple l'ecologia dei consumi richiese schermi a colori nitidi e Pebble non possedeva le finanze per seguirli.",
        lessonsLearned: [
          "Aziende pioniere monopoli di piccole dimensioni difficilmente vincono nell'hardware a lungo andare.",
          "Monitorare diligentemente i miglioramenti delle tecnologie grafiche concorrenti.",
          "Ricercare canali industriali più ampi per ridurre i costi di montaggio."
        ]
      },
      ru: {
        slogan: "Пионер умных часов с энергосберегающим экраном e-paper и рекордными 7 сутками автономности.",
        detailedFailureReason: "Вытеснение бренда с рынка гигантами (Apple и Samsung) и нежелание внедрять цветные сенсорные дисплеи.",
        postMortem: "Pebble открыла эпоху смарт-часов благодаря супер-кампании на Kickstarter. Приход Apple Watch изменил вкус пользователей, сделав ставку на яркие цветные экраны с продвинутыми виджетами.",
        lessonsLearned: [
          "Нишевые производители аксессуаров не могут воевать со смартфонами-платформами в одиночку.",
          "Быстро реагируйте на смену дисплейных технологий и трендов интерфейса.",
          "Не ограничивайте финансовую подушку только одним краудфандингом."
        ]
      },
      el: {
        slogan: "E-paper ekrana ve 7 günlük batarya süresine sahip efsane akıllı saat öncüsü.",
        detailedFailureReason: "Teknoloji devlerinin (Apple ve Samsung) pazara girip renkli dokunmatik ekranları standart yapması.",
        postMortem: "Pebble kitle fonlaması rekorları kırarak akıllı saat kategorisini açtı. Apple Watch piyasaya sürülünce tüketici tercihleri renkli ekranlara kaydı. Pebble bütçesel yetersizlikten dolayı bu yazılım ekosistemine karşı koyamadı.",
        lessonsLearned: [
          "Küçük donanım üreticileri devlerin ekosistem platformları karşısında uzun süre tutunamaz.",
          "Tüketici eğilimleri değiştiğinde donanım konfigürasyonunuzu hızla revize edin.",
          "Büyük kitle fonlama başarıları, sonraki turlarda sürekli nakit enjeksiyonu garantilemez."
        ]
      }
    },
    casper: {
      fa: {
        slogan: "شرکت مستقیم به مصرف‌کننده (D2C) تشک که تشک‌های فوم متراکم را در جعبه‌های فشرده می‌فروخت.",
        detailedFailureReason: "هزینه‌های مرجوعی بالا، بودجه‌های سرسام‌آور تبلیغاتی و ظهور کدهای کپی‌کار با قیمت ارزان.",
        postMortem: "کاسپر با کارتون‌های فانتزی و مانیتورینگ آنلاین خرید تشک را ساده کرد. اما با توجه به اینکه افراد تشک را هر ده سال یکبار می‌خرند، جذب مشتری مجدد فاقد دوام بود و رقبا حاشیه‌های سود تشک درون جعبه را با شبیه‌سازی کامل بیهوده کردند و کاسپر مجبور به واگذاری شد.",
        lessonsLearned: [
          "کالاهایی با فرآیند تعویض طولانی (۱۰ ساله) نمی‌توانند هزینه‌های نجومی جذب مشتری را توجیه کنند.",
          "طرح‌های فیزیکی D2C بدون ابداعات کپی رایتِ حق اختراعِ اجزا به سرعت شبیه‌سازی خواهند شد.",
          "شرکت تشک در درجه نخست یک بیزینس لجستیک و انبارداری است، نه یک هاب فناورانه پربازده."
        ]
      },
      ar: {
        slogan: "شركة وسائد ومراتب تشاركية تبيع مراتب فوم عالية الكثافة مباشرة للمستهلك في صناديق.",
        detailedFailureReason: "ارتفاع هائل في كلفة شحن المرتجعات، نفقات إعلانية خيالية ومئات الماركات المقلدة الرخيصة.",
        postMortem: "أحدثت كاسبر ثورة في بيع المراتب ووسائد النوم وافتتحت السوق ببرند جذاب ورسوم متحركة رائعة. لكنهم اكتشفوا أن الشخص يشتري مرتبة مرة كل ١٠ سنوات، مما تطلب الدفع المتواصل لجلب مستخدمين جدد مقابل هوامش ربحية جافة تآكلت بتدفق المستنسخين.",
        lessonsLearned: [
          "المنتجات ذات الدورة الاستهلاكية الطويلة لا تدعم تكاليف استحواذ متكررة مرتفعة.",
          "نماذج التجارة الإلكترونية المادية المباشرة للمستهلك سهلة النسخ ما لم تدعمها براءات اختراع صناعية.",
          "شركة المراتب هي في جوهرها شركة عمليات لوجستية وتصنيع، وليست منصة تكنولوجيا فائقة."
        ]
      },
      de: {
        slogan: "D2C-Matratzenmarke, die Premium-Schaummatratzen komprimiert im Karton verkaufte.",
        detailedFailureReason: "Enorme Retourenkosten, absurde Werbebudgets und Hunderte aggressiver Klonmarken.",
        postMortem: "Casper revolutionierte den Matratzenkauf im Internet mit pfiffigen Cartoons und simpler Boxlieferung. Doch Kunden kaufen Matratzen nur alle zehn Jahre. Der hohe CAC von über 300 USD pro Matratze und mörderische Konkurrenz (Purple, Emma) radierten die Margen radikal aus.",
        lessonsLearned: [
          "Ein Produkt mit zehn Jahre Austauschzyklus erlaubt keine permanent hohen Kundenakquisebudgets.",
          "Physische D2C-Modelle sind extrem leicht kopierbar, wenn Patente auf technische Schaumsegmente fehlen.",
          "Eine Matratzenfirma ist im Kern ein Logistikunternehmen und keine hochbewertete Tech-Plattform."
        ]
      },
      zh: {
        slogan: "开创“盒中装床垫”风潮直接面向消费者（D2C）的高端记忆海绵床垫品牌。",
        detailedFailureReason: "高昂的退换货包裹物流负荷、极高且难以下降的广告获客开销、以及同质化冒牌厂牌的疯狂跟风绞杀。",
        postMortem: "Casper 凭借幽默卡通广告与真空盒装配送，重塑了人们在线选购床垫的繁琐环节，初期获得爆红。但随后面临致命痛点：消费者往往每隔 10 年才会复购一张床垫，极其缺乏高频交叉销售条件。为了冲高营收，卡斯珀一张床垫需支出 300 点广告成本。随后数以百计的竞对低成本跟风（如 Tuft & Needle，Purple 等）蚕食生存池，最终 Casper 连年亏损，低价退市卖给私募股权公司。",
        lessonsLearned: [
          "床垫这类复购生命周期极长（10年以上）的家庭耐用品，在经济模型中绝无法长期支撑极高的公域红利买量获客比对（CAC）。",
          "纯物理属性的 D2C 消费品直销网络在壁垒较低时形同透明。缺乏具有专利壁垒的独家材质支撑时极其容易被快速克隆。",
          "床垫生意的本质是偏传统的大型仓储、运输制造与供应链资源博弈，而不应该将其强拉到所谓的千倍溢价 SaaS 科技溢价轨道上。"
        ]
      },
      es: {
        slogan: "Marca de colchones D2C que vendía colchones de espuma comprimidos en cajas de cartón.",
        detailedFailureReason: "Costos de envío por devoluciones masivos, presupuestos de marketing desmedidos y clones competitivos.",
        postMortem: "Casper reformuló la compra de colchones pero chocó contra la baja recompra: las personas solo cambian su colchón cada diez años. Gastar más de $300 de CAC con bajos márgenes y copias (Purple, Nectar) erosionó la rentabilidad.",
        lessonsLearned: [
          "Los productos con un ciclo de reemplazo largo no resisten campañas continuas de CAC de alto costo.",
          "Los modelos D2C físicos son transparentes e imitables si carecen de patentes tecnológicas de resortes/espumas.",
          "Una marca de colchones es un negocio logístico e industrial, no un ecosistema tecnológico escalable."
        ]
      },
      fr: {
        slogan: "Entreprise de matelas D2C vendant des produits en mousse haute-densité livrés en boîte compacte.",
        detailedFailureReason: "Coûts de retour exorbitants, budgets marketing pharaoniques et nuée de clones bas de gamme.",
        postMortem: "Casper a transformé l'achat de literie en ligne avec des publicités hilarantes et une livraison en boîte originale. Mais avec une récurrence d'achat de dix ans, Casper injectait trop de CAC (300$+). La démultiplication de copies a achevé de tuer ses marges.",
        lessonsLearned: [
          "Un produit acheté tous les dix ans n'est pas compatible avec des budgets d'acquisition perpétuels.",
          "Les architectures e-commerce de fabrication physique sont trop rapides à copier sans barrières de dépôt breveté.",
          "Un producteur de matelas s'insère dans de l'assemblage et du transport routier, pas dans une valorisation tech."
        ]
      },
      it: {
        slogan: "Pioniere della vendita di materassi in scatola di cartone D2C.",
        detailedFailureReason: "Resi costosi, budget promozionali spropositati e copycat a bassissimo costo di produzione.",
        postMortem: "Casper ottenne visibilità immediata vendendo con simpatici sketch e scatole compatte. Un materasso però si ricompra dopo 10 anni. L'aumento del CAC pubblicitario e i rivali (Emma, Tuft) hanno azzerato i profitti.",
        lessonsLearned: [
          "Beni con tempi di sostituzione lunghi non sostengono carichi pubblicitari perpetui.",
          "La vendita D2C senz'argomenti di brevetto esclusivi si copia in pochi mesi.",
          "La catena dei materassi risponde a sfide camionistiche, non a logiche software ad alta marginalità."
        ]
      },
      ru: {
        slogan: "D2C-компания по продаже матрасов, поставлявшая матрасы из плотной пены сжатыми в коробках.",
        detailedFailureReason: "Огромная доля возвратов товара по почте, раздутые маркетинговые затраты и засилье дешевых матрасов-клонов.",
        postMortem: "Casper перепроектировала покупку матрасов с помощью классных комиксов и простой доставки. Их рост был огромен. Но люди не приобретают матрасы чаще одного раза в десятилетие. Casper платила до 300 долларов за клиента при жесткой конкуренции.",
        lessonsLearned: [
          "Товары с длинным 10-летним циклом службы не терпят непомерных рекламных затрат на привлечение.",
          "Физические D2C-модели копируются за пару недель при отсутствии запатентованных химических соединений.",
          "Производитель матрасов — это логистика и склад, а не технологический единорог с капитализацией SaaS."
        ]
      },
      el: {
        slogan: "Yoğun sünger yatakları kargo kutusunda doğrudan tüketiciye (D2C) satan yatak markası öncüsü.",
        detailedFailureReason: "Aşırı yüksek iade kargo maliyetleri, çılgın reklam harcamaları ve taklitçi ucuz markaların sektörü basması.",
        postMortem: "Casper sevimli reklamları ve kutuda teslimat kolaylığıyla internetten yatak alma devrini başlattı. Ancak bir kullanıcının ortalama 10 yılda bir yatak değiştirmesi, markanın sürekli yüksek reklam maliyetiyle dönmesini zorunlu kıldı ve iflas tehlikesiyle satıldılar.",
        lessonsLearned: [
          "Doğal ikame ömrü 10 yıl olan ürünler, yüksek sürdürülemez CAC maliyetleriyle yaşatılamaz.",
          "Fiziksel D2C modelleri, patentli hammadde bileşenleri ile korunmuyor ise rakiplerce hemen kopyalanır.",
          "Bir yatak şirketi özünde üretim-lojistik işidir, çarpanı uçuk bir teknoloji platformu değildir."
        ]
      }
    }
  };

  const cacheKey = `${startup.id}_${l}`;
  const localizedData = startupMap[startup.id]?.[l] || (dynamicCache && dynamicCache[cacheKey]);
  const ind = industryTable[startup.industry]?.[l] || startup.industry;
  const pfr = reasonTable[startup.primaryFailureReason]?.[l] || startup.primaryFailureReason;
  const c = countryTable[startup.country]?.[l] || startup.country;

  return {
    ...startup,
    industry: ind,
    primaryFailureReason: pfr,
    country: c,
    slogan: localizedData?.slogan || startup.slogan,
    detailedFailureReason: localizedData?.detailedFailureReason || startup.detailedFailureReason,
    postMortem: localizedData?.postMortem || startup.postMortem,
    lessonsLearned: localizedData?.lessonsLearned || startup.lessonsLearned
  };
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
          
          // Dispatch to active server pipeline for true fullstack cross-browser logging
          await fetch("/api/track-visit", {
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
  const [locale, setLocale] = useState<string>("en");

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
  const [selectedStartupId, setSelectedStartupId] = useState<string | null>(null);
  
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
    return Array.from(set);
  }, [allStartups]);

  // Unique failure reasons for Filtering
  const uniqueReasons = useMemo(() => {
    const set = new Set<string>();
    allStartups.forEach(s => set.add(s.primaryFailureReason));
    return Array.from(set);
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
    setSelectedStartupId(id);
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
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${themeStyles.bg}`} dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Dynamic Header Address container representing routing state */}
      <div className={`border-b text-[11px] font-mono py-1.5 px-4 flex items-center justify-between transition-colors ${themeStyles.headerAddr}`}>
        <div className="flex items-center gap-2 overflow-x-auto truncate">
          <span className={`font-semibold uppercase tracking-wider text-[9px] border px-1.5 py-0.5 rounded ${
            theme === "dark" 
              ? "text-yellow-500 border-yellow-850 bg-yellow-950/20" 
              : "text-yellow-700 border-yellow-300 bg-yellow-50"
          }`}>
            Route Simulation
          </span>
          <span className={theme === "dark" ? "text-gray-400" : "text-slate-600"}>https://pimxfail.com</span>
          <span className="opacity-40">/</span>
          <span className="text-emerald-600 font-semibold">{locale}</span>
          {activeTab === "blueprints" ? (
            <>
              <span className="opacity-40">/</span>
              <span className="text-purple-600 font-semibold">blueprints</span>
              <span className="opacity-40">/</span>
              <span className="text-pink-600 font-semibold">{activeBlueprintId}</span>
            </>
          ) : selectedStartupId ? (
            <>
              <span className="opacity-40">/</span>
              <span className="text-sky-600 font-semibold">startups</span>
              <span className="opacity-40">/</span>
              <span className="text-emerald-600 font-semibold">{selectedStartupId}</span>
            </>
          ) : null}
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs">
          <span className={theme === "dark" ? "text-gray-400" : "text-slate-500"}>🛡️ Edge Authenticated: Guest</span>
          <span className={theme === "dark" ? "text-emerald-500 font-mono" : "text-emerald-600 font-semibold"}>● Node.js Sandbox OK</span>
        </div>
      </div>

      {/* Primary Navigation and Branding bar */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-all duration-300 ${themeStyles.header}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/20 border border-rose-500/30">
              <Skull className="h-5.5 w-5.5 text-[#060a13] stroke-[2.5]" />
            </div>
            <div>
              <h1 className={`font-display font-bold text-xl tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{t.title}</h1>
              <p className={`text-xs max-w-sm hidden md:block ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}>{t.subtitle}</p>
            </div>
          </div>

          {/* Action Tabs & Switchers */}
          <div className="flex flex-wrap items-center gap-3 justify-center">
            
            {/* Tab view controller */}
            <div className={`border rounded-lg p-1 flex transition-colors ${
              theme === "dark" ? "bg-[#0b1322] border-gray-800" : "bg-slate-100 border-slate-200"
            }`}>
              <button
                onClick={() => { setActiveTab("database"); setSelectedStartupId(null); }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "database" 
                    ? themeStyles.tabActive 
                    : (theme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900")
                }`}
              >
                <Database className="h-3.5 w-3.5" />
                <span>{t.graveyardDb || "Graveyard DB"}</span>
              </button>
              <button
                onClick={() => setActiveTab("blueprints")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "blueprints" 
                    ? themeStyles.tabActiveBlueprint 
                    : (theme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900")
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>{t.blueprintTitle}</span>
              </button>
            </div>

            {/* Custom Designed Dropdown Language Localizer Switcher */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setIsLangMenuOpen(!isLangMenuOpen); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  theme === "dark"
                    ? "bg-[#0b1322] border-gray-800 hover:border-gray-700 text-rose-400"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-rose-600 shadow-xs"
                }`}
                aria-label="Select Language"
              >
                <Globe className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <span>
                  {locale === "en" && "English"}
                  {locale === "fa" && "Persian"}
                  {locale === "ar" && "Arabic"}
                  {locale === "de" && "Deutsch"}
                  {locale === "zh" && "中文 (Chinese)"}
                  {locale === "es" && "Español"}
                  {locale === "fr" && "Français"}
                  {locale === "it" && "Italiano"}
                  {locale === "ru" && "Русский"}
                  {locale === "el" && "Ελληνικά"}
                </span>
                <span className="text-[9px] opacity-60">▼</span>
              </button>

              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-50 screen-overlay" onClick={() => setIsLangMenuOpen(false)} />
                  <div className={`absolute right-0 mt-1.5 w-52 rounded-xl border p-2 shadow-xl z-50 ${
                    theme === "dark"
                      ? "bg-[#0d1424] border-gray-800 text-gray-200"
                      : "bg-white border-slate-200 text-slate-800"
                  }`}>
                    <div className={`p-1.5 text-[10px] font-mono tracking-wider uppercase border-b mb-1 ${
                      theme === "dark" ? "text-gray-400 border-gray-800" : "text-slate-500 border-slate-100"
                    }`}>
                      {isRtl ? "انتخاب زبان" : "Select Region / Locale"}
                    </div>
                    {[
                      { code: "en", label: "English" },
                      { code: "fa", label: "Persian", isRtlGrid: false },
                      { code: "ar", label: "Arabic", isRtlGrid: false },
                      { code: "de", label: "Deutsch" },
                      { code: "zh", label: "中文 (Chinese)" },
                      { code: "es", label: "Español" },
                      { code: "fr", label: "Français" },
                      { code: "it", label: "Italiano" },
                      { code: "ru", label: "Русский" },
                      { code: "el", label: "Ελληνικά" }
                    ].map((item) => (
                      <button
                        key={item.code}
                        onClick={() => {
                          setLocale(item.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          locale === item.code
                            ? (theme === "dark" ? "bg-rose-950/40 text-rose-400 font-semibold" : "bg-rose-50 text-rose-600 font-semibold")
                            : (theme === "dark" ? "hover:bg-gray-800/60" : "hover:bg-slate-100")
                        }`}
                        style={{ direction: item.isRtlGrid ? "rtl" : "ltr" }}
                      >
                        <span className="truncate">{item.label}</span>
                        {locale === item.code && <Check className="h-3.5 w-3.5 shrink-0 ml-1" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
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

            {/* Proactive code asset button linking back to files */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-gradient-to-r from-rose-600 to-amber-600 text-white font-semibold text-xs tracking-tight px-3.5 py-1.8 rounded-lg shadow-md hover:from-rose-500 hover:to-amber-500 transition-all flex items-center gap-1 border border-rose-500/20 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">{t.addBtn}</span>
            </button>

          </div>
        </div>
      </header>

      {/* Main Container Hero */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative">
        
        {/* Visual Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-950/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-950/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Global Statistical Overview Banners */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
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
            <div className="text-center max-w-3xl mx-auto py-8">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border mb-3 tracking-wider uppercase ${
                theme === "dark" 
                  ? "bg-rose-950/40 text-rose-400 border-rose-900/50" 
                  : "bg-rose-100 text-rose-700 border-rose-200"
              }`}>
                💀 Global Autopsy Database Hub
              </span>
              <h2 className={`font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-tight ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}>
                {t.tagline}
              </h2>
              <p className={`mt-3 text-base max-w-xl mx-auto ${themeStyles.textMuted}`}>
                Discover the engineering friction, structural missteps, cash burns, and regulatory hurdles that crippled unicorn ideas before they reached security.
              </p>
            </div>

            {/* SINGLE-COLUMN DATABASE LISTING VIEW */}
            <div className="space-y-6">
                
                {/* Search, Filter Bar Panel */}
                <div className={`rounded-2xl p-5 space-y-4 border transition-colors ${themeStyles.panel}`}>
                  
                  {/* Text search form */}
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${theme === "dark" ? "text-gray-500" : "text-slate-400"}`} />
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full rounded-xl py-3 pl-10 pr-4 text-sm transition-all shadow-inner font-sans border focus:outline-none ${themeStyles.input}`}
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
                    
                    <div>
                      <label className={`block text-[11px] font-semibold mb-1 uppercase tracking-wider ${themeStyles.textMuted}`}>{t.filterAll}</label>
                      <select
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className={`w-full rounded-xl px-3 py-2.5 text-xs focus:outline-none cursor-pointer border ${themeStyles.input}`}
                      >
                        <option value="all" className={theme === "dark" ? "bg-[#0b1322] text-gray-300" : "bg-white text-slate-800"}>{isRtl ? "همه حوزه‌ها" : "All Industries"}</option>
                        {uniqueIndustries.map(ind => (
                          <option key={ind} value={ind} className={theme === "dark" ? "bg-[#0b1322] text-gray-300" : "bg-white text-slate-800"}>{ind}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-[11px] font-semibold mb-1 uppercase tracking-wider ${themeStyles.textMuted}`}>{t.filterReason}</label>
                      <select
                        value={selectedReason}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className={`w-full rounded-xl px-3 py-2.5 text-xs focus:outline-none cursor-pointer border ${themeStyles.input}`}
                      >
                        <option value="all" className={theme === "dark" ? "bg-[#0b1322] text-gray-300" : "bg-white text-slate-800"}>{isRtl ? "همه علل شکست" : "All Failure Reasons"}</option>
                        {uniqueReasons.map(r => (
                          <option key={r} value={r} className={theme === "dark" ? "bg-[#0b1322] text-gray-300" : "bg-white text-slate-800"}>{r}</option>
                        ))}
                      </select>
                    </div>

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
                            onClick={() => setSelectedStartupId(startup.id)}
                            className={`group border rounded-2xl p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
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
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h3 className={`font-display font-bold text-lg group-hover:text-rose-500 transition-colors ${themeStyles.textDarkFocus}`}>
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
                                <div className="w-full bg-slate-300 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
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
                          onClick={() => setSelectedStartupId(s.id)}
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
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t transition-colors ${themeStyles.divider}`}>
              
              {/* Chart 1: Failure Breakdown SVG */}
              <div className={`border rounded-2xl p-6 space-y-4 transition-colors ${theme === "dark" ? "bg-[#0b1322]/80 border-gray-800" : "bg-white border-slate-200"}`}>
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
                    <div className="bg-white dark:bg-gray-950 h-3.5 rounded-md border border-slate-200 dark:border-gray-800/60 overflow-hidden flex">
                      <div className="bg-rose-500 h-full" style={{ width: "35%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className={themeStyles.textMuted}>{t.breakdownEconomics || "Dysfunctional Economics (WeWork)"}</span>
                      <span className={`font-bold ${themeStyles.textDarkFocus}`}>22%</span>
                    </div>
                    <div className="bg-white dark:bg-gray-950 h-3.5 rounded-md border border-slate-200 dark:border-gray-800/60 overflow-hidden flex">
                      <div className="bg-amber-500 h-full" style={{ width: "22%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className={themeStyles.textMuted}>{t.breakdownEngineering || "Over-engineering (Juicero)"}</span>
                      <span className={`font-bold ${themeStyles.textDarkFocus}`}>18%</span>
                    </div>
                    <div className="bg-white dark:bg-gray-950 h-3.5 rounded-md border border-slate-200 dark:border-gray-800/60 overflow-hidden flex">
                      <div className="bg-sky-500 h-full" style={{ width: "18%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className={themeStyles.textMuted}>{t.breakdownFraud || "Fraud & Misgovernance (FTX, Theranos)"}</span>
                      <span className={`font-bold ${themeStyles.textDarkFocus}`}>15%</span>
                    </div>
                    <div className="bg-white dark:bg-gray-950 h-3.5 rounded-md border border-slate-200 dark:border-gray-800/60 overflow-hidden flex">
                      <div className="bg-purple-500 h-full" style={{ width: "15%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className={themeStyles.textMuted}>{t.breakdownSaturation || "Competitor Saturation (Pebble)"}</span>
                      <span className={`font-bold ${themeStyles.textDarkFocus}`}>10%</span>
                    </div>
                    <div className="bg-white dark:bg-gray-950 h-3.5 rounded-md border border-slate-200 dark:border-gray-800/60 overflow-hidden flex">
                      <div className="bg-emerald-500 h-full" style={{ width: "10%" }} />
                    </div>
                  </div>

                </div>
              </div>

              {/* Chart 2: Survival Year Bracket SVG */}
              <div className={`border rounded-2xl p-6 space-y-4 transition-colors ${theme === "dark" ? "bg-[#0b1322]/80 border-gray-800" : "bg-white border-slate-200"}`}>
                <div className={`flex items-center gap-1.5 border-b pb-3 transition-colors ${themeStyles.divider}`}>
                  <Activity className="h-4 w-4 text-emerald-500" />
                  <h3 className={`font-display font-bold text-sm ${themeStyles.textDarkFocus}`}>
                    {t.averageLifespan}
                  </h3>
                </div>

                {/* Grid Visual Survival Stats */}
                <div className="grid grid-cols-4 gap-3 text-center py-4 text-xs font-sans">
                  
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
          <div className="space-y-6">
            
            {/* Header intro */}
            <div className="text-center max-w-2xl mx-auto pb-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold border mb-2 uppercase tracking-wide transition-colors ${
                theme === "dark" 
                  ? "bg-purple-950/40 text-purple-400 border-purple-900/50" 
                  : "bg-purple-50 text-purple-700 border-purple-200/90"
              }`}>
                💻 Production-Ready Coding Blueprints
              </span>
              <h2 className={`font-display font-bold text-3xl tracking-tight transition-colors ${themeStyles.textDarkFocus}`}>
                {t.blueprintTitle}
              </h2>
              <p className={`text-sm mt-1.5 transition-colors ${themeStyles.textMuted}`}>
                {t.blueprintSubtitle}. These codebases are directly compatible with Cloudflare Workers (Hono dialect) and Drizzle SQLite/D1 ORM pipelines.
              </p>
            </div>

            {/* BLUEPRINT MULTI-PANEL VIEW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT CHANNEL SELECTION (3 COLS) */}
              <div className="lg:col-span-3 space-y-2">
                <span className={`block text-[10px] font-bold uppercase tracking-wider px-2 mb-1 ${themeStyles.textMuted}`}>
                  {t.blueprintTabsHeader || "Blueprint Sections"}
                </span>
                {TECHNICAL_BLUEPRINTS.map(bp => {
                  const localizedBp = getLocalizedBlueprint(bp, locale);
                  return (
                    <button
                      key={bp.id}
                      onClick={() => setActiveBlueprintId(bp.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all font-mono text-xs flex items-center justify-between cursor-pointer ${
                        activeBlueprintId === bp.id
                          ? (theme === "dark" 
                              ? "bg-purple-950/60 text-purple-300 border border-purple-900/50 shadow-md shadow-purple-950/20"
                              : "bg-purple-100 text-purple-800 border border-purple-200 shadow-xs font-semibold")
                          : (theme === "dark"
                              ? "bg-[#0b1322]/60 text-gray-400 hover:bg-[#111c30] hover:text-white border border-gray-800/40"
                              : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200/80 shadow-2xs")
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="h-2 w-2 rounded-full bg-purple-500 shrink-0" />
                        <span className="truncate">{localizedBp.title}</span>
                      </div>
                      <ChevronRight className="h-3 w-3 text-purple-700" />
                    </button>
                  );
                })}
              </div>

              {/* RIGHT EXPANDED CODEBOARD syntax visualizer (9 COLS) */}
              <div className={`lg:col-span-9 border rounded-2xl overflow-hidden shadow-2xl relative transition-all ${
                theme === "dark" ? "bg-[#0b1322] border-gray-800" : "bg-white border-slate-200 shadow-sm"
              }`}>
                
                {/* Visual title board */}
                <div className={`border-b p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                  theme === "dark" ? "bg-[#03060c] border-gray-800/80" : "bg-slate-50 border-slate-200"
                }`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-display font-bold text-sm ${themeStyles.textDarkFocus}`}>{currentBlueprint.title}</h3>
                      <span className={`font-mono text-[9px] px-1.5 py-0.2 rounded uppercase transition-colors ${
                        theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-slate-200 text-slate-600 font-semibold"
                      }`}>
                        {currentBlueprint.category}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-1 max-w-xl transition-colors ${themeStyles.textMuted}`}>{currentBlueprint.description}</p>
                  </div>

                  {/* Copy button action */}
                  <button
                    onClick={() => handleCopyCode(currentBlueprint.id, currentBlueprint.code)}
                    className={`px-3.5 py-1.8 rounded-lg border text-[11px] font-medium font-sans flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
                <div className={`p-5 overflow-x-auto max-h-[580px] text-[12px] font-mono leading-relaxed select-all scrollbar-thin transition-colors ${
                  theme === "dark" ? "bg-[#03060b] text-gray-300" : "bg-slate-50 text-slate-800 border-y border-slate-200"
                }`}>
                  <pre className="whitespace-pre">{currentBlueprint.code}</pre>
                </div>

                {/* Info block footer */}
                <div className={`p-3 px-4 text-[10.5px] font-sans flex items-center gap-2 border-t transition-colors ${
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
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          
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
              }`}>/en/startups/wework</span>
              <span className={`px-1.5 py-0.5 rounded border transition-colors ${
                theme === "dark" ? "bg-gray-950 border-gray-905 text-gray-400" : "bg-slate-200/60 text-slate-700 border-slate-300"
              }`}>/fa/startups/wework</span>
              <span className={`px-1.5 py-0.5 rounded border transition-colors ${
                theme === "dark" ? "bg-gray-950 border-gray-905 text-gray-400" : "bg-slate-200/60 text-slate-700 border-slate-300"
              }`}>/de/startups/wework</span>
              <span className={`px-1.5 py-0.5 rounded border transition-colors ${
                theme === "dark" ? "bg-gray-950 border-gray-905 text-gray-400" : "bg-slate-200/60 text-slate-700 border-slate-300"
              }`}>/zh/startups/wework</span>
              <span className={`px-1.5 py-0.5 rounded border transition-colors ${
                theme === "dark" ? "bg-gray-950 border-gray-905 text-gray-400" : "bg-slate-200/60 text-slate-700 border-slate-300"
              }`}>/es/startups/wework</span>
              <span className={`px-1.5 py-0.5 rounded border transition-colors ${
                theme === "dark" ? "bg-gray-950 border-gray-905 text-gray-400" : "bg-slate-200/60 text-slate-700 border-slate-300"
              }`}>/fr/startups/wework</span>
            </div>
            <p className={`text-[10px] leading-normal leading-tighter transition-colors ${
              theme === "dark" ? "text-gray-600" : "text-slate-400"
            }`}>
              {t.seoDescription || "Dynamic internationalized sub-directories are served instantly at edge matching hreflangs and canonical parameters."}
            </p>
          </div>

        </div>

        <div className={`max-w-7xl mx-auto px-4 mt-8 pt-8 border-t text-center text-[11px] transition-colors ${
          theme === "dark" ? "border-gray-800/40 text-gray-600" : "border-slate-250 text-slate-400"
        }`}>
          <span>&copy; {new Date().getFullYear()} PIMXFAIL. {t.copyRights || "All rights reserved."}</span>
        </div>
      </footer>

      {/* MODAL VIEW: SUBMIT NEW STARTUP CASE */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm shadow-xl animate-fade-in">
          <div className={`border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative transition-all duration-300 ${themeStyles.modalBg}`} dir={isRtl ? "rtl" : "ltr"}>
            
            {/* Modal header */}
            <div className={`px-6 py-4 flex items-center justify-between border-b transition-colors ${
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
            <form onSubmit={handleAddStartupSubmit} className="p-6 space-y-4 max-h-[480px] overflow-y-auto">
              
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
              <div className={`flex justify-end gap-3 pt-3 border-t transition-colors ${themeStyles.divider}`}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm shadow-xl animate-fade-in">
          <div className={`border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative transition-all duration-300 ${themeStyles.modalBg}`} dir={isRtl ? "rtl" : "ltr"}>
            
            {/* Design backdrop accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-amber-500" />
            
            {/* Modal header */}
            <div className={`px-6 py-5 flex items-center justify-between border-b transition-colors ${
              theme === "dark" ? "bg-[#03060c] border-gray-800" : "bg-slate-50 border-slate-200"
            }`}>
              <div>
                <span className="text-[10px] font-mono text-rose-500 tracking-wider uppercase font-semibold">
                  {isRtl ? "کالبدشکافی کامل استارتاپ" : "Autopsy Profile Report"}
                </span>
                <h3 className={`font-display font-extrabold text-xl md:text-2xl mt-0.5 ${themeStyles.textDarkFocus}`}>
                  {selectedStartup.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedStartupId(null)}
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
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
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
              <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border text-xs font-mono transition-colors ${
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
                  onClick={(e) => {
                    const url = `https://pimxfail.com/${locale}/startups/${selectedStartup.id}`;
                    navigator.clipboard.writeText(url);
                    setCopiedSeoId(selectedStartup.id);
                    setTimeout(() => setCopiedSeoId(null), 3000);
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
                      : `📋 ${isRtl ? "اشتراک‌گذاری:" : "Share link:"} /${locale}/startups/${selectedStartup.id}`}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 ml-1" />
                </button>
              </div>

            </div>

            {/* Modal footer action */}
            <div className={`px-6 py-4 flex justify-end border-t transition-colors ${
              theme === "dark" ? "bg-[#03060c] border-gray-800" : "bg-slate-50 border-slate-200"
            }`}>
              <button
                onClick={() => setSelectedStartupId(null)}
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

