import React, { useState, useEffect, useRef } from "react";
import { workData } from "../Data/WorkData";
import gsap from "gsap";
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(MotionPathPlugin, Draggable);

const Overview = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeItem, setActiveItem] = useState(0);
  const galleryRef = useRef(null);
  const infoRef = useRef(null);
  const categoryListRef = useRef(null);
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  const currentCategory = workData[activeCategory];
  const itemCount = currentCategory.items.length;
  const safeActiveItem = activeItem >= itemCount ? 0 : activeItem;

  // GSAP Carousel Variables
  const animation = useRef(null);
  const proxy = useRef(document.createElement('div'));
  const numBoxes = currentCategory.items.length;
  const boxStep = 1 / (numBoxes + 1);
  const numPositions = numBoxes * 2;
  const positionStep = 1 / numPositions;
  const snapValues = Array.from({ length: numBoxes }, (_, i) => (i + 1) * boxStep);
  const hoverTweens = useRef([]);
  const clickTweens = useRef([]);

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

  useEffect(() => {
    const calculateLayout = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const categoryRadius = containerWidth * 0.01;
      
      if (categoryListRef.current) {
        arrangeInCircle([...categoryListRef.current.children], categoryRadius);
      }
    };

    calculateLayout();
    window.addEventListener("resize", calculateLayout);
    return () => window.removeEventListener("resize", calculateLayout);
  }, [activeCategory]);

  // Reset active item and animate on category change
  useEffect(() => {
    setActiveItem(0);
    gsap.to([galleryRef.current, infoRef.current], {
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.5
    });
  }, [activeCategory]);

  // Carousel Logic
  useEffect(() => {
    if (!numBoxes || !galleryRef.current) return;

    const createSVGPath = () => {
      const radius = galleryRef.current.offsetWidth ;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', `0 0 ${radius * 2} ${radius * 6}`);
      svg.style.position = 'absolute';
      svg.style.left = `-${radius}px`;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.id = 'path';
      
      // Create right-bending arc
      const startX = radius;
      const startY = 0;
      const endX = radius;
      const endY = radius * 6;
      
      path.setAttribute('d', `M${startX},${startY} A${radius/4},${radius} 0 0 1 ${endX},${endY}`);
      svg.appendChild(path);
      wrapperRef.current.prepend(svg);
    };

    const createAnimation = () => {
      const boxes = gsap.utils.toArray('.gallery-item', wrapperRef.current);
      
      animation.current = gsap.timeline({ 
        paused: true,
        defaults: { duration: 1, ease: 'none' },
        onUpdate: () => updateActiveIndex()
      });

      animation.current.to(boxes, {
        motionPath: {
          path: '#path',
          align: '#path',
          alignOrigin: 'right',
          start: i => i * (1 / numBoxes),
          end: i => (i * (1 / numBoxes))
        }
      }, 0);

      animation.current.progress(snapValues[0]);
    };

    const createDraggable = () => {
      const path = document.querySelector('#path');
      const circumference = MotionPathPlugin.getLength(path);
      const snapX = gsap.utils.snap(snapValues.map(v => v * circumference));

      Draggable.create(proxy.current, {
        type: 'x',
        trigger: galleryRef.current,
        inertia: true,
        bounds: { minX: 0, maxX: circumference },
        onDrag: () => updateProgress(),
        onThrowUpdate: () => updateProgress(),
        snap: snapX
      });
    };

    const updateProgress = () => {
      const circumference = MotionPathPlugin.getLength(document.querySelector('#path'));
      const progress = gsap.utils.normalize(0, circumference)(proxy.current._gsap.x);
      animation.current.progress(progress);
    };

    const updateActiveIndex = () => {
      const progress = gsap.utils.snap(snapValues)(animation.current.progress());
      const newIndex = Math.round(progress * (numBoxes + 1)) - 1;
      setActiveItem(Math.max(0, Math.min(newIndex, numBoxes - 1)));
    };

    const handleItemClick = (index) => {
      gsap.to(animation.current, {
        progress: snapValues[index],
        ease: 'power3.out',
        onComplete: () => setActiveItem(index)
      });
    };

    // Initialize carousel
    createSVGPath();
    createAnimation();
    if (numBoxes > 1) createDraggable();

    // Wheel control
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY);
      const currentProgress = animation.current.progress();
      const newProgress = gsap.utils.clamp(0, 1, currentProgress + (delta * boxStep));
      animation.current.progress(newProgress);
    };

    containerRef.current.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      containerRef.current?.removeEventListener('wheel', handleWheel);
      animation.current?.kill();
      Draggable.get(proxy.current)?.kill();
    };
  }, [currentCategory, numBoxes]);

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
        <div className='galleryWrap' ref={wrapperRef}>
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
      </div>
    </section>
  );
};

export default Overview;