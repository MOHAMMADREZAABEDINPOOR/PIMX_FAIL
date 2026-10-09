import express from "express";
import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import startupCatalog from "./src/startups.json";

let aiInstance: GoogleGenAI | null = null;

function getGeminiClient() {
  if (aiInstance) return aiInstance;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") return null;
  aiInstance = new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { "User-Agent": "pimxfail-english-app" } },
  });
  return aiInstance;
}

function fallbackAnalysis(name: string, industry: string) {
  return {
    simulated: true,
    analysis: `No AI provider is available to assess the supplied scenario for ${name}. The following are general research questions for a ${industry || "technology"} business, not findings about this company.\n\nLook for evidence of repeat use, willingness to pay, and sustainable operating costs. Compare the proposed product with the simplest alternative customers already have. Identify which assumptions require interviews, a paid pilot, or financial records before drawing a conclusion.`,
    mistakes: [
      "Is repeat customer demand demonstrated, or only assumed?",
      "Do recurring revenues cover the costs of serving customers?",
      "What evidence would cause the team to change its product or market strategy?",
    ],
    lessons: [
      "Require evidence of repeat use and willingness to pay before scaling distribution.",
      "Connect hiring and capital plans to conservative runway scenarios.",
      "Use churned-customer interviews to test whether the core problem is urgent and recurring.",
    ],
    pathway: "Run a narrow paid pilot, keep the team small, and scale only after retention and contribution-margin targets hold across multiple cohorts.",
  };
}

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;
  const visitsFile = path.join(process.cwd(), "visits_history.json");
  let visits: Record<string, unknown>[] = [];

  try {
    if (fs.existsSync(visitsFile)) visits = JSON.parse(fs.readFileSync(visitsFile, "utf8"));
  } catch (error) {
    console.warn("The existing visit history could not be loaded.", error);
  }

  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_request, response) => {
    response.json({ status: "healthy", language: "English", startupRecords: startupCatalog.length, timestamp: new Date().toISOString() });
  });

  app.get("/api/startups", (_request, response) => {
    response.setHeader("Content-Language", "en");
    response.json(startupCatalog);
  });

  app.post("/api/visits", (request, response) => {
    const forwarded = request.headers["x-forwarded-for"];
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0] || request.ip || "Not recorded";
    const visit = {
      ...request.body,
      ip,
      timestamp: new Date().toISOString(),
      location: request.body.location || "Not collected",
    };
    visits.unshift(visit);
    visits = visits.slice(0, 500);
    try {
      fs.writeFileSync(visitsFile, JSON.stringify(visits, null, 2), "utf8");
    } catch (error) {
      console.warn("The visit record could not be persisted.", error);
    }
    response.json({ success: true });
  });

  app.get("/api/visits", (_request, response) => {
    response.json(visits);
  });

  app.post("/api/analyze", async (request, response) => {
    const { name, description, industry = "Technology", failureReasons = "Not specified" } = request.body || {};
    if (typeof name !== "string" || !name.trim() || typeof description !== "string" || !description.trim()) {
      return response.status(400).json({ error: "Startup name and an English description are required." });
    }

    const client = getGeminiClient();
    if (!client) return response.json(fallbackAnalysis(name.trim(), industry));

    try {
      const prompt = `Analyze this startup failure scenario and respond only in English.
Startup: ${name}
Industry: ${industry}
Description: ${description}
Suspected failure reasons: ${failureReasons}

Use evidence from the supplied scenario. Do not invent company facts. Explain uncertainty when evidence is incomplete.`;
      const result = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an objective startup post-mortem analyst. All output must be professional English.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              failureScore: { type: Type.INTEGER },
              marketFitScore: { type: Type.INTEGER },
              executionScore: { type: Type.INTEGER },
              fundingRiskScore: { type: Type.INTEGER },
              competitorRiskScore: { type: Type.INTEGER },
              analysis: { type: Type.STRING },
              mistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
              lessons: { type: Type.ARRAY, items: { type: Type.STRING } },
              pathway: { type: Type.STRING },
            },
            required: ["failureScore", "marketFitScore", "executionScore", "fundingRiskScore", "competitorRiskScore", "analysis", "mistakes", "lessons", "pathway"],
          },
        },
      });
      response.setHeader("Content-Language", "en");
      response.json(JSON.parse((result.text || "{}").trim()));
    } catch (error) {
      console.error("The AI diagnostic failed.", error);
      response.json(fallbackAnalysis(name.trim(), industry));
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_request, response) => response.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`PIMXFAIL is running in English at http://localhost:${port}`);
  });
}

startServer();
