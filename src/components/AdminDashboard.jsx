import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './AdminDashboard.module.css';
import { Link } from 'react-router-dom';
import Tiptap from '../rich_editor/Tiptap';

const AdminDashboard = ({articles}) => {
  const [articleData, setArticleData] = useState({
    title: '',
    link: '',
    pubDate: new Date().toISOString().split('T')[0], // Default to today
    creator: '',
    guid: '', // Should be generated or entered
    content: '',
    post_id: '', // Should be unique
    post_date: new Date().toISOString().split('T')[0],
    post_modified: new Date().toISOString().split('T')[0],
    post_name: '',
    category: 'Technology',
    views: 0 // Default value
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const { currentUser } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setArticleData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (content) => {
    setArticleData(prev => ({
      ...prev,
      content
    }));
  };

  const generateGuid = () => {
    // Simple GUID generator - you might want a more robust solution
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleGenerateFields = () => {
    setArticleData(prev => ({
      ...prev,
      guid: generateGuid(),
      post_id: Date.now().toString(),
      post_name: prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      link: `${window.location.origin}/articles/${prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
      creator: currentUser.username || 'admin'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Validate required fields
      const requiredFields = [
        'title', 'link', 'pubDate', 'creator', 'guid',
        'content', 'post_id', 'post_date', 'post_modified', 'category'
      ];
      
      const missingFields = requiredFields.filter(field => !articleData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          ...articleData,
          pubDate: new Date(articleData.pubDate).toISOString(),
          post_date: new Date(articleData.post_date).toISOString(),
          post_modified: new Date(articleData.post_modified).toISOString(),
          views: 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit article');
      }

      const data = await response.json();
      setSubmitMessage('Article published successfully!');
      // Reset form
      setArticleData({
        title: '',
        link: '',
        pubDate: new Date().toISOString().split('T')[0],
        creator: '',
        guid: '',
        content: '',
        post_id: '',
        post_date: new Date().toISOString().split('T')[0],
        post_modified: new Date().toISOString().split('T')[0],
        post_name: '',
        category: 'Technology',
        views: 0
      });
    } catch (error) {
      setSubmitMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Sidebar remains unchanged */}
      <div className={styles.sidebar}>
  <div style={{ padding: '0 2rem' }}>
    <h2 style={{ 
      fontSize: '1.25rem', 
      fontWeight: '600', 
      color: 'var(--accent)', 
      marginBottom: '2rem' 
    }}>
      Content Manager
    </h2>
    <nav>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '0.5rem' }}>
          <Link 
            to="/admin/new" 
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              background: 'rgba(240, 103, 57, 0.1)',
              color: 'var(--accent)',
              textDecoration: 'none',
              fontWeight: '500',
              borderLeft: '3px solid var(--accent)',
              transition: 'all 0.2s ease'
            }}
            activeStyle={{
              background: 'rgba(240, 103, 57, 0.2)'
            }}
          >
            New Article
          </Link>
        </li>
        <li style={{ marginBottom: '0.5rem' }}>
          <Link 
            to="/admin/articles" 
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            activeStyle={{
              background: 'rgba(240, 103, 57, 0.1)',
              color: 'var(--accent)',
              borderLeft: '3px solid var(--accent)'
            }}
          >
            Articles
          </Link>
        </li>
      </ul>
    </nav>
  </div>
</div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#f5f5f5', marginBottom: '0.25rem' }}>Create New Article</h1>
            <p style={{ color: '#b3b3b3' }}>Fill out the form to publish a new article</p>
          </div>
          <div className={styles.userAvatar}>
            {currentUser?.username?.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className={styles.formCard}>
          {submitMessage && (
            <div className={`${styles.notification} ${submitMessage.includes('success') ? styles.success : styles.error}`}>
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>Article Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={articleData.title}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Enter article title"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.label}>Category*</label>
                <select
                  id="category"
                  name="category"
                  value={articleData.category}
                  onChange={handleChange}
                  className={styles.input}
                  required
                >
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Health">Health</option>
                  <option value="Science">Science</option>
                  <option value="Entertainment">Entertainment</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
              <div className={styles.formGroup}>
                <label htmlFor="pubDate" className={styles.label}>Publication Date*</label>
                <input
                  type="date"
                  id="pubDate"
                  name="pubDate"
                  value={articleData.pubDate}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="creator" className={styles.label}>Creator*</label>
                <input
                  type="text"
                  id="creator"
                  name="creator"
                  value={articleData.creator}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Author name"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
              <label htmlFor="content" className={styles.label}>Content*</label>
              <Tiptap 
                content={articleData.content} 
                setContent={handleContentChange} 
              />
            </div>

            <div style={{ margin: '1rem 0' }}>
              <button 
                type="button" 
                onClick={handleGenerateFields}
                className={styles.generateButton}
              >
                Generate Missing Fields
              </button>
              <small style={{ display: 'block', marginTop: '0.5rem', color: '#b3b3b3' }}>
                This will generate GUID, post_id, post_name, and link based on title
              </small>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
              <div className={styles.formGroup}>
                <label htmlFor="guid" className={styles.label}>GUID*</label>
                <input
                  type="text"
                  id="guid"
                  name="guid"
                  value={articleData.guid}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Unique identifier"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="post_id" className={styles.label}>Post ID*</label>
                <input
                  type="text"
                  id="post_id"
                  name="post_id"
                  value={articleData.post_id}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Unique post ID"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
              <div className={styles.formGroup}>
                <label htmlFor="post_date" className={styles.label}>Post Date*</label>
                <input
                  type="date"
                  id="post_date"
                  name="post_date"
                  value={articleData.post_date}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="post_modified" className={styles.label}>Post Modified*</label>
                <input
                  type="date"
                  id="post_modified"
                  name="post_modified"
                  value={articleData.post_modified}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
              <div className={styles.formGroup}>
                <label htmlFor="post_name" className={styles.label}>Post Name</label>
                <input
                  type="text"
                  id="post_name"
                  name="post_name"
                  value={articleData.post_name}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="URL-friendly name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="link" className={styles.label}>Link*</label>
                <input
                  type="text"
                  id="link"
                  name="link"
                  value={articleData.link}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Article URL"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
              style={{ marginTop: '2rem' }}
            >
              {isSubmitting ? (
                <>
                  Publishing...
                </>
              ) : 'Publish Article'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;