import React, { useState, useEffect, useRef } from "react";
import { workData } from "../Data/WorkData";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

gsap.registerPlugin(Draggable);

const Overview = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeItem, setActiveItem] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const galleryWrapRef = useRef(null);
  const containerRef = useRef(null);
  const infoRef = useRef(null);

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
    if (!galleryWrap) return;

    const items = galleryWrap.children;
    if (items.length === 0) return;

    const itemHeight = items[0].offsetHeight;
    const gap = 16;
    const targetY = -safeActiveItem * (itemHeight + gap);

    gsap.to(galleryWrap, {
      y: targetY,
      duration: 0.5,
      ease: "power3.out",
      onComplete: () => setIsDragging(false),
    });
  }, [safeActiveItem, isDragging, currentCategory]);

  // Updated wheel handler with infinite logic
  const handleWheel = e => {
    e.preventDefault();
    if (isDragging || !currentCategory.items.length) return;

    const delta = Math.sign(e.deltaY);
    handleActiveItem(safeActiveItem + delta);
  };

  // Click handler for gallery items
  const handleItemClick = index => {
    setIsDragging(false); // Reset dragging state
    handleActiveItem(index);
  };

  // SVG line component
  const EndMarker = ({ position }) => (
    <div className={`end-marker ${position}`}>
      <svg viewBox='0 0 100 2'>
        <path d='M0 1 L100 1' stroke='currentColor' strokeWidth='1' />
      </svg>
    </div>
  );
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
      <div className='cateInfo' ref={infoRef}>
        {currentCategory.type === "text" ? (
          <div className='poemContainer'>
            <svg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlnsXlink='http://www.w3.org/1999/xlink'>
              <defs>
                <linearGradient gradientTransform='rotate(0, 0.5, 0.5)' x1='50%' y1='0%' x2='50%' y2='100%' id='trippygradient'>
                  <stop stopColor='hsl(0, 87%, 50%)' stopOpacity='1' offset='0%'></stop>
                  <stop stopColor='hsl(24, 81%, 18%)' stopOpacity='1' offset='100%'></stop>
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
              <pre>{currentCategory.items[safeActiveItem].content}</pre>
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

      {/* Gallery carousel */}
      <div className='cateGallery'>
        <EndMarker position='top' />
        <div className='galleryWrap' ref={galleryWrapRef}>
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
        <EndMarker position='bottom' />
      </div>

      {/* Counter display */}
      <div className='counter'>
        {safeActiveItem + 1} / {`${currentCategory.items.length}`}
      </div>
    </section>
  );
};

export default Overview;
