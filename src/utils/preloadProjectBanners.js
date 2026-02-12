/**
 * Warm up project banner assets before the first Hero -> Projects handoff.
 * This reduces first-swipe jank caused by image fetch/decode on demand.
 */

const PROJECT_BANNER_PATHS = [
  "/img/project-banners/kino-proby.png",
  "/img/project-banners/dmilkanova.png",
  "/img/project-banners/golden-sushi.png",
  "/img/project-banners/fujin.png",
  "/img/project-banners/myfashionmystyle.png",
  "/img/project-banners/lk-kurs.png",
];

const preloadOne = (src) => {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  // Decode where supported so paint does less work during first interaction.
  img.decode?.().catch(() => {});
};

export function preloadProjectBanners() {
  if (typeof window === "undefined") return;

  // Prioritize first visible project(s); defer the rest to idle time.
  PROJECT_BANNER_PATHS.slice(0, 2).forEach(preloadOne);

  const preloadRest = () => {
    PROJECT_BANNER_PATHS.slice(2).forEach(preloadOne);
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(preloadRest, { timeout: 1500 });
    return;
  }

  window.setTimeout(preloadRest, 250);
}
