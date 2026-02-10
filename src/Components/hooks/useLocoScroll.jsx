import { useDispatch } from "react-redux";
import { setScrollInstanse } from "../../redux/actions/scrollActions";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect } from "react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default function useLocoScroll(start) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!start) return;

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Store the lenis instance so other components can use scrollTo
    const scrollProxy = {
      scrollTo: (target, options) => {
        if (typeof target === "string" || target instanceof Element) {
          lenis.scrollTo(target, { offset: 0, ...options });
        } else {
          lenis.scrollTo(target, options);
        }
      },
      lenis,
    };

    dispatch(setScrollInstanse(scrollProxy));
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      lenis.destroy();
    };
  }, [start, dispatch]);
}
