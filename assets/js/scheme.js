/* Publish an explicitly chosen colour scheme as <html data-scheme>.
 *
 * The absence of the attribute is meaningful: it means "follow the OS", which
 * the stylesheet answers on its own with prefers-color-scheme. So this only
 * ever sets the attribute for a *stored* preference, and removes it when the
 * visitor has none. Dark mode therefore works with JavaScript disabled, and
 * the OS-follows path needs no script at all.
 *
 * Runs inline and blocking in <head>: the attribute has to exist before the
 * first paint or a visitor whose stored preference disagrees with their OS
 * sees the wrong scheme and then a snap.
 *
 * The theme's coder.js still drives the toggle at this point and announces
 * changes with a themeChanged event; we mirror it. (#52 replaces coder.js.)
 */
(function () {
  var KEY = "colorscheme";
  var root = document.documentElement;

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "dark" || v === "light" ? v : null;
    } catch (e) {
      return null; /* private mode, storage disabled — let CSS decide */
    }
  }

  function apply(scheme) {
    if (scheme) root.setAttribute("data-scheme", scheme);
    else root.removeAttribute("data-scheme");
  }

  apply(stored());

  document.addEventListener("themeChanged", function () {
    apply(stored());
  });
})();
