import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { workData } from "../Data/WorkData";
import "../Style/Subpages.scss";

const Work = () => {
  const gridRef = useRef(null);
  const navigate = useNavigate();
  const [randomSelections] = useState(() => {
    // Generate random selections once on component mount
    const selections = { text: {}, images: {} };

    workData.forEach((category, rowIndex) => {
      if (category.type === "text") {
        // Randomly select one text item
        selections.text[rowIndex] = Math.floor(Math.random() * category.items.length);
      } else if (category.type === "images") {
        // Create position map for this category's row
        selections.images[rowIndex] = {};
        for (let colIndex = 0; colIndex < 5; colIndex++) {
          if (rowIndex === colIndex || rowIndex + colIndex === 4) {
            // Randomly select an image for this grid position
            selections.images[rowIndex][colIndex] = Math.floor(Math.random() * category.items.length);
          }
        }
      }
    });

    return selections;
  });

  useEffect(() => {
    gsap.fromTo(
      gridRef.current.querySelectorAll(".grid-item"),
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: "power1.in",
      }
    );
  }, []);

  const handleCategoryClick = category => {
    navigate(`/works/overview`);
  };

  return (
    <section className='works'>
      <div className='wGrid' ref={gridRef} style={{ display: "grid", gridTemplateRows: `repeat(${workData.length}, auto)` }}>
        {workData.map((category, rowIndex) => (
          <div key={rowIndex} className='categoryRow'>
            <div className='grid-item categoryTitle' onClick={() => handleCategoryClick(category.category)}>
              <p>[I]</p>
              <h4>{category.category}</h4>
            </div>

            {[...Array(5)].map((_, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className='grid-item image-container'>
                {/* Dynamic Text Content */}
                {category.type === "text" && colIndex === 2 && (
                  <div className='poem'>
                    {category.items[randomSelections.text[rowIndex]] && (
                      <>
                        <em>{category.items[randomSelections.text[rowIndex]].title}</em>
                      </>
                    )}  
                  </div>
                )}

                {/* Dynamic Image Display */}
                {category.type === "images" && (rowIndex === colIndex || rowIndex + colIndex === 4) && (
                  <img src={category.items[randomSelections.images[rowIndex]?.[colIndex]]?.src} alt={`${category.category} example`} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Work;
