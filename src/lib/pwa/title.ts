import { brand } from "@/lib/brand";
import { FOREIGN_PWA_TITLE_RE } from "@/lib/pwa/identity";

/** Remove prefixos de outros PWAs (Carona, Trampolim) e mantém só o título Dahora. */
export function forceDahoraTitle(current: string): string {
  const appName = brand.fullName;
  const idx = current.indexOf(appName);

  if (idx >= 0 && !FOREIGN_PWA_TITLE_RE.test(current.slice(0, idx))) {
    return current.slice(idx).trim();
  }

  if (FOREIGN_PWA_TITLE_RE.test(current) || idx < 0) {
    if (idx >= 0) return current.slice(idx).trim();
    return `${appName} — ${brand.slogan}`;
  }

  return current.trim() || `${appName} — ${brand.slogan}`;
}

export const dahoraTitleScript = `
(function () {
  var APP = ${JSON.stringify(brand.fullName)};
  var SLOGAN = ${JSON.stringify(brand.slogan)};
  var FOREIGN = /carona|trampolim|app de corridas|impulso para o trampo|super eletrolar/i;
  function fixTitle() {
    var t = document.title || "";
    var i = t.indexOf(APP);
    if (i > 0 || FOREIGN.test(t)) {
      document.title = i >= 0 ? t.slice(i).trim() : APP + " — " + SLOGAN;
    }
    ["application-name", "apple-mobile-web-app-title"].forEach(function (name) {
      var el = document.querySelector('meta[name="' + name + '"]');
      if (el) el.setAttribute("content", APP);
    });
  }
  fixTitle();
  var titleEl = document.querySelector("title");
  var obs = new MutationObserver(fixTitle);
  if (titleEl) {
    obs.observe(titleEl, { childList: true, characterData: true, subtree: true });
  } else {
    obs.observe(document.head, { childList: true, subtree: true });
  }
})();
`.trim();
