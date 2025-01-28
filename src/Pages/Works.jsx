import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { workData } from '../Data/WorkData';
import "../Style/Subpages.scss";


const Work = () => {
  const gridRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // GSAP animation for grid items
    gsap.fromTo(
      gridRef.current.querySelectorAll(".grid-item"),
      {
        opacity: 0,
        //  y: 20
      },
      {
        opacity: 1,
        // y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power1.in",
      }
    );
  }, []);

  const handleCategoryClick = category => {
    navigate(`/works/overview`);
  };
  // const handleCategoryClick = category => {
  //   navigate(`/${category.toLowerCase()}`);
  // };

  return (
    <section className='works'>
      <div className='wGrid' ref={gridRef} style={{ display: "grid", gridTemplateRows: `repeat(${workData.length}, 1fr)` }}>
        {workData.map((category, rowIndex) => (
          <div key={rowIndex} className='categoryRow'>
            {/* Category Title */}
            <div className='grid-item categoryTitle' onClick={() => handleCategoryClick(category.category)}>
              <p>[I]</p>
              <h4>
                {category.category}
                </h4>
            </div>

            {/* X Format for images/text */}
            {[...Array(5)].map((_, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className='grid-item image-container'>
                {/* Center poem */}
                {category.category === "Poems" && colIndex === 2 ? (
                  <div className='poem'>
                    <em>{category.text}</em>
                  </div>
                ) : null}

                {/* X Format for images */}
                {category.images &&
                  (rowIndex === colIndex || rowIndex + colIndex === 4 ? (
                    <img src={category.images[colIndex % category.images.length]} alt={`${category.category} example ${colIndex + 1}`} />
                  ) : null)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Work;
