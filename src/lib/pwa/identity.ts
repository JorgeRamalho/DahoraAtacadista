/**
 * Identidade isolada do PWA Dahora Atacadista.
 *
 * Carona (porta 3000) e Trampolim também usam localhost + /sw.js.
 * Por isso o Dahora roda em porta própria e arquivos com nome único —
 * o Chrome trata origins diferentes (porta) como apps separados.
 */
export const PWA_APP_KEY = "dahora-atacadista";
export const PWA_PORT = 3010;
export const PWA_MANIFEST_ID = "/?app=dahora-atacadista";
export const PWA_START_URL = "/?app=dahora-atacadista";
export const PWA_MANIFEST_PATH = "/manifest-dahora-atacadista.webmanifest";
export const PWA_SW_PATH = "/sw-dahora-atacadista.js";
export const PWA_CACHE_PREFIX = "dahora-atacadista-static-";
export const PWA_CACHE_NAME = `${PWA_CACHE_PREFIX}v1`;

/** Títulos/nomes de outros PWAs que já competiram no mesmo localhost. */
export const FOREIGN_PWA_TITLE_RE =
  /carona|trampolim|app de corridas|impulso para o trampo|super eletrolar/i;

export const LOCAL_DEV_ORIGINS = [
  `http://localhost:${PWA_PORT}`,
  `http://127.0.0.1:${PWA_PORT}`,
] as const;
