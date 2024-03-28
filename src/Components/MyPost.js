import React, { useState, useEffect } from 'react';
import '../Components/MyPost.css';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

function MyPost({ user_id }) {
  const [myPost, setMyPost] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/api/mypost/1`)
      .then((response) => response.json())
      .then((data) => {
        setMyPost(data);
      })
      .catch((error) => {
        console.error('Error Fetching data: ', error);
      });
  }, [user_id]);

  
  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/delete/1`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Post deleted successfully!');
        // fetchMyPosts(); // Fetch the updated list of posts
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleUpdate = (postId) => {
    navigate(`/UpdatePost/${postId}`);
  };

  return (
    <>
      {myPost.map((post) => (
        <div className="post-item" key={post.post_id}>
          <div className="post-item-card">
            <p>Post: {post.post}</p>
            <p>Date: {new Date(post.date).toLocaleString()}</p>
            <p>Created by: {post.user.username}</p>
            <button onClick={() => handleUpdate(post.post_id)}>Update</button>
            <button onClick={() => handleDelete(post.post_id)}>Delete</button>
          </div>
        </div>
      ))}
    </>
  );
}

export default MyPost;