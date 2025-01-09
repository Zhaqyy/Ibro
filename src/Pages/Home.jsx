import React, { useEffect, useRef } from "react";
import "../Style/Home.scss";

import gsap from "gsap";
import { Link } from "react-router-dom";
// import { animateHome, animateHomeFoot } from "../Component/PageAnimations";

function Home() {
  // const homeRef = useRef();
  // const containerRef = useRef(null);

  // useEffect(() => {
  //   const context = gsap.context(() => {
  //     const tl = gsap.timeline({delay:0.5});

  //     tl.add(animateHome(homeRef));
  //     tl.add(animateHomeFoot(containerRef), "-=90%");

  //   }, homeRef);

  //   return () => context.revert(); // Cleanup on unmount
  // }, []);

  return (
    <section
      className='hero'
      //  ref={homeRef}
    >
      <h1 className='bigName'>IBRAHIM SHUAIB</h1>
      <div className='menu'>
        <div className='menuCol'>
          <Link to={"#"}>Bio</Link>
          <Link to={"#"}>Press</Link>
        </div>
        <div className='menuCol'>
          <Link to={"#"}>Work</Link>
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
