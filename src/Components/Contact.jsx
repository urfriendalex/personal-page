import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { switchBgVersion, switchThemeMode } from "../redux/actions/uiActions";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STICKY_TOPS_DESKTOP = [0, 20, 40, 60, 80]; // percentage of stable viewport height
const getViewportHeight = (sectionEl) =>
  Math.max(1, sectionEl?.clientHeight || document.documentElement.clientHeight || 1);

const Contact = () => {
  const bgVersion = useSelector((state) => state.UI.bgVersion);
  const isLight = useSelector((state) => state.UI.isLight);
  const dispatch = useDispatch();
  const sectionRef = useRef(null);
  const smileyRef = useRef(null);
  const mailWrapperRef = useRef(null);
  const socialsRef = useRef(null);
  const isLightRef = useRef(isLight);

  useEffect(() => {
    isLightRef.current = isLight;
  }, [isLight]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const mobileMediaQuery = window.matchMedia("(max-width: 768px)");

    const ctx = gsap.context(() => {
      const viewportReferenceEl =
        section.querySelector("#contact-details-scroll") ||
        section.querySelector(".background-holder") ||
        document.documentElement;
      const vhToPx = (vhValue) => (getViewportHeight(viewportReferenceEl) * vhValue) / 100;

      /* ---- sticky "Contact Me" lines ---- */
      const titleDivs = gsap.utils.toArray(".section-title", section);
      const stickyTopGetters = [];
      let endStateInfiniteMarquee = null;
      let endStateScrollTween = null;
      let endStateLine = null;
      let isEndStateActive = false;
      let activateEndState = () => {};
      let deactivateEndState = () => {};
      const detailsScroll = section.querySelector("#contact-details-scroll");
      const detailsWrapper = section.querySelector(".contact-details-wrapper");
      const detailsRevealStartPercent = isMobile ? 84 : 90;
      const detailsHideBackStartPercent = isMobile ? 52 : 64;
      let animateDetailsIn = () => {};
      let animateDetailsOut = () => {};
      const getDetailsOffsetX = () => Math.round(window.innerWidth * 1.1);
      const getMarqueeTravel = (lineEl) => {
        const unit = lineEl.querySelector(".contact-me-unit");
        if (!unit) return 0;
        const unitWidth = unit.getBoundingClientRect().width;
        const lineStyles = window.getComputedStyle(lineEl);
        const gap = Number.parseFloat(lineStyles.columnGap || lineStyles.gap || "0") || 0;
        return unitWidth + gap;
      };
      const handoffToFixed = (lineEl, getStickyTopPx) => {
        const rect = lineEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const targetTop = `${getStickyTopPx()}px`;

        gsap.killTweensOf(lineEl, "top,left");
        lineEl.style.position = "fixed";
        lineEl.style.top = `${rect.top}px`;
        lineEl.style.left = `${centerX}px`;
        gsap.to(lineEl, {
          top: targetTop,
          left: "50%",
          duration: 0.16,
          ease: "power1.out",
          overwrite: "auto",
        });
      };
      const releaseFromFixed = (lineEl, { smooth = false } = {}) => {
        gsap.killTweensOf(lineEl, "top,left,y");

        if (!smooth) {
          lineEl.style.position = "";
          lineEl.style.top = "";
          lineEl.style.left = "";
          gsap.set(lineEl, { y: 0 });
          return;
        }

        // FLIP-style release: keep visual position after switching to absolute,
        // then ease y back to 0 to avoid the "snap" on scroll-up handoff.
        const beforeTop = lineEl.getBoundingClientRect().top;
        lineEl.style.position = "";
        lineEl.style.top = "";
        lineEl.style.left = "";
        const afterTop = lineEl.getBoundingClientRect().top;
        const deltaY = beforeTop - afterTop;

        gsap.set(lineEl, { y: deltaY });
        gsap.to(lineEl, {
          y: 0,
          duration: isMobile ? 0.18 : 0.14,
          ease: "power1.out",
          overwrite: "auto",
        });
      };

      titleDivs.forEach((titleDiv, i) => {
        const line = titleDiv.querySelector(".line");
        if (!line) return;
        const getStickyTopPx = () => {
          const defaultTopPx = vhToPx(STICKY_TOPS_DESKTOP[i]);
          if (!isMobile) return defaultTopPx;

          // Mobile line-height can exceed fixed vh steps; derive a minimum lane gap
          // from the rendered line to keep rows separated during smooth handoff.
          const lineHeight = line.getBoundingClientRect().height || defaultTopPx;
          const minLaneStepPx = lineHeight * 0.84;
          return Math.max(defaultTopPx, i * minLaneStepPx);
        };
        stickyTopGetters[i] = getStickyTopPx;
        const marqueeDirection = i % 2 === 0 ? -1 : 1;
        const isEndStateTitle = i === 0; // section-titlte-scroll-1 is the line visible at the end state
        if (isEndStateTitle) {
          endStateLine = line;
        }

        gsap.set(line, {
          left: "50%",
          xPercent: -50,
          x: 0,
          y: 0,
          force3D: true,
        });

        ScrollTrigger.create({
          trigger: titleDiv,
          start: () => `top ${getStickyTopPx()}px`,
          end: () => `bottom ${getStickyTopPx()}px`,
          onEnter: () => {
            handoffToFixed(line, getStickyTopPx);
          },
          onLeave: () => {
            releaseFromFixed(line, { smooth: false });
          },
          onEnterBack: () => {
            handoffToFixed(line, getStickyTopPx);
          },
          onLeaveBack: () => {
            releaseFromFixed(line, { smooth: true });
          },
        });

        // Scroll-driven horizontal marquee while each title line is active.
        const scrollTween = gsap.fromTo(
          line,
          { x: 0 },
          {
            x: () => marqueeDirection * getMarqueeTravel(line),
            ease: "none",
            scrollTrigger: {
              trigger: titleDiv,
              start: () => `top ${getStickyTopPx()}px`,
              end: () => `bottom ${getStickyTopPx()}px`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );

        if (isEndStateTitle) {
          endStateScrollTween = scrollTween;
        }
      });

      /* ---- theme toggle and fade state ---- */
      const lastTitle = titleDivs[titleDivs.length - 1];
      if (lastTitle) {
        const getLastStickyTopPx =
          stickyTopGetters[stickyTopGetters.length - 1] ||
          (() => vhToPx(STICKY_TOPS_DESKTOP[STICKY_TOPS_DESKTOP.length - 1]));
        const activationProgress = 0.16;
        const isDetailsReadyForReveal = () => {
          if (!detailsScroll) return true;
          const rect = detailsScroll.getBoundingClientRect();
          const revealThresholdPx = (window.innerHeight * detailsRevealStartPercent) / 100;
          return rect.top <= revealThresholdPx && rect.bottom > 0;
        };

        activateEndState = () => {
          if (isEndStateActive) return;
          isEndStateActive = true;
          section.classList.add("scrolled");
          animateDetailsIn();
          if (!isLightRef.current) {
            dispatch(switchThemeMode());
          }
          if (endStateScrollTween?.scrollTrigger) {
            endStateScrollTween.scrollTrigger.disable();
          }
          if (endStateInfiniteMarquee) {
            endStateInfiniteMarquee.kill();
            endStateInfiniteMarquee = null;
          }
          if (endStateLine) {
            const travel = getMarqueeTravel(endStateLine);
            gsap.set(endStateLine, { x: 0 });
            endStateInfiniteMarquee = gsap.to(endStateLine, {
              x: -travel,
              duration: isMobile ? 13 : 6.5,
              ease: "none",
              repeat: -1,
              modifiers: {
                x: (value) => `${gsap.utils.wrap(-travel, 0, Number.parseFloat(value))}px`,
              },
            });
          }
        };

        deactivateEndState = () => {
          if (!isEndStateActive) return;
          isEndStateActive = false;
          animateDetailsOut();
          section.classList.remove("scrolled");
          if (isLightRef.current) {
            dispatch(switchThemeMode());
          }
          if (endStateInfiniteMarquee) {
            endStateInfiniteMarquee.kill();
            endStateInfiniteMarquee = null;
          }
          if (endStateScrollTween?.scrollTrigger) {
            endStateScrollTween.scrollTrigger.enable();
            endStateScrollTween.scrollTrigger.refresh();
          }
          if (endStateLine) {
            gsap.set(endStateLine, { x: 0 });
          }
        };

        ScrollTrigger.create({
          trigger: lastTitle,
          start: () => `top ${getLastStickyTopPx()}px`,
          end: "bottom bottom",
          onUpdate: (self) => {
            if (self.progress >= activationProgress && isDetailsReadyForReveal()) {
              activateEndState();
              return;
            }
            deactivateEndState();
          },
          onLeaveBack: () => {
            deactivateEndState();
          },
        });
      }

      /* ---- contact-details sticky ---- */
      if (detailsScroll && detailsWrapper) {
        ScrollTrigger.create({
          trigger: detailsScroll,
          start: "top top",
          end: "bottom bottom",
          pin: detailsWrapper,
          pinSpacing: false,
        });
      }

      if (detailsScroll && (mailWrapperRef.current || socialsRef.current)) {
        const getFromState = () => {
          const offsetX = getDetailsOffsetX();
          return {
            mailX: -offsetX,
            socialsX: offsetX,
          };
        };

        if (mailWrapperRef.current) {
          const { mailX } = getFromState();
          gsap.set(mailWrapperRef.current, { x: mailX, autoAlpha: 0 });
        }
        if (socialsRef.current) {
          const { socialsX } = getFromState();
          gsap.set(socialsRef.current, { x: socialsX, autoAlpha: 0 });
        }

        animateDetailsIn = () => {
          if (mailWrapperRef.current) {
            gsap.to(mailWrapperRef.current, {
              x: 0,
              autoAlpha: 1,
              duration: isMobile ? 0.75 : 0.95,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
          if (socialsRef.current) {
            gsap.to(socialsRef.current, {
              x: 0,
              autoAlpha: 1,
              duration: isMobile ? 0.75 : 0.95,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        };

        animateDetailsOut = () => {
          const { mailX, socialsX } = getFromState();

          if (mailWrapperRef.current) {
            gsap.to(mailWrapperRef.current, {
              x: mailX,
              autoAlpha: 0,
              duration: isMobile ? 0.55 : 0.7,
              ease: "power3.in",
              overwrite: "auto",
            });
          }
          if (socialsRef.current) {
            gsap.to(socialsRef.current, {
              x: socialsX,
              autoAlpha: 0,
              duration: isMobile ? 0.55 : 0.7,
              ease: "power3.in",
              overwrite: "auto",
            });
          }
        };

        ScrollTrigger.create({
          trigger: detailsScroll,
          start: `top ${detailsRevealStartPercent}%`,
          end: "bottom top",
          onEnter: () => {
            activateEndState();
          },
          onEnterBack: () => {
            activateEndState();
          },
        });

        ScrollTrigger.create({
          trigger: detailsScroll,
          start: `top ${detailsHideBackStartPercent}%`,
          end: "bottom top",
          onLeaveBack: () => {
            deactivateEndState();
          },
        });

        if (section.classList.contains("scrolled")) {
          animateDetailsIn();
        }

        // Programmatic jumps can land directly in the reveal zone and skip
        // incremental onEnter timing; sync state immediately on setup.
        const detailsRect = detailsScroll.getBoundingClientRect();
        const revealThresholdPx = (window.innerHeight * detailsRevealStartPercent) / 100;
        if (detailsRect.top <= revealThresholdPx && detailsRect.bottom > 0) {
          activateEndState();
        }
      }

      /* ---- smiley parallax ---- */
      if (smileyRef.current) {
        gsap.to(smileyRef.current, {
          x: isMobile ? -60 : -200,
          ease: "none",
          scrollTrigger: {
            trigger: smileyRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

    }, section);

    let refreshRafId = null;
    const refreshViewportDrivenLayout = () => {
      if (refreshRafId !== null) return;
      refreshRafId = window.requestAnimationFrame(() => {
        refreshRafId = null;
        ScrollTrigger.refresh();
      });
    };
    const handleWindowResize = () => {
      if (mobileMediaQuery.matches) return;
      refreshViewportDrivenLayout();
    };

    window.addEventListener("orientationchange", refreshViewportDrivenLayout);
    window.addEventListener("resize", handleWindowResize);

    return () => {
      if (refreshRafId !== null) {
        window.cancelAnimationFrame(refreshRafId);
      }
      window.removeEventListener("orientationchange", refreshViewportDrivenLayout);
      window.removeEventListener("resize", handleWindowResize);
      ctx.revert();
    };
  }, [dispatch]);

  return (
    <section ref={sectionRef} id="contact">
      {[1, 2, 3, 4, 5].map((number) => (
        <div
          key={number}
          id={`section-titlte-scroll-${number}`}
          className={`section-title${number === 1 ? " is-primary" : ""}`}
        >
          <div className="line">
            {Array.from({ length: number === 1 ? 5 : 3 }).map((_, idx) => (
              <span key={idx + 1} className="contact-me-unit">
                Contact
                <span className="second-word">Me</span>
              </span>
            ))}
          </div>
        </div>
      ))}
      <div id="contact-details-scroll">
        <div className="contact-details-wrapper">
          <div ref={mailWrapperRef} className="mail-link-wrapper">
            <a
              className="mail-link link link-underline"
              href="mailto:alex.yansons@gmail.com"
            >
              SAY<i> HI.</i>
            </a>
          </div>
          <div ref={smileyRef} className="smileyFace-row-wrapper">
            <div className="smileyFace-wrapper">
              <div className="smileyFace">
                <div className="left-eye"></div>
                <div className="right-eye"></div>
                <div className="mouth"></div>
              </div>
            </div>
          </div>
          <div ref={socialsRef} className="social-links-container">
            <div className="text">Socials</div>
            <div className="social-links-list">
              <a
                className="link link-underline"
                href="https://www.linkedin.com/in/alexander-yansons-2005a117a/"
                target="_blank"
                rel="noreferrer"
              >
                linkedin
              </a>
              <a
                className="link link-underline"
                href="https://github.com/urfriendalex"
                target="_blank"
                rel="noreferrer"
              >
                github
              </a>
              <a
                className="link link-underline"
                href="https://www.instagram.com/urfriendalex/"
                target="_blank"
                rel="noreferrer"
              >
                instagram
              </a>
            </div>
          </div>
        </div>
        <div className="bg-changer">
          <div
            className="btn link link-wavy"
            onClick={() => dispatch(switchBgVersion())}
          >
            <span>click</span>
            <svg
              className="link__graphic link__graphic--slide"
              width="300%"
              height="100%"
              viewBox="0 0 1200 60"
              preserveAspectRatio="none"
            >
              <path d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0"></path>
            </svg>
          </div>
        </div>
      </div>
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className={`background-holder bg-${item} ${bgVersion === item ? "active" : ""}`}
        ></div>
      ))}
    </section>
  );
};

export default Contact;
