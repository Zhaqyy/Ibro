import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Loader from "../Component/Loader/Loader";
import Transitioner from "../Util/Transition";

import Home from "../Pages/Home";
import Contact from "../Pages/Contact";
import Bio from "../Pages/Bio";
import CV from "../Pages/CV";
import Works from "../Pages/Works";
import Overview from "../Pages/Overview";

import Header from "../Component/Header";

const Router = () => {
  // const [loaderFinished, setLoaderFinished] = useState(false);
  const location = useLocation();

  // routes where <header /> should not render
  const excludedRoutes = ["/"];


  return (
    <>
      {/* <Loader onComplete={() => setLoaderFinished(true)} /> */}

      {/* Render routes only after the loader signals completion */}
      {/* {loaderFinished && ( */}
        <>
                  {/* Conditionally render Header based on the route */}
        {!excludedRoutes.includes(location.pathname) && <Header />}

          <Routes>
            <Route
              index
              path='/'
              element={
                <Transitioner>
                  <Home />
                </Transitioner>
              }
            />
            <Route
              path='/contact'
              element={
                <Transitioner>
                  <Contact />
                </Transitioner>
              }
            />
            <Route
              path='/bio'
              element={
                <Transitioner>
                  <Bio />
                </Transitioner>
              }
            />
            <Route
              path='/cv'
              element={
                <Transitioner>
                  <CV />
                </Transitioner>
              }
            />
            <Route
              path='/works'
              element={
                <Transitioner>
                  <Works />
                </Transitioner>
              }
            />
            <Route
              path='/works/overview'
              element={
                <Transitioner>
                  <Overview />
                </Transitioner>
              }
            />
            {/* <Route
              path='/works/:category'
              element={
                <Transitioner>
                  <Category />
                </Transitioner>
              }
            /> */}
          </Routes>
        </>
      {/* )} */}

    </>
  );
};

export default Router;
