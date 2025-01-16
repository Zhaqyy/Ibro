import React, { useEffect } from "react";
import "../Style/Contact.scss";
import gsap from "gsap";

const Contact = () => {
  // useEffect(() => {
  //     gsap.set("text.circleText", { transformOrigin: "50% 50%" });
  //     gsap.to("text.circleText", {
  //       duration: 10,
  //       ease: "none",
  //       rotation: "+=360",
  //       repeat: -1
  //     });

  //   return () => {
  //   }
  // }, [])

  return (
    <section className='contact'>
      <div className='cCover'></div>

      <svg id='crossLine' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 250 250'>
        <g>
          <line
            strokeLinecap='square'
            strokeLinejoin='square'
            y2='249.99999'
            x2='125'
            y1='0'
            x1='125'
            stroke='#000'
            fill='none'
            strokeWidth={3}
          />
          <line
            strokeLinecap='square'
            strokeLinejoin='square'
            y2='124.5'
            x2='488'
            y1='125'
            x1='-238'
            stroke='#000'
            fill='none'
            strokeWidth={3}
          />
        </g>
      </svg>

      <div className='cInfo'>
        <div className='cList'>
          {" "}
          <a href={"mailto:Shuaibibrahim111@gmail.com"} target='_blank' rel='noopener noreferrer'>
            Mail
          </a>
        </div>
        <div className='cList'>
          <a href={"https://x.com/Zharqyy"} target='_blank' rel='noopener noreferrer'>
            Instagram
          </a>
        </div>
        <div className='cList'>
          <a href={"https://x.com/Zharqyy"} target='_blank' rel='noopener noreferrer'>
            Twitter
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
