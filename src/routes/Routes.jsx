import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import Articles from "../components/Articles";
import FamousArticles from "../components/FamousArticles";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/famous-articles" element={<FamousArticles />} />
    </Routes>
  );
};

export default AppRoutes;
