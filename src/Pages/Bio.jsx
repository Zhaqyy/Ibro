import React from "react";
import "../Style/Subpages.scss";

const Bio = () => {
  return (
    <section className='bio'>
      <img src='./ibro.jpg' alt='ibro' className='bImage' />
      <hr />
      <div >
        <p className='bDetail'>
          Ibrahim Shuaib is a multidisciplinary visual artist hailing from Nigeria, who currently resides on Treaty 1 Territory in Winnipeg.
          As a self-taught artist, he finds inspiration in the interplay of chaos and tranquility within himself and seeks to simplify the
          existential questions of life to better understand them and help ease the difficulties of life's journeys.
          <br />
          Throughout his artistic career, Ibrahim has explored various forms of self-expression, but has found art to be his most consistent
          and stable medium. He is constantly experimenting with different techniques and pushing the limits of each medium he works with to
          create works that are both thought-provoking and aesthetically pleasing.
          <br />
          Ibrahim's art often tackles topics that are commonly avoided, using direction and misdirection to convey his messages in a unique
          and impactful way.
        </p>
      </div>
    </section>
  );
};

export default Bio;
