import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../Style/Component.scss";
import { Link, NavLink } from "react-router-dom";
import useIsMobile from "../Util/isMobile";

const Header = () => {
  const navRef = useRef(null);
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const menuItems = useRef([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile(800);

  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const overlayRef = useRef(null);

  const menuData = [
    { path: "/", label: "Home" },
    { path: "/bio", label: "Bio" },
    { path: "/works", label: "Works" },
    { path: "/cv", label: "CV" },
    { path: "/contact", label: "Contact" },
  ];

  // Header fade-in animation
  useEffect(() => {
    gsap.to(headerRef.current, {
      autoAlpha: 1,
      duration: 0.5,
      ease: "expo.inOut",
      delay: 1.5,
    });
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && 
          !navRef.current.contains(e.target) && 
          !hamburgerRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isMobile]);

  const initialScrollY = useRef(0);

  // Scroll handling
  useEffect(() => {
    if (isMobile && isMenuOpen) {
      initialScrollY.current = window.scrollY;
      let lastScrollY = window.scrollY;
      let ticking = false;

      const handleScroll = () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollDelta = Math.abs(lastScrollY - initialScrollY.current);
            if (scrollDelta > 50) { // 50px threshold
              setIsMenuOpen(false);
            }
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isMenuOpen, isMobile]);

  // Updated mobile menu animations with scroll prevention
  // useEffect(() => {
  //   if (isMobile) {
  //     if (isMenuOpen) {
  //       // Store current scroll position
  //       const scrollY = window.scrollY;
  //       // Add padding to prevent layout shift
  //       // document.body.style.paddingTop = `calc(${window.scrollY}px + 5vh)`;
  //       document.documentElement.style.scrollBehavior = 'auto';
  //       document.documentElement.style.overflow = 'hidden';
  //       document.documentElement.style.position = 'fixed';
  //       // document.documentElement.style.width = '100%';
  //     } else {
  //       // Restore styles
  //       const scrollY = document.documentElement.style.scrollBehavior;
  //       document.documentElement.style.overflow = '';
  //       document.documentElement.style.position = '';
  //       // document.documentElement.style.width = '';
  //       document.documentElement.style.scrollBehavior = scrollY;
  //       // window.scrollTo(0, parseInt(document.body.style.paddingTop || '0'));
  //       // document.body.style.paddingTop = '';
  //     }
  //   }
  // }, [isMenuOpen, isMobile]);


  // Mobile menu animations
  useEffect(() => {
    if (isMobile) {
      const menu = navRef.current;
      const items = menuItems.current;

      if (isMenuOpen) {
        gsap.to(menu, {
          duration: 0.8,
          autoAlpha: 1,
          y: 0,
          ease: "expo.out",
        });
        gsap.to(items, {
          duration: 0.6,
          autoAlpha: 1,
          y: 0,
          stagger: 0.1,
          ease: "expo.out",
          delay: 0.2,
        });
      } else {
        gsap.to(items, {
          duration: 0.4,
          autoAlpha: 0,
          y: 20,
          stagger: 0.05,
          ease: "expo.in",
        });
        gsap.to(menu, {
          duration: 0.6,
          autoAlpha: 0,
          y: -20,
          ease: "expo.in",
          delay: 0.1,
        });
      }
    }
  }, [isMenuOpen, isMobile]);

  // Reset menu state on desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
      gsap.set(navRef.current, { autoAlpha: 1, y: 0 });
      gsap.set(menuItems.current, { autoAlpha: 1, y: 0 });
    }
  }, [isMobile]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header id='header' ref={headerRef} data-hidden>
      <div className='logo' ref={logoRef}>
        <Link to='/'>IBRAHIM SHUAIB</Link>
      </div>

      {isMobile && (
        <button className={`hamburger ${isMenuOpen ? "active" : ""}`} ref={hamburgerRef} onClick={toggleMenu} aria-label='Menu'>
          <span className='hamburger-line'></span>
          <span className='hamburger-line'></span>
          <span className='hamburger-line'></span>
        </button>
      )}

      <ul className='menu' ref={navRef}>
        {menuData.map((item, index) => (
          <li className='menu-item' key={item.path} ref={el => (menuItems.current[index] = el)}>
            <NavLink to={item.path} onClick={() => isMobile && setIsMenuOpen(false)}>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      {/* <ul className="menuSocials">
<li></li>
<li></li>
<li></li>
      </ul> */}
    </header>
  );
};

export default Header;
