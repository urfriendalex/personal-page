import React, { useEffect } from "react";
import "./styles/App.scss";
import Landing from "./components/Landing";
import { useSelector } from "react-redux";
import CustomCursor from "./components/CustomCursor";

export default function App() {
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

  const isLight = useSelector(state => state.UI.isLight);

  return (
    <div className={`App${isLight ? " light" : ""}`}>
      <CustomCursor />
      <Landing />
    </div>
  );
}
