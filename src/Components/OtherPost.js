import React, { useState, useEffect } from 'react';
import '../Components/OtherPost.css';

export default function OtherPost({ user_id }) {
  const [otherPost, setOtherPost] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/otherpost/1`)
      .then((response) => response.json())
      .then((data) => {
        setOtherPost(data);
      })
      .catch((error) => {
        console.error('Error Fetching data: ', error);
      });
  }, [user_id]);

  return (
    <>
      {otherPost.map((post) => (
        <div className="other-post-item" key={post.id}>
          <div className="other-post-item-card">
            <p>Post: {post.post}</p>
            <p>Date: {new Date(post.date).toLocaleString()}</p>
            <p>Created by: {post.user.username}</p>
          </div>
        </div>
      ))}
    </>
  );
}
