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
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#6366f1', marginBottom: '2rem' }}>Content Manager</h2>
                <nav>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <Link to="/admin/new" style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        borderRadius: '6px',
                        background: '#eef2ff',
                        color: '#6366f1',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.75rem' }}>
                          <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        New Article
                      </Link>
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <Link to="/admin/articles" style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        borderRadius: '6px',
                        color: '#64748b',
                        textDecoration: 'none'
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.75rem' }}>
                          <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
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
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>Create New Article</h1>
            <p style={{ color: '#64748b' }}>Fill out the form to publish a new article</p>
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
              <small style={{ display: 'block', marginTop: '0.5rem', color: '#64748b' }}>
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
                  <svg className={styles.spinner} viewBox="0 0 24 24" width="20" height="20">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.415, 31.415" strokeOpacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"></path>
                  </svg>
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