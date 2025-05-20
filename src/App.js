import React, { useEffect, useRef, useState } from "react";
import "./styles/App.scss";
import Loader from "./components/Loader";
import Landing from "./components/Landing";
import useLocoScroll from "./components/hooks/useLocoScroll";
import { useSelector } from "react-redux";

function App() {
  const cursor = useRef(null);
  const [isLoading, setIsloading] = useState(false);

  const handleIsLoading = status => {
    setIsloading(status);
  };

  const faviconUpdate = async () => {
    const favicon = document.getElementById("favicon");
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      favicon.href = "/favicon/dark/favicon.ico";
    } else {
      favicon.href = "/favicon/light/favicon.ico";
    }
  };

  const onMove = e => {
    cursor.current.style.left = `${e.pageX}px`;
    cursor.current.style.top = `${e.pageY}px`;
  };

  useLocoScroll(true);

  useEffect(() => {
    faviconUpdate();
  }, []);

  const isLight = useSelector(state => state.UI.isLight);

  return (
    <div className={`App${isLight ? " light" : ""}`} onMouseMove={onMove}>
      <div ref={cursor} id="cursor"></div>
      {isLoading ? <Loader handleIsLoading={handleIsLoading} /> : <Landing />}
    </div>
  );
}

export default App;
