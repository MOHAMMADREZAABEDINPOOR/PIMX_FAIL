import type { Startup, TechnicalBlueprint } from "./types";
import startupCatalog from "./startups.json";
import blueprintCatalog from "./technical_blueprints.json";
import englishTranslations from "./translations.json";

export const SEED_STARTUPS = startupCatalog as Startup[];
export const TECHNICAL_BLUEPRINTS = blueprintCatalog as TechnicalBlueprint[];
export const TRANSLATIONS = { en: englishTranslations } as const;
