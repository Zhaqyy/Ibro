import React, { useState, useEffect, useRef } from "react";
import { workData } from "../Data/WorkData";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useLocation } from "react-router-dom";
import useIsMobile from "../Util/isMobile";

gsap.registerPlugin(Draggable);

const Overview = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeItem, setActiveItem] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const galleryWrapRef = useRef(null);
  const containerRef = useRef(null);
  const infoRef = useRef(null);
  const isMobile = useIsMobile(900);

  const currentCategory = workData[activeCategory];
  const itemCount = currentCategory.items.length;
  const safeActiveItem = activeItem >= itemCount ? 0 : activeItem;

  const location = useLocation();

  useEffect(() => {
    const state = location.state || {};

    if (typeof state.category === "number") {
      setActiveCategory(Math.min(state.category, workData.length - 1));
    }

    if (typeof state.item === "number") {
      const maxItem = workData[activeCategory]?.items?.length - 1 || 0;
      setActiveItem(Math.min(state.item, maxItem));
    }
  }, [location.state]);

  // Reset active item and animate on category change
  useEffect(() => {
    setActiveItem(0); // Immediately reset active item

    const tl = gsap.timeline();
    tl.fromTo(
      [galleryWrapRef.current, infoRef.current],
      { opacity: 0.5, filter: "blur(2px)" },
      { opacity: 1, filter: "blur(0px)", duration: 0.5 }
    );
  }, [activeCategory]);

  // Animation on gallery item change
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo([infoRef.current], { opacity: 0.5, filter: "blur(2px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.5 });
  }, [activeItem]);

  // Modified handleActiveItem with infinite carousel logic
  const handleActiveItem = newIndex => {
    const wrappedIndex = (newIndex + itemCount) % itemCount;
    setActiveItem(wrappedIndex);
  };

  // Updated useEffect for active item changes
  useEffect(() => {
    if (isDragging) return;

    const galleryWrap = galleryWrapRef.current;
    const overview = containerRef.current;
    if (!galleryWrap) return;

    const items = galleryWrap.children;
    const itemsAmount = items.length;

    if (items.length === 0) return;
    const itemHeight = items[0].offsetHeight;
    const itemWidth = items[0].offsetWidth;
    const itemsfullWidth = galleryWrap.offsetWidth;
    // const itemsfullHeight = galleryWrap.offsetHeight;

    const gap = 16;
    const targetY = -safeActiveItem * (itemHeight + gap);
    const targetX = -safeActiveItem * (itemWidth + gap);

    gsap.set(galleryWrap, {
   '--itemsAmount': itemsAmount,
   '--itemsfullWidth': itemsfullWidth,
  //  '--itemsfullHeight': itemsfullHeight,
    });

    gsap.to(galleryWrap, {
      y: isMobile ? 0 : targetY,
      x: isMobile ? targetX : 0,
      duration: 0.5,
      ease: "power3.out",
      onComplete: () => setIsDragging(false),
    });
  }, [safeActiveItem, isDragging, currentCategory]);

  const scrollTimeout = useRef(null); // Add this ref for throttling

  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  // Throttled wheel handler
  const handleWheel = e => {
    e.preventDefault();
    if (isDragging || !currentCategory.items.length || scrollTimeout.current) return;

    const delta = Math.sign(e.deltaY);
    handleActiveItem(safeActiveItem + delta);

    // Set timeout to prevent rapid firing
    scrollTimeout.current = setTimeout(() => {
      scrollTimeout.current = null;
    }, 500); 
  };

  // Click handler for gallery items
  const handleItemClick = index => {
    setIsDragging(false); // Reset dragging state
    handleActiveItem(index);
  };

  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

  // Touch handlers for mobile swipe
  const handleTouchStart = e => {
    if (!isMobile) return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = e => {
    if (!isMobile) return;
    const touch = e.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;
    const deltaX = touchEndX - touchStart.x;
    const deltaY = touchEndY - touchStart.y;
    const threshold = 50;

    // Check if horizontal swipe exceeds threshold
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        handleActiveItem(safeActiveItem - 1); // Swipe right
      } else {
        handleActiveItem(safeActiveItem + 1); // Swipe left
      }
    }
  };

  // randomized poem block alignment
  function roundRandom(n) {
    return Math.floor(Math.random() * n);
  }

  const preRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (preRef.current && currentCategory.type === "text") {
      const lines = preRef.current.children;
      Array.from(lines).forEach(line => {
        const alignments = ["flex-start", "center", "flex-end"];
        line.style.alignSelf = alignments[roundRandom(3)];
      });
    }
  }, [safeActiveItem, activeCategory]);

  // randomized poem svg gradient colors
  const [gradientColors, setGradientColors] = useState(() => [
    `hsl(${roundRandom(360)}, ${30 + roundRandom(70)}%, ${10 + roundRandom(40)}%)`,
    `hsl(${roundRandom(360)}, ${30 + roundRandom(70)}%, ${10 + roundRandom(20)}%)`,
  ]);

  // Update colors on category change
  useEffect(() => {
    setGradientColors([
      `hsl(${roundRandom(360)}, ${30 + roundRandom(70)}%, ${10 + roundRandom(40)}%)`,
      `hsl(${roundRandom(360)}, ${30 + roundRandom(70)}%, ${10 + roundRandom(20)}%)`,
    ]);
  }, [safeActiveItem, activeCategory]);

  // gradient rotation with mouse
  const gradientRotationRef = useRef(0);

  // Initialize GSAP quickTo for smooth rotation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // GSAP quickTo for smooth gradient rotation
    const gradientTween = gsap.quickTo(gradientRotationRef, "current", {
      duration: 1.5,
      ease: "power1.out",
      onUpdate: () => {
        // Update the gradient rotation in the DOM
        const gradient = svgRef.current?.querySelector("#trippygradient");
        if (gradient) {
          gradient.setAttribute("gradientTransform", `rotate(${gradientRotationRef.current}, 0.5, 0.5)`);
        }
      },
    });

    // Mouse move handler
    const handleMouseMove = e => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate rotation based on both x and y
      const xRotation = (x / rect.width) * 360; // X contributes to rotation
      const yRotation = (y / rect.height) * 180; // Y contributes to rotation (scaled down for subtlety)
      const targetRotation = xRotation + yRotation; // Combine both axes

      // Update GSAP tween
      gradientTween(targetRotation);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className='overview' ref={containerRef} onWheel={handleWheel}>
      {/* Category selector */}
      <div className='cateList'>
        {workData.map((category, index) => (
          <button
            key={category.category}
            className={`category-btn ${index === activeCategory ? "active" : ""}`}
            onClick={() => setActiveCategory(index)}
          >
            {category.category}
          </button>
        ))}
      </div>

      {/* Active item display */}
      <div className='cateInfo' onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}  ref={infoRef}>
        {currentCategory.type === "text" ? (
          <div className='poemContainer' ref={containerRef}>
            <svg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlnsXlink='http://www.w3.org/1999/xlink' ref={svgRef}>
              <defs>
                <linearGradient gradientTransform={`rotate(0, 0.5, 0.5)`} x1='50%' y1='0%' x2='50%' y2='100%' id='trippygradient'>
                  <stop stopColor={gradientColors[0]} stopOpacity='1' offset='0%'></stop>
                  <stop stopColor={gradientColors[1]} stopOpacity='1' offset='100%'></stop>
                </linearGradient>
                <filter
                  id='trippyfilter'
                  x='-20%'
                  y='-20%'
                  width='140%'
                  height='140%'
                  filterUnits='objectBoundingBox'
                  primitiveUnits='userSpaceOnUse'
                  colorInterpolationFilters='sRGB'
                >
                  <feTurbulence
                    type='fractalNoise'
                    baseFrequency='0.005 0.003'
                    numOctaves='1'
                    seed='2'
                    stitchTiles='stitch'
                    x='0%'
                    y='0%'
                    width='100%'
                    height='100%'
                    result='turbulence'
                  ></feTurbulence>
                  <feGaussianBlur
                    stdDeviation='20 0'
                    x='0%'
                    y='0%'
                    width='100%'
                    height='100%'
                    in='turbulence'
                    edgeMode='duplicate'
                    result='blur'
                  ></feGaussianBlur>
                  <feBlend
                    mode='color-burn'
                    x='0%'
                    y='0%'
                    width='100%'
                    height='100%'
                    in='SourceGraphic'
                    in2='blur'
                    result='blend'
                  ></feBlend>
                </filter>
              </defs>
              <rect fill='url(#trippygradient)' filter='url(#trippyfilter)'></rect>
            </svg>

            <h3>`-` {currentCategory.items[safeActiveItem].title}</h3>
            <div className='poemBody'>
              <pre ref={preRef}>{currentCategory.items[safeActiveItem].content}</pre>
            </div>
          </div>
        ) : (
          <div className='image-info'>
            <span>
              <div className='image-title'>{currentCategory.items[safeActiveItem].title}</div>
              <img src={`/${currentCategory.items[safeActiveItem].src}`} alt={currentCategory.items[safeActiveItem].title} />
            </span>
          </div>
        )}
      </div>

      {/* Counter display */}
      <div className='counter'>
        <p>
          {safeActiveItem + 1} / {`${currentCategory.items.length}`}
        </p>
      </div>
      {/* Gallery carousel */}
      <div className='cateGallery'  onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} >
        <div className='galleryWrap'ref={galleryWrapRef}>
          {currentCategory.items.map((item, index) => (
            <div key={index} className={`gallery-item ${index === safeActiveItem ? "active" : ""}`} onClick={() => handleItemClick(index)}>
              {currentCategory.type === "text" ? (
                <div className='poem-title'>{item.title}</div>
              ) : (
                <img src={`/${item.src}`} alt={item.title} />
              )}
            </div>
          ))}
        </div>
        {/* <EndMarker position='bottom' /> */}
      </div>
    </section>
  );
};

export default Overview;
