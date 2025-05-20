import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { switchBgVersion } from "../redux/actions/uiActions";
// import useLocalStorage from './hooks/useLocalStorage';

const Hero = () => {
  const scroll = useSelector(state => state.scroll.scrollInstanse);
  const dispatch = useDispatch();
  const bgVersion = useSelector(state => state.UI.bgVersion);

  return (
    <section data-scroll-section data-scroll-section-id="section1" className="hero" id="about">
      <div className="hero-text-wrapper">
        <h1
          className="text text-1"
          data-scroll
          data-scroll-direction="horizontal"
          data-scroll-speed="3"
        >
          <span>Hi, I'm Alex</span>
        </h1>
        <h2 className="text text-2">
          <span>front-end developer</span>
        </h2>
        <span className="text text-inbetween">
          <span>&</span>
        </span>
        <h2 className="text text-3">
          <span>design enthusiast</span>
        </h2>
        <h3
          className="text text-4"
          data-scroll
          data-scroll-direction="horizontal"
          data-scroll-speed="-2"
        >
          <span>
            <a
              href="#contact"
              className="link link-underline"
              onClick={event => {
                event.preventDefault();
                scroll.scrollTo(document.querySelector("#contact-details-scroll"));
              }}
            >
              lets talk.
            </a>
          </span>
        </h3>
      </div>
      <div className="bg-changer">
        <div
          className="btn link link-wavy"
          onClick={() => {
            dispatch(switchBgVersion());
          }}
        >
          <span>click</span>
          <svg
            className="link__graphic link__graphic--slide"
            width="300%"
            height="100%"
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
          >
            <path d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0"></path>
          </svg>
        </div>
      </div>
      {[1, 2, 3].map((item, index) => (
        <div
          key={index}
          className={`background-container bg-${bgVersion} ${bgVersion === item ? "active" : ""}`}
        ></div>
      ))}
    </section>
  );
};

export default Hero;
