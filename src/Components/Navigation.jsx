import React from "react";
import { splitToSpans } from "./tools/functions.jsx";
import { useSelector } from "react-redux";

const Navigation = ({ navActive, setNavActive }) => {
  const scroll = useSelector(state => state.scroll.scrollInstance);
  return (
    <nav className={`navFull${navActive ? " active" : ""}`}>
      <div className="navItem">
        <a
          href="#about"
          onClick={event => {
            event.preventDefault();
            if (scroll?.scrollTo) {
              scroll.scrollTo(document.querySelector("#about"));
            }
            setNavActive(!navActive);
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
            window.dispatchEvent(new Event("projects:nav-scroll-to-start"));
            setNavActive(false);
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
            scroll.scrollTo(document.querySelector("#contact-details-scroll"));
            setNavActive(!navActive);
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
