const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const QUERY_DIR = path.join(ROOT, ".tmp_wikidata");
const BATCH_SIZE = 80;

function makeId(name) {
  const id = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return id === "yarus" ? "rus" : id;
}

function parseRawCatalog() {
  const records = [];
  const seen = new Set();

  for (let fileNumber = 1; fileNumber <= 10; fileNumber += 1) {
    const filePath = path.join(ROOT, "src", `raw_startups_${fileNumber}.txt`);
    const content = fs.readFileSync(filePath, "utf8").replace(/\r/g, "");
    const blocks = content.split(/\n\s*\n/);

    for (const block of blocks) {
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      if (!/^#\d+$/.test(lines[0] || "")) continue;
      const scoreIndex = lines.findIndex((line) => /^\d{1,3}%$/.test(line));
      if (scoreIndex < 8 || !lines[1] || !lines[2]) continue;

      const name = lines[1];
      const id = makeId(name);
      if (!id || seen.has(id)) continue;
      seen.add(id);

      const lifespan = lines[scoreIndex - 4] || "";
      const yearMatches = [...lifespan.matchAll(/\b(18|19|20)\d{2}\b/g)].map((match) => Number(match[0]));
      records.push({
        id,
        name,
        industry: lines[2],
        description: lines.slice(3, scoreIndex - 5).join(" "),
        lifespan,
        yearFounded: yearMatches.length > 1 ? yearMatches[0] : 0,
        yearFailed: yearMatches.length > 1 ? yearMatches[1] : yearMatches[0] || 0,
        fundingRaised: lines[scoreIndex - 2] || "",
        failureScore: Number(lines[scoreIndex].replace("%", "")),
        primaryFailureReason: lines[scoreIndex + 1] || "Multiple Factors",
      });
    }
  }

  return records;
}

function sparqlString(value) {
  return JSON.stringify(value).replace(/\\u2028|\\u2029/g, " ");
}

function buildQuery(batch) {
  const labels = batch.map((record) => `${sparqlString(record.name)}@en`).join(" ");
  return `SELECT ?searchLabel ?item ?itemLabel ?itemDescription ?instanceLabel ?founderLabel ?countryLabel ?hqCountryLabel ?originCountryLabel ?inception ?dissolved WHERE {
  VALUES ?searchLabel { ${labels} }
  { ?item rdfs:label ?searchLabel. }
  UNION
  { ?item skos:altLabel ?searchLabel. }
  OPTIONAL { ?item wdt:P31 ?instance. }
  OPTIONAL { ?item wdt:P112 ?founder. }
  OPTIONAL { ?item wdt:P17 ?country. }
  OPTIONAL { ?item wdt:P495 ?originCountry. }
  OPTIONAL { ?item wdt:P159 ?headquarters. ?headquarters wdt:P17 ?hqCountry. }
  OPTIONAL { ?item wdt:P571 ?inception. }
  OPTIONAL { ?item wdt:P576 ?dissolved. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
`;
}

function prepareQueries() {
  const catalog = parseRawCatalog();
  fs.mkdirSync(QUERY_DIR, { recursive: true });
  for (const file of fs.readdirSync(QUERY_DIR)) {
    if (/^(query|result)-\d+\.(rq|json)$/.test(file)) fs.unlinkSync(path.join(QUERY_DIR, file));
  }

  for (let offset = 0; offset < catalog.length; offset += BATCH_SIZE) {
    const batchNumber = Math.floor(offset / BATCH_SIZE) + 1;
    const queryPath = path.join(QUERY_DIR, `query-${String(batchNumber).padStart(2, "0")}.rq`);
    fs.writeFileSync(queryPath, buildQuery(catalog.slice(offset, offset + BATCH_SIZE)), "utf8");
  }

  fs.writeFileSync(path.join(QUERY_DIR, "catalog.json"), JSON.stringify(catalog, null, 2), "utf8");
  console.log(JSON.stringify({ records: catalog.length, batches: Math.ceil(catalog.length / BATCH_SIZE), queryDir: QUERY_DIR }));
}

function prepareWikipediaBatches() {
  const catalog = parseRawCatalog();
  fs.mkdirSync(QUERY_DIR, { recursive: true });
  const batchSize = 40;
  for (const file of fs.readdirSync(QUERY_DIR)) {
    if (/^(wiki-titles|wiki-result)-\d+\.(txt|json)$/.test(file)) fs.unlinkSync(path.join(QUERY_DIR, file));
  }
  for (let offset = 0; offset < catalog.length; offset += batchSize) {
    const batchNumber = Math.floor(offset / batchSize) + 1;
    const filePath = path.join(QUERY_DIR, `wiki-titles-${String(batchNumber).padStart(2, "0")}.txt`);
    fs.writeFileSync(filePath, catalog.slice(offset, offset + batchSize).map((record) => record.name).join("|"), "utf8");
  }
  fs.writeFileSync(path.join(QUERY_DIR, "catalog.json"), JSON.stringify(catalog, null, 2), "utf8");
  console.log(JSON.stringify({ records: catalog.length, batches: Math.ceil(catalog.length / batchSize), queryDir: QUERY_DIR }));
}

function value(binding, key) {
  return binding[key]?.value || "";
}

function yearFrom(valueToParse) {
  const match = valueToParse.match(/^(\d{4})/);
  return match ? Number(match[1]) : 0;
}

function normalize(valueToNormalize) {
  return valueToNormalize.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function mergeResearch() {
  const catalogPath = path.join(QUERY_DIR, "catalog.json");
  if (!fs.existsSync(catalogPath)) throw new Error("Run `node scripts/researchStartups.cjs prepare` first.");
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const byName = new Map(catalog.map((record) => [record.name, record]));
  const candidates = new Map();

  for (const file of fs.readdirSync(QUERY_DIR).filter((name) => /^result-\d+\.json$/.test(name))) {
    const payload = JSON.parse(fs.readFileSync(path.join(QUERY_DIR, file), "utf8"));
    for (const binding of payload.results?.bindings || []) {
      const searchLabel = value(binding, "searchLabel");
      const record = byName.get(searchLabel);
      const itemUrl = value(binding, "item");
      if (!record || !itemUrl) continue;
      const key = `${record.id}|${itemUrl}`;
      const candidate = candidates.get(key) || {
        id: record.id,
        itemUrl,
        wikidataId: itemUrl.split("/").pop(),
        itemLabel: value(binding, "itemLabel"),
        description: value(binding, "itemDescription"),
        instances: new Set(),
        founders: new Set(),
        countries: new Set(),
        hqCountries: new Set(),
        originCountries: new Set(),
        inception: value(binding, "inception"),
        dissolved: value(binding, "dissolved"),
      };
      if (value(binding, "instanceLabel")) candidate.instances.add(value(binding, "instanceLabel"));
      if (value(binding, "founderLabel") && !/^Q\d+$/.test(value(binding, "founderLabel"))) candidate.founders.add(value(binding, "founderLabel"));
      if (value(binding, "countryLabel") && !/^Q\d+$/.test(value(binding, "countryLabel"))) candidate.countries.add(value(binding, "countryLabel"));
      if (value(binding, "hqCountryLabel") && !/^Q\d+$/.test(value(binding, "hqCountryLabel"))) candidate.hqCountries.add(value(binding, "hqCountryLabel"));
      if (value(binding, "originCountryLabel") && !/^Q\d+$/.test(value(binding, "originCountryLabel"))) candidate.originCountries.add(value(binding, "originCountryLabel"));
      candidates.set(key, candidate);
    }
  }

  const candidateGroups = new Map();
  for (const candidate of candidates.values()) {
    const group = candidateGroups.get(candidate.id) || [];
    group.push(candidate);
    candidateGroups.set(candidate.id, group);
  }

  const output = {};
  for (const record of catalog) {
    const ranked = (candidateGroups.get(record.id) || []).map((candidate) => {
      const inceptionYear = yearFrom(candidate.inception);
      const dissolvedYear = yearFrom(candidate.dissolved);
      const descriptor = `${candidate.description} ${[...candidate.instances].join(" ")}`.toLowerCase();
      let score = normalize(candidate.itemLabel) === normalize(record.name) ? 4 : 1;
      if (inceptionYear && record.yearFounded) score += inceptionYear === record.yearFounded ? 7 : Math.abs(inceptionYear - record.yearFounded) <= 1 ? 3 : -4;
      if (dissolvedYear && record.yearFailed) score += dissolvedYear === record.yearFailed ? 7 : Math.abs(dissolvedYear - record.yearFailed) <= 1 ? 3 : -4;
      if (candidate.founders.size) score += 3;
      if (candidate.countries.size || candidate.hqCountries.size || candidate.originCountries.size) score += 2;
      if (/company|business|startup|software|service|website|social network|technology|platform|manufacturer|retailer|airline|bank|corporation/.test(descriptor)) score += 4;
      if (/film|song|album|person|surname|given name|village|taxon|episode|novel|character|television series/.test(descriptor)) score -= 8;
      return { candidate, score };
    }).sort((a, b) => b.score - a.score);

    const best = ranked[0];
    if (!best || best.score < 3) continue;
    const candidate = best.candidate;
    const country = [...candidate.countries, ...candidate.hqCountries, ...candidate.originCountries][0];
    output[record.id] = {
      sourceUrl: candidate.itemUrl,
      wikidataId: candidate.wikidataId,
      matchScore: best.score,
      ...(candidate.description ? { description: candidate.description } : {}),
      ...(candidate.founders.size ? { founders: [...candidate.founders].sort() } : {}),
      ...(country ? { country } : {}),
      ...(yearFrom(candidate.inception) ? { yearFounded: yearFrom(candidate.inception) } : {}),
      ...(yearFrom(candidate.dissolved) ? { yearFailed: yearFrom(candidate.dissolved) } : {}),
    };
  }

  const outputPath = path.join(ROOT, "src", "startup_research.json");
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  const values = Object.values(output);
  console.log(JSON.stringify({
    catalogRecords: catalog.length,
    matchedRecords: values.length,
    foundersFound: values.filter((entry) => entry.founders?.length).length,
    countriesFound: values.filter((entry) => entry.country).length,
    outputPath,
  }, null, 2));
}

function mergeWikipedia() {
  const catalogPath = path.join(QUERY_DIR, "catalog.json");
  if (!fs.existsSync(catalogPath)) throw new Error("Run `node scripts/researchStartups.cjs prepare-wikipedia` first.");
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const recordByTitle = new Map(catalog.map((record) => [record.name, record]));
  const output = {};

  for (const file of fs.readdirSync(QUERY_DIR).filter((name) => /^wiki-result-\d+\.json$/.test(name))) {
    const payload = JSON.parse(fs.readFileSync(path.join(QUERY_DIR, file), "utf8"));
    const resolvedTitles = new Map([...recordByTitle].map(([title, record]) => [title, record]));
    for (const normalized of payload.query?.normalized || []) {
      const record = resolvedTitles.get(normalized.from);
      if (record) resolvedTitles.set(normalized.to, record);
    }
    for (const redirect of payload.query?.redirects || []) {
      const record = resolvedTitles.get(redirect.from);
      if (record) resolvedTitles.set(redirect.to, record);
    }
    for (const page of payload.query?.pages || []) {
      if (page.missing) continue;
      const record = resolvedTitles.get(page.title);
      if (!record || !page.extract) continue;
      const extract = page.extract.toLowerCase();
      const clearlyUnrelated = /\b(?:may refer to|municipality|commune|village|species|taxon|plant family|given name|surname|disambiguation page)\b/.test(extract)
        || /\bis any of various plants\b/.test(extract);
      const businessOrProduct = /\b(?:company|startup|business|service|website|software|platform|social network|application|app|technology|retailer|bank|airline|manufacturer|corporation|organization|exchange|publication|newspaper|studio|video game|online game|device|product)\b/.test(extract);
      if (clearlyUnrelated || !businessOrProduct) continue;
      output[record.id] = {
        sourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, "_"))}`,
        ...(page.pageprops?.wikibase_item ? { wikidataId: page.pageprops.wikibase_item } : {}),
        extract: page.extract,
      };
    }
  }

  const outputPath = path.join(ROOT, "src", "startup_wikipedia.json");
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ catalogRecords: catalog.length, matchedPages: Object.keys(output).length, outputPath }, null, 2));
}

if (require.main === module) {
  const command = process.argv[2];
  if (command === "prepare") prepareQueries();
  else if (command === "merge") mergeResearch();
  else if (command === "prepare-wikipedia") prepareWikipediaBatches();
  else if (command === "merge-wikipedia") mergeWikipedia();
  else {
    console.error("Usage: node scripts/researchStartups.cjs <prepare|merge|prepare-wikipedia|merge-wikipedia>");
    process.exitCode = 1;
  }
}

module.exports = { makeId, parseRawCatalog };
