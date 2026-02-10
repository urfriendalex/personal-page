/**
 * Pre-loads all background switcher images so transitions are smooth.
 * Call this as early as possible (e.g. from main.jsx before first render).
 */

import mesh01 from "../img/mesh01.png";
import mesh02 from "../img/mesh02.png";
import mesh03 from "../img/mesh03.png";
import meshBtm01 from "../img/mesh-btm-01.png";
import meshBtm02 from "../img/mesh-btm-02.png";
import meshBtm03 from "../img/mesh-btm-03.png";
import noise02 from "../img/noise02.png";

const BG_IMAGES = [
  mesh01,
  mesh02,
  mesh03,
  meshBtm01,
  meshBtm02,
  meshBtm03,
  noise02,
];

export function preloadBgImages() {
  BG_IMAGES.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}
