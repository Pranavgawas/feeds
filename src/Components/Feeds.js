import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Components/Feed.css";

function Feeds() {
  const [content, setContent] = useState('');
  const userId = localStorage.getItem('userId');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/addpost/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content ), // Send the content as JSON
      });
      if (response.ok) {
        setContent('');
        alert('Post added successfully!');
      } else {
        throw new Error('Failed to add post');
      }
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to add post');
    }
  };
  
  const handleMypost = () => {
    navigate('/MyPost');
  };

  const handleOtherpost = () => {
    navigate('/OtherPost');
  };



  return (
    <div className="feed">
      <div className='feed-card'>
        <h2>Feeds</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="new-post">Enter your post:</label>
          <textarea
            id="new-post"
            placeholder="Enter your post"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit">Create Post</button>
        </form>
        <button onClick={handleMypost}>View My Posts</button>
        <button onClick={handleOtherpost}>View Other Users Posts</button>


      </div>
    </div>
  );
}

export default Feeds;
