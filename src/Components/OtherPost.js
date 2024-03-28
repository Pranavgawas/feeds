import React, { useState, useEffect } from 'react';
import '../Components/OtherPost.css';

export default function OtherPost({ user_id }) {
  const [otherPost, setOtherPost] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetch(`http://localhost:8080/api/user/otherpost/${userId}`)
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
            <p>Approved:  <div className={`circle ${post.approved ? 'approved' : 'not-approved'}`}></div></p>
        
          </div>
        </div>
      ))}
    </>
  );
}
