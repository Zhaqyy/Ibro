import React, { useState, useEffect, useRef } from "react";
import { workData } from "../Data/WorkData";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

const Overview = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeItem, setActiveItem] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const galleryWrapRef = useRef(null);
  const containerRef = useRef(null);
  const draggableRef = useRef(null);
  const infoRef = useRef(null);
  const loopRef = useRef();
  
  const currentCategory = workData[activeCategory];
  const itemCount = currentCategory.items.length;
  const safeActiveItem = activeItem >= itemCount ? 0 : activeItem;

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

  // Updated Draggable config with infinite logic
  // useEffect(() => {
  //   const galleryWrap = galleryWrapRef.current;
  //   if (!galleryWrap) return;

  //   const items = galleryWrap.children;
  //   if (items.length === 0) return;

  //   const itemHeight = items[0].offsetHeight;
  //   const gap = 16;

  //   const totalItems = currentCategory.items.length;


  //   draggableRef.current = Draggable.create(galleryWrap, {
  //     type: "y",
  //     inertia: true,
  //     onPress: () => setIsDragging(true),
  //     onDrag: function () {
  //       const currentY = this.y;
  //       const maxY = 0;
  //       const minY = -((itemHeight + gap) * (totalItems - 1));

  //       // Infinite scroll logic
  //       if (currentY > maxY + itemHeight) {
  //         this.y -= totalItems * (itemHeight + gap);
  //       } else if (currentY < minY - itemHeight) {
  //         this.y += totalItems * (itemHeight + gap);
  //       }
  //     },
  //     onDragEnd: function () {
  //       const currentY = this.y;
  //       const wrappedY =
  //         ((currentY % (totalItems * (itemHeight + gap))) + totalItems * (itemHeight + gap)) % (totalItems * (itemHeight + gap));

  //       const newIndex = Math.round(Math.abs(wrappedY) / (itemHeight + gap)) % totalItems;
  //       handleActiveItem(newIndex);
  //       setIsDragging(false);
  //     },
  //   });
  // }, [currentCategory, activeCategory]);

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
          <div className='poem-container'>
            <h3>{currentCategory.items[safeActiveItem].title}</h3>
            <pre>{currentCategory.items[safeActiveItem].content}</pre>
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
