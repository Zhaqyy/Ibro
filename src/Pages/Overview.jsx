import React, { useState, useEffect, useRef } from "react";
import { workData } from "../Data/WorkData";
import gsap from "gsap";

const Overview = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeItem, setActiveItem] = useState(0);
  const galleryRef = useRef(null);
  const infoRef = useRef(null);
  const categoryListRef = useRef(null);
  const containerRef = useRef(null);

  // Updated circular layout calculations
// const arrangeGallery = (elements, containerHeight, activeIndex) => {
//   if (!elements.length) return;
  
//   const MAX_VISIBLE_ITEMS = 7; // Control density
//   const ITEM_ANGLE = 25; // Degrees between items
//   const BASE_SCALE = 0.7;
//   const SCALE_FACTOR = 0.15;
  
//   const centerIndex = activeIndex;
//   const radius = containerHeight * 0.4;
  
//   elements.forEach((el, index) => {
//     const distanceFromCenter = index - centerIndex;
//     const absDistance = Math.abs(distanceFromCenter);
    
//     // Only display items within visible range
//     const shouldDisplay = absDistance <= MAX_VISIBLE_ITEMS / 2;
    
//     if (shouldDisplay) {
//       const angle = distanceFromCenter * ITEM_ANGLE;
//       const scale = 1 - (absDistance * SCALE_FACTOR);
      
//       gsap.set(el, {
//         x: Math.sin(angle * Math.PI / 180) * radius,
//         y: (index - centerIndex) * (containerHeight * 0.1),
//         scale: Math.max(scale, BASE_SCALE),
//         opacity: 1 - (absDistance * 0.2),
//         // rotationZ: angle,
//         display: "block"
//       });
//     } else {
//       gsap.set(el, { display: "none" });
//     }
//   });
// };

// // Update layout effect
// useEffect(() => {
//   const calculateLayout = () => {
//     if (!containerRef.current || !galleryRef.current) return;
    
//     const containerHeight = containerRef.current.offsetHeight;
//     const galleryElements = [...galleryRef.current.children];
    
//     const containerWidth = containerRef.current.offsetWidth;
//     const categoryRadius = containerWidth * 0.01;
//     // const galleryRadius = containerWidth * -0.01;

//     if (categoryListRef.current) {
//       arrangeInCircle([...categoryListRef.current.children], categoryRadius);
//     }
//     // Arrange gallery
//     arrangeGallery(galleryElements, containerHeight, activeItem);
//   };

//   calculateLayout();
//   window.addEventListener('resize', calculateLayout);
//   return () => window.removeEventListener('resize', calculateLayout);
// }, [activeItem, activeCategory]);

  // Circular layout calculations
  const arrangeInCircle = (elements, radius) => {
    const angleStep = Math.PI / (elements.length - 1);
    elements.forEach((el, i) => {
      const angle = Math.PI / 2 + angleStep * i;
      gsap.set(el, {
        x: Math.cos(angle) * radius,
        // y: Math.sin(angle) * radius,
        // rotation: angle * (180 / Math.PI) - 90,
      });
    });
  };

  // // Arrange categories and gallery
  useEffect(() => {
    const calculateLayout = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const categoryRadius = containerWidth * 0.01;
      const galleryRadius = containerWidth * -0.01;

      if (categoryListRef.current) {
        arrangeInCircle([...categoryListRef.current.children], categoryRadius);
      }

      if (galleryRef.current) {
        arrangeInCircle([...galleryRef.current.children], galleryRadius);
      }
    };

    calculateLayout();
    window.addEventListener("resize", calculateLayout);
    return () => window.removeEventListener("resize", calculateLayout);
  }, [activeCategory]);

   // Reset active item and animate on category change
   useEffect(() => {
    setActiveItem(0); // Immediately reset active item

    const tl = gsap.timeline();
    tl.fromTo(
      [galleryRef.current, infoRef.current],
      { opacity: 0.5, filter: "blur(2px)" },
      { opacity: 1, filter: "blur(0px)", duration: 0.5 }
    );
  }, [activeCategory]);

  // Animation on gallery item change
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo([infoRef.current], { opacity: 0.5, filter: "blur(2px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.5 });
  }, [activeItem]);

  const currentCategory = workData[activeCategory];
  const itemCount = currentCategory.items.length;
  const safeActiveItem = activeItem >= itemCount ? 0 : activeItem;



  // Add wheel handler for scroll navigation
const handleWheel = (e) => {
  if (!currentCategory.items.length) return;

  const delta = Math.sign(e.deltaY);
  const itemCount = currentCategory.items.length;
  
  // Calculate new index with wrapping
  let newIndex = activeItem + delta;
  
  if (newIndex >= itemCount) {
    newIndex = 0; // Wrap to first item
  } else if (newIndex < 0) {
    newIndex = itemCount - 1; // Wrap to last item
  }

  // Alternative modulo-based approach:
  // const newIndex = (activeItem + delta + itemCount) % itemCount;

  if (newIndex !== activeItem) {
    setActiveItem(newIndex);
    
    // Optional: Add subtle animation feedback
    gsap.to(galleryRef.current.children[newIndex], {
      scale: 1.1,
      duration: 0.3,
      yoyo: true,
      repeat: 1
    });
  }
};

  return (
    <section className='overview' ref={containerRef} onWheel={handleWheel}>
      <div className='cateList' ref={categoryListRef}>
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

      <div className='cateGallery' ref={galleryRef}>
        {currentCategory.items.map((item, index) => (
          <div
            key={index}
            className={`gallery-item ${index === safeActiveItem ? "active" : ""}`}
            onClick={() => setActiveItem(index)}
          >
            {currentCategory.type === "text" ? (
              <div className='poem-title'>{item.title}</div>
            ) : (
              <img src={`/${item.src}`} alt={item.title} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Overview;
