import React, { useEffect, useRef, useState } from "react";
import "../Style/Home.scss";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { animateHome } from "../Util/PageAnimations";

function Home() {
  const svgRef = useRef(null);
  const maskRef = useRef(null);
  const heroRef = useRef(null);
  const textPathRef = useRef(null);
  const [currentText, setCurrentText] = useState("      ");
  const marqueeTween = useRef(null);

  // Mouse follow animation
  useEffect(() => {
    if (!svgRef.current || !maskRef.current) return;

    gsap.set([svgRef.current, maskRef.current], {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      transformOrigin: "0%",
      xPercent: -50,
      yPercent: -50,
    });

    const xTo = gsap.quickTo([svgRef.current, maskRef.current], "x", { duration: 1, ease: "power3" });
    const yTo = gsap.quickTo([svgRef.current, maskRef.current], "y", { duration: 1, ease: "power3" });

    const handleMouseMove = e => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("pointermove", handleMouseMove);
    return () => window.removeEventListener("pointermove", handleMouseMove);
  }, []);

  // Text path animation on hover
  useEffect(() => {
    if (!textPathRef.current) return;

    const textPath = textPathRef.current;

    if (currentText.trim() !== "") {
      // Entry animation
      gsap.fromTo(textPath, { filter: "blur(2px)", opacity: 0 }, { filter: "blur(0px)", opacity: 1, duration: 1, ease: "power2.out" });
    } else {
      // Exit animation
      gsap.to(textPath, { filter: "blur(2px)", opacity: 0, duration: 1, ease: "power2.in" });
    }
  }, [currentText]);
  let textLength;

  useEffect(() => {
    if (!textPathRef.current) return;
    const textPath = textPathRef.current;
    const pathElement = document.getElementById("textPath");

    if (!textPath || !pathElement) return;

    const pathLength = Math.round(pathElement.getTotalLength());
    const baseText = currentText.trim();
    textLength = textPath.getComputedTextLength();
    const repetitions = Math.ceil(pathLength / textLength);
    const dynamicText = baseText.repeat(repetitions);

    // Update text content
    textPath.textContent = dynamicText;
    textPath.setAttribute("textLength", pathLength);

    // Ensure startOffset is set before animation
    textPath.setAttribute("startOffset", "0%");

    // GSAP marquee animation
    if (marqueeTween.current) marqueeTween.current.kill();

    marqueeTween.current = gsap.fromTo(
      textPath,
      { attr: { startOffset: "0%" } },
      {
        attr: { startOffset: "-100%" }, // Changed to -100% for smoother loop
        duration: 25,
        ease: "none",
        repeat: -1,
      }
    );

    return () => {
      if (marqueeTween.current) marqueeTween.current.kill();
    };
  }, [currentText]);

  // useEffect(() => {
  //   if (!textPathRef.current) return;

  //   const textPath = textPathRef.current;
  //   const pathElement = document.getElementById("textPath");

  //   if (!textPath || !pathElement) return;
  //   const pathLength = Math.round(pathElement.getTotalLength());

  //   // Calculate dynamic repetitions based on text length
  //   const baseText = currentText.trim();
  //   const textLength = textPath.getComputedTextLength(); // Get the length of the base text
  //   const repetitions = Math.ceil(pathLength / textLength);
  //   const dynamicText = baseText.repeat(repetitions);

  //   // Update text content
  //   textPath.textContent = dynamicText;

  //   // Set textLength to match the path length
  //   textPath.setAttributeNS(null, "textLength", pathLength);

  //   // GSAP marquee animation
  //   if (marqueeTween.current) marqueeTween.current.kill();

  //   marqueeTween.current = gsap.fromTo(
  //     textPath,
  //     { attr: { startOffset: "0%" } },
  //     {
  //       attr: { startOffset: "50%" },
  //       duration: 25,
  //       ease: "none",
  //       repeat: -1,
  //     }
  //   );

  //   return () => {
  //     if (marqueeTween.current) marqueeTween.current.kill();
  //   };
  // }, [currentText]);

  const menuItems = useRef([]);
  const menuWraps = useRef([]);

  // Initialize GSAP and event listeners
  useEffect(() => {
    const wraps = menuWraps.current;
    
    // Set initial position for all menu items
    gsap.set(menuItems.current, {
      xPercent: -50,
      yPercent: -50
    });

    // Add event listeners to each wrap
    wraps.forEach(wrap => {
      if (wrap) {
        wrap.addEventListener('mousemove', onMove);
        wrap.addEventListener('mouseleave', onLeave);
      }
    });

    return () => {
      // Clean up event listeners
      wraps.forEach(wrap => {
        if (wrap) {
          wrap.removeEventListener('mousemove', onMove);
          wrap.removeEventListener('mouseleave', onLeave);
        }
      });
    };
  }, []);

  const onMove = (e) => {
    const wrap = e.currentTarget;
    const index = menuWraps.current.indexOf(wrap);
    const menuItem = menuItems.current[index];
    
    if (!menuItem) return;
    
    const { left, top, width, height } = wrap.getBoundingClientRect();
    
    const halfW = width / 2;
    const halfH = height / 2;  
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    
    const x = gsap.utils.interpolate(-halfW, halfW, mouseX / width);
    const y = gsap.utils.interpolate(-halfH, halfH, mouseY / height);
    
    gsap.to(menuItem, {
      x: x,
      y: y,
      duration: 0.2,
      ease: "power3.out",
      overwrite: true
    });  
  };

  const onLeave = (e) => {
    const wrap = e.currentTarget;
    const index = menuWraps.current.indexOf(wrap);
    const menuItem = menuItems.current[index];
    
    if (menuItem) {
      gsap.to(menuItem, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)"
      });
    }
  };

  // Add ref to the arrays
  const addToItems = (el) => {
    if (el && !menuItems.current.includes(el)) {
      menuItems.current.push(el);
    }
  };

  const addToWraps = (el) => {
    if (el && !menuWraps.current.includes(el)) {
      menuWraps.current.push(el);
    }
  };


  const handleHover = text => {
    setCurrentText(`${text} •`);
  };

  const handleLeave = () => {
    setCurrentText(`      `);
  };

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.timeline({ delay: 0.5 }).add(animateHome(heroRef));
    }, heroRef);

    return () => context.revert();
  }, []);

  return (
    <section className='hero' ref={heroRef} data-hidden>
      <svg
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        width='100%'
        height='100%'
        id='masker'
      >
        <filter id='blur-image' colorInterpolationFilters='sRGB'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='15 30' result='blur' />
        </filter>

        <image xlinkHref='./ibro.jpg' width='100%' height='100%' preserveAspectRatio='xMidYMax slice' filter='url(#blur-image)' />
        <image xlinkHref='./ibro.jpg' width='100%' height='100%' preserveAspectRatio='xMidYMax slice' mask='url(#blur-mask)' />

        <g>
          <path
            ref={svgRef}
            x='0'
            y='0'
            id='textPath'
            fill='none'
            d='M10 0h205s10 0 10 10v105s0 10 -10 10h-205s-10 0 -10 -10v-105s0 -10 10 -10
            M10 0h205s10 0 10 10v105s0 10 -10 10h-205s-10 0 -10 -10v-105s0 -10 10 -10'
          />

          <text
            textAnchor='middle'
            alignmentBaseline='hanging'
            // x="5"
            style={{
              fill: "white",
              fontSize: "100%",
              textTransform: "uppercase",
              fontVariantNumeric: "tabular-nums",
              fontFamily: "monospace",
              fontWeight: "bolder",
              whiteSpace: "pre",
            }}
          >
            {/* <textPath
              ref={textPathRef}
              href='#textPath'
              spacing='auto'
              textLength={textLength}
              startOffset="0%"
            >
              {currentText}
            </textPath> */}
          </text>
        </g>
        <mask id='blur-mask'>
          <rect x='0' y='0' ref={maskRef} width='250' height='150' rx='10' fill='#fff' />
        </mask>
      </svg>

      <h1 className='bigName'>IBRAHIM SHUAIB</h1>

      <div className='menu'>
      <div className='menuCol'>
      <div className='proxWrap' ref={addToWraps}>
        <Link 
          to='/bio' 
          ref={addToItems} 
          onMouseEnter={() => handleHover("BIO ")} 
          onMouseLeave={() => handleLeave()}
        >
          Bio
        </Link>
      </div>
      <div className='proxWrap' ref={addToWraps}>
        <Link 
          to='/cv' 
          ref={addToItems} 
          onMouseEnter={() => handleHover("CV")} 
          onMouseLeave={() => handleLeave()}
        >
          CV
        </Link>
      </div>
    </div>
    <div className='menuCol'>
      <div className='proxWrap' ref={addToWraps}>
        <Link 
          to='/works' 
          ref={addToItems} 
          onMouseEnter={() => handleHover("WORKS")} 
          onMouseLeave={() => handleLeave()}
        >
          Works
        </Link>
      </div>
      <div className='proxWrap' ref={addToWraps}>
        <Link 
          to='/contact' 
          ref={addToItems} 
          onMouseEnter={() => handleHover("CONTACT")} 
          onMouseLeave={() => handleLeave()}
        >
          Contact
        </Link>
      </div>
    </div>
      </div>
    </section>
  );
}

export default Home;
