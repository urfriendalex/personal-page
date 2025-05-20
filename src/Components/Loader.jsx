import React, { useEffect, useRef, useMemo } from "react";
import { TimelineLite } from "gsap";

const Loader = ({ handleIsLoading }) => {
  const tl = useMemo(() => new TimelineLite(), []);

  const loader = useRef(null);

  useEffect(() => {
    tl.to(loader.current, 0, { css: { visibility: "visible" } })
      .fromTo(loader.current.childNodes[0], 0.5, { left: "-100vw" }, { left: "0" })
      .fromTo(loader.current.childNodes[1], 0.5, { right: "-100vw" }, { right: "0" })
      .to(loader.current.childNodes[1], 0.5, { backgroundColor: "#2D2D2A" });

    tl.eventCallback("onComplete", () => {
      console.log("i am done");
      handleIsLoading(false);
    });

    return () => {
      console.log("i am disappearing");
    };
  }, [handleIsLoading, tl]);

  return (
    <div ref={loader} className="loader">
      <div className="loader loader-first">That is loader 1</div>
      <div className="loader loader-second">That is loader 2</div>
    </div>
  );
};

export default Loader;
