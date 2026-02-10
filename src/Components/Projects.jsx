/*eslint no-mixed-operators: 0*/

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitToSpans } from "./tools/functions.jsx";
import { useSelector } from "react-redux";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_BP = 768;
const getViewportHeight = () =>
  Math.max(1, window.visualViewport?.height || window.innerHeight);

const projects = [
  {
    bannerImg: "img/project-banners/kino-proby.png",
    title: "KINOPROBY",
    description: "Portfolio website for a film production duo.",
    year: "2019",
    partial: false,
    site: "https://kino-proby.com/",
    primaryColor: "#fadd41",
  },
  {
    bannerImg: "img/project-banners/dmilkanova.png",
    title: "DIANA MILKANOVA BRAND",
    description: "E-commerce website for an independent clothing brand.",
    year: "2020",
    partial: false,
    site: "https://www.dianamilkanova.com/",
    primaryColor: "#888d8e",
  },
  {
    bannerImg: "img/project-banners/golden-sushi.png",
    title: "GOLDEN SUSHI",
    description: "Sushi restaurant website with integrated online ordering.",
    year: "2020",
    partial: "https://codepen.io/urfriendalex/pen/ZEBVbqB",
    primaryColor: "#e5ca8c",
  },
  {
    bannerImg: "img/project-banners/fujin.png",
    title: "FUJIN SUSHI",
    description: "Sushi restaurant website with integrated online ordering.",
    year: "2020",
    partial: "https://codepen.io/urfriendalex/pen/KKmZgMq",
    primaryColor: "#fff",
  },
  {
    bannerImg: "img/project-banners/myfashionmystyle.png",
    title: "MY FASHION MY STYLE",
    description: "Portfolio website for a personal fashion stylist.",
    year: "2021",
    partial: "https://codepen.io/urfriendalex/pen/JjWaNQb",
    primaryColor: "#f46036",
  },
  {
    bannerImg: "img/project-banners/lk-kurs.png",
    title: "LK DIGITAL COURSE",
    description: "Landing page for an online learning platform.",
    year: "2020",
    partial: "https://codepen.io/urfriendalex/pen/vYXEaOV",
    primaryColor: "#f8c43a",
  },
];

const Project = ({
  info: { description, title, year, bannerImg, partial, site, primaryColor },
  index,
}) => {
  return (
    <li className={`project-wrapper project-${index + 1}`}>
      <div className="project-links">
        {partial ? (
          <a className="link secondary link-wavy" href={partial} target="blank">
            <span>view partial</span>
            <svg
              className="link__graphic link__graphic--slide"
              width="300%"
              height="100%"
              viewBox="0 0 1200 60"
              preserveAspectRatio="none"
            >
              <path d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0"></path>
            </svg>
          </a>
        ) : (
          <div className="link-placeholder"></div>
        )}
        {site && (
          <a className="link link-wavy" href={site} target="blank">
            <span>visit site</span>
            <svg
              className="link__graphic link__graphic--slide"
              width="300%"
              height="100%"
              viewBox="0 0 1200 60"
              preserveAspectRatio="none"
            >
              <path d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0"></path>
            </svg>
          </a>
        )}
      </div>
      <div
        className="project-banner"
        style={{ backgroundImage: `url(${bannerImg})` }}
      ></div>
      <div className="project-info">
        <div className="project-title" style={{ color: primaryColor }}>
          {splitToSpans(title, "")}
        </div>
        <div className="project-meta">
          <div className="project-description">
            {splitToSpans(description, "/n")}
          </div>
          <div className="project-year">
            <span>{year}</span>
          </div>
        </div>
      </div>
    </li>
  );
};

const Projects = () => {
  const scroll = useSelector(state => state.scroll.scrollInstance);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const containerRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const metaRef = useRef({ titleFrac: 0, projectCount: 0, stepCount: 0 });
  const scrollDirectionRef = useRef(1);
  const snapStepRef = useRef(0);
  const activeStepRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(false);

  const stepToProgress = (step, titleFrac, projectCount) => {
    if (step <= 0) return 0;
    if (step === 1) return titleFrac;
    if (projectCount <= 1) return titleFrac;
    const projectIndex = step - 1;
    const normalized = projectIndex / (projectCount - 1);
    return titleFrac + normalized * (1 - titleFrac);
  };

  const progressToNearestProjectIndex = (progress, titleFrac, projectCount) => {
    if (projectCount <= 1) return 0;
    const hp = (progress - titleFrac) / (1 - titleFrac);
    const clampedHp = gsap.utils.clamp(0, 1, hp);
    return Math.round(clampedHp * (projectCount - 1));
  };

  const setStep = (step) => {
    if (activeStepRef.current === step) return;
    activeStepRef.current = step;
    setActiveStep(step);
  };

  const scrollToStep = (step) => {
    const st = scrollTriggerRef.current;
    const { titleFrac, projectCount, stepCount } = metaRef.current;
    if (!st || !projectCount || !stepCount) return;

    const clampedStep = Math.min(Math.max(step, 0), stepCount - 1);
    const progress = stepToProgress(clampedStep, titleFrac, projectCount);
    const target = st.start + progress * (st.end - st.start);

    if (scroll?.scrollTo) {
      scroll.scrollTo(target, {
        duration: 0.45,
        lock: true,
        force: true,
      });
    } else {
      st.scroll(target);
    }

    snapStepRef.current = clampedStep;
    setStep(clampedStep);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const titleEl = titleRef.current;
    if (!section || !container || !titleEl) return;

    const projectEls = gsap.utils.toArray(".project-wrapper", container);
    if (!projectEls.length) return;

    const mm = gsap.matchMedia();

    /* ======== DESKTOP – horizontal scroll ======== */
    mm.add(`(min-width: ${MOBILE_BP + 1}px)`, () => {
      const viewportHeight = getViewportHeight();
      const scrollDistance = (projectEls.length - 1) * window.innerWidth;
      const titleScrollPx = viewportHeight * 0.38;
      const totalEnd = titleScrollPx + scrollDistance;
      const titleFrac = titleScrollPx / totalEnd;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.08,
          start: "top top",
          end: () => `+=${totalEnd}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => setControlsVisible(true),
          onEnterBack: () => setControlsVisible(true),
          onLeave: () => setControlsVisible(false),
          onLeaveBack: () => setControlsVisible(false),
          snap: {
            snapTo(progress) {
              const n = projectEls.length;
              const stepCount = n + 1; // 0: title state, 1..n: projects
              let targetStep = 0;

              if (progress <= titleFrac * 0.5) {
                targetStep = 0;
              } else if (progress <= titleFrac) {
                targetStep = 1;
              } else {
                targetStep =
                  progressToNearestProjectIndex(progress, titleFrac, n) + 1;
              }

              const prevStep = snapStepRef.current;
              if (targetStep > prevStep + 1) targetStep = prevStep + 1;
              if (targetStep < prevStep - 1) targetStep = prevStep - 1;
              targetStep = gsap.utils.clamp(0, stepCount - 1, targetStep);

              if (scrollDirectionRef.current > 0 && targetStep < prevStep) {
                targetStep = prevStep;
              } else if (
                scrollDirectionRef.current < 0 &&
                targetStep > prevStep
              ) {
                targetStep = prevStep;
              }

              snapStepRef.current = targetStep;
              return stepToProgress(targetStep, titleFrac, n);
            },
            duration: { min: 0.06, max: 0.14 },
            delay: 0,
            ease: "power2.out",
            directional: true,
            inertia: false,
          },
          onUpdate(self) {
            const progress = self.progress;
            scrollDirectionRef.current = self.direction || scrollDirectionRef.current;
            if (progress < titleFrac * 0.85) setStep(0);
            const idx =
              progress < titleFrac * 0.85
                ? -1
                : progressToNearestProjectIndex(
                    progress,
                    titleFrac,
                    projectEls.length
                  );
            if (idx >= 0) setStep(idx + 1);
            projectEls.forEach((el, i) => {
              if (progress < titleFrac * 0.85) {
                el.classList.remove("is-reveal");
                return;
              }
              el.classList.toggle("is-reveal", i === idx);
            });
          },
        },
      });
      scrollTriggerRef.current = tl.scrollTrigger;
      metaRef.current = {
        titleFrac,
        projectCount: projectEls.length,
        stepCount: projectEls.length + 1,
      };
      snapStepRef.current = 0;
      setStep(0);

      // Phase 1 – title scrolls LEFT
      tl.to(titleEl, {
        xPercent: -120,
        opacity: 0,
        duration: titleFrac,
        ease: "power2.in",
      });

      // Phase 2 – horizontal scroll
      tl.to(container, {
        x: -scrollDistance,
        duration: 1 - titleFrac,
        ease: "none",
      });
    });

    /* ======== MOBILE – vertical scroll with snap ======== */
    mm.add(`(max-width: ${MOBILE_BP}px)`, () => {
      const viewportHeight = getViewportHeight();
      const scrollDistance = (projectEls.length - 1) * viewportHeight;
      const titleScrollPx = viewportHeight * 0.24;
      const totalEnd = titleScrollPx + scrollDistance;
      const titleFrac = titleScrollPx / totalEnd;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.1,
          start: "top top",
          end: () => `+=${totalEnd}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => setControlsVisible(true),
          onEnterBack: () => setControlsVisible(true),
          onLeave: () => setControlsVisible(false),
          onLeaveBack: () => setControlsVisible(false),
          snap: {
            snapTo(progress) {
              const n = projectEls.length;
              const stepCount = n + 1;
              let targetStep = 0;

              if (progress <= titleFrac * 0.5) {
                targetStep = 0;
              } else if (progress <= titleFrac) {
                targetStep = 1;
              } else {
                targetStep =
                  progressToNearestProjectIndex(progress, titleFrac, n) + 1;
              }

              const prevStep = snapStepRef.current;
              if (targetStep > prevStep + 1) targetStep = prevStep + 1;
              if (targetStep < prevStep - 1) targetStep = prevStep - 1;
              targetStep = gsap.utils.clamp(0, stepCount - 1, targetStep);

              if (scrollDirectionRef.current > 0 && targetStep < prevStep) {
                targetStep = prevStep;
              } else if (
                scrollDirectionRef.current < 0 &&
                targetStep > prevStep
              ) {
                targetStep = prevStep;
              }

              snapStepRef.current = targetStep;
              return stepToProgress(targetStep, titleFrac, n);
            },
            duration: { min: 0.12, max: 0.22 },
            delay: 0,
            ease: "power2.out",
            directional: true,
            inertia: false,
          },
          onUpdate(self) {
            const progress = self.progress;
            scrollDirectionRef.current = self.direction || scrollDirectionRef.current;
            if (progress < titleFrac * 0.85) {
              setStep(0);
              projectEls.forEach(el => el.classList.remove("is-reveal"));
              return;
            }

            const idx = progressToNearestProjectIndex(
              progress,
              titleFrac,
              projectEls.length
            );
            setStep(idx + 1);

            projectEls.forEach((el, i) => {
              el.classList.toggle("is-reveal", i === idx);
            });
          },
        },
      });
      scrollTriggerRef.current = tl.scrollTrigger;
      metaRef.current = {
        titleFrac,
        projectCount: projectEls.length,
        stepCount: projectEls.length + 1,
      };
      snapStepRef.current = 0;
      setStep(0);

      // Phase 1 – title scrolls UP on mobile
      tl.to(titleEl, {
        yPercent: -120,
        opacity: 0,
        duration: titleFrac,
        ease: "power2.in",
      });

      // Phase 2 – vertical scroll through projects
      tl.to(container, {
        y: -scrollDistance,
        duration: 1 - titleFrac,
        ease: "none",
      });
    });

    return () => {
      mm.revert();
      scrollTriggerRef.current = null;
      metaRef.current = { titleFrac: 0, projectCount: 0, stepCount: 0 };
      snapStepRef.current = 0;
      setStep(0);
      setControlsVisible(false);
    };
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="section-wrapper">
      <div ref={titleRef} className="projects-title">
        Projects
      </div>
      <ul ref={containerRef} className="projects-container">
        {projects.map((proj, index) => (
          <Project key={index} info={proj} index={index} />
        ))}
      </ul>
      {controlsVisible && (
        <div className="projects-controls is-visible">
          <button
            type="button"
            className="projects-control-btn"
            onClick={() => scrollToStep(activeStep - 1)}
            disabled={activeStep <= 0}
            aria-label="Previous project"
          >
            Prev
          </button>
          <button
            type="button"
            className="projects-control-btn"
            onClick={() => scrollToStep(activeStep + 1)}
            disabled={activeStep >= projects.length}
            aria-label="Next project"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default Projects;
