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
    const textPath = textPathRef.current;

    if (currentText.trim() !== "") {
      // Entry animation
      gsap.fromTo(textPath, { filter: "blur(2px)", opacity: 0 }, { filter: "blur(0px)", opacity: 1, duration: 1, ease: "power2.out" });
    } else {
      // Exit animation
      gsap.to(textPath, { filter: "blur(2px)", opacity: 0, duration: 1, ease: "power2.in" });
    }
  }, [currentText]);

  useEffect(() => {
    const textPath = textPathRef.current;
    const pathElement = document.getElementById("textPath");

    const pathLength = Math.round(pathElement.getTotalLength());

    // Calculate dynamic repetitions based on text length
    const baseText = currentText.trim();
    const textLength = textPath.getComputedTextLength(); // Get the length of the base text
    const repetitions = Math.ceil(pathLength / textLength);
    const dynamicText = baseText.repeat(repetitions);

    // Update text content
    textPath.textContent = dynamicText;

    // Set textLength to match the path length
    textPath.setAttributeNS(null, "textLength", pathLength);

    // GSAP marquee animation
    if (marqueeTween.current) marqueeTween.current.kill();

    marqueeTween.current = gsap.fromTo(
      textPath,
      { attr: { startOffset: "0%" } },
      {
        attr: { startOffset: "50%" },
        duration: 25,
        ease: "none",
        repeat: -1,
      }
    );

    return () => {
      if (marqueeTween.current) marqueeTween.current.kill();
    };
  }, [currentText]);

  const handleHover = text => {
    setCurrentText(`${text} •`);
  };

  const handleleave = () => {
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
            text-anchor='middle'
            alignment-baseline='hanging'
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
            <textPath
              ref={textPathRef}
              href='#textPath'
              spacing='auto'
              // textLength='2712'
            >
              {currentText}
            </textPath>
          </text>
        </g>
        <mask id='blur-mask'>
          <rect x='0' y='0' ref={maskRef} width='250' height='150' rx='10' fill='#fff' />
        </mask>
      </svg>

      <h1 className='bigName'>IBRAHIM SHUAIB</h1>

      <div className='menu'>
        <div className='menuCol'>
          <Link to='/bio' onMouseEnter={() => handleHover("BIO ")} onMouseLeave={() => handleleave()}>
            Bio
          </Link>
          <Link to='/cv' onMouseEnter={() => handleHover("CV")} onMouseLeave={() => handleleave()}>
            CV
          </Link>
        </div>
        <div className='menuCol'>
          <Link to='/works' onMouseEnter={() => handleHover("WORKS")} onMouseLeave={() => handleleave()}>
            Works
          </Link>
          <Link to='/contact' onMouseEnter={() => handleHover("CONTACT")} onMouseLeave={() => handleleave()}>
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;
