import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stage, Sprite, Container, Graphics } from "@pixi/react";
// import { BLEND_MODES, BlurFilter } from "pixi.js";
import * as PIXI from "pixi.js";

import "../Style/Home.scss";
import gsap from "gsap";
import { Link } from "react-router-dom";

function Home() {
  const svgRef = useRef(null);
  const heroRef = useRef(null);


  useEffect(() => {
    gsap.set(svgRef.current, { xPercent: -50, yPercent: -50 });

    // Setup the gsap quickTo for smooth movement
    const xTo = gsap.quickTo(svgRef.current, "x", { duration: 1, ease: "power3" });
    const yTo = gsap.quickTo(svgRef.current, "y", { duration: 1, ease: "power3" });

    let mouseX = 0;
    let mouseY = 0;


    const handleMouseMove = e => {
      mouseX = e.clientX;
      mouseY = e.clientY;

        xTo(mouseX);
        yTo(mouseY);
    };

    // Attach mousemove event listener
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className='hero' ref={heroRef}>

      <svg
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        width='100%'
        height='100%'
        id='masker'
      >
        <filter id='blur-image'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='15'></feGaussianBlur>
        </filter>
        <mask id='blur-mask'>
          <rect x="0" y="0" height="150" width="250" rx="10"fill="#fff"   ref={svgRef} id='mask' />
          {/* <g ref={svgRef} id='mask'>
            <path
              fill='#000'
              d='M225.15,75c0,18.5-10.05,34.66-25,43.3l-150-.3h0c-14.95-8.64-25-24.5-25-43s10.05-34.36,25-43h150c14.95,8.64,25,24.5,25,43Z'
            />
          </g> */}
        </mask>
        <image xlinkHref='./ibro.jpg' width='100%' height='100%' filter='url(#blur-image)' preserveAspectRatio="xMidYMax slice" />
        <image xlinkHref='./ibro.jpg' width='100%' height='100%' mask='url(#blur-mask)' preserveAspectRatio="xMidYMax slice" />
      </svg>
      <h1 className='bigName'>IBRAHIM SHUAIB</h1>
      <div className='menu'>
        <div className='menuCol'>
          <Link to={"#"}>Bio</Link>
          <Link to={"#"}>Press</Link>
        </div>
        <div className='menuCol'>
          <Link to={"#"}>Works</Link>
          <Link to={"#"}>Media</Link>
        </div>
        <div className='menuCol'>
          <Link to={"#"}>CV</Link>
          <Link to={"#"}>Contact</Link>
        </div>
      </div>
    </section>
  );
}

export default Home;
