import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Components/Login.css";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  const fetchUserId = async (username) => {
    try {
      const response = await fetch(`http://localhost:8080/api/user/getuserid/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user ID');
      }
      const data = await response.json();
      setUserId(data);
      localStorage.setItem('userId', data);
      console.log(data); // Log the user ID to the console
    } catch (error) {
      console.error('Failed to fetch user ID:', error.message);
      setError('Failed to fetch user ID');
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const isValidUser = await response.json();
      if (isValidUser) {
        setError('');
        localStorage.setItem('username', username);
        await fetchUserId(username);
        navigate('/Feeds');
      } else {
        setError('Invalid username or password / you maybe Admin');
      }
    } catch (error) {
      console.error('Failed to login:', error.message);
      setError('Failed to login');
    }
  };

  const handleRegister = () => {
    navigate('/Register');
  };

  return (
    <div className="login-container">
      <div className='login-card'>
        <h1>Login Page</h1>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
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
          <button type="button" onClick={handleRegister}>Register</button>
        </form>
      </div>
    </div>
  );
}

export default Login;