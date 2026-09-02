/* Colour-scheme toggle, and the transition unlock.
 *
 * Replaces the theme's coder.js, which also carried Giscus, Utterances and
 * Mermaid plumbing this site does not use. The initial scheme is resolved by
 * the blocking script in <head> (assets/js/scheme.js); this only handles the
 * click.
 *
 * The attribute's absence means "follow the OS", so toggling from that state
 * has to decide what the OS is currently showing and pick the opposite —
 * which is exactly what the visible label already says.
 */
(function () {
  var KEY = "colorscheme";
  var root = document.documentElement;

  function current() {
    var explicit = root.getAttribute("data-scheme");
    if (explicit === "dark" || explicit === "light") return explicit;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  document.querySelectorAll("[data-scheme-toggle]").forEach(function (button) {
    button.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-scheme", next);
      try {
        localStorage.setItem(KEY, next);
      } catch (e) {
        /* storage disabled — the choice holds for this page only */
      }
    });
  });

  /* Transitions are suppressed until here so that the page does not animate
   * its own first paint. */
  function unlock() {
    document.body.classList.remove("preload-transitions");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", unlock);
  } else {
    unlock();
  }
})();
