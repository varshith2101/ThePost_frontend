import React from "react";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import styled from "styled-components";

const FamousArticles = ({ articles, ids = [] }) => {
  const fallbackImage = "/test.jpg";

  // Filter articles by IDs if provided; otherwise, show all articles
  const filteredArticles = ids.length > 0 ? articles.filter((article) => ids.includes(article._id)) : articles;

  return (
    <StyledWrapper>
      <section id="famous-articles" className="famous-articles">
        <h2 className="section-title">Famous Articles</h2>
        <div className="famous-articles-grid">
          {filteredArticles.map((article) => (
            <div key={article._id} className="card">
              <img
                src={article.link || fallbackImage}
                alt={article.title}
                onError={(e) => (e.target.src = fallbackImage)}
                className="card-image"
              />
              <div className="card__content">
                <p className="card__title">{article.title}</p>
                <p className="card__description">{parse(article.content.slice(0, 100))}</p>
                <p className="card-meta">
                  By {article.creator} | {new Date(article.pubDate).toLocaleDateString()}
                </p>
                <Link to={`/articles/${article._id}`} className="read-more-button">
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .famous-articles {
    display: flex;
    flex-direction: column;
    align-items: start;
  }

  .section-title {
    font-size: 60px;
    font-weight: bold;
    color:#f06739;
    margin-bottom: 20px;
    text-align: center;
    letter-spacing: -3px;
    float: left ; 
  }

  .famous-articles-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px; /* Add spacing between cards */
    justify-content: center;
  }

  .card {
    position: relative;
    width: 20vw;
    height: auto;
    background-color: #f2f2f2; /* Light background for cards */
    border-radius: 10px;
    overflow: hidden;
    perspective: 1000px; /* For hover effect */
    box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px; /* Shadow effect */
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card:hover {
    transform: scale(1.05);
    box-shadow: rgba(255, 255, 255, 0.2) 0px 8px 16px; /* Hover effect */
  }

  .card-image {
    width: calc(100%);
    height: auto;
    border-bottom: solid #ddd; /* Subtle border below the image */
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
    font-size: 24px;
    color: #333;
    font-weight: 700;
  }

  .card__description {
    margin: 10px 0 0;
    font-size: 14px;
    color: #777;
    line-height: 1.4;
  }

  .card-meta {
    font-size: 14px;
    color: #777;
    margin-top: 10px;
  }

  .read-more-button {
    background-color: #f06739;
    color: #ffffff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    display: inline-block;
    float: right;
  }

  .read-more-button:hover {
    background-color:rgb(241, 128, 91);
  }
`;

export default FamousArticles;
