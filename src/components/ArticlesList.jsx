// components/ArticlesList.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import parse from "html-react-parser";


const ArticlesList = ({ articles }) => {
  const fallbackImage = "/test.jpg";

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  // Reverse articles order
  const reversedArticles = articles;

  // Calculate the articles to display on the current page
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = reversedArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Calculate total pages
  const totalPages = Math.ceil(reversedArticles.length / articlesPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate pagination numbers dynamically
  const generatePaginationNumbers = () => {
    let paginationNumbers = [1,2,3,4,5,6,7,8,9,10];
    
    return paginationNumbers;
  };

  return (
    <section id="all-articles" className="articles-list">
      <h2 className="section-title">All Articles</h2>
      {currentArticles.map((article) => (
        <div key={article._id} className="articles-list-card">
          <img
            src={article.link || fallbackImage}
            alt={article.title}
            onError={(e) => (e.target.src = fallbackImage)}
            className="articles-list-image"
          />
          <div className="articles-list-content">
            <h3>{article.title}</h3>
            <div className="articles-list-sample">{parse(article.content.slice(0, 100))}</div>
            <p className="articles-list-meta">
              By {article.creator} | {new Date(article.pubDate).toLocaleDateString()}
            </p>
            <Link to={`/articles/${article._id}`} className="read-more-button">
              Read More
            </Link>
          </div>
        </div>
      ))}

      {/* Pagination Bar */}
      <div className="pagination-bar">
        {generatePaginationNumbers().map((pageNumber, index) =>
          typeof pageNumber === "number" ? (
            <button
              key={index}
              className={`pagination-button ${
                currentPage === pageNumber ? "active" : ""
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ) : (
            <span key={index} className="pagination-ellipsis">
              {pageNumber}
            </span>
          )
        )}
      </div>
    </section>
  );
};

export default ArticlesList;
