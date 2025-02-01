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

  const currentCategory = workData[activeCategory];
  const itemCount = currentCategory.items.length;
  const safeActiveItem = activeItem >= itemCount ? 0 : activeItem;

  // Handle active item changes
  useEffect(() => {
    if (isDragging) return;

    const galleryWrap = galleryWrapRef.current;
    if (!galleryWrap) return;

    const items = galleryWrap.children;
    if (items.length === 0) return;

    const itemWidth = items[0].offsetWidth;
    const gap = 16; // Should match your CSS gap
    const targetY = -safeActiveItem * (itemWidth + gap);

    gsap.to(galleryWrap, {
      y: targetY,
      duration: 0.5,
      ease: "power3.out"
    });
  }, [safeActiveItem, isDragging, currentCategory]);

  // Initialize Draggable
  useEffect(() => {
    const galleryWrap = galleryWrapRef.current;
    if (!galleryWrap) return;

    const items = galleryWrap.children;
    if (items.length === 0) return;

    const itemWidth = items[0].offsetWidth;
    const gap = 20;
    const totalItems = currentCategory.items.length;

    draggableRef.current = Draggable.create(galleryWrap, {
      type: "y",
      inertia: true,
      bounds: {
        minX: -(totalItems - 1) * (itemWidth + gap),
        maxX: 0
      },
      snap: {
        y: Array.from({ length: totalItems }, (_, i) => -i * (itemWidth + gap))
      },
      onPress: () => setIsDragging(true),
      onDragEnd: () => {
        const currentY = gsap.getProperty(galleryWrap, "y");
        const newIndex = Math.round(Math.abs(currentY) / (itemWidth + gap));
        setActiveItem(newIndex);
        setIsDragging(false);
      }
    });

    return () => {
      if (draggableRef.current) {
        draggableRef.current[0].kill();
        draggableRef.current = null;
      }
    };
  }, [currentCategory, activeCategory]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!galleryWrapRef.current || isDragging) return;

      const items = galleryWrapRef.current.children;
      if (items.length === 0) return;

      const itemWidth = items[0].offsetWidth;
      const gap = 16;
      const targetY = -safeActiveItem * (itemWidth + gap);

      gsap.set(galleryWrapRef.current, { y: targetY });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [safeActiveItem, isDragging]);

  // Wheel handler
  const handleWheel = (e) => {
    e.preventDefault();
    if (isDragging || !currentCategory.items.length) return;

    const delta = Math.sign(e.deltaY);
    let newIndex = safeActiveItem + delta;

    if (newIndex >= itemCount) newIndex = itemCount - 1;
    if (newIndex < 0) newIndex = 0;

    setActiveItem(newIndex);
  };

  return (
    <section className="overview" ref={containerRef} onWheel={handleWheel}>
      {/* Category selector */}
      <div className="cateList">
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
      <div className="cateInfo">
        {currentCategory.type === "text" ? (
          <div className="poem-container">
            <h3>{currentCategory.items[safeActiveItem].title}</h3>
            <pre>{currentCategory.items[safeActiveItem].content}</pre>
          </div>
        ) : (
          <div className="image-info">
            <span>
              <div className="image-title">{currentCategory.items[safeActiveItem].title}</div>
              <img
                src={`/${currentCategory.items[safeActiveItem].src}`}
                alt={currentCategory.items[safeActiveItem].title}
              />
            </span>
          </div>
        )}
      </div>

      {/* Gallery carousel */}
      <div className="cateGallery">
        <div className="galleryWrap" ref={galleryWrapRef}>
          {currentCategory.items.map((item, index) => (
            <div
              key={index}
              className={`gallery-item ${index === safeActiveItem ? "active" : ""}`}
              onClick={() => setActiveItem(index)}
            >
              {currentCategory.type === "text" ? (
                <div className="poem-title">{item.title}</div>
              ) : (
                <img src={`/${item.src}`} alt={item.title} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Counter display */}
      <div className="counter">
        {safeActiveItem + 1} / {`${currentCategory.items.length}`}
      </div>
    </section>
  );
};

export default Overview;