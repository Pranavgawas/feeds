import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import "../Components/UpdatePost.css";

function UpdatePost() {
  const { postId } = useParams();
  const [content, setContent] = useState(''); // Provide an initial value

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/user/update/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( content ), // Send the content as JSON
      });
      if (response.ok) {
        alert('Post updated successfully!');
        // Optionally, you can handle the updated post data or perform any other actions
      } else {
        throw new Error('Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    }
  };

  return (
    <div className="Update-Post">
      <div className='Update-post-Cards'>
        <h2>Update Post</h2>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button onClick={handleUpdate}>Update Post</button>
      </div>
    </div>
  );
}

export default UpdatePost;
