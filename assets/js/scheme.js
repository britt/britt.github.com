/* Resolve the colour scheme and publish it as <html data-scheme>.
 *
 * The design system scopes its dark tokens to :root[data-scheme="dark"], so
 * the attribute has to exist before the first paint or the page renders light
 * and snaps. This runs inline and blocking in <head> for that reason.
 *
 * The theme's own coder.js still drives the toggle at this point and signals
 * changes with a themeChanged event; we mirror it. (#43 replaces coder.js.)
 */
(function () {
  var KEY = "colorscheme";
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function resolve() {
    var stored = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch (e) {
      /* private mode, storage disabled — fall through to the media query */
    }
    if (stored === "dark" || stored === "light") return stored;
    return media.matches ? "dark" : "light";
  }

  function apply(scheme) {
    document.documentElement.setAttribute("data-scheme", scheme);
  }

  apply(resolve());

  media.addEventListener("change", function () {
    apply(resolve());
  });

  document.addEventListener("themeChanged", function () {
    apply(document.body.classList.contains("colorscheme-dark") ? "dark" : "light");
  });
})();
