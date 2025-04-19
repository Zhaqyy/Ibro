import { useRef, useEffect } from "react";
import gsap from "gsap";
import useFetch from "../Hooks/useFetch";
import cvData from "../Data/CV.json";

const CV = () => {
  // const { loading, data, error } = useFetch(
  //   "http://localhost:1337/api/cv-groups?populate=*&sort=createdAt"
  // );
  const data = cvData.cvGroups || [];

  const handRef = useRef(null);
  const cvWrapperRef = useRef(null);

  // Hand animation
  useEffect(() => {
    const handleMouseMove = event => {
      const { pageY } = event;  // Changed from clientY to pageY
      gsap.set(handRef.current, { yPercent: -98 });
      const yTo = gsap.quickTo(handRef.current, "y", { duration: 0.5, ease: "power3" });
      yTo(pageY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Content entry animation
  useEffect(() => {
    if ( data && cvWrapperRef.current) {
      const ctx = gsap.context(() => {
        // Animate groups
        gsap.from(".cvGroup", {
          duration: 1,
          opacity: 0,
          y: 15,
          stagger: 0.25,
          ease: "power3.out",
        });

        // Animate items with delay
        gsap.from(".gItem", {
          duration: 0.8,
          opacity: 0,
          x: -10,
          stagger: 0.1,
          ease: "sine.out",
          delay: 0.3,
        });
      }, cvWrapperRef.current);

      return () => ctx.revert();
    }
  }, [data]);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error!</p>;
// console.log(data);


  return (
    <section className='cv'>
      <div className='godHand'>
        <img ref={handRef} src='./hand.png' alt='hand pointer' fetchpriority='high' loading='eager' />
      </div>

      <div className='cvWrapper' ref={cvWrapperRef}>
      {data.map((group) => (
        <div className='cvGroup' key={group.documentId}>
          <h2 className='gTitle'>{group.gItemTitle}</h2>
          <hr />
          <ul className='gItemList'>
            {group?.item?.map((item) => (
              <li className='gItem' key={item.id}>
                <h4 className='gItemTitle'>{item.gTitle}</h4>
                {item.gPlace ? <p className='gItemPlace'>{item.gPlace}</p> : null}
                {item.link ? (
                  <a href={item.link} className='gItemLink'>
                    🌐{item.gTitle}🌐
                  </a>
                ) : null}
                {item.Year ? <p className='gItemYear'>{item.Year}</p> : null}
                {item.range ? <p className='gItemYear'>{item.range}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
      </div>
    </section>
  );
};

export default CV;
