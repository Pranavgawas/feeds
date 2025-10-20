import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingPosts, deletePost, approvePost, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import '../Components/AdminPost.css';

function AdminPost() {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchPendingPosts();
      } else {
        navigate('/adminlogin');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchPendingPosts = async () => {
    try {
      setLoading(true);
      const posts = await getPendingPosts();
      // Sort by createdAt, newest first
      const sortedPosts = posts.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB - dateA;
      });
      setPendingPosts(sortedPosts);
      setError('');
    } catch (err) {
      console.error('Error fetching pending posts:', err);
      setError('Failed to load pending posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      console.log('Post deleted successfully');
      // Update the UI by removing the deleted post
      setPendingPosts(pendingPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
    }
  };

  const handleApprove = async (postId) => {
    try {
      await approvePost(postId);
      console.log('Post approved successfully');
      // Update the UI by removing the approved post
      setPendingPosts(pendingPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error approving post:', error);
      setError('Failed to approve post');
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/adminlogin');
  };

  const formatDate = (createdAt) => {
    if (!createdAt) return 'Unknown date';
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading pending posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
            <path fillRule="evenodd" d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
          </svg>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Review and moderate pending posts</p>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
          </svg>
          Logout
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon pending">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{pendingPosts.length}</h3>
            <p>Pending Posts</p>
          </div>
        </div>
      </div>

      {pendingPosts.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
          </svg>
          <h2>All Caught Up!</h2>
          <p>No pending posts to review at the moment.</p>
        </div>
      ) : (
        <div className="posts-grid">
          {pendingPosts.map((post) => (
            <div className="admin-post-card" key={post.id}>
              <div className="post-header">
                <div className="author-info">
                  <div className="author-avatar">
                    {post.userDisplayName ? post.userDisplayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4>{post.userDisplayName || 'Unknown User'}</h4>
                    <span className="post-date">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
                <span className="status-badge pending">Pending Review</span>
              </div>

              <div className="post-content">
                <p>{post.content}</p>
              </div>

              <div className="post-actions">
                <button className="btn-approve" onClick={() => handleApprove(post.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                  </svg>
                  Approve
                </button>
                <button className="btn-delete" onClick={() => handleDelete(post.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPost;
