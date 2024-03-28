import React, { useState } from 'react';
import "../Components/UpdatePost.css";

function UpdatePost({ post }) {
  // const [content, setContent] = useState(post.content);
  // const [date, setDate] = useState(post.date);

  // const handleUpdate = () => {
  //   // Implement the update logic here, e.g., send a PUT request to update the post
  //   console.log('Update post with content:', content, 'and date:', date);
  // };

  return (
    <div className="Update-Post">
      <div className='Update-post-Cards'>
        <h2>Update Post</h2>
        {/* <label htmlFor="content">Content:</label> */}
        <textarea
          id="content"
          // value={content}
          // onChange={(e) => setContent(e.target.value)}
          required
        />
        {/* <label htmlFor="date">Date:</label> */}
        <input
          type="date"
          id="date"
          // value={date}
          // onChange={(e) => setDate(e.target.value)}
          required
        />
        <button >Update Post</button>
      </div>
    </div>
  );
}

export default UpdatePost;
