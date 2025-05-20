import React from "react";
import { useSelector } from "react-redux";

const Header = ({ navActive, setNavActive }) => {
  const scroll = useSelector(state => state.scroll.scrollInstanse);
  return (
    <header>
      <h1
        className="logo-text"
        onClick={() => {
          scroll.scrollTo(document.querySelector("#about"));
        }}
      >
        <span>A</span>
        <span className="hidden-part">LEXANDER</span>
        <span className="ending-part">Y.</span>
      </h1>
      <div
        onClick={() => setNavActive(!navActive)}
        className={`menu-toggler${navActive ? " active" : ""}`}
      >
        <span className="menu-line"></span>
        <span className="menu-line"></span>
      </div>
    </header>
  );
};

export default Header;
