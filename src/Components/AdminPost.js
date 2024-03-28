import React, { useState, useEffect } from 'react';
import '../Components/MyPost.css';

function AdminPost() {
  const [myPost, setMyPost] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/user/getallUnApprovedPost')
      .then((response) => response.json())
      .then((data) => {
        setMyPost(data);
      })
      .catch((error) => {
        console.error('Error Fetching data: ', error);
      });
  }, []);

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/user/delete/${postId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Post deleted successfully!');
        window.location.reload();
        // Optionally, you can update the state or fetch the updated list of posts
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleApprove = async (postId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/user/approve/${postId}`, {
        method: 'PUT',
      });
      if (response.ok) {
        alert('Post approved successfully!');
        window.location.reload();
      } else {
        throw new Error('Failed to approve post');
      }
    } catch (error) {
      console.error('Error approving post:', error);
      alert('Failed to approve post');
    }
  };

  return (
    <>
      {myPost.map((post) => (
        <div className="post-item" key={post.id}>
          <div className="post-item-card">
            <p>Post: {post.post}</p>
            <p>Date: {new Date(post.date).toLocaleString()}</p>
            <p>Created by: {post.user.username}</p>
            <button onClick={() => handleDelete(post.post_id)}>Delete</button>
            <button onClick={() => handleApprove(post.post_id)}>Approve</button>
          </div>
        </div>
      ))}
    </>
  );
}

export default AdminPost;
