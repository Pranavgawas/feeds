import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, logout } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import "../Components/Feed.css";

function Feeds() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem('userId', currentUser.uid);
        localStorage.setItem('username', currentUser.displayName || currentUser.email);
      } else {
        navigate('/Login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      return;
    }

    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      
      await createPost(userId, content, username);
      setContent('');
    } catch (error) {
      console.error('Error adding post:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleMypost = () => {
    navigate('/MyPost');
  };

  const handleOtherpost = () => {
    navigate('/OtherPost');
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      navigate('/Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) {
    return (
      <div className="feed">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feed">
      <div className="feed-header">
        <div className="user-info">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="user-avatar" />
          ) : (
            <div className="user-avatar-placeholder">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="user-details">
            <h3>{user.displayName || user.email.split('@')[0]}</h3>
            <p>{user.email}</p>
          </div>
        </div>
        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
          </svg>
          Logout
        </button>
      </div>

      <div className='feed-card'>
        <h2>Create a Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="new-post">What's on your mind?</label>
            <textarea
              id="new-post"
              className="form-control"
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary btn-create-post"
            disabled={loading || !content.trim()}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Posting...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                </svg>
                Create Post
              </>
            )}
          </button>
        </form>

        <div className="post-actions">
          <button className="btn btn-outline-primary" onClick={handleMypost}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
            </svg>
            My Posts
          </button>
          <button className="btn btn-outline-success" onClick={handleOtherpost}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
            </svg>
            Community Posts
          </button>
        </div>
      </div>
    </div>
  );
}

export default Feeds;
