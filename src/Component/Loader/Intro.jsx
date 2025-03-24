import React, { useEffect, useRef } from "react";
import "../../Style/Component.scss";
import gsap from "gsap";
import Logo from "../Logo";
import useIsMobile from "../../Util/isMobile";
import TextSplit from "../../Util/TextSplit";

const Intro = ({ timeline, onComplete }) => {
  const loaderRef = useRef(null);
  // const eyeRef = useRef(null);
  // const progressNumberRef = useRef(null);
  // const isMobile = useIsMobile(800);

  useEffect(() => {
    const context = gsap.context(() => {
      if (timeline) {
        timeline.add(progressAnimation(loaderRef, onComplete), 0);
      }
    }, loaderRef);

    return () => context.revert(); // Cleanup on unmount
  }, [timeline, onComplete]);

  return (
    <div className={"loaderWrapper"} ref={loaderRef}>
      <TextSplit
        as='h1'
        animateInView={true}
        hover={false}
        // animationConfig={{
        //   options: {
        //     stagger: 0.2,
        //   }
        // }}
      >
        IBRAHIM SHUAIB
      </TextSplit>
    </div>
  );
};

export default Intro;

export const progressAnimation = (loaderRef, onComplete) => {
  const tl = gsap.timeline();

  tl.set(loaderRef.current, {
    display: "block",
  });

  tl.fromTo(
    loaderRef.current,
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
      duration: 0.05,
      ease: "sine.in",
    },
    "<"
  )
  .call(onComplete, null, ">");

  tl.set(loaderRef.current, {
    display: "none",
  })

  return tl;
};
