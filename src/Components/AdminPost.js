import React, { useState, useEffect } from 'react';
import '../Components/MyPost.css';


function AdminPost({ user_id }) {
  const [myPost, setMyPost] = useState([]);


  useEffect(() => {
    fetch(`http://localhost:8080/api/otherpost/1`)
      .then((response) => response.json())
      .then((data) => {
        setMyPost(data);
      })
      .catch((error) => {
        console.error('Error Fetching data: ', error);
      });
  }, [user_id]);

  const handleDelete = async (post_id) => {
  try {
    const response = await fetch(`http://localhost:8080/api/delete/1`, {
      method: 'DELETE',
    });
    if (response.ok) {
      alert('Post deleted successfully!');
      // Optionally, you can update the state or fetch the updated list of posts
    } else {
      throw new Error('Failed to delete post');
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    alert('Failed to delete post');
  }
};


  const handleApprove = (post_id) => {
    alert("Approved!!!");
  };

  return (
    <>
      {myPost.map((post) => (
        <div className="post-item" key={post.id}>

          <div className="post-item-card">
            
            <p>Post: {post.post}</p>
            <p>Date:  {new Date(post.date).toLocaleString()}</p>
            <p>Created by: {post.user.username}</p>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
            <button onClick={() => handleApprove(post.id)}>Approve</button>
          </div>

        </div>
      ))}
    </>
  );
}

export default AdminPost;
