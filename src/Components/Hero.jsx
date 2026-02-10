import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { switchBgVersion } from "../redux/actions/uiActions";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const scroll = useSelector(state => state.scroll.scrollInstance);
  const dispatch = useDispatch();
  const bgVersion = useSelector(state => state.UI.bgVersion);

  const text1Ref = useRef(null);
  const text4Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax: "Hi, I'm Alex" moves right on scroll
      if (text1Ref.current) {
        gsap.to(text1Ref.current, {
          x: 200,
          ease: "none",
          scrollTrigger: {
            trigger: text1Ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Parallax: "lets talk." moves left on scroll
      if (text4Ref.current) {
        gsap.to(text4Ref.current, {
          x: -150,
          ease: "none",
          scrollTrigger: {
            trigger: text4Ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="about">
      <div className="hero-text-wrapper">
        <h1 ref={text1Ref} className="text text-1">
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
        <h3 ref={text4Ref} className="text text-4">
          <span>
            <a
              href="#contact"
              className="link link-underline"
              onClick={event => {
                event.preventDefault();
                if (scroll && scroll.scrollTo) {
                  scroll.scrollTo(document.querySelector("#contact-details-scroll"));
                }
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
          className={`background-container bg-${item} ${bgVersion === item ? "active" : ""}`}
        ></div>
      ))}
    </section>
  );
};

export default Hero;
