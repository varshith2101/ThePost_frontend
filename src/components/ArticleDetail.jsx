// components/ArticleDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FamousArticles from "./FamousArticles";
import parse from "html-react-parser";
import styled from "styled-components";
import { Link } from "react-router-dom";

const ArticleDetail = ({ articles }) => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [suggestedArticles, setSuggestedArticles] = useState([]);
  const fallbackImage = "/test.jpg";
  const fallback2 = "/test_2.jpg"; // Fallback for content images

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Fetch the specific article
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/${id}`);
        const data = await response.json();
        setArticle(data);

        // Get 3 random articles for suggestions
        if (articles.length > 0) {
          const filtered = articles.filter(a => a._id !== id);
          const randomArticles = filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
          setSuggestedArticles(randomArticles);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id, articles]);

    // Function to replace <img> tags with fallback2
    const replaceImages = (node) => {
        if (node.name === "img") {
          return (
            <img
              src={fallback2} // Replace with fallback2
              alt={node.attribs.alt || "Fallback Image"}
              className="article-image"
            />
          );
        }
      };
    
      if (!article) {
        return <div className="loading">Loading...</div>;
      }

  if (!article) {
    return <div className="loading">Loading...</div>;
  }


  return (
    <StyledWrapper>
      <Navbar />
      <div className="app-container">
              <div className="article-detail">
                <div className="article-header">
                  <h1 className="article-title">{article.title}</h1>
                  <div className="article-meta">
                    <span className="article-date">{new Date(article.pubDate).toLocaleDateString()}</span>
                    <span className="article-author">By {article.creator}</span>
                  </div>
                </div>
                <div className="article-content">
                  {/* Parse the content and replace images with fallback2 */}
                  {parse(article.content, { replace: replaceImages })}
                </div>
              </div>
        
        <div className="suggested-articles">
          <h2 className="section-title">Suggested Articles</h2>
          <div className="famous-articles-grid">
            {suggestedArticles.map(article => (
              <div key={article._id} className="card">
                <img
                  src={fallbackImage}
                  alt={article.title}
                  className="card-image"
                />
                <div className="card__content">
                  <p className="card__title">{article.title}</p>
                  <p className="card__description">{parse(article.content.slice(0, 100))}</p>
                  <Link to={`/articles/${article._id}`} className="read-more-button">
                                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`

   .app-container {
    display: flex;
    flex-direction: column;
    align-items: start;
   }

   .suggested-articles {
   display: flex;
    flex-direction: column;
    align-items: start;
   }
   .article-detail {
    padding: 40px;
    background-color: #2a2a2a;
    border-radius: 15px;
    margin: 20px 0;
  }

  .article-header {
    margin-bottom: 30px;
    text-align: center;
  }

  .article-title {
    font-size: 42px;
    font-weight: bold;
    color: #ff9900;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  .article-meta {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
    color: #cccccc;
    font-size: 20px;
  }

  .article-content {
    color: #ffffff;
    line-height: 1.8;
    font-size: 18px;
  }

  .article-content p img {
    max-width: 70%;
    height: auto;
    margin: 20px 0;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
    .article-content img {
    max-width: 70%;
    height: auto;
    margin: 20px 0;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }

  .article-content p:has(img) {
    padding-left: 12vw;
  }

  .article-content p {
    margin-bottom: 20px;
  }

  .article-content a {
    color: #ff9900;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .article-content a:hover {
    color: #ffad33;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 30px;
    color: #ff9900;
  }

  /* Card styles for suggested articles */
  .famous-articles-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }

  .card {
    position: relative;
    width: 300px;
    height: 200px;
    background-color: #f2f2f2;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    perspective: 1000px;
    box-shadow: 0 0 0 5px #ffffff80;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .card:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2);
  }

  .card__content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: #f2f2f2;
    transform: rotateX(-90deg);
    transform-origin: bottom;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .card:hover .card__content {
    transform: rotateX(0deg);
  }

  .card__title {
    margin: 0;
    font-size: 30px;
    color: #333;
    font-weight: 700;
  }

  .card__description {
    margin: 10px 0 0;
    font-size: 14px;
    color: #777;
    line-height: 1.4;
  }

    .card {
    position: relative;
    width: 20vw;
    height: 30vh;
    background-color: #f2f2f2;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    perspective: 1000px;
    box-shadow: 0 0 0 5px #ffffff80;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }

  
`;

export default ArticleDetail;
