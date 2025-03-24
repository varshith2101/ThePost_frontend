// components/CarouselComponent.js
import React from "react";
import { Link } from "react-router-dom";

const CarouselComponent = ({ articles }) => {
  const fallbackImage = "/test.jpg";

  return (
    <section className="carousel-section">
      <h2 className="section-title">Featured Articles</h2>
      <div className="carousel">
        {articles.map((article) => (
          <div key={article._id} className="carousel-item">
            <img
              src={article.link || fallbackImage}
              alt={article.title}
              className="carousel-image"
              onError={(e) => (e.target.src = fallbackImage)}
            />
            <div className="carousel-overlay">
              <h3 className="carousel-title">{article.title}</h3>
              <p className="carousel-author">By {article.creator}</p>
              <Link to={`/articles/${article._id}`} className="carousel-read-more">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CarouselComponent;
