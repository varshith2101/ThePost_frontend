import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Tiptap from '../rich_editor/Tiptap';
import styles from './AdminDashboard.module.css'; // Reuse AdminDashboard styles or create new ones

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [article, setArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    creator: '',
    pubDate: '',
    category: 'Technology',
    content: ''
  });
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch article data on component mount
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        const data = await response.json();
        
        setArticle(data);
        setFormData({
          title: data.title,
          creator: data.creator,
          pubDate: new Date(data.pubDate).toISOString().split('T')[0],
          category: data.category,
          content: data.content
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsChanged(true);
  };

  // Handle content changes from Tiptap
  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
    setIsChanged(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updatedArticle = {
        ...article,
        ...formData,
        pubDate: new Date(formData.pubDate).toISOString(),
        post_modified: new Date().toISOString()
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(updatedArticle)
      });

      if (!response.ok) {
        throw new Error('Failed to update article');
      }

      // Redirect to articles list or show success message
      navigate('/admin/articles');
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading article...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!article) {
    return <div className={styles.error}>Article not found</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Edit Article</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="creator">Author</label>
          <input
            type="text"
            id="creator"
            name="creator"
            value={formData.creator}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="pubDate">Publishing Date</label>
          <input
            type="date"
            id="pubDate"
            name="pubDate"
            value={formData.pubDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Health">Health</option>
            <option value="Science">Science</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Content</label>
          <Tiptap 
            content={formData.content} 
            setContent={handleContentChange} 
          />
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button
          type="submit"
          disabled={!isChanged}
          className={styles.submitButton}
        >
          Update Article
        </button>
      </form>
    </div>
  );
};

export default EditArticle;