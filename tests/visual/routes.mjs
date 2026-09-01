/* The regression surface: every distinct template the site renders.
 *
 * /styleguide/ is deliberately in the list before it exists (#44). A route
 * that 404s is recorded as `missing` rather than failing the run, so the same
 * list works against master and against the redesign branch.
 */
export const ROUTES = [
  { name: "home", path: "/" },
  { name: "cocktails-index", path: "/cocktails/" },
  { name: "cocktail-el-nino", path: "/cocktails/el-nino/" },
  { name: "cocktail-bitter-nonsense", path: "/cocktails/bitter-nonsense/" },
  { name: "cocktail-peach-julep", path: "/cocktails/peach-pepper-jelly-julep/" },
  { name: "projects", path: "/projects/" },
  { name: "daresnot", path: "/daresnot/" },
  { name: "styleguide", path: "/styleguide/" },
  { name: "notfound", path: "/404.html" },
];

export const VIEWPORTS = [
  { name: "375", width: 375, height: 800 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
];

export const SCHEMES = ["light", "dark"];
