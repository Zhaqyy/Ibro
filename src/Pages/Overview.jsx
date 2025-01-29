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

  // Arrange categories and gallery
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

  // Animation on category change
  useEffect(() => {
    const tl = gsap.timeline();
     tl.call(() => setActiveItem(0));
    tl.fromTo(
      [galleryRef.current, infoRef.current],
      { opacity: 0.5, filter: "blur(2px)" },
      { opacity: 1, filter: "blur(0px)", duration: 0.5 }
    )
   
  }, [activeCategory]);

  // Animation on gallery item change
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      [infoRef.current],
      { opacity: 0.5, filter: "blur(2px)" },
      { opacity: 1, filter: "blur(0px)", duration: 0.5 }
    )
  }, [activeItem]);

  const currentCategory = workData[activeCategory];

  return (
    <section className='overview' ref={containerRef}>
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
            <h3>{currentCategory.items[activeItem].title}</h3>
            <pre>{currentCategory.items[activeItem].content}</pre>
          </div>
        ) : (
          <div className='image-info'>
            <span>
              <div className='image-title'>{currentCategory.items[activeItem].title}</div>
              <img src={`/${currentCategory.items[activeItem].src}`} alt={currentCategory.items[activeItem].title} />
            </span>
          </div>
        )}
      </div>

      <div className='cateGallery' ref={galleryRef}>
        {currentCategory.items.map((item, index) => (
          <div key={index} className={`gallery-item ${index === activeItem ? "active" : ""}`} onClick={() => setActiveItem(index)}>
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
