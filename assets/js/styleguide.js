/* Fill in the values the styleguide can only know at runtime.
 *
 * Two things are resolved in the browser rather than at build time, because
 * both depend on the cascade: what a token actually computes to in the active
 * theme and scheme, and what contrast ratio that produces. Printing values
 * copied from the source files would report the design system as written
 * rather than as it renders, which is the opposite of what this page is for.
 */
(function () {
  var root = document.documentElement;

  function resolve(name) {
    return getComputedStyle(root).getPropertyValue(name).trim();
  }

  /* Resolve a colour by letting the browser do it: assign it, read it back. */
  var probe = document.createElement("span");
  probe.style.display = "none";
  document.body.appendChild(probe);

  function toRgb(value) {
    probe.style.color = "";
    probe.style.color = value;
    var c = getComputedStyle(probe).color;
    var m = c.match(/-?[\d.]+/g);
    if (!m || m.length < 3) return null;
    if (m.length > 3 && Number(m[3]) < 1) return null; /* translucent — ratio is meaningless */
    return [Number(m[0]), Number(m[1]), Number(m[2])];
  }

  function luminance(rgb) {
    var a = rgb.map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }

  function ratio(a, b) {
    var l1 = luminance(a);
    var l2 = luminance(b);
    var hi = Math.max(l1, l2);
    var lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  /* Which colours are a foreground/background *pair*, and therefore have a
   * contrast ratio worth reporting.
   *
   * Deliberately not "everything". Raw palette entries — --ink-2, --clay,
   * --wash-1 — are not paired with anything; grading them against body text
   * produces a page full of red that means nothing, and a styleguide that
   * cries wolf is one nobody reads. Only semantic roles are graded, each
   * against what it is actually drawn on.
   *
   * `text: false` marks a non-text pairing, where WCAG's bar is 3:1 rather
   * than 4.5:1. Purely decorative hairlines are absent entirely: they carry no
   * information, so no ratio applies to them. */
  var PAIRINGS = {
    "--text-heading": { on: "--surface-page" },
    "--text-body": { on: "--surface-page" },
    "--text-muted": { on: "--surface-page" },
    "--text-faint": { on: "--surface-page" },
    "--link": { on: "--surface-page" },
    "--link-hover": { on: "--surface-page" },
    "--heading-1": { on: "--surface-page" },
    "--heading-2": { on: "--surface-page" },
    "--heading-3": { on: "--surface-page" },
    "--heading-4": { on: "--surface-page" },
    "--wordmark-color": { on: "--surface-page" },
    "--date-color": { on: "--surface-page" },
    "--focus-ring": { on: "--surface-page", text: false },
    "--rule-accent": { on: "--surface-page", text: false },

    "--surface-sunken": { on: "--text-body" },
    "--surface-code": { on: "--text-body" },
    "--tint-clay": { on: "--text-body" },
    "--tint-amber": { on: "--text-body" },
    "--tint-pine": { on: "--text-body" },
    "--tint-lapis": { on: "--text-body" },

    /* code blocks sit on --surface-sunken, inline code on --surface-code */
    "--code-keyword": { on: "--surface-sunken" },
    "--code-string": { on: "--surface-sunken" },
    "--code-number": { on: "--surface-sunken" },
    "--code-comment": { on: "--surface-sunken" },
    "--code-name": { on: "--surface-sunken" },
    "--code-variable": { on: "--surface-sunken" },
    "--code-function": { on: "--surface-sunken" },
    "--code-label": { on: "--surface-sunken" },
    "--code-deleted": { on: "--surface-sunken" },
    "--code-inserted": { on: "--surface-sunken" },
    "--code-linenum": { on: "--surface-sunken" },

    "--tag-clay-fg": { on: "--tag-clay-bg" },
    "--tag-amber-fg": { on: "--tag-amber-bg" },
    "--tag-pine-fg": { on: "--tag-pine-bg" },
    "--tag-lapis-fg": { on: "--tag-lapis-bg" },
    "--avatar-fg": { on: "--avatar-bg" },
  };

  function paint() {
    document.querySelectorAll("[data-resolve]").forEach(function (el) {
      el.textContent = resolve(el.getAttribute("data-resolve")) || "—";
    });

    document.querySelectorAll("[data-contrast]").forEach(function (el) {
      var name = el.getAttribute("data-contrast");
      var pair = PAIRINGS[name];
      el.removeAttribute("data-level");
      if (!pair) {
        el.textContent = "unpaired";
        return;
      }
      var a = toRgb(resolve(name));
      var b = toRgb(resolve(pair.on));
      if (!a || !b) {
        el.textContent = "";
        return;
      }
      var r = ratio(a, b);
      var isText = pair.text !== false;
      var level = isText
        ? (r >= 7 ? "AAA" : r >= 4.5 ? "AA" : "fail")
        : (r >= 3 ? "AA" : "fail");
      el.setAttribute("data-level", level);
      /* Truncated, never rounded. A ratio of 4.4996 displayed as "4.50" beside
       * a FAIL verdict reads as a bug in the page rather than in the palette. */
      el.textContent = (Math.floor(r * 100) / 100).toFixed(2) + ":1 on " + pair.on;
    });
  }

  paint();
  /* Re-run when the scheme changes so the ratios describe what is on screen. */
  new MutationObserver(paint).observe(root, { attributes: true, attributeFilter: ["data-scheme", "data-theme"] });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", paint);
})();
