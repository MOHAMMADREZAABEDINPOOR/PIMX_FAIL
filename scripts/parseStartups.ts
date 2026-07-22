/**
 * Compatibility entry point for rebuilding the canonical English startup catalog.
 * The implementation lives in buildStartupCatalog.cjs so it can run without a
 * TypeScript loader in CI and data-audit environments.
 */
import "./buildStartupCatalog.cjs";
