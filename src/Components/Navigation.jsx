import React, { useEffect } from "react";
import { splitToSpans } from "./tools/functions.jsx";
import { useSelector } from "react-redux";

const Navigation = ({ navActive, setNavActive }) => {
  const scroll = useSelector(state => state.scroll.scrollInstance);

  useEffect(() => {
    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = documentElement.style.overflow;
    const previousBodyTouchAction = body.style.touchAction;
    const previousHtmlTouchAction = documentElement.style.touchAction;
    const lenis = scroll?.lenis;

    if (navActive) {
      body.style.overflow = "hidden";
      documentElement.style.overflow = "hidden";
      body.style.touchAction = "none";
      documentElement.style.touchAction = "none";
      lenis?.stop?.();
    } else {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousHtmlOverflow;
      body.style.touchAction = previousBodyTouchAction;
      documentElement.style.touchAction = previousHtmlTouchAction;
      lenis?.start?.();
    }

    return () => {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousHtmlOverflow;
      body.style.touchAction = previousBodyTouchAction;
      documentElement.style.touchAction = previousHtmlTouchAction;
      lenis?.start?.();
    };
  }, [navActive, scroll]);

  return (
    <nav className={`navFull${navActive ? " active" : ""}`}>
      <div className="navItem">
        <a
          href="#about"
          onClick={event => {
            event.preventDefault();
            setNavActive(false);
            requestAnimationFrame(() => {
              if (scroll?.scrollTo) {
                scroll.scrollTo(document.querySelector("#about"));
              }
            });
          }}
        >
          <div className="main-text">{splitToSpans("about", "")}</div>
          <div className="second-text">{splitToSpans("about", "")}</div>
        </a>
      </div>
      <div className="navItem">
        <a
          href="#projects"
          onClick={event => {
            event.preventDefault();
            setNavActive(false);
            requestAnimationFrame(() => {
              window.dispatchEvent(new Event("projects:nav-scroll-to-start"));
            });
          }}
        >
          <div className="main-text">{splitToSpans("projects", "")}</div>
          <div className="second-text">{splitToSpans("projects", "")}</div>
        </a>
      </div>
      <div className="navItem">
        <a
          href="#contact"
          onClick={event => {
            event.preventDefault();
            setNavActive(false);
            requestAnimationFrame(() => {
              if (scroll?.scrollTo) {
                scroll.scrollTo(document.querySelector("#contact-details-scroll"));
              }
            });
          }}
        >
          <div className="main-text">{splitToSpans("contact", "")}</div>
          <div className="second-text">{splitToSpans("contact", "")}</div>
        </a>
      </div>
    </nav>
  );
};

export default Navigation;
