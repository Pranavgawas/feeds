import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApprovedPosts } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import '../Components/OtherPost.css';

export default function OtherPost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetchPosts();
      } else {
        navigate('/Login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const approvedPosts = await getApprovedPosts();
      setPosts(approvedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/Feeds');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Just now';
    }
  };

  if (loading) {
    return (
      <div className="other-post-container">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading community posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="other-post-container">
      <div className="other-post-header">
        <button className="btn btn-outline-secondary" onClick={handleBack}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
          Back to Feed
        </button>
        <h1>Community Posts ({posts.length})</h1>
      </div>

      {posts.length === 0 ? (
        <div className="no-posts">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
          </svg>
          <h3>No approved posts yet</h3>
          <p>Be the first to share something with the community!</p>
          <button className="btn btn-primary" onClick={handleBack}>Create a Post</button>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div className="other-post-item" key={post.id}>
              <div className="other-post-item-card">
                <div className="post-author">
                  <div className="author-avatar">
                    {post.displayName ? post.displayName.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="author-info">
                    <h4>{post.displayName || 'Anonymous'}</h4>
                    <p className="post-time">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                      </svg>
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div className="post-content">
                  <p>{post.content}</p>
                </div>

                <div className="post-footer">
                  <span className="status-badge status-approved">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                    </svg>
                    Approved
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}