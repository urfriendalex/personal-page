/*eslint no-mixed-operators: 0*/

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitToSpans } from "./tools/functions.jsx";
import { useSelector } from "react-redux";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_BP = 768;
const MIN_PROGRESS_RANGE = 0.0001;
const FIRST_PROJECT_STEP = 1;
const MOBILE_TRAILING_SPACE_VH = 0.18;
const MOBILE_STEP_GESTURE_COOLDOWN_MS = 260;
const MOBILE_STEP_SCROLL_DURATION = 0.82;
const MOBILE_EXIT_SCROLL_DURATION = 0.62;
const MOBILE_SKIP_SNAP_MS = 700;
const MOBILE_ENTRY_SETTLE_MS = 80;
const MOBILE_WHEEL_DELTA_THRESHOLD = 8;
const MOBILE_TOUCH_SWIPE_THRESHOLD = 10;
const MOBILE_CAPTURE_BUFFER_VH = 0.4;
const MOBILE_VIEWPORT_WIDTH_RESET_PX = 90;
const smoothStepEase = t => 1 - Math.pow(1 - t, 4);
const getViewportHeight = (sectionEl) =>
  Math.max(1, sectionEl?.clientHeight || document.documentElement.clientHeight || 1);

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
    title: "DIANA MILKANOVA",
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
          <a
            className="link secondary link-wavy"
            href={partial}
            target="_blank"
            rel="noreferrer"
          >
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
          <a className="link link-wavy" href={site} target="_blank" rel="noreferrer">
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
      <div className="project-banner" style={{ backgroundImage: `url(${bannerImg})` }} />
      <div className="project-info">
        <div className="project-title" style={{ color: primaryColor }}>
          {splitToSpans(title, "")}
        </div>
        <div className="project-meta">
          <div className="project-description">
            {splitToSpans(description, "\n")}
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
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const containerRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const skipSnapUntilRef = useRef(0);
  const metaRef = useRef({
    titleFrac: 0,
    projectEndFrac: 1,
    projectCount: 0,
    stepCount: 0,
  });
  const scrollDirectionRef = useRef(1);
  const snapStepRef = useRef(0);
  const activeStepRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(false);

  useEffect(() => {
    scrollRef.current = scroll;
  }, [scroll]);

  const stepToProgress = (step, titleFrac, projectEndFrac, projectCount) => {
    const safeTitleFrac = gsap.utils.clamp(0, 0.95, titleFrac);
    const safeProjectEndFrac = gsap.utils.clamp(safeTitleFrac, 1, projectEndFrac);
    if (step <= 0) return 0;
    if (step === 1) return safeTitleFrac;
    if (projectCount <= 1) return safeTitleFrac;
    const projectIndex = step - 1;
    const normalized = projectIndex / (projectCount - 1);
    return safeTitleFrac + normalized * (safeProjectEndFrac - safeTitleFrac);
  };

  const progressToNearestProjectIndex = (
    progress,
    titleFrac,
    projectEndFrac,
    projectCount
  ) => {
    if (projectCount <= 1) return 0;
    const safeTitleFrac = gsap.utils.clamp(0, 0.95, titleFrac);
    const safeProjectEndFrac = gsap.utils.clamp(safeTitleFrac, 1, projectEndFrac);
    const range = Math.max(
      MIN_PROGRESS_RANGE,
      safeProjectEndFrac - safeTitleFrac
    );
    const hp = (progress - safeTitleFrac) / range;
    const clampedHp = gsap.utils.clamp(0, 1, hp);
    return Math.round(clampedHp * (projectCount - 1));
  };

  const setStep = (step) => {
    if (activeStepRef.current === step) return;
    activeStepRef.current = step;
    setActiveStep(step);
  };

  const scrollToStep = (step, options = {}) => {
    const st = scrollTriggerRef.current;
    const { titleFrac, projectEndFrac, projectCount, stepCount } = metaRef.current;
    if (!st || !projectCount || !stepCount) return;

    const clampedStep = Math.min(Math.max(step, 0), stepCount - 1);
    const progress = stepToProgress(
      clampedStep,
      titleFrac,
      projectEndFrac,
      projectCount
    );
    const target = st.start + progress * (st.end - st.start);

    if (scroll?.scrollTo) {
      const {
        duration = 0.45,
        lock = true,
        force = true,
        easing,
      } = options;
      scroll.scrollTo(target, {
        duration,
        lock,
        force,
        ...(easing ? { easing } : {}),
      });
    } else {
      st.scroll(target);
    }

    snapStepRef.current = clampedStep;
    setStep(clampedStep);
  };

  const scrollToProjectStep = (step, options = {}) => {
    const { stepCount } = metaRef.current;
    if (!stepCount) return;
    const maxStep = stepCount - 1;
    const projectStep = Math.min(Math.max(step, FIRST_PROJECT_STEP), maxStep);
    scrollToStep(projectStep, options);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const titleEl = titleRef.current;
    if (!section || !container || !titleEl) return;

    const projectEls = gsap.utils.toArray(".project-wrapper", container);
    if (!projectEls.length) return;
    let stableMobileViewportHeight = null;
    let lastViewportWidth = 0;
    let lastVisibleViewportHeight = null;
    let lastViewportOcclusion = null;

    const syncMobileViewportVars = ({ resetStable = false } = {}) => {
      const visualViewport = window.visualViewport;
      const visualViewportHeight = Math.max(0, Math.round(visualViewport?.height || 0));
      const layoutViewportHeight =
        Math.max(
          1,
          Math.round(
            window.innerHeight ||
            document.documentElement.clientHeight ||
            section.clientHeight ||
            1
          )
        );
      const renderedSectionHeight = Math.max(
        1,
        Math.round(section.getBoundingClientRect().height || 0)
      );
      const visibleHeight = Math.max(
        1,
        visualViewportHeight || layoutViewportHeight || renderedSectionHeight
      );
      const stableSeedHeight = Math.max(
        visibleHeight,
        layoutViewportHeight,
        renderedSectionHeight
      );
      const rawViewportWidth =
        visualViewport?.width ||
        window.innerWidth ||
        document.documentElement.clientWidth ||
        section.clientWidth ||
        1;
      const viewportWidth = Math.max(1, Math.round(rawViewportWidth));
      const prevStable = stableMobileViewportHeight;
      const widthJumped =
        lastViewportWidth > 0 &&
        Math.abs(viewportWidth - lastViewportWidth) > MOBILE_VIEWPORT_WIDTH_RESET_PX;

      if (resetStable || stableMobileViewportHeight === null || widthJumped) {
        stableMobileViewportHeight = stableSeedHeight;
      }

      const occlusion = Math.max(0, stableMobileViewportHeight - visibleHeight);
      if (prevStable !== stableMobileViewportHeight) {
        section.style.setProperty("--projects-stable-vh", `${stableMobileViewportHeight}px`);
      }
      if (lastVisibleViewportHeight !== visibleHeight) {
        section.style.setProperty("--projects-visible-vh", `${visibleHeight}px`);
        lastVisibleViewportHeight = visibleHeight;
      }
      if (lastViewportOcclusion !== occlusion) {
        section.style.setProperty("--projects-viewport-occlusion", `${Math.round(occlusion)}px`);
        lastViewportOcclusion = occlusion;
      }

      lastViewportWidth = viewportWidth;
      return prevStable !== stableMobileViewportHeight;
    };

    syncMobileViewportVars({ resetStable: true });

    const mm = gsap.matchMedia();
    const handleNavProjectsScroll = () => {
      const st = scrollTriggerRef.current;
      const scrollProxy = scrollRef.current;
      const target = st?.start ?? section;

      skipSnapUntilRef.current = Date.now() + 1800;
      snapStepRef.current = 0;
      setStep(0);

      if (scrollProxy?.scrollTo) {
        scrollProxy.scrollTo(target, {
          offset: 0,
          duration: 1.1,
          lock: true,
          force: true,
        });
      } else if (st) {
        st.scroll(st.start);
      } else {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("projects:nav-scroll-to-start", handleNavProjectsScroll);

    /* ======== DESKTOP – horizontal scroll ======== */
    mm.add(`(min-width: ${MOBILE_BP + 1}px)`, () => {
      let metrics = {
        scrollDistance: 0,
        titleFrac: 0,
        projectEndFrac: 1,
        totalEnd: 1,
      };

      const computeMetrics = () => {
        const viewportHeight = getViewportHeight(section);
        const viewportWidth = Math.max(1, section.clientWidth || window.innerWidth);
        const fallbackDistance = Math.max(0, (projectEls.length - 1) * viewportWidth);
        const measuredDistance = Math.max(0, container.scrollWidth - viewportWidth);
        const projectDistance =
          measuredDistance > viewportWidth * 0.25 ? measuredDistance : fallbackDistance;
        const scrollDistance = projectDistance;
        const titleScrollPx = viewportHeight * 0.38;
        const totalEnd = Math.max(1, titleScrollPx + scrollDistance);
        const titleFrac = gsap.utils.clamp(0, 0.95, titleScrollPx / totalEnd);
        const projectEndFrac = 1;
        return { scrollDistance, titleFrac, projectEndFrac, totalEnd };
      };

      const syncMetrics = () => {
        metrics = computeMetrics();
        metaRef.current = {
          titleFrac: metrics.titleFrac,
          projectEndFrac: metrics.projectEndFrac,
          projectCount: projectEls.length,
          stepCount: projectEls.length + 1,
        };
      };

      syncMetrics();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.08,
          start: "top top",
          end: () => `+=${metrics.totalEnd}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: syncMetrics,
          onRefresh: syncMetrics,
          onEnter: () => setControlsVisible(true),
          onEnterBack: () => setControlsVisible(true),
          onLeave: () => setControlsVisible(true),
          onLeaveBack: () => setControlsVisible(false),
          snap: {
            snapTo(progress) {
              if (Date.now() < skipSnapUntilRef.current) return progress;
              const n = projectEls.length;
              const stepCount = n + 1; // 0: title state, 1..n: projects
              const { titleFrac, projectEndFrac } = metrics;

              if (progress > projectEndFrac) return progress;
              let targetStep = 0;

              if (progress <= titleFrac * 0.5) {
                targetStep = 0;
              } else if (progress <= titleFrac) {
                targetStep = 1;
              } else {
                targetStep =
                  progressToNearestProjectIndex(
                    progress,
                    titleFrac,
                    projectEndFrac,
                    n
                  ) + 1;
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
              return stepToProgress(targetStep, titleFrac, projectEndFrac, n);
            },
            duration: { min: 0.06, max: 0.14 },
            delay: 0,
            ease: "power2.out",
            directional: true,
            inertia: false,
          },
          onUpdate(self) {
            const progress = self.progress;
            const { titleFrac, projectEndFrac } = metrics;
            scrollDirectionRef.current = self.direction || scrollDirectionRef.current;
            if (progress < titleFrac * 0.85) setStep(0);
            const idx =
              progress < titleFrac * 0.85
                ? -1
                : progressToNearestProjectIndex(
                    progress,
                    titleFrac,
                    projectEndFrac,
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
      snapStepRef.current = 0;
      setStep(0);

      // Phase 1 – title scrolls LEFT
      tl.to(titleEl, {
        xPercent: -120,
        opacity: 0,
        duration: () => metrics.titleFrac,
        ease: "power2.in",
      });

      // Phase 2 – horizontal scroll
      tl.to(container, {
        x: () => -metrics.scrollDistance,
        duration: () => 1 - metrics.titleFrac,
        ease: "none",
      });
    });

    /* ======== MOBILE – discrete swipe steps ======== */
    mm.add(`(max-width: ${MOBILE_BP}px)`, () => {
      let metrics = {
        scrollDistance: 0,
        titleFrac: 0,
        projectEndFrac: 1,
        totalEnd: 1,
      };
      let isSectionActive = false;
      let lockedUntilTs = 0;
      let boundaryReleaseUntilTs = 0;
      let touchStartY = null;
      let touchGestureConsumed = false;

      const computeMetrics = () => {
        const viewportHeight = getViewportHeight(section);
        const measuredStepHeight = projectEls.reduce((maxHeight, el) => {
          const itemHeight = Math.round(el.getBoundingClientRect().height || 0);
          return Math.max(maxHeight, itemHeight);
        }, 0);
        const projectStepHeight = Math.max(viewportHeight, measuredStepHeight);
        const projectDistance = Math.max(0, (projectEls.length - 1) * projectStepHeight);
        const trailingSpace = viewportHeight * MOBILE_TRAILING_SPACE_VH;
        const scrollDistance = projectDistance + trailingSpace;
        const titleScrollPx = viewportHeight * 0.24;
        const totalEnd = Math.max(1, titleScrollPx + scrollDistance);
        const titleFrac = gsap.utils.clamp(0, 0.95, titleScrollPx / totalEnd);
        const projectEndFrac = gsap.utils.clamp(
          titleFrac,
          1,
          (titleScrollPx + projectDistance) / totalEnd
        );
        return { scrollDistance, titleFrac, projectEndFrac, totalEnd };
      };

      const syncMetrics = () => {
        metrics = computeMetrics();
        metaRef.current = {
          titleFrac: metrics.titleFrac,
          projectEndFrac: metrics.projectEndFrac,
          projectCount: projectEls.length,
          stepCount: projectEls.length + 1,
        };
      };

      const setInteractionLock = enabled => {
        isSectionActive = enabled;
        section.style.touchAction = enabled ? "none" : "";
      };

      const isWithinCaptureRange = () => {
        if (Date.now() < boundaryReleaseUntilTs) return false;
        const st = scrollTriggerRef.current;
        if (!st) return false;
        const current = st.scroll();
        const buffer = getViewportHeight(section) * MOBILE_CAPTURE_BUFFER_VH;
        return current >= st.start - buffer && current <= st.end + buffer;
      };

      const applyRevealState = step => {
        projectEls.forEach((el, i) => {
          el.classList.toggle("is-reveal", step > 0 && i === step - 1);
        });
      };

      const goToStep = (step, duration = MOBILE_STEP_SCROLL_DURATION) => {
        const st = scrollTriggerRef.current;
        const scrollProxy = scrollRef.current;
        if (!st) return;

        const maxStep = projectEls.length;
        const clampedStep = gsap.utils.clamp(0, maxStep, step);
        setStep(clampedStep);
        snapStepRef.current = clampedStep;
        applyRevealState(clampedStep);

        const progress = stepToProgress(
          clampedStep,
          metrics.titleFrac,
          metrics.projectEndFrac,
          projectEls.length
        );
        const target = st.start + progress * (st.end - st.start);
        skipSnapUntilRef.current = Date.now() + MOBILE_SKIP_SNAP_MS;
        if (scrollProxy?.scrollTo) {
          scrollProxy.scrollTo(target, {
            duration,
            lock: true,
            force: true,
            easing: smoothStepEase,
          });
        } else {
          st.scroll(target);
        }
      };

      const exitSection = movingForward => {
        const st = scrollTriggerRef.current;
        const scrollProxy = scrollRef.current;
        if (!st) return;
        const viewportHeight = getViewportHeight(section);
        const target = movingForward
          ? st.end + viewportHeight * 0.7
          : st.start - viewportHeight * 0.6;
        setInteractionLock(false);
        skipSnapUntilRef.current = Date.now() + MOBILE_SKIP_SNAP_MS;
        if (scrollProxy?.scrollTo) {
          scrollProxy.scrollTo(target, {
            duration: MOBILE_EXIT_SCROLL_DURATION,
            lock: true,
            force: true,
            easing: smoothStepEase,
          });
        } else {
          st.scroll(target);
        }
      };

      const moveByGesture = delta => {
        if (!isWithinCaptureRange()) return;
        if (Date.now() < lockedUntilTs) return;
        lockedUntilTs = Date.now() + MOBILE_STEP_GESTURE_COOLDOWN_MS;
        if (!isSectionActive) setInteractionLock(true);

        const currentStep = activeStepRef.current;
        const maxStep = projectEls.length;
        const movingForward = delta > 0;

        if (movingForward) {
          if (currentStep < maxStep) {
            goToStep(currentStep + 1);
            return;
          }
          exitSection(true);
          return;
        }

        if (currentStep > 0) {
          goToStep(currentStep - 1);
          return;
        }
        exitSection(false);
      };

      const shouldAllowNativeBoundaryScroll = delta => {
        const currentStep = activeStepRef.current;
        const maxStep = projectEls.length;
        const movingForward = delta > 0;
        if (movingForward && currentStep >= maxStep) return true;
        if (!movingForward && currentStep <= 0) return true;
        return false;
      };

      const releaseBoundary = delta => {
        void delta;
        setInteractionLock(false);
        // Let the current gesture pass through to native/Lenis scrolling.
        boundaryReleaseUntilTs = Date.now() + 950;
        lockedUntilTs = 0;
      };

      const progressToMobileStep = (progress) => {
        const { titleFrac, projectEndFrac } = metrics;
        if (progress <= titleFrac * 0.5) return 0;
        if (progress <= titleFrac) return 1;
        if (progress >= projectEndFrac) return projectEls.length;
        return (
          progressToNearestProjectIndex(
            progress,
            titleFrac,
            projectEndFrac,
            projectEls.length
          ) + 1
        );
      };

      const handleWheel = event => {
        if (!isWithinCaptureRange()) return;
        if (shouldAllowNativeBoundaryScroll(event.deltaY)) {
          releaseBoundary(event.deltaY);
          return;
        }
        event.preventDefault();
        if (Math.abs(event.deltaY) < MOBILE_WHEEL_DELTA_THRESHOLD) return;
        moveByGesture(event.deltaY);
      };

      const handleTouchStart = event => {
        const firstTouch = event.touches?.[0];
        if (!firstTouch) return;
        touchStartY = firstTouch.clientY;
        touchGestureConsumed = false;
      };

      const handleTouchMove = event => {
        if (!isWithinCaptureRange()) return;
        if (touchGestureConsumed || touchStartY === null) return;
        const firstTouch = event.touches?.[0];
        if (!firstTouch) return;
        const deltaY = touchStartY - firstTouch.clientY;
        if (shouldAllowNativeBoundaryScroll(deltaY)) {
          touchGestureConsumed = true;
          releaseBoundary(deltaY);
          return;
        }
        event.preventDefault();
        if (Math.abs(deltaY) < MOBILE_TOUCH_SWIPE_THRESHOLD) return;
        touchGestureConsumed = true;
        moveByGesture(deltaY);
      };

      const handleTouchEnd = () => {
        touchStartY = null;
        touchGestureConsumed = false;
      };

      window.addEventListener("wheel", handleWheel, {
        passive: false,
        capture: true,
      });
      window.addEventListener("touchstart", handleTouchStart, {
        passive: false,
        capture: true,
      });
      window.addEventListener("touchmove", handleTouchMove, {
        passive: false,
        capture: true,
      });
      window.addEventListener("touchend", handleTouchEnd, true);
      window.addEventListener("touchcancel", handleTouchEnd, true);

      syncMetrics();
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.12,
          start: "top top",
          end: () => `+=${metrics.totalEnd}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: syncMetrics,
          onRefresh: syncMetrics,
          onEnter: () => {
            setControlsVisible(true);
            setInteractionLock(true);
            skipSnapUntilRef.current = Date.now() + MOBILE_ENTRY_SETTLE_MS;
            if (activeStepRef.current < 0 || activeStepRef.current > projectEls.length) {
              setStep(0);
              applyRevealState(0);
            }
          },
          onEnterBack: () => {
            setControlsVisible(true);
            setInteractionLock(true);
          },
          onLeave: () => {
            setControlsVisible(true);
            setInteractionLock(false);
          },
          onLeaveBack: () => {
            setControlsVisible(false);
            setInteractionLock(false);
          },
          snap: {
            snapTo(progress) {
              if (Date.now() < skipSnapUntilRef.current) return progress;
              if (Date.now() < boundaryReleaseUntilTs) return progress;
              const targetStep = progressToMobileStep(progress);
              snapStepRef.current = targetStep;
              return stepToProgress(
                targetStep,
                metrics.titleFrac,
                metrics.projectEndFrac,
                projectEls.length
              );
            },
            duration: { min: 0.08, max: 0.2 },
            delay: 0.02,
            ease: "power2.out",
            directional: true,
            inertia: false,
          },
          onUpdate(self) {
            const progress = self.progress;
            const { titleFrac, projectEndFrac } = metrics;
            scrollDirectionRef.current = self.direction || scrollDirectionRef.current;
            if (progress < titleFrac * 0.85) {
              setStep(0);
              applyRevealState(0);
              return;
            }
            const idx = progressToNearestProjectIndex(
              progress,
              titleFrac,
              projectEndFrac,
              projectEls.length
            );
            const nextStep = idx + 1;
            setStep(nextStep);
            applyRevealState(nextStep);
          },
        },
      });
      scrollTriggerRef.current = tl.scrollTrigger;
      snapStepRef.current = 0;
      setStep(0);
      applyRevealState(0);
      skipSnapUntilRef.current = Date.now() + MOBILE_ENTRY_SETTLE_MS;

      tl.to(titleEl, {
        yPercent: -120,
        opacity: 0,
        duration: () => metrics.titleFrac,
        ease: "power2.in",
      });

      tl.to(container, {
        y: () => -metrics.scrollDistance,
        duration: () => 1 - metrics.titleFrac,
        ease: "none",
      });

      return () => {
        setInteractionLock(false);
        window.removeEventListener("wheel", handleWheel, true);
        window.removeEventListener("touchstart", handleTouchStart, true);
        window.removeEventListener("touchmove", handleTouchMove, true);
        window.removeEventListener("touchend", handleTouchEnd, true);
        window.removeEventListener("touchcancel", handleTouchEnd, true);
      };
    });

    let refreshRafId = null;
    const mobileMediaQuery = window.matchMedia(`(max-width: ${MOBILE_BP}px)`);
    const refreshViewportDrivenLayout = () => {
      if (refreshRafId !== null) return;
      refreshRafId = window.requestAnimationFrame(() => {
        refreshRafId = null;
        syncMobileViewportVars();
        scrollRef.current?.lenis?.resize?.();
        ScrollTrigger.refresh();
      });
    };
    const handleWindowResize = () => {
      if (mobileMediaQuery.matches) {
        const stableHeightChanged = syncMobileViewportVars();
        if (stableHeightChanged) refreshViewportDrivenLayout();
        return;
      }
      refreshViewportDrivenLayout();
    };
    const handleOrientationChange = () => {
      if (mobileMediaQuery.matches) {
        syncMobileViewportVars({ resetStable: true });
      }
      refreshViewportDrivenLayout();
    };
    const handleVisualViewportResize = () => {
      if (!mobileMediaQuery.matches) return;
      const stableHeightChanged = syncMobileViewportVars();
      if (stableHeightChanged) refreshViewportDrivenLayout();
    };

    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("orientationchange", handleOrientationChange);
    window.visualViewport?.addEventListener("resize", handleVisualViewportResize);

    return () => {
      window.removeEventListener(
        "projects:nav-scroll-to-start",
        handleNavProjectsScroll
      );
      if (refreshRafId !== null) {
        window.cancelAnimationFrame(refreshRafId);
      }
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.visualViewport?.removeEventListener("resize", handleVisualViewportResize);
      mm.revert();
      section.style.removeProperty("--projects-stable-vh");
      section.style.removeProperty("--projects-visible-vh");
      section.style.removeProperty("--projects-viewport-occlusion");
      scrollTriggerRef.current = null;
      metaRef.current = {
        titleFrac: 0,
        projectEndFrac: 1,
        projectCount: 0,
        stepCount: 0,
      };
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
          <Project key={proj.title} info={proj} index={index} />
        ))}
      </ul>
      {controlsVisible && (
        <div className="projects-controls is-visible">
          <button
            type="button"
            className="projects-control-btn"
            onClick={() => scrollToProjectStep(activeStep - 1)}
            disabled={activeStep <= FIRST_PROJECT_STEP}
            aria-label="Previous project"
          >
            Prev
          </button>
          <button
            type="button"
            className="projects-control-btn"
            onClick={() => scrollToProjectStep(activeStep + 1)}
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
