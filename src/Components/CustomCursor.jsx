import React, { useEffect, useRef } from "react";

const LINK_SELECTOR = "a, .link, .projects-control-btn";
const FOLLOW_EASING = 0.16;

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;
    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (isMobileViewport || !hasFinePointer) return;

    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    let rafId = null;
    let shouldAnimate = false;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };

    const getLinkTarget = element => {
      const linkTarget = element.closest(LINK_SELECTOR);
      if (!linkTarget) return null;
      return linkTarget;
    };

    const animate = () => {
      current.x += (target.x - current.x) * FOLLOW_EASING;
      current.y += (target.y - current.y) * FOLLOW_EASING;

      cursorEl.style.left = `${current.x}px`;
      cursorEl.style.top = `${current.y}px`;

      const isSettled =
        Math.abs(target.x - current.x) < 0.1 &&
        Math.abs(target.y - current.y) < 0.1;

      if (!shouldAnimate && isSettled) {
        rafId = null;
        return;
      }

      rafId = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(animate);
    };

    const handleMouseMove = event => {
      target.x = event.clientX;
      target.y = event.clientY;
      shouldAnimate = true;
      cursorEl.classList.add("is-visible");

      startAnimation();
    };

    const hideCursor = () => {
      shouldAnimate = false;
      cursorEl.classList.remove("is-visible");
    };

    const handleWindowMouseOut = event => {
      if (!event.relatedTarget && !event.toElement) {
        hideCursor();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        hideCursor();
      }
    };

    const handleMouseOver = event => {
      const targetEl = event.target;
      if (!(targetEl instanceof Element)) return;
      const linkEl = getLinkTarget(targetEl);

      if (linkEl) {
        cursorEl.classList.add("is-hidden");
      }
    };

    const handleMouseOut = event => {
      const fromEl = event.target;
      const toEl = event.relatedTarget;
      if (!(fromEl instanceof Element)) return;

      const fromLink = getLinkTarget(fromEl);
      const toLink = toEl instanceof Element ? getLinkTarget(toEl) : null;

      if (fromLink && !toLink) {
        cursorEl.classList.remove("is-hidden");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleWindowMouseOut);
    window.addEventListener("blur", hideCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mouseleave", hideCursor);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleWindowMouseOut);
      window.removeEventListener("blur", hideCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseleave", hideCursor);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return <div ref={cursorRef} id="cursor"></div>;
}
