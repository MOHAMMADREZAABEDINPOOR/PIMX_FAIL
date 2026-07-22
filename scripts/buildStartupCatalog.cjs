const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const { parseRawCatalog } = require("./researchStartups.cjs");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const PLACEHOLDER = /^(?:unknown|n\/?a|not available|not disclosed|undisclosed|unspecified|international)$/i;

function loadTypeScriptModule(relativePath) {
  const filePath = path.join(ROOT, relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const moduleShim = { exports: {} };
  const localRequire = (request) => require(request.startsWith(".") ? path.resolve(path.dirname(filePath), request) : request);
  new Function("exports", "module", "require", output)(moduleShim.exports, moduleShim, localRequire);
  return moduleShim.exports;
}

function extractServerEnrichment() {
  const recoveredPath = path.join(ROOT, "src", "startup_legacy_enrichment.json");
  if (fs.existsSync(recoveredPath)) return JSON.parse(fs.readFileSync(recoveredPath, "utf8"));
  const filePath = path.join(ROOT, "server.ts");
  const source = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let initializer = "";
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(sourceFile) === "enrichmentMap" && node.initializer) {
      initializer = node.initializer.getText(sourceFile);
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return initializer ? new Function(`return (${initializer});`)() : {};
}

function english(value) {
  if (typeof value === "string") return cleanText(value);
  if (value && typeof value === "object" && typeof value.en === "string") return cleanText(value.en);
  return "";
}

function cleanText(value) {
  return value
    .replace(/\u00e2\u20ac[\u201d\u201c]/g, " - ")
    .replace(/\u00e2\u20ac[\u2122\u02dc]/g, "'")
    .replace(/\u00e2\u20ac[\u0153\u009d]/g, '"')
    .replace(/\u00e2\u20ac\u00a6/g, "...")
    .replace(/\u00c2/g, "")
    .replace(/[—–]/g, " - ")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, "...")
    .replace(/\([^)]*[\p{Script=Arabic}\p{Script=Cyrillic}\p{Script=Greek}\p{Script=Han}\p{Script=Hebrew}][^)]*\)/gu, "")
    .replace(/\u042fRUS/g, "YaRUS")
    .replace(/[\p{Script=Arabic}\p{Script=Cyrillic}\p{Script=Greek}\p{Script=Han}\p{Script=Hebrew}]/gu, "")
    .replace(/\u00b7/g, " - ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function usefulList(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map(english)
    .filter((entry) => entry && !PLACEHOLDER.test(entry) && !/not publicly documented/i.test(entry));
}

function normalizeName(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function extractFounders(description) {
  const candidates = [];
  const patterns = [
    /\b(?:co-?founded|founded|launched|started|established|created)(?:\s+in\s+(?:18|19|20)\d{2})?\s+by ([^.;]{3,120})/gi,
    /\bbrainchild of ([^.;]{3,120})/gi,
    /\bfounders?[, :]+\s*([^.;]{3,120})/gi,
    /\bfounder ([A-Z][\p{L}'-]+(?:\s+[A-Z][\p{L}'-]+){1,3})/gu,
  ];
  for (const pattern of patterns) {
    for (const match of description.matchAll(pattern)) {
      const phrase = match[1]
        .replace(/\b(?:who|whose|with|after|before|in|to|as|and the company).*$/i, "")
        .trim();
      for (const part of phrase.split(/\s+(?:and|&)\s+|,\s*/)) {
        const name = part.trim().replace(/^(?:CEO|entrepreneur|engineer|brothers?)\s+/i, "");
        if (/^[A-Z][\p{L}'-]+(?:\s+[A-Z][\p{L}'-]+){1,3}$/u.test(name)) candidates.push(name);
      }
    }
  }
  return [...new Set(candidates)].slice(0, 6);
}

function extractYears(description) {
  const rangeMatch = description.match(/\b((?:18|19|20)\d{2})\s*(?:-|–|—|to|until|through)\s*((?:18|19|20)\d{2})\b/i)
    || description.match(/\bfrom\b[^.]{0,60}\b((?:18|19|20)\d{2})\b[^.]{0,80}\b(?:to|until|through)\b[^.]{0,40}\b((?:18|19|20)\d{2})\b/i);
  if (rangeMatch && Number(rangeMatch[2]) >= Number(rangeMatch[1])) {
    return { yearFounded: Number(rangeMatch[1]), yearFailed: Number(rangeMatch[2]) };
  }
  const foundedPatterns = [
    /\b(?:founded|established|launched|started|incorporated|created)\s+(?:in\s+)?((?:18|19|20)\d{2})\b/i,
    /\bsince\s+((?:18|19|20)\d{2})\b/i,
  ];
  const failedPatterns = [
    /\b(?:shut down|closed|folded|ceased operations|dissolved|liquidated|filed for bankruptcy|went bankrupt|collapsed|ended|discontinued|retired|went offline|was acquired)\s+(?:in\s+|on\s+[^,.;]+,?\s*)?((?:19|20)\d{2})\b/i,
    /\bin\s+((?:19|20)\d{2})\b[^.]{0,100}\b(?:shut down|closed|folded|ceased operations|dissolved|liquidated|bankrupt|collapsed|ended|discontinued|retired|went offline|acquired)\b/i,
  ];
  const find = (patterns) => {
    for (const pattern of patterns) {
      const match = description.match(pattern);
      if (match) return Number(match[1]);
    }
    return 0;
  };
  return { yearFounded: find(foundedPatterns), yearFailed: find(failedPatterns) };
}

const COUNTRY_RULES = [
  ["United States", /\b(?:United States|U\.S\.|American|Silicon Valley|San Francisco|California|New York|Seattle|Boston|Chicago|Austin)\b/i],
  ["United Kingdom", /\b(?:United Kingdom|U\.K\.|British|London|England|Scotland|Wales)\b/i],
  ["China", /\b(?:China|Chinese|Beijing|Shanghai|Shenzhen)\b/i],
  ["India", /\b(?:India|Indian|Bengaluru|Bangalore|Mumbai|Delhi)\b/i],
  ["Israel", /\b(?:Israel|Israeli|Tel Aviv)\b/i],
  ["Germany", /\b(?:Germany|German|Berlin|Munich|Hamburg)\b/i],
  ["Canada", /\b(?:Canada|Canadian|Toronto|Vancouver|Montreal)\b/i],
  ["France", /\b(?:France|French|Paris)\b/i],
  ["Australia", /\b(?:Australia|Australian|Sydney|Melbourne)\b/i],
  ["Singapore", /\bSingapore\b/i],
  ["Japan", /\b(?:Japan|Japanese|Tokyo)\b/i],
  ["South Korea", /\b(?:South Korea|Korean|Seoul)\b/i],
  ["Hong Kong", /\bHong Kong\b/i],
  ["Netherlands", /\b(?:Netherlands|Dutch|Amsterdam)\b/i],
  ["Sweden", /\b(?:Sweden|Swedish|Stockholm)\b/i],
  ["Spain", /\b(?:Spain|Spanish|Madrid|Barcelona)\b/i],
  ["Brazil", /\b(?:Brazil|Brazilian|Sao Paulo|São Paulo)\b/i],
  ["Russia", /\b(?:Russia|Russian|Moscow)\b/i],
  ["Ireland", /\b(?:Ireland|Irish|Dublin)\b/i],
  ["Switzerland", /\b(?:Switzerland|Swiss|Zurich)\b/i],
  ["Bahamas", /\bBahamas\b/i],
];

function inferCountry(description) {
  return COUNTRY_RULES.find(([, pattern]) => pattern.test(description))?.[0] || "";
}

function cleanFunding(value) {
  const funding = english(value);
  if (!funding || PLACEHOLDER.test(funding) || /^[^\x00-\x7F]+$/.test(funding)) {
    return "No public funding amount reported";
  }
  return funding;
}

function firstSentence(description, name, industry) {
  const sentence = description.match(/^.{25,180}?[.!?](?:\s|$)/)?.[0]?.trim();
  return sentence || `${name} operated in the ${industry} sector before ceasing operations.`;
}

function lessonsFor(reason) {
  const text = reason.toLowerCase();
  const lessons = [
    "Validate sustainable unit economics with real customer behavior before accelerating expansion.",
    "Track cash runway, retention, and operational risk with independent governance and regular reviews.",
    "Test the assumptions behind the business model early and respond quickly when evidence disproves them.",
  ];
  if (/fraud|governance|accounting|regulat/.test(text)) {
    lessons[1] = "Maintain independent oversight, auditable controls, and transparent reporting from the earliest stage.";
  }
  if (/competition|saturation|market/.test(text)) {
    lessons[2] = "Build a differentiated product and defensible distribution before larger competitors compress the market.";
  }
  if (/burn|fund|capital|economics|revenue/.test(text)) {
    lessons[0] = "Tie hiring and expansion to verified revenue, contribution margin, and a realistic capital plan.";
  }
  if (/technical|engineering|hardware|product/.test(text)) {
    lessons[2] = "Prove technical feasibility and customer value with a narrow product before funding a complex build-out.";
  }
  return lessons;
}

function stableScore(name, offset, min, max) {
  let hash = offset;
  for (let index = 0; index < name.length; index += 1) hash = name.charCodeAt(index) + ((hash << 5) - hash);
  return min + (Math.abs(hash) % (max - min + 1));
}

function buildCatalog() {
  const rawCatalog = parseRawCatalog();
  const currentData = loadTypeScriptModule("src/data.ts");
  const recoveredCuratedPath = path.join(SRC, "startup_legacy_curated.json");
  const recoveredCurated = fs.existsSync(recoveredCuratedPath) ? JSON.parse(fs.readFileSync(recoveredCuratedPath, "utf8")) : [];
  const curatedById = new Map();
  const curatedByName = new Map();
  for (const startup of [...recoveredCurated, ...(currentData.SEED_STARTUPS || [])]) {
    if (!curatedById.has(startup.id)) curatedById.set(startup.id, startup);
    const key = normalizeName(startup.name || "");
    if (key && !curatedByName.has(key)) curatedByName.set(key, startup);
  }
  const serverEnrichment = extractServerEnrichment();
  const researchPath = path.join(SRC, "startup_research.json");
  const research = fs.existsSync(researchPath) ? JSON.parse(fs.readFileSync(researchPath, "utf8")) : {};
  const wikipediaPath = path.join(SRC, "startup_wikipedia.json");
  const wikipedia = fs.existsSync(wikipediaPath) ? JSON.parse(fs.readFileSync(wikipediaPath, "utf8")) : {};

  const catalog = rawCatalog.map((raw) => {
    const curated = curatedById.get(raw.id) || curatedByName.get(normalizeName(raw.name)) || {};
    const verified = research[raw.id] || {};
    const encyclopedia = wikipedia[raw.id] || {};
    const serverPatch = serverEnrichment[raw.id] || {};
    const curatedFounders = usefulList(curated.founders);
    const researchText = `${encyclopedia.extract || ""} ${raw.description}`.trim();
    const extractedFounders = extractFounders(researchText);
    const founders = verified.founders?.length
      ? verified.founders
      : curatedFounders.length
        ? curatedFounders
        : extractedFounders.length
          ? extractedFounders
          : ["Founding team not publicly documented"];
    const curatedCountry = english(curated.country);
    const country = verified.country ||
      (curatedCountry && !PLACEHOLDER.test(curatedCountry) ? curatedCountry : "") ||
      inferCountry(researchText) ||
      "Country not publicly documented";
    const describedYears = extractYears(researchText);
    const curatedYearsAreValid = Number.isInteger(curated.yearFounded) && Number.isInteger(curated.yearFailed) && curated.yearFailed >= curated.yearFounded;
    let yearFounded = serverPatch.yearFounded || verified.yearFounded || raw.yearFounded || describedYears.yearFounded || (curatedYearsAreValid ? curated.yearFounded : 0);
    let yearFailed = serverPatch.yearFailed || verified.yearFailed || raw.yearFailed || describedYears.yearFailed || (curatedYearsAreValid ? curated.yearFailed : 0);
    if (yearFounded && yearFailed && yearFailed < yearFounded) {
      if (describedYears.yearFounded && describedYears.yearFounded <= yearFailed) yearFounded = describedYears.yearFounded;
      else if (describedYears.yearFailed && describedYears.yearFailed >= yearFounded) yearFailed = describedYears.yearFailed;
      else if (curatedYearsAreValid) {
        yearFounded = curated.yearFounded;
        yearFailed = curated.yearFailed;
      } else {
        yearFounded = 0;
        yearFailed = 0;
      }
    }
    const finalYearFounded = yearFounded || "Not publicly documented";
    const finalYearFailed = yearFailed || "Not publicly documented";
    const curatedLessons = usefulList(curated.lessonsLearned);
    const primaryFailureReason = raw.primaryFailureReason || english(curated.primaryFailureReason) || "Multiple Factors";
    const rawFunding = cleanFunding(serverPatch.funding || raw.fundingRaised);
    const curatedFunding = cleanFunding(curated.fundingRaised);
    const fundingRaised = rawFunding === "No public funding amount reported" && curatedFunding !== "No public funding amount reported"
      ? curatedFunding
      : rawFunding;
    const candidatePostMortem = english(curated.postMortem) || cleanText(raw.description);
    const descriptionMismatch = /\b(?:municipality|commune|village|taxon|species|album|feature film)\b/i.test(candidatePostMortem);
    const postMortem = descriptionMismatch
      ? `${cleanText(verified.description || `${raw.name} operated in the ${raw.industry} sector`)}. The catalog identifies ${primaryFailureReason.toLowerCase()} as the primary reason the service ended.`
      : candidatePostMortem;

    return {
      id: raw.id,
      name: cleanText(raw.name),
      slogan: english(curated.slogan) || firstSentence(raw.description, raw.name, raw.industry),
      industry: raw.industry || english(curated.industry) || "Other",
      yearFounded: finalYearFounded,
      yearFailed: finalYearFailed,
      fundingRaised,
      primaryFailureReason,
      detailedFailureReason: english(curated.detailedFailureReason) || `The documented primary factor in ${raw.name}'s closure was ${primaryFailureReason.toLowerCase()}.`,
      founders,
      country,
      postMortem,
      lessonsLearned: curatedLessons.length >= 3 ? curatedLessons : lessonsFor(primaryFailureReason),
      metrics: curated.metrics || {
        failureScore: raw.failureScore || stableScore(raw.name, 1, 60, 95),
        marketFitScore: stableScore(raw.name, 2, 15, 65),
        executionScore: stableScore(raw.name, 3, 20, 75),
        fundingRiskScore: stableScore(raw.name, 4, 40, 95),
        competitorRiskScore: stableScore(raw.name, 5, 30, 90),
      },
      ...((verified.sourceUrl || encyclopedia.sourceUrl) ? {
        sourceUrls: [...new Set([verified.sourceUrl, encyclopedia.sourceUrl].filter(Boolean))],
      } : {}),
    };
  });

  const startupPath = path.join(SRC, "startups.json");
  fs.writeFileSync(startupPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

  if (!fs.existsSync(path.join(SRC, "technical_blueprints.json"))) {
    fs.writeFileSync(path.join(SRC, "technical_blueprints.json"), `${JSON.stringify(currentData.TECHNICAL_BLUEPRINTS || [], null, 2)}\n`, "utf8");
  }
  if (!fs.existsSync(path.join(SRC, "translations.json"))) {
    fs.writeFileSync(path.join(SRC, "translations.json"), `${JSON.stringify(currentData.TRANSLATIONS?.en || {}, null, 2)}\n`, "utf8");
  }

  const stats = {
    records: catalog.length,
    uniqueIds: new Set(catalog.map((entry) => entry.id)).size,
    researchedSources: catalog.filter((entry) => entry.sourceUrls?.length).length,
    documentedFounders: catalog.filter((entry) => !entry.founders[0].includes("not publicly documented")).length,
    documentedCountries: catalog.filter((entry) => !entry.country.includes("not publicly documented")).length,
    reportedFunding: catalog.filter((entry) => !entry.fundingRaised.includes("No public funding")).length,
    undocumentedLifecycleDates: catalog.filter((entry) => !Number.isInteger(entry.yearFounded) || !Number.isInteger(entry.yearFailed)).length,
    invalidYearRanges: catalog.filter((entry) => Number.isInteger(entry.yearFounded) && Number.isInteger(entry.yearFailed) && entry.yearFailed < entry.yearFounded).length,
  };
  console.log(JSON.stringify(stats, null, 2));
}

buildCatalog();
