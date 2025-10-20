import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { updatePost } from '../firebase';
import "../Components/UpdatePost.css";

function UpdatePost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get post data from navigation state
    if (location.state && location.state.post) {
      setContent(location.state.post.content);
    }
  }, [location]);

  const handleUpdate = async () => {
    if (!content.trim()) {
      return;
    }

    setLoading(true);
    try {
      await updatePost(postId, content);
      navigate('/MyPost');
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/MyPost');
  };

  return (
    <div className="update-post-container">
      <div className='update-post-card'>
        <div className="update-header">
          <h2>Update Post</h2>
          <p className="update-subtitle">Edit your post content</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Post Content</label>
          <textarea
            id="content"
            className="form-control"
            rows="6"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="button-group">
          <button 
            className="btn btn-outline-secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleUpdate}
            disabled={loading || !content.trim()}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Updating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
                Update Post
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdatePost;
