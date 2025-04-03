import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CarouselComponent from "./components/CarouselComponent";
import FamousArticles from "./components/FamousArticles";
import ArticlesList from "./components/ArticlesList";
import ArticleDetail from "./components/ArticleDetail";
import Footer from "./components/Footer";
import Login from "./components/Login";
import "./index.css";
import RotatingCircle from "./components/RotatingCircle";
import AdminDashboard from './components/AdminDashboard';
import AdminArticlesList from './components/AdminArticlesList';
import EditArticle from './components/EditArticle';

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

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [articles, setArticles] = useState([]);
  const { currentUser } = useAuth(); // Now this will work properly

  const famousArticleIDs = ["67d041735e2b9503bac85edd", "67d041735e2b9503bac85edb", "67d041735e2b9503bac85eda"];
  const listArticleIDs = [];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const headers = {};
        if (currentUser) {
          headers['Authorization'] = `Bearer ${currentUser.token}`;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles`, {
          headers
        });
        
        if (!response.ok) throw new Error('Failed to fetch articles');
        
        const data = await response.json();
        const sortedArticles = data.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        setArticles(sortedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [currentUser]);

  return (
    <Routes>
      <Route 
        path="/" 
        element={<HomePage articles={articles} famousArticleIDs={famousArticleIDs} listArticleIDs={listArticleIDs} />} 
      />
      <Route path="/articles/:id" element={<ArticleDetail articles={articles} />} />
      <Route path="/login" element={<Login />} />
      <Route 
          path="/admin/" 
          element={
            <ProtectedRoute>
              <AdminDashboard articles={articles} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/articles" 
          element={
            <ProtectedRoute>
              <AdminArticlesList articles={articles} />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/admin/edit/:id"
          element={
            <ProtectedRoute>
              <EditArticle />
            </ProtectedRoute>
          }
        />
    </Routes>
  );
};

export default App;