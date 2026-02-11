import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { switchBgVersion, switchThemeMode } from "../redux/actions/uiActions";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STICKY_TOPS = [0, 20, 40, 60, 80]; // vh – where each line sticks

const Contact = () => {
  const bgVersion = useSelector((state) => state.UI.bgVersion);
  const isLight = useSelector((state) => state.UI.isLight);
  const dispatch = useDispatch();
  const sectionRef = useRef(null);
  const smileyRef = useRef(null);
  const mailLinkRef = useRef(null);
  const socialsRef = useRef(null);
  const isLightRef = useRef(isLight);

  useEffect(() => {
    isLightRef.current = isLight;
  }, [isLight]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const ctx = gsap.context(() => {
      /* ---- sticky "Contact Me" lines ---- */
      const titleDivs = gsap.utils.toArray(".section-title", section);
      let endStateInfiniteMarquee = null;
      let endStateScrollTween = null;
      let endStateLine = null;
      const getMarqueeTravel = (lineEl) => {
        const unit = lineEl.querySelector(".contact-me-unit");
        if (!unit) return 0;
        const unitWidth = unit.getBoundingClientRect().width;
        const lineStyles = window.getComputedStyle(lineEl);
        const gap = Number.parseFloat(lineStyles.columnGap || lineStyles.gap || "0") || 0;
        return unitWidth + gap;
      };
      const handoffToFixed = (lineEl, stickyTop) => {
        const rect = lineEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;

        lineEl.style.position = "fixed";
        lineEl.style.top = `${rect.top}px`;
        lineEl.style.left = `${centerX}px`;

        gsap.to(lineEl, {
          top: `${stickyTop}vh`,
          left: "50%",
          duration: 0.16,
          ease: "power1.out",
          overwrite: "auto",
        });
      };

      titleDivs.forEach((titleDiv, i) => {
        const line = titleDiv.querySelector(".line");
        if (!line) return;
        const stickyTop = STICKY_TOPS[i];
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
          start: `top ${stickyTop}vh`,
          end: `bottom ${stickyTop}vh`,
          onEnter: () => {
            handoffToFixed(line, stickyTop);
          },
          onLeave: () => {
            line.style.position = "";
            line.style.top = "";
            line.style.left = "";
          },
          onEnterBack: () => {
            handoffToFixed(line, stickyTop);
          },
          onLeaveBack: () => {
            line.style.position = "";
            line.style.top = "";
            line.style.left = "";
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
              start: `top ${stickyTop}vh`,
              end: `bottom ${stickyTop}vh`,
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
        let isEndStateActive = false;
        const activationProgress = 0.16;

        const activateEndState = () => {
          if (isEndStateActive) return;
          isEndStateActive = true;
          section.classList.add("scrolled");
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

        const deactivateEndState = () => {
          if (!isEndStateActive) return;
          isEndStateActive = false;
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
          start: `top ${STICKY_TOPS[STICKY_TOPS.length - 1]}vh`,
          end: "bottom bottom",
          onUpdate: (self) => {
            if (self.progress >= activationProgress) {
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
      const detailsScroll = section.querySelector("#contact-details-scroll");
      const detailsWrapper = section.querySelector(".contact-details-wrapper");
      if (detailsScroll && detailsWrapper) {
        ScrollTrigger.create({
          trigger: detailsScroll,
          start: "top top",
          end: "bottom bottom",
          pin: detailsWrapper,
          pinSpacing: false,
        });
      }

      if (mailLinkRef.current) {
        gsap.fromTo(
          mailLinkRef.current,
          { xPercent: -22, autoAlpha: 0 },
          {
            xPercent: 0,
            autoAlpha: 1,
            duration: isMobile ? 0.75 : 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: detailsScroll || mailLinkRef.current,
              start: isMobile ? "top 95%" : "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (socialsRef.current) {
        gsap.fromTo(
          socialsRef.current,
          { xPercent: 24, autoAlpha: 0 },
          {
            xPercent: 0,
            autoAlpha: 1,
            duration: isMobile ? 0.75 : 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: detailsScroll || socialsRef.current,
              start: isMobile ? "top 95%" : "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
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

      /* ---- socials parallax ---- */
      if (socialsRef.current) {
        gsap.to(socialsRef.current, {
          x: isMobile ? 40 : 100,
          ease: "none",
          scrollTrigger: {
            trigger: socialsRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, section);

    return () => {
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
          <div className="mail-link-wrapper">
            <a
              ref={mailLinkRef}
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
