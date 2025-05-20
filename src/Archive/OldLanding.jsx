import React, { useEffect, useRef, useState } from "react";
import { gsap, Power2 } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Tween, Timeline } from "react-gsap";
import Header from "../components/Header";
import Hero from "../components/Hero";
// import pic from '../img/pic.jpg';

const Landing = () => {
  if (typeof window !== `undefined`) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.core.globals("ScrollTrigger", ScrollTrigger);
  }

  const loadingTl = gsap.timeline();

  const [navActive, setNavActive] = useState(false);
  const [loadedBefore, setLoadedBefore] = useState(false);

  const circleGrow = () => {
    gsap.to("#cursor", { height: "150px", width: "150px", duration: 0.5 });
  };

  const circleShrink = () => {
    gsap.to("#cursor", { width: "3rem", height: "3rem", duration: 0.5 });
  };

  useEffect(() => {
    gsap.to(["#cursor", "main"], { visibility: "visible" });

    if (!loadedBefore) {
      loadingTl
        .to([".hamburger", "#hey", ".hero"], {
          visibility: "visible",
          duration: 0,
        })
        .fromTo(
          ".landing",
          { backgroundColor: "#2D2D2A" },
          { backgroundColor: "#262626", duration: 1 }
        )
        .fromTo("#hey", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=1.8")
        .fromTo(
          ".hamburger span:nth-of-type(1)",
          { width: "0" },
          {
            width: "36px",
            ease: Power2.easeInOut,
            clearProps: "width",
            duration: 0.3,
          },
          "-=1.3"
        )
        .fromTo(
          ".hamburger span:nth-of-type(2)",
          { width: "0" },
          {
            width: "26px",
            ease: Power2.easeInOut,
            clearProps: "width",
            duration: 0.3,
          },
          "-=1"
        )
        .fromTo(
          ".hamburger span:nth-of-type(3)",
          { width: "0" },
          {
            width: "20px",
            ease: Power2.easeInOut,
            clearProps: "width",
            duration: 0.4,
          },
          "-=0.7"
        )
        .then(() => {
          setLoadedBefore(true);
        });
    }
  }, [loadedBefore, loadingTl]);

  return (
    <div className="landing">
      <Header navActive={navActive} setNavActive={setNavActive} />
      <Hero />
      <main>
        <div className="works section-wrapper">
          <div className="section-title">
            <div className="section-back-subtitle">MY PROJECTS MY PROJECTS</div>
            <div className="section-back-subtitle">MY PROJECTS MY PROJECTS</div>
            <h1 className="section-subtitle">MY PROJECTS</h1>
          </div>
        </div>
        <div className="skills section-wrapper">
          <div className="section-title">
            <div className="section-back-subtitle">MY SKILLS MY SKILLS</div>
            <div className="section-back-subtitle">MY SKILLS MY SKILLS</div>
            <h1 className="section-subtitle">MY SKILLS</h1>
          </div>
        </div>
        <div className="contact">
          <h1>CONTACT</h1>
        </div>
      </main>
    </div>
  );
};

export default Landing;
