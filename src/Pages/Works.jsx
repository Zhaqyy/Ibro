import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
// import { workData } from "../Data/WorkData";
import workData from "../Data/workData.json";
import "../Style/Subpages.scss";

const Work = () => {
  const gridRef = useRef(null);
  const navigate = useNavigate();

  // category image randomizer
  const [randomSelections] = useState(() => {
    const selections = { text: {}, images: {} };

    workData.forEach((category, rowIndex) => {
      if (category.type === "text") {
        // Shuffle text items and pick first
        const shuffled = [...category.items].sort(() => Math.random() - 0.5);
        selections.text[rowIndex] = category.items.indexOf(shuffled[0]);
      } else if (category.type === "images") {
        // Create shuffled array of available indices
        const indices = Array.from({ length: category.items.length }, (_, i) => i);
        const shuffled = [...indices].sort(() => Math.random() - 0.5);

        selections.images[rowIndex] = {};
        let shuffleIndex = 0;

        for (let colIndex = 0; colIndex < 5; colIndex++) {
          if (rowIndex === colIndex || rowIndex + colIndex === 4) {
            // Cycle through shuffled array
            selections.images[rowIndex][colIndex] = shuffled[shuffleIndex % shuffled.length];
            shuffleIndex++;
          }
        }
      }
    });

    return selections;
  });

  const handleCategoryClick = rowIndex => {
    navigate(`/works/overview`, {
      state: { category: rowIndex },
      // replace: true, // Prevent history buildup
    });
  };
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

  return (
    <section className='works'>
      <div className='wGrid' ref={gridRef} style={{ display: "grid", gridTemplateRows: `repeat(${workData.length}, auto)` }}>
        {workData.map((category, rowIndex) => (
          <div key={rowIndex} className='categoryRow'>
            <div className='grid-item categoryTitle' onClick={() => handleCategoryClick(rowIndex)}>
              <p>[I]</p>
              <h4>{category.category}</h4>
            </div>

            {[...Array(5)].map((_, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className='grid-item image-container'>
                {category.type === "text" && colIndex === 2 && (
                  <div className='poem' onClick={() => handleCategoryClick(rowIndex)}>
                    {category.items[randomSelections.text[rowIndex]] && (
                      <>
                        <em>{category.items[randomSelections.text[rowIndex]].title}</em>
                      </>
                    )}
                  </div>
                )}

                {category.type === "images" && (rowIndex === colIndex || rowIndex + colIndex === 4) && (
                  <img
                    src={category.items[randomSelections.images[rowIndex]?.[colIndex]]?.src}
                    alt={`${category.category} example`}
                    onClick={() => handleCategoryClick(rowIndex)}
                  />
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
