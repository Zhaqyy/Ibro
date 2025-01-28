import React, { useState, useEffect, useRef } from "react";
import { workData } from "../Data/WorkData";
import gsap from "gsap";

const Overview = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const galleryRef = useRef(null);
  const infoRef = useRef(null);
  const categoryListRef = useRef(null);

  gsap.defaults({
    ease: "sine.inOut",
  });

  // Category change animation
  useEffect(() => {
    gsap.fromTo(categoryListRef.current.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.3 });
  }, []);

  // Gallery/Info animation on category change
  useEffect(() => {
    const tl = gsap.timeline();
    tl.to([galleryRef.current, infoRef.current], {
      opacity: 0,
      duration: 0.3,
    })
      .call(() => {
        setActiveImage(0); // Reset active image on category change
      })
      .to([galleryRef.current, infoRef.current], {
        opacity: 1,
        duration: 0.3,
      });
  }, [activeCategory]);

  // Image click animation
  const handleImageClick = index => {
    setActiveImage(index);
    gsap.fromTo(infoRef.current, { opacity: 0.5, filter: "blur(2px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.5 });
  };

  return (
    <section className='overview'>
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
        {workData[activeCategory].text ? (
          <div className='text-info'>
            <p>{workData[activeCategory].text}</p>
          </div>
        ) : (
          <div className='image-info'>
            <span>
              <img src={`/${workData[activeCategory].images[activeImage]}`} alt='Selected work' />
            </span>
          </div>
        )}
      </div>

      <div className='cateGallery' ref={galleryRef}>
        {workData[activeCategory].images?.map((image, index) => (
          <div key={index} className={`gallery-item ${index === activeImage ? "active" : ""}`} onClick={() => handleImageClick(index)}>
            <img src={`/${image}`} alt={`Work ${index + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Overview;
