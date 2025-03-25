import React, { useEffect, useRef } from "react";
import "../../Style/Component.scss";
import gsap from "gsap";
import Logo from "../Logo";
import useIsMobile from "../../Util/isMobile";
import TextSplit from "../../Util/TextSplit";

const FONT_CLASSES = ["font1", "font2", "font3", "font4"];

const Intro = ({ timeline, onComplete }) => {
  const loaderRef = useRef(null);
  const textSplitRef = useRef(null);

  useEffect(() => {
    const context = gsap.context(() => {
      if (timeline) {
        timeline.add(introAnimation(loaderRef, textSplitRef, onComplete), 0);
      }
    }, loaderRef);

    return () => context.revert();
  }, [timeline, onComplete]);

  return (
    <div className={"loaderWrapper"} ref={loaderRef}>
      <TextSplit
        ref={textSplitRef}
        as='h1'
        animateInView={false} // We'll handle animation manually
        hover={false}
        splitBy='char'
        unitAs='span'
      >
        IBRAHIM SHUAIB
      </TextSplit>
    </div>
  );
};

export default Intro;

export const introAnimation = (loaderRef, textSplitRef, onComplete) => {
  const tl = gsap.timeline();
  const chars = textSplitRef.current?.querySelectorAll(".animated-unit") || [];
  const randomFont = FONT_CLASSES[Math.floor(Math.random() * FONT_CLASSES.length)];
  tl.set(loaderRef.current, {
    display: "block",
  });

  chars.forEach((char, index) => {
    const randomFonts = FONT_CLASSES[Math.floor(Math.random() * FONT_CLASSES.length)];
    tl.set(char, { className: `${randomFonts} animated-unit`, autoAlpha: 0, y: 25 }, 0);

    tl.to(
      char,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(2)",
        delay: index * 0.05,
      },
      0
    );
  });

  // Unify fonts after all chars are visible
  tl.to(
    chars,
    {
      className: `${randomFont} animated-unit`,
      duration: 1.5,
      ease: "power4.inOut",
      stagger: 0.1,
    },
    ">+=0.5"
  );

  // Zoom effect
  tl.to(loaderRef.current, {
    scale: 5,
    opacity:0,
    filter: 'blur(100px)',
    duration: 1,
    ease: "expo.in"
  }, ">")

  // tl.fromTo(
  //   loaderRef.current,
  //   {
  //     autoAlpha: 0,
  //   },
  //   {
  //     autoAlpha: 1,
  //     duration: 0.05,
  //     ease: "sine.in",
  //   },
  //   "<"
  // )
  // tl.to(loaderRef.current, {
  //   autoAlpha: 0,
  //   duration: 0.5,
  // })
  .call(onComplete, null, ">");

  tl.set(loaderRef.current, {
    display: "none",
  })

  return tl;
};
