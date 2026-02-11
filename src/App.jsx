import React, { useEffect, useState } from "react";
import "./styles/App.scss";
import Landing from "./components/Landing";
import { useSelector } from "react-redux";
import CustomCursor from "./components/CustomCursor";

export default function App() {
  const [isPageReady, setIsPageReady] = useState(false);

  const faviconUpdate = async () => {
    const favicon = document.getElementById("favicon");
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      favicon.href = "/favicon/dark/favicon.ico";
    } else {
      favicon.href = "/favicon/light/favicon.ico";
    }
  };

  // LocomotiveScroll is initialized inside Landing after DOM is mounted

  useEffect(() => {
    faviconUpdate();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    let rafId = null;
    const mobileMediaQuery = window.matchMedia("(max-width: 768px)");

    const applyStableViewportHeight = () => {
      rafId = null;
      root.style.setProperty("--full-vh", `${window.innerHeight}px`);
    };

    const scheduleViewportUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(applyStableViewportHeight);
    };

    const handleWindowResize = () => {
      if (mobileMediaQuery.matches) return;
      scheduleViewportUpdate();
    };

    scheduleViewportUpdate();
    window.addEventListener("orientationchange", scheduleViewportUpdate);
    window.addEventListener("resize", handleWindowResize);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("orientationchange", scheduleViewportUpdate);
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsPageReady(true);
      return undefined;
    }

    let firstFrameId = null;
    let secondFrameId = null;
    firstFrameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(() => {
        setIsPageReady(true);
      });
    });

    return () => {
      if (firstFrameId !== null) {
        window.cancelAnimationFrame(firstFrameId);
      }
      if (secondFrameId !== null) {
        window.cancelAnimationFrame(secondFrameId);
      }
    };
  }, []);

  const isLight = useSelector(state => state.UI.isLight);

  return (
    <div
      className={`App${isLight ? " light" : ""}${isPageReady ? " is-page-ready" : " is-page-loading"}`}
    >
      <CustomCursor />
      <Landing />
    </div>
  );
}
