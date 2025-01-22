import React, { useEffect, useRef } from "react";
import "../Style/Subpages.scss";
import gsap from "gsap";

const CV = () => {
  const handRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = event => {
      const { clientY } = event;

      // remove 2% offset to target finger pad instead of tip
      gsap.set(handRef.current, { yPercent: -98 });

      // Setup the gsap quickTo for smooth movement
      const yTo = gsap.quickTo(handRef.current, "y", { duration: 0.5, ease: "" });

      yTo(clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className='cv'>
      <div className='godHand'>
        <img ref={handRef} src='./hand.png' alt='hand pointer' />
      </div>
      <div className='cvWrapper'>
        <div className='cvGroup'>
          <h2 className='gTitle'>Exp</h2>
          <hr />
          <ul className='gItemList'>
            <li className='gItem'>
              <h4 className='gItemTitle'>MOMENTARY VOICES</h4>
              <p className='gItemPlace'>Alternator Centre for Contemporary Art(Forthcoming Solo)</p>
              <p className='gItemYear'>2025</p>
            </li>
            <li className='gItem'>
              <h4 className='gItemTitle'>MOMENTARY VOICES</h4>
              <p className='gItemPlace'>Alternator Centre for Contemporary Art(Forthcoming Solo)</p>
              <p className='gItemYear'>2025</p>
            </li>
            <li className='gItem'>
              <h4 className='gItemTitle'>MOMENTARY VOICES</h4>
              <p className='gItemPlace'>Alternator Centre for Contemporary Art(Forthcoming Solo)</p>
              <p className='gItemYear'>2025</p>
            </li>
          </ul>
        </div>
        <div className='cvGroup'>
          <h2 className='gTitle'>Sch</h2>
          <hr />
          <ul className='gItemList'>
            <li className='gItem'>
              <h4 className='gItemTitle'>MOMENTARY VOICES</h4>
              <p className='gItemPlace'>Alternator Centre for Contemporary Art(Forthcoming Solo)</p>
              <p className='gItemYear'>2025</p>
            </li>
            <li className='gItem'>
              <h4 className='gItemTitle'>MOMENTARY VOICES</h4>
              <p className='gItemPlace'>Alternator Centre for Contemporary Art(Forthcoming Solo)</p>
              <p className='gItemYear'>2025</p>
            </li>
            <li className='gItem'>
              <h4 className='gItemTitle'>MOMENTARY VOICES</h4>
              <p className='gItemPlace'>Alternator Centre for Contemporary Art(Forthcoming Solo)</p>
              <p className='gItemYear'>2025</p>
            </li>
          </ul>
        </div>
        <div className='cvGroup'>
          <h2 className='gTitle'>Sch</h2>
          <hr />
          <ul className='gItemList'>
            <li className='gItem'>
              <h4 className='gItemTitle'>MOMENTARY VOICES</h4>
              <p className='gItemPlace'>Alternator Centre for Contemporary Art(Forthcoming Solo)</p>
              <p className='gItemYear'>2025</p>
            </li>
            <li className='gItem'>
              <h4 className='gItemTitle'>MOMENTARY VOICES</h4>
              <p className='gItemPlace'>Alternator Centre for Contemporary Art(Forthcoming Solo)</p>
              <p className='gItemYear'>2025</p>
            </li>
            <li className='gItem'>
              <h4 className='gItemTitle'>MOMENTARY VOICES</h4>
              <p className='gItemPlace'>Alternator Centre for Contemporary Art(Forthcoming Solo)</p>
              <p className='gItemYear'>2025</p>
            </li>
          </ul>
        </div>
        <div className='cvGroup'>
          <h2 className='gTitle'>Sch</h2>
          <hr />
          <ul className='gItemList'>
            <li className='gItem'>
              <h4 className='gItemTitle'>MOMENTARY VOICES</h4>
              <p className='gItemPlace'>Alternator Centre for Contemporary Art(Forthcoming Solo)</p>
              <p className='gItemYear'>2025</p>
            </li>
            <li className='gItem'>
              <h4 className='gItemTitle'>MOMENTARY VOICES</h4>
              <p className='gItemPlace'>Alternator Centre for Contemporary Art(Forthcoming Solo)</p>
              <p className='gItemYear'>2025</p>
            </li>
            <li className='gItem'>
              <h4 className='gItemTitle'>MOMENTARY VOICES</h4>
              <p className='gItemPlace'>Alternator Centre for Contemporary Art(Forthcoming Solo)</p>
              <p className='gItemYear'>2025</p>
            </li>
          </ul>
        </div>
        <div className='cvGroup'>
          <h2 className='gTitle'>Sch</h2>
          <hr />
          <ul className='gItemList'>
            <li className='gItem'>
              <h4 className='gItemTitle'>MOMENTARY VOICES</h4>
              <p className='gItemPlace'>Alternator Centre for Contemporary Art(Forthcoming Solo)</p>
              <p className='gItemYear'>2025</p>
            </li>
            <li className='gItem'>
              <h4 className='gItemTitle'>MOMENTARY VOICES</h4>
              <p className='gItemPlace'>Alternator Centre for Contemporary Art(Forthcoming Solo)</p>
              <p className='gItemYear'>2025</p>
            </li>
            <li className='gItem'>
              <h4 className='gItemTitle'>MOMENTARY VOICES</h4>
              <p className='gItemPlace'>Alternator Centre for Contemporary Art(Forthcoming Solo)</p>
              <p className='gItemYear'>2025</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CV;
