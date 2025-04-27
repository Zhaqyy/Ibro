import React, { useEffect, useRef } from "react";
import "../../Style/Component.scss";
import gsap from "gsap";
import Logo from "../Logo";
import useIsMobile from "../../Util/isMobile";
import TextSplit from "../../Util/TextSplit";

const FONT_CLASSES = ["font1", "font2", "font4"];

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
    <div className={"loaderWrapper"} ref={loaderRef} style={{maskImage: 'linear-gradient(90deg, rgba(0,0,0,1) 0% 100%)'}}>
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

  // Shutter gradient transition
  const MAX_GRADIENT_BREAK = 30; // Number of gradient bands

  const createGradient = (progress) => {
    const gradient = [];
    const center = 50; // Center point (50%)
    
    for(let i = 0; i < MAX_GRADIENT_BREAK; i++) {
      const position = (i / MAX_GRADIENT_BREAK) * 100;
      const width = (1 / MAX_GRADIENT_BREAK) * 100;
      
      // Calculate distance from center (0-50)
      const distanceFromCenter = Math.abs(position - center);
      
      // Normalize distance (0-1)
      const normalizedDistance = distanceFromCenter / center;
      
      // Apply progress with easing - bands closer to center animate first
      const bandProgress = Math.min(progress / (1 - normalizedDistance * 0.75), 1);
      
      const start = position.toFixed(4);
      const end = (position + width).toFixed(4);
      const visibleEnd = position + (width * bandProgress);
      
      // For bands on the left side
      if (position < center) {
        gradient[i] = `rgba(0, 0, 0, 1) ${start}% ${visibleEnd}%, rgba(0, 0, 0, 0) ${visibleEnd}% ${end}%`;
      } 
      // For bands on the right side
      else {
        const visibleStart = position + (width * (1 - bandProgress));
        gradient[i] = `rgba(0, 0, 0, 0) ${start}% ${visibleStart}%, rgba(0, 0, 0, 1) ${visibleStart}% ${end}%`;
      }
    }
    
    return `linear-gradient(90deg, ${gradient.join(', ')})`;
  };


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
  // tl.to(
  //   chars,
  //   {
  //     className: `${randomFont} animated-unit`,
  //     duration: 1.5,
  //     ease: "power2.inOut",
  //     stagger: {
  //       each: 0.1,
  //       from: "edges",
  //     },
  //   },
  //   ">+=0.5"
  // );
  chars.forEach((char, index) => {

    tl.to(
      char,
      {
        className: `${randomFont} animated-unit`,
        duration: 1.5,
        ease: "power2.inOut",
        delay: index * 0.05,
        stagger: {
          each: 0.05,
          from: "edges", 
        },
      },
      0
    );
  });
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

  // expand all bars to full height
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
      y: 50,
      duration: 1,
      ease: "back.out(2)",
      stagger: {
        each: 0.05,
        from: "center",
      },
    },
    ">"
  );
  // Bar Final exit animation - retract all bars height
  tl.to(
    bars,
    {
      height: "0%",
      y: "0%", // Reset any vertical translation
      duration: 1,
      ease: "expo.in",
      stagger: {
        each: 0.015,
        from: "center", // Randomize which bars move first
      },
    },
    "<"
  );

  tl.fromTo(loaderRef.current, 
    { 
      maskImage: createGradient(1),
    },
    { 
      maskImage: createGradient(0),
      duration: 1.5,
      onUpdate: function() {
        const progress = 1 - this.progress();
        loaderRef.current.style.maskImage = createGradient(progress);
      }
    },
    "<+=1"
  )
  .call(onComplete, null, ">-=1.5");
  tl.set(loaderRef.current, { display: "none" });


  return tl;
};
