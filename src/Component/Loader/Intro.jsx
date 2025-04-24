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
  const waveformRef = useRef(null);

  useEffect(() => {
    const context = gsap.context(() => {
      if (timeline) {
        timeline.add(introAnimation(loaderRef, textSplitRef, waveformRef, onComplete), 0);
      }
    }, loaderRef);

    return () => context.revert();
  }, [timeline, onComplete]);

  // Create waveform bars
  const renderWaveform = () => {
    const bars = [];
    for (let i = 0; i < 100; i++) {
      bars.push(<div key={i} className='waveform-bar' />);
    }
    return bars;
  };

  return (
    <div className={"loaderWrapper"} ref={loaderRef}>
      <div className='wrap'>
        <TextSplit ref={textSplitRef} as='h1' animateInView={false} hover={false} splitBy='char' unitAs='span'>
          IBRAHIM SHUAIB
        </TextSplit>
        <div ref={waveformRef} className='wave'>
          {renderWaveform()}
        </div>
      </div>
    </div>
  );
};

export default Intro;

export const introAnimation = (loaderRef, textSplitRef, waveformRef, onComplete) => {
  const tl = gsap.timeline();
  const chars = textSplitRef.current?.querySelectorAll(".animated-unit") || [];
  const bars = waveformRef.current?.querySelectorAll(".waveform-bar") || [];
  const randomFont = FONT_CLASSES[Math.floor(Math.random() * FONT_CLASSES.length)];

  // Initial setup
  tl.set(loaderRef.current, { display: "block" });
  tl.set(bars, {
    height: "0%",
    y: "0%",
    transformOrigin: "center center",
  });

  // Animate text
  chars.forEach((char, index) => {
    const randomFonts = FONT_CLASSES[Math.floor(Math.random() * FONT_CLASSES.length)];
    tl.set(char, { className: `${randomFonts} animated-unit`, autoAlpha: 0, y: 25 }, 0);

    // tl.to(
    //   char,
    //   {
    //     autoAlpha: 1,
    //     y: 0,
    //     duration: 0.5,
    //     ease: "back.out(2)",
    //     delay: index * 0.05,
    //     stagger: {
    //       each: 0.05,
    //       from: "edges", // Randomize which bars move first
    //     },
    //   },
    //   0
    // );
  });
  tl.to(
    chars,
    {
      // y: "100%",
      // duration: 1.5,
      // ease: "power4.inOut",
      autoAlpha: 1,
      y: 0,
      duration: 0.5,
      ease: "back.out(2)",
      stagger: {
        each: 0.05,
        from: "edges",
      },
    },
    "<"
  );
  // Animate waveform bars - grow from center to random heights
  tl.to(
    bars,
    {
      height: () => `${Math.random() * 80 + 20}%`, // Random height between 20-100%
      duration: 1,
      ease: "expo.out",
      stagger: {
        each: 0.015,
        from: "center", // Animate outwards from center
      },
    },
    "<"
  );

  // Unify fonts
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
  // Random bar translations every 0.25s for 2 seconds
  const randomBarAnimations = () => {
    const animTl = gsap.timeline({ yoyo: true, repeat: 1 });

    animTl.to(
      bars,
      {
        y: () => gsap.utils.random(-50, 50) + "%", // Random vertical position
        duration: 1,
        ease: "expo.inOut",
        stagger: {
          each: 0.01,
          from: "edges", // Randomize which bars move first
        },
      },
      0
    );

    return animTl;
  };

  tl.add(randomBarAnimations(), "<");

  // Final animation - expand all bars to full height
  tl.to(
    bars,
    {
      height: "100%",
      y: "0%", // Reset any vertical translation
      duration: 1,
      ease: "expo.in",
      stagger: {
        each: 0.015,
        from: "edges", // Randomize which bars move first
      },
    },
    ">+=0.5" // After 2 seconds of random movements
  );

  // exit text
  tl.to(
    chars,
    {
      autoAlpha: 0,
      y: 25,
      duration: 0.5,
      ease: "back.out(2)",
      stagger: {
        each: 0.05,
        from: "center",
      },
    },
    ">-=0.5"
  );

  tl.to(
    waveformRef.current,
    {
      scale: 5,
      // opacity: 0,
      filter: "blur(50px)",
      background: "rgba(255, 255, 255, 1)",
      duration: 1,
      ease: "expo.inOut",
    },
    ">-=0.5"
  )
  tl.to(
    loaderRef.current,
    {
      opacity: 0,
      duration: 2,
    },
    "<"
  )
  .call(onComplete, null, ">-=1.5");
  tl.set(loaderRef.current, { display: "none" });
  tl.to(
    waveformRef.current,
    {
      opacity: 0,
      duration: 1,
    },
    "<"
  );


  return tl;
};
