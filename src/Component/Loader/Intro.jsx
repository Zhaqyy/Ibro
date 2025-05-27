import React, { useEffect, useRef } from "react";
import "../../Style/Component.scss";
import gsap from "gsap";
import Logo from "../Logo";
import useIsMobile from "../../Util/isMobile";
import TextSplit from "../../Util/TextSplit";
import bowser from "bowser";

const FONT_CLASSES = ["font1", "font4"];

const Intro = ({ timeline, onComplete }) => {
  const loaderRef = useRef(null);
  const textSplitRef = useRef(null);
  const waveformRef = useRef(null);
  const isMobile = useIsMobile(800);
  
 // Detect Safari/iOS
 const parser = bowser.getParser(window.navigator.userAgent);
 const isSafari = parser.getBrowserName() === "Safari" || parser.getOS().name === "iOS";


  useEffect(() => {
    const context = gsap.context(() => {
      if (timeline) {
        timeline.add(introAnimation(loaderRef, textSplitRef, waveformRef, onComplete, isMobile, isSafari), 0);
      }
    }, loaderRef);

    return () => context.revert();
  }, [timeline, onComplete, isMobile, isSafari]);

  // Create waveform bars
  const renderWaveform = () => {
    const bars = [];
    for (let i = 0; i < 100; i++) {
      bars.push(<div key={i} className='waveform-bar' />);
    }
    return bars;
  };

  return (
    <div 
      className={"loaderWrapper"} 
      ref={loaderRef} 
      style={{maskImage: `linear-gradient(${isMobile ? '0deg' : '90deg'}, rgba(0,0,0,1) 0% 100%)`}}
    >
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

const introAnimation = (loaderRef, textSplitRef, waveformRef, onComplete, isMobile, isSafari) => {
  const tl = gsap.timeline();
  const chars = textSplitRef.current?.querySelectorAll(".animated-unit") || [];
  const bars = waveformRef.current?.querySelectorAll(".waveform-bar") || [];
  const randomFont = FONT_CLASSES[Math.floor(Math.random() * FONT_CLASSES.length)];

  // Shutter gradient transition
  const MAX_GRADIENT_BREAK = 30; // Number of gradient bands

  const createGradient = (progress) => {
    const gradient = [];
    const center = 50; // Center point (50%)
    const gradientDirection = isMobile ? '0deg' : '90deg';
    
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
    
    return `linear-gradient(${gradientDirection}, ${gradient.join(', ')})`;
  };

  const createClipPath = (progress) => {
    const center = 50; // Center point (50%)
    const points = [];
    
    // Start with top-left corner
    points.push('0% 0%');
    
    for (let i = 0; i < MAX_GRADIENT_BREAK; i++) {
      const position = (i / MAX_GRADIENT_BREAK) * 100;
      const width = (1 / MAX_GRADIENT_BREAK) * 100;
      
      // Calculate distance from center (0-50)
      const distanceFromCenter = Math.abs(position - center);
      
      // Normalize distance (0-1)
      const normalizedDistance = distanceFromCenter / center;
      
      // Apply progress with easing - bands closer to center animate first
      const bandProgress = Math.min(progress / (1 - normalizedDistance * 0.75), 1);
      
      // For bands on the left side
      if (position < center) {
        const visibleEnd = position + (width * bandProgress);
        points.push(`${visibleEnd}% 0%`);
        points.push(`${visibleEnd}% 100%`);
      } 
      // For bands on the right side
      else {
        const visibleStart = position + (width * (1 - bandProgress));
        points.push(`${visibleStart}% 100%`);
        points.push(`${visibleStart}% 0%`);
      }
    }
    
    // Close the polygon
    points.push('100% 0%');
    points.push('100% 100%');
    points.push('0% 100%');
    
    return `polygon(${points.join(', ')})`;
  };
  

  // Initial setup
  tl.set(loaderRef.current, { display: "block" });
  
  // Set initial properties based on mobile/desktop
  tl.set(bars, {
    [isMobile ? 'width' : 'height']: "0%",
    // [isMobile ? 'height' : 'width']: "100%",
    [isMobile ? 'x' : 'y']: "0%",
    transformOrigin: "center center",
  });

  // Animate text (unchanged)
  chars.forEach((char, index) => {
    const randomFonts = FONT_CLASSES[Math.floor(Math.random() * FONT_CLASSES.length)];
    tl.set(char, { className: `${randomFonts} animated-unit`, autoAlpha: 0, y: isMobile ? 0 : 25 }, 0);
  });

  // text entry
  tl.to(
    chars,
    {
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

  // Animate waveform bars - grow from center to random heights/widths
  tl.to(
    bars,
    {
      [isMobile ? 'width' : 'height']: () => `${Math.random() * 80 + 20}%`, // Random between 20-100%
      duration: 1,
      ease: "expo.out",
      stagger: {
        each: 0.015,
        from: "center",
      },
    },
    "<"
  );

  // Unify fonts
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
  // const randomBarAnimations = () => {
  //   const animTl = gsap.timeline({ yoyo: true, repeat: 1 });

  //   animTl.to(
  //     bars,
  //     {
  //       [isMobile ? 'x' : 'y']: () => gsap.utils.random(-50, 50) + "%", // Random position
  //       duration: 1,
  //       ease: "expo.inOut",
  //       stagger: {
  //         each: 0.01,
  //         from: "edges",
  //       },
  //     },
  //     0
  //   );

  //   return animTl;
  // };

  // tl.add(randomBarAnimations(), "<");

  // expand all bars to full height/width
  // tl.to(
  //   bars,
  //   {
  //     [isMobile ? 'width' : 'height']: "100%",
  //     [isMobile ? 'x' : 'y']: "0%", // Reset any translation
  //     duration: 1,
  //     ease: "expo.in",
  //     stagger: {
  //       each: 0.015,
  //       from: "edges",
  //     },
  //   },
  //   ">+=0.5"
  // );

  // exit text
  tl.to(
    chars,
    {
      autoAlpha: 0,
      y: isMobile ? 0 : 50,
      duration: 1,
      ease: "back.out(2)",
      stagger: {
        each: 0.05,
        from: "center",
      },
    },
    ">"
  );

  // Bar Final exit animation - retract all bars height/width
  tl.to(
    bars,
    {
      [isMobile ? 'width' : 'height']: "0%",
      [isMobile ? 'x' : 'y']: "0%", // Reset any translation
      duration: 1,
      ease: "expo.in",
      stagger: {
        each: 0.015,
        from: "center",
      },
    },
    "<"
  );

  // if (isSafari) {
    // tl.fromTo(
    //   loaderRef.current,
    //   { 
    //     // clipPath: 'polygon(0% 0%, 20% 0%, 20% 100%, 20% 100%, 20% 0%, 40% 0%, 40% 100%, 40% 100%, 40% 0%, 60% 0%, 60% 100%, 60% 100%, 60% 0%, 80% 0%, 80% 100%, 80% 100%, 80% 0%, 100% 0%, 100% 100%, 0% 100%)',
    //     clipPath: createClipPath(1),
    //     webkitClipPath: createClipPath(1) 
    //   },
    //   { 
    //     clipPath: createClipPath(0),
    //     webkitClipPath: createClipPath(0),
    //     // clipPath: 'polygon(20% 0%, 20% 0%, 20% 100%, 40% 100%, 40% 0%, 40% 0%, 40% 100%, 60% 100%, 60% 0%, 60% 0%, 60% 100%, 80% 100%, 80% 0%, 80% 0%, 80% 100%, 100% 100%, 100% 0%, 100% 0%, 100% 100%, 20% 100%)',
    //     // clipPath: 'polygon(0% 0%, 20% 0%, 20% 100%, 20% 100%, 20% 0%, 40% 0%, 40% 100%, 40% 100%, 40% 0%, 60% 0%, 60% 100%, 60% 100%, 60% 0%, 80% 0%, 80% 100%, 80% 100%, 80% 0%, 100% 0%, 100% 100%, 0% 100%)',
    //     duration: isMobile ? 1 : 1.5,
    //     // onUpdate: function() {
    //     //   const progress = 1 - this.progress();
    //     //   const path = createClipPath(progress);
    //     //   loaderRef.current.style.clipPath = path;
    //     //   loaderRef.current.style.webkitClipPath = path;
    //     // }
    //   },
    //   isMobile ? '<+=1.5' : "<+=1"
    // );
  // } else {
  tl.fromTo(loaderRef.current, 
    { 
      maskImage: createGradient(1),
    },
    { 
      maskImage: createGradient(0),
      duration: isMobile ? 1:1.5,
      onUpdate: function() {
        const progress = 1 - this.progress();
        loaderRef.current.style.maskImage = createGradient(progress);
      }
    },
    isMobile ? '<+=1.5' : "<+=1"
  )
// }
  tl.call(onComplete, null, "<");
  tl.set(loaderRef.current, { display: "none" });

  return tl;
};