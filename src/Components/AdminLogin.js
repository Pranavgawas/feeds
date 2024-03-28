import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Components/Login.css";

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const checkAdmin = async () => {
    const user = { username, password }; // Create user object
    try {
      const response = await fetch('http://localhost:8080/api/login/isAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const isAdmin = await response.json();
      if (isAdmin) {
        setError('');
        navigate('/adminpost');
      } else {
        setError('Not authorized');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('Failed to check admin status');
    }
  };

  return (
    <div className="login-container">
      <div className='login-card'>
        <h1>Admin Login Page</h1>
        {error && <div className="error">{error}</div>}
        <form onSubmit={e => { e.preventDefault(); checkAdmin(); }}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
