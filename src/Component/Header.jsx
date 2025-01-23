import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../Style/Component.scss";
import { Link } from "react-router-dom";

const Header = () => {
  const navRef = useRef(null);
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  useEffect(() => {
    gsap.to(headerRef.current, {
      autoAlpha: 1,
      duration: 0.5,
      ease: "expo.inOut",
      delay: 1.5,
    });
  }, []);

  return (
    <header id='header' ref={headerRef} data-hidden>
      <div className='logo'>
        <Link to={"/"}>IBRAHIM SHUAIB</Link>
      </div>
      <ul className='menu' ref={navRef}>
        <li className='menu-item'>
          <div>
            <Link to={"/bio"}>Bio</Link>
          </div>
        </li>
        <li className='menu-item'>
          <div>
            <Link to={"/works"}>Works</Link>
          </div>
        </li>
        <li className='menu-item'>
          <div>
            <Link to={"/cv"}>CV</Link>
          </div>
        </li>
        <li className='menu-item'>
          <div>
            <Link to={"/contact"}>Contact</Link>
          </div>
        </li>
      </ul>
    </header>
  );
};

export default Header;
