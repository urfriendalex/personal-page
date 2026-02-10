import React, { useEffect, useRef } from "react";

const LINK_SELECTOR = "a, .link";
const NAV_EXCLUDE_SELECTOR = ".navFull";
const FOLLOW_EASING = 0.16;
const MAGNETIC_STRENGTH = 0.22;
const MAGNETIC_MAX_SHIFT = 14;
const MAGNETIC_IN_TRANSITION = "transform 120ms ease-out";
const MAGNETIC_OUT_TRANSITION = "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)";

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
    let activeMagneticEl = null;
    const magneticBaseStyles = new WeakMap();

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const getInteractiveLinkTarget = element => {
      const linkTarget = element.closest(LINK_SELECTOR);
      if (!linkTarget) return null;
      if (linkTarget.closest(NAV_EXCLUDE_SELECTOR)) return null;
      return linkTarget;
    };

    const setActiveMagnetic = element => {
      if (activeMagneticEl === element) return;

      if (activeMagneticEl) {
        const previousEl = activeMagneticEl;
        const previousStyles = magneticBaseStyles.get(previousEl);
        previousEl.style.transition = MAGNETIC_OUT_TRANSITION;
        previousEl.style.transform = previousStyles?.transform ?? "";

        const clearTransition = () => {
          previousEl.style.transition = previousStyles?.transition ?? "";
          previousEl.style.willChange = previousStyles?.willChange ?? "";
          previousEl.removeEventListener("transitionend", clearTransition);
        };

        previousEl.addEventListener("transitionend", clearTransition);
      }

      activeMagneticEl = element;
      if (!activeMagneticEl) return;

      if (!magneticBaseStyles.has(activeMagneticEl)) {
        magneticBaseStyles.set(activeMagneticEl, {
          transform: activeMagneticEl.style.transform,
          transition: activeMagneticEl.style.transition,
          willChange: activeMagneticEl.style.willChange
        });
      }

      activeMagneticEl.style.willChange = "transform";
      activeMagneticEl.style.transition = MAGNETIC_IN_TRANSITION;
    };

    const applyMagneticOffset = (element, mouseX, mouseY) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;
      const halfW = Math.max(rect.width / 2, 1);
      const halfH = Math.max(rect.height / 2, 1);
      const maxShiftX = Math.min(halfW * MAGNETIC_STRENGTH, MAGNETIC_MAX_SHIFT);
      const maxShiftY = Math.min(halfH * MAGNETIC_STRENGTH, MAGNETIC_MAX_SHIFT);
      const shiftX = clamp((deltaX / halfW) * maxShiftX, -maxShiftX, maxShiftX);
      const shiftY = clamp((deltaY / halfH) * maxShiftY, -maxShiftY, maxShiftY);

      element.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0)`;
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

      if (activeMagneticEl) {
        applyMagneticOffset(activeMagneticEl, event.clientX, event.clientY);
      }

      startAnimation();
    };

    const hideCursor = () => {
      shouldAnimate = false;
      cursorEl.classList.remove("is-visible");
      setActiveMagnetic(null);
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
      const linkEl = getInteractiveLinkTarget(targetEl);
      if (linkEl) {
        cursorEl.classList.add("is-hidden");
        setActiveMagnetic(linkEl);
      }
    };

    const handleMouseOut = event => {
      const fromEl = event.target;
      const toEl = event.relatedTarget;
      if (!(fromEl instanceof Element)) return;

      const fromLink = getInteractiveLinkTarget(fromEl);
      const toLink =
        toEl instanceof Element ? getInteractiveLinkTarget(toEl) : null;

      if (fromLink && !toLink) {
        cursorEl.classList.remove("is-hidden");
      }

      if (fromLink && fromLink !== toLink) {
        setActiveMagnetic(toLink);
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
