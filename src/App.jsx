import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CarouselComponent from "./components/CarouselComponent";
import FamousArticles from "./components/FamousArticles";
import ArticlesList from "./components/ArticlesList";
import ArticleDetail from "./components/ArticleDetail";
import Footer from "./components/Footer";
import "./index.css";
import RotatingCircle from "./components/RotatingCircle";

// Home page component
const HomePage = ({ articles, famousArticleIDs, listArticleIDs }) => {
  return (
    <>
      <RotatingCircle />
      <Navbar />
      <div className="app-container">
        <Hero />
        <CarouselComponent articles={articles.slice(0, 6)} />
        <FamousArticles articles={articles} ids={famousArticleIDs} />
        <ArticlesList articles={articles} ids={listArticleIDs} />
        
      </div>
      <Footer />
    </>
  );
};

const App = () => {
  const [articles, setArticles] = useState([]);

  // Predefined list of article IDs for Famous Articles and Articles List
  const famousArticleIDs = ["67d041735e2b9503bac85edd", "67d041735e2b9503bac85edb", "67d041735e2b9503bac85eda"];
  const listArticleIDs = [];

  // Fetch articles from backend
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles`);
        const data = await response.json();
        
        // Sort articles by date (newest first)
        const sortedArticles = data.sort((a, b) => {
          return new Date(b.pubDate) - new Date(a.pubDate);
        });
        
        setArticles(sortedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <Routes>
      <Route 
        path="/" 
        element={<HomePage articles={articles} famousArticleIDs={famousArticleIDs} listArticleIDs={listArticleIDs} />} 
      />
      <Route path="/articles/:id" element={<ArticleDetail articles={articles} />} />
    </Routes>
  );
};

export default App;