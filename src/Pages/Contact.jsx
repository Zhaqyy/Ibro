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
      <div className='cHalf'></div>
      <div className='cHalf'></div>

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

      {/* <div className='cInfo'>
        <svg id='circlePath' viewBox="0 0 250 250">
          <def>
            <path
              id='circle'
            d="m125,250.00001c-69.06077,0 -125,-55.93923 -125,-125c0,-69.06077 55.93923,-125 125,-125c69.06077,0 125,55.93923 125,125c0,69.06077 -55.93923,125 -125,125z"
              stroke='#fff'
              fill='none'
              strokeWidth={3}
            />
          </def>
          <text class='circleText'>
            <textPath className='circles__text-path' xlinkHref='#circle' ariaLabel=''  >
              CONTACT ME&nbsp;
            </textPath>
          </text>
        </svg>

        <div className='cItem'>
          <a href={"mailto:zaqrashyy7@gmail.com"} target='_blank' rel='noopener noreferrer'>
            Mail
          </a>
        </div>
        <div className='cItem'>
          <a href={"https://x.com/Zharqyy"} target='_blank' rel='noopener noreferrer'>
            Instagram
          </a>
          <a href={"https://x.com/Zharqyy"} target='_blank' rel='noopener noreferrer'>
            Twitter
          </a>
        </div>
      </div> */}

      <div className='cInfos'>
        <div className='cList'>
          {" "}
          <a href={"mailto:zaqrashyy7@gmail.com"} target='_blank' rel='noopener noreferrer'>
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
