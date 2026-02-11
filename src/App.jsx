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
