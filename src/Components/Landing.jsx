import React, { useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import Navigation from "./Navigation";
import Projects from "../Components/Projects";
import Contact from "../Components/Contact";
import useLocoScroll from "./hooks/useLocoScroll";

const Landing = () => {
  const [navActive, setNavActive] = useState(false);
  useLocoScroll(true);

  return (
    <div className="landing">
      <Header navActive={navActive} setNavActive={setNavActive} />
      <Navigation navActive={navActive} setNavActive={setNavActive} />
      <div id="main-container">
        <Hero />
        <Projects />
        <Contact />
      </div>
    </div>
  );
};

export default Landing;
