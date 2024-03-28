import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Components/Feed.css";

function Feeds() {
  const [content, setContent] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/addpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post: content }), // Send the content as JSON
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

  const handleAdmin = () => {
    // Fetch admin status from the API
    fetch('http://localhost/api/isadmin')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch admin status');
        }
        return response.json();
      })
      .then(data => {
        const isAdmin = data.isAdmin; // Assuming the API returns { isAdmin: true/false }
        if (isAdmin) {
          // If the user is an admin, navigate to the AdminPost route
          navigate('/AdminPost');
        } else {
          // If the user is not an admin, display an error message or perform any other desired action
          alert('You do not have permission to access this page.');
        }
      })
      .catch(error => {
        console.error('Error fetching admin status:', error);
        // Handle the error, e.g., display an error message to the user
        alert('Failed to fetch admin status. Please try again later.');
      });
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
        <button onClick={handleAdmin}>Admin</button>
        <ul>
          {filteredPosts.map((post) => (
            <li key={post.id}>
              <p>{post.content}</p>
              <p>By: {post.user}</p>
              <p>Posted: {post.timestamp}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Feeds;
