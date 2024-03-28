import React, { useState, useEffect } from 'react';
import '../Components/MyPost.css';
import { useNavigate } from 'react-router-dom';

function MyPost({ user_id }) {
  const [myPost, setMyPost] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetch(`http://localhost:8080/api/user/mypost/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMyPost(data);
          console.log(data);
        } else {
          const dataArray = Object.values(data); // Convert object to array
          setMyPost(dataArray);
        }
      })
      .catch((error) => {
        console.error('Error Fetching data: ', error);
      });
  }, [user_id]);

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/user/delete/${postId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Post deleted successfully!');
        window.location.reload();
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
            <p>Date: {post.date && post.date.length === 3 ? new Date(post.date[0], post.date[1], post.date[2]).toLocaleString() : 'Invalid Date'}</p>
            {post.user && post.user.username && (
              <p>Created by: {post.user.username}</p>
            )}
            <p>Approved:  <div className={`circle ${post.approved ? 'approved' : 'not-approved'}`}></div></p>
        

            <button onClick={() => handleUpdate(post.post_id)}>Update</button>
            <button onClick={() => handleDelete(post.post_id)}>Delete</button>
          </div>
        </div>
      ))}
    </>
  );
}

export default MyPost;