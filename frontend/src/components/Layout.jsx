import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  const location = useLocation();

  return (
    <>
      <Navbar currentPath={location.pathname} />
      <Outlet />
    </>
  );
};

export default Layout;
