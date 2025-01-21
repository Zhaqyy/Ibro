import React from "react";
import "../Style/Subpages.scss";

const CV = () => {
  return (
    <section className='cv'>
      <div className='godHand'>
        <img src="./hand.png" alt="dd" />
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
      </div>
    </section>
  );
};

export default CV;
