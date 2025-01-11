import React, { useEffect, useMemo, useRef } from "react";
import { Stage, Sprite, Container, Graphics } from "@pixi/react";
// import { BLEND_MODES, BlurFilter } from "pixi.js";
import * as PIXI from "pixi.js";

import "../Style/Home.scss";
import gsap from "gsap";
import { Link } from "react-router-dom";

function Home() {
  const svgRef = useRef(null);
  const heroRef = useRef(null);
  useEffect(() => {
    const svg = svgRef.current;
    const heroElement = heroRef.current;

    // Set mask dynamically
    // if (heroElement) {
    //   heroElement.style.maskImage = `  <svg
    //   id="mask"
    //   ref={svgRef}
    //   xmlns="http://www.w3.org/2000/svg"
    //   height="150px" width="250px" 
    // >
    //   <path
    //     fill="#ff0000"
    //     d="M225.15,75c0,18.5-10.05,34.66-25,43.3l-150-.3h0c-14.95-8.64-25-24.5-25-43s10.05-34.36,25-43h150c14.95,8.64,25,24.5,25,43Z"
    //   />
    // </svg>`;
    //   // heroElement.style.webkitMaskImage = `url(#mask)`; // Safari support
    // }
    // GSAP animation to follow mouse
    const onMouseMove = event => {
      const { clientX, clientY } = event;
      gsap.to(svg, {
        duration: 0.3,
        x: clientX - window.innerWidth / 2,
        y: clientY - window.innerHeight / 2,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <section className='hero' ref={heroRef}>
      <svg id='masker' xmlns='http://www.w3.org/2000/svg' height='150px' width='250px'>
        <clipPath ref={svgRef}  id='mask'>
          <path
            fill='#ff0000'
            clip-rule="evenodd"
            d='M225.15,75c0,18.5-10.05,34.66-25,43.3l-150-.3h0c-14.95-8.64-25-24.5-25-43s10.05-34.36,25-43h150c14.95,8.64,25,24.5,25,43Z'
          />
        </clipPath>
      </svg>
      <h1 className='bigName'>IBRAHIM SHUAIB</h1>
      <div className='menu'>
        <div className='menuCol'>
          <Link to={"#"}>Bio</Link>
          <Link to={"#"}>Press</Link>
        </div>
        <div className='menuCol'>
          <Link to={"#"}>Works</Link>
          <Link to={"#"}>Media</Link>
        </div>
        <div className='menuCol'>
          <Link to={"#"}>CV</Link>
          <Link to={"#"}>Contact</Link>
        </div>
      </div>
    </section>
  );
}

export default Home;

// const HeroBg = () => {
//   const blurFilter = useMemo(() => new PIXI.BlurFilter(20), []);
//   const maskSprite = useRef();

//   useEffect(() => {
//     const handleMouseMove = event => {
//       const { offsetX, offsetY } = event.nativeEvent;
//       if (maskSprite.current) {
//         maskSprite.current.x = offsetX - maskSprite.current.width / 2;
//         maskSprite.current.y = offsetY - maskSprite.current.height / 2;
//       }
//     };

//     const stageElement = document.querySelector(".pixi-react-stage");
//     stageElement.addEventListener("mousemove", handleMouseMove);

//     return () => {
//       stageElement.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, []);

//   const image = "./ibro.jpg";
//   const texture = new PIXI.Texture(new PIXI.BaseTexture(image, { scaleMode: PIXI.SCALE_MODES.LINEAR }));
//   const texture2 = new PIXI.Texture(new PIXI.BaseTexture(image, { scaleMode: PIXI.SCALE_MODES.LINEAR }));
//   return (
//     <div className='pixi-react-stage' style={{ position: "absolute", top: 0, left: 0, height: "100vh", width: "100%" }}>
//       <Stage width={window.innerWidth} height={window.innerHeight} options={{ backgroundColor: 0xeef1f5 }}>
//         <Container>
//           {/* Background Image */}
//           <Sprite
//             width={window.innerWidth}
//             height={window.innerHeight}
//             texture={texture2}
//             // filters={[blurFilter]}
//             // mask={maskSprite.current}
//             // onmousemove={handleMouseMove}
//           />

//           {/* Mask */}
//           <Graphics
//             x={200}
//             y={200}
//             preventRedraw={true}
//             draw={g => {
//               g.beginFill(0x000000);
//               // g.drawCircle(-25, -25, 50);
//               g.drawRoundedRect(-150, -50, 300, 100, 40);
//               g.endFill();
//             }}
//             // eventMode='dynamic'
//             ref={maskSprite}
//           />
//           <Sprite
//             width={window.innerWidth}
//             height={window.innerHeight}
//             texture={texture}
//             filters={[blurFilter]}
//             // mask={maskSprite.current}
//             // onmousemove={handleMouseMove}
//           />
//         </Container>
//       </Stage>
//     </div>
//   );
// };
