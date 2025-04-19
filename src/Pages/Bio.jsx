import React, { useEffect, useRef } from "react";
import "../Style/Subpages.scss";
import gsap from "gsap";
import useFetch from "../Hooks/useFetch";
import useIsMobile from "../Util/isMobile";
import bioData from "../Data/bio.json";

const Bio = () => {
  const svgRef = useRef([]);
  const bImageRef = useRef(null);
  const isMobile = useIsMobile(700);

  useEffect(() => {
    const svgWidth = bImageRef.current.clientWidth;
    const svgHeight = bImageRef.current.clientHeight;

    const generateRandomPosition = (maskWidth, maskHeight) => {
      const maxWidth = svgWidth - maskWidth;
      const maxHeight = svgHeight - maskHeight;
      return {
        x: Math.random() * maxWidth,
        y: Math.random() * maxHeight,
      };
    };

    const generateRandomWidth = () => {
      return Math.random() * (svgWidth * 0.4) + svgWidth * 0.2; // Between 10% to 50% of SVG width
    };

    const updateMaskPositions = () => {
      const maskHeight = bImageRef.current.clientHeight / 2;

      const positions = [];
      svgRef.current.forEach((mask, index) => {
        let position;
        let maskWidth;
        let attempts = 0;
        const maxAttempts = isMobile ? 50 : 100;

        // Ensure non-overlapping positions
        do {
          maskWidth = generateRandomWidth();
          position = generateRandomPosition(maskWidth, maskHeight);
          attempts++;
        } while (
          positions.some(p => Math.abs(p.x - position.x) < maskWidth && Math.abs(p.y - position.y) < maskHeight) &&
          attempts < maxAttempts
        );

        positions.push({ ...position, width: maskWidth });
        gsap.to(mask, {
          x: position.x,
          y: position.y,
          width: maskWidth,
          duration: 1,
          ease: "expo.inOut",
        });
      });
    };

    const startColorShift = () => {
      if (isMobile) return;

      const randomColorMatrix = () => {
        const randomValue = () => (Math.random() - 0.5).toFixed(2); // Random value between -0.5 and 0.5

        // return `
        //   ${randomValue()} 0 0 0 0
        //   0 ${randomValue()} 0 0 0
        //   0 0 ${randomValue()} 0 0
        //   0 0 0 1 0`;
        return `
        ${randomValue()} ${randomValue()} ${randomValue()} 0 0 
        ${randomValue()} ${randomValue()} ${randomValue()} 0 0  
        ${randomValue()} ${randomValue()} ${randomValue()} 0 0  
        0 0 0 1 0`;
      };

      gsap.to("#Rfilter feColorMatrix", {
        attr: { values: randomColorMatrix() },
        duration: 10,
        repeat: -1,
        yoyo: true,
      });
      gsap.to("#Gfilter feColorMatrix", {
        attr: { values: randomColorMatrix() },
        duration: 10,
        delay: 1,

        repeat: -1,
        yoyo: true,
      });
      gsap.to("#Bfilter feColorMatrix", {
        attr: { values: randomColorMatrix() },
        duration: 10,
        delay: 3,
        repeat: -1,
        yoyo: true,
      });
    };

    const addParallaxEffect = () => {
      if (isMobile) return; // Disable parallax on mobile

      const handleMouseMove = e => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        svgRef.current.forEach((mask, index) => {
          const depth = (index + 1) * 0.1; // Increase depth for each mask
          const offsetX = (clientX / innerWidth - 0.5) * depth * 10;
          const offsetY = (clientY / innerHeight - 0.5) * depth * 10;

          gsap.to(mask, {
            x: `+=${offsetX}`,
            y: `+=${offsetY}`,
            duration: 0.5,
            ease: "power1.out",
          });
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    };

    const handleMaskIntersections = () => {
      if (isMobile) return;
      svgRef.current.forEach((mask1, i) => {
        svgRef.current.forEach((mask2, j) => {
          if (i !== j) {
            gsap.to(mask1, {
              onUpdate: () => {
                const rect1 = mask1.getBoundingClientRect();
                const rect2 = mask2.getBoundingClientRect();

                const overlap = !(
                  rect1.right < rect2.left ||
                  rect1.left > rect2.right ||
                  rect1.bottom < rect2.top ||
                  rect1.top > rect2.bottom
                );

                if (overlap) {
                  mask1.setAttribute("fill", "rgba(255,255,255,0.5)");
                } else {
                  mask1.setAttribute("fill", "#fff");
                }
              },
            });
          }
        });
      });
    };

    setTimeout(
      () => {
        updateMaskPositions();
      },
      isMobile ? 2000 : 100
    );
    startColorShift();
    const cleanupParallax = addParallaxEffect();
    handleMaskIntersections();

    const interval = setInterval(updateMaskPositions, 5000);

    return () => {
      clearInterval(interval);
      cleanupParallax();
    };
  }, [isMobile]);
  return (
    <section className='bio'>
      <svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' id='bImage' ref={bImageRef}>
        {/* Filters */}
        <filter id='blurFIlter' colorInterpolationFilters='sRGB'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='15 30' result='blur'></feGaussianBlur>
          <feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch' />
          <feColorMatrix type='saturate' values='0' result='grain' />
          <feComposite operator='in' in='blur' in2='grain' />
        </filter>
        <filter id='Rfilter'>
          <feColorMatrix
            type='matrix'
            values='1 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 1 0'
          />
        </filter>
        <filter id='Gfilter'>
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0
                  0 1 0 0 0
                  0 0 0 0 0
                  0 0 0 1 0'
          />
        </filter>
        <filter id='Bfilter'>
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0
                  0 0 0 0 0
                  0 0 1 0 0
                  0 0 0 1 0'
          />
        </filter>

        {/* Masks */}
        {[0, 1, 2, 3].map((_, index) => (
          <mask id={`mask-${index}`} key={index}>
            <rect x='0' y='0' height='50%' width='40%' rx='2' fill='gray' ref={el => (svgRef.current[index] = el)} />
          </mask>
        ))}
        <mask id='staticMask'>
          <rect x='25%' y={`${isMobile ? "65%" : "50%"}`} height='10%' width='50%' rx='2' fill='#fff' />
        </mask>
        {/* Images */}
        <image
          xlinkHref='./ibroAscii.png'
          width='100%'
          height='100%'
          mask='url(#staticMask)'
          // filter="url(#blurFIlter)"
          preserveAspectRatio='xMidYMax slice'
        />
        <image
          xlinkHref='./ibro.jpg'
          width='100%'
          height='100%'
          filter='url(#Rfilter)'
          mask='url(#mask-1)'
          preserveAspectRatio='xMidYMax slice'
        />
        <image
          xlinkHref='./ibro.jpg'
          width='100%'
          height='100%'
          filter='url(#Gfilter)'
          mask='url(#mask-2)'
          preserveAspectRatio='xMidYMax slice'
        />
        <image
          xlinkHref='./ibro.jpg'
          width='100%'
          height='100%'
          filter='url(#Bfilter)'
          mask='url(#mask-3)'
          preserveAspectRatio='xMidYMax slice'
        />
      </svg>
      <hr />
      <div>
        <div className='bDetail'>
          {bioData?.bioHead ? (
            <span>
              <p>{bioData?.bioHead}</p>
            </span>
          ) : (
            <span>
              <p>About Ibrahim Shuaib...</p>
            </span>
          )}

          {bioData?.bioBody ? (
           bioData.bioBody.map(({ paragraph }, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <>
              <p>
                As a self-taught artist, he finds inspiration in the interplay of chaos and tranquility within himself and seeks to simplify
                the existential questions of life to better understand them and help ease the difficulties of life's journeys.
                <br />
                <br />
                Throughout his artistic career, Ibrahim has explored various forms of self-expression, but has found art to be his most
                consistent and stable medium. He is constantly experimenting with different techniques and pushing the limits of each medium
                he works with to create works that are both thought-provoking and aesthetically pleasing.
                <br />
                <br />
                Ibrahim's art often tackles topics that are commonly avoided, using direction and misdirection to convey his messages in a
                unique and impactful way.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Bio;
