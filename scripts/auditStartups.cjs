const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const REQUIRED_FIELDS = [
  "id",
  "name",
  "slogan",
  "industry",
  "yearFounded",
  "yearFailed",
  "fundingRaised",
  "primaryFailureReason",
  "detailedFailureReason",
  "founders",
  "country",
  "postMortem",
  "lessonsLearned",
  "metrics",
];

const PLACEHOLDER_PATTERN = /^\s*(?:unknown|n\/?a|not available|undisclosed|unspecified|not specified|tbd|null|undefined)\s*$/i;

function loadStartups(relativePath) {
  const filePath = path.resolve(__dirname, "..", relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  if (relativePath.endsWith(".json")) return JSON.parse(source);
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const moduleShim = { exports: {} };
  new Function("exports", "module", "require", output)(
    moduleShim.exports,
    moduleShim,
    require,
  );
  return moduleShim.exports.SEED_STARTUPS;
}

function isMissing(value) {
  return (
    value == null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0)
  );
}

function findPlaceholders(value, fieldPath = "") {
  if (typeof value === "string") {
    return PLACEHOLDER_PATTERN.test(value) ? [fieldPath] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => findPlaceholders(entry, `${fieldPath}[${index}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, entry]) =>
      findPlaceholders(entry, fieldPath ? `${fieldPath}.${key}` : key),
    );
  }
  return [];
}

function audit(startups) {
  const issues = [];
  const seenIds = new Set();
  let explicitlyUndocumentedValues = 0;

  for (const startup of startups) {
    const missing = REQUIRED_FIELDS.filter((field) => isMissing(startup[field]));
    const placeholders = findPlaceholders(startup);
    const invalidMetrics = Object.entries(startup.metrics || {})
      .filter(([, value]) => !Number.isFinite(value) || value < 0 || value > 100)
      .map(([key]) => `metrics.${key}`);
    const foundedUnavailable = startup.yearFounded === "Not publicly documented";
    const failedUnavailable = startup.yearFailed === "Not publicly documented";
    explicitlyUndocumentedValues += [
      startup.fundingRaised,
      startup.country,
      ...(startup.founders || []),
      startup.yearFounded,
      startup.yearFailed,
    ].filter((value) => typeof value === "string" && /not publicly documented|no public funding amount reported/i.test(value)).length;
    const invalidYears =
      (!Number.isInteger(startup.yearFounded) && !foundedUnavailable) ||
      (!Number.isInteger(startup.yearFailed) && !failedUnavailable) ||
      (Number.isInteger(startup.yearFounded) && startup.yearFounded < 1800) ||
      (Number.isInteger(startup.yearFounded) && Number.isInteger(startup.yearFailed) && startup.yearFailed < startup.yearFounded);
    const duplicateId = seenIds.has(startup.id);
    seenIds.add(startup.id);

    if (missing.length || placeholders.length || invalidMetrics.length || invalidYears || duplicateId) {
      issues.push({
        id: startup.id,
        name: startup.name,
        missing,
        placeholders,
        invalidMetrics,
        invalidYears,
        duplicateId,
      });
    }
  }

  return {
    records: startups.length,
    uniqueIds: seenIds.size,
    completeRecords: startups.length - issues.length,
    issueCount: issues.length,
    explicitlyUndocumentedValues,
    recordsWithNonAsciiCharacters: startups.filter((startup) => /[^\x00-\x7F]/.test(JSON.stringify(startup))).length,
    issues,
  };
}

const includeDetails = process.argv.includes("--details");
const sources = process.argv.slice(2).filter((argument) => argument !== "--details");
const files = sources.length ? sources : ["src/data.ts", "src/data_generated.ts"];
const result = Object.fromEntries(files.map((file) => [file, audit(loadStartups(file))]));
if (!includeDetails) {
  for (const report of Object.values(result)) delete report.issues;
}
console.log(JSON.stringify(result, null, 2));
