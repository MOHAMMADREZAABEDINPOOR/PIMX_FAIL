const fs = require("node:fs");
const path = require("node:path");
const { parseRawCatalog } = require("./researchStartups.cjs");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");

function cleanText(value) {
  if (typeof value !== "string") return value;
  return value
    .replace(/\u00f0\u0178\u2019[\u20ac\u00bb]/g, "")
    .replace(/\u00e2\u2014\u008f/g, "-")
    .replace(/\u00e2\u20ac[\u201d\u201c]/g, " - ")
    .replace(/\u00e2\u20ac[\u2122\u02dc]/g, "'")
    .replace(/\u00e2\u20ac[\u0153\u009d]/g, '"')
    .replace(/\u00e2\u20ac\u00a6/g, "...")
    .replace(/\u00c2/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function englishOnlyDescription(value) {
  return cleanText(value)
    .replace(/\([^)]*[\p{Script=Arabic}\p{Script=Cyrillic}\p{Script=Greek}\p{Script=Han}\p{Script=Hebrew}][^)]*\)/gu, "")
    .replace(/\u042fRUS/g, "YaRUS")
    .replace(/[\p{Script=Arabic}\p{Script=Cyrillic}\p{Script=Greek}\p{Script=Han}\p{Script=Hebrew}]/gu, "")
    .replace(/\u00b7/g, " - ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function englishLifespan(value) {
  const years = [...String(value).matchAll(/\b(?:18|19|20)\d{2}\b/g)].map((match) => Number(match[0]));
  if (years.length > 1) return `${years[0]} - ${years[1]} (${Math.max(0, years[1] - years[0])} years)`;
  if (years.length === 1) return `${years[0]} (founding date not publicly documented)`;
  return "Not publicly documented";
}

function rewriteRawFiles() {
  const records = parseRawCatalog();
  for (let fileNumber = 1; fileNumber <= 10; fileNumber += 1) {
    const start = (fileNumber - 1) * 170;
    const batch = records.slice(start, start + 170);
    const content = batch.map((record, index) => [
      `#${start + index + 1}`,
      record.id === "rus" ? "YaRUS" : englishOnlyDescription(record.name),
      record.industry,
      englishOnlyDescription(record.description),
      "Lifespan:",
      englishLifespan(record.lifespan),
      "Funding:",
      record.fundingRaised && /[\x00-\x7F]/.test(record.fundingRaised) ? record.fundingRaised : "No public funding amount reported",
      "Failure score:",
      `${record.failureScore}%`,
      record.primaryFailureReason,
    ].join("\n")).join("\n\n\n");
    fs.writeFileSync(path.join(SRC, `raw_startups_${fileNumber}.txt`), `${content}\n`, "utf8");
  }
}

function rewriteTranslations() {
  const filePath = path.join(SRC, "translations.json");
  const translations = JSON.parse(fs.readFileSync(filePath, "utf8"));
  for (const [key, value] of Object.entries(translations)) translations[key] = cleanText(value);
  Object.assign(translations, {
    language: "English",
    hubBadge: "Global Autopsy Database Hub",
    blueprintBadge: "Production-Ready Coding Blueprints",
    seoCheckpoints: "English SEO Checkpoints",
    seoDescription: "Canonical English routes are served consistently across the application.",
    selectLanguage: "English",
  });
  fs.writeFileSync(filePath, `${JSON.stringify(translations, null, 2)}\n`, "utf8");
}

function rewriteBlueprints() {
  const blueprints = [
    {
      id: "architecture",
      title: "System Architecture",
      category: "Edge Infrastructure",
      description: "English-only request flow for the React client, Express API, and static startup catalog.",
      icon: "Network",
      codeLanguage: "text",
      code: "Browser -> React application -> /api/startups -> English startup catalog\nBrowser -> /api/analyze -> server-side AI diagnostic\nBrowser -> /api/visits -> privacy-aware operational telemetry",
    },
    {
      id: "folder-structure",
      title: "Repository Structure",
      category: "Code Organization",
      description: "A compact production layout with one canonical English content source.",
      icon: "FolderGit2",
      codeLanguage: "text",
      code: "src/\n  App.tsx                    # English user interface\n  startups.json              # Canonical startup catalog\n  startup_research.json      # Structured Wikidata findings\n  startup_wikipedia.json     # English Wikipedia findings\n  translations.json          # English interface copy\nserver.ts                     # API and application server\nscripts/                      # Research, build, and audit tools",
    },
    {
      id: "startup-schema",
      title: "Startup Data Contract",
      category: "TypeScript Schema",
      description: "The normalized English record shape used by the client and server.",
      icon: "Database",
      codeLanguage: "typescript",
      code: "interface Startup {\n  id: string;\n  name: string;\n  slogan: string;\n  industry: string;\n  yearFounded: number | 'Not publicly documented';\n  yearFailed: number | 'Not publicly documented';\n  fundingRaised: string;\n  primaryFailureReason: string;\n  detailedFailureReason: string;\n  founders: string[];\n  country: string;\n  postMortem: string;\n  lessonsLearned: string[];\n  sourceUrls?: string[];\n}",
    },
    {
      id: "api-design",
      title: "API Design",
      category: "Express Endpoints",
      description: "Small English-only endpoints for catalog delivery, diagnostics, and visit telemetry.",
      icon: "Terminal",
      codeLanguage: "typescript",
      code: "GET  /api/health    # Service status\nGET  /api/startups  # Complete English startup catalog\nPOST /api/analyze   # English failure diagnostic\nGET  /api/visits    # Recent operational visits\nPOST /api/visits    # Record an operational visit",
    },
    {
      id: "data-audit",
      title: "Data Audit Pipeline",
      category: "Data Quality",
      description: "Repeatable validation for required fields, unique IDs, valid scores, and honest disclosure labels.",
      icon: "ShieldAlert",
      codeLanguage: "shell",
      code: "node scripts/researchStartups.cjs prepare\nnode scripts/researchStartups.cjs merge\nnode scripts/buildStartupCatalog.cjs\nnode scripts/auditStartups.cjs src/startups.json",
    },
  ];
  fs.writeFileSync(path.join(SRC, "technical_blueprints.json"), `${JSON.stringify(blueprints, null, 2)}\n`, "utf8");
}

function rewriteDataModules() {
  const dataModule = `import type { Startup, TechnicalBlueprint } from "./types";
import startupCatalog from "./startups.json";
import blueprintCatalog from "./technical_blueprints.json";
import englishTranslations from "./translations.json";

export const SEED_STARTUPS = startupCatalog as Startup[];
export const TECHNICAL_BLUEPRINTS = blueprintCatalog as TechnicalBlueprint[];
export const TRANSLATIONS = { en: englishTranslations } as const;
`;
  fs.writeFileSync(path.join(SRC, "data.ts"), dataModule, "utf8");
  fs.writeFileSync(path.join(SRC, "data_generated.ts"), 'export { SEED_STARTUPS } from "./data";\n', "utf8");
}

function sanitizeResearchFiles() {
  const sanitize = (value) => {
    if (typeof value === "string") return englishOnlyDescription(value);
    if (Array.isArray(value)) return value.map(sanitize);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, sanitize(entry)]));
    return value;
  };
  for (const fileName of ["startup_research.json", "startup_wikipedia.json", "startup_legacy_curated.json", "startup_legacy_enrichment.json"]) {
    const filePath = path.join(SRC, fileName);
    if (!fs.existsSync(filePath)) continue;
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    fs.writeFileSync(filePath, `${JSON.stringify(sanitize(data), null, 2)}\n`, "utf8");
  }
}

rewriteRawFiles();
rewriteTranslations();
rewriteBlueprints();
rewriteDataModules();
sanitizeResearchFiles();
console.log("Converted catalog sources and runtime data modules to English-only content.");
