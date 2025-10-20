import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, checkIfAdmin } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import "../Components/Login.css";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/Feeds');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const user = await loginWithEmail(email, password);
      
      // Check if user is admin
      const isAdmin = await checkIfAdmin(user.uid);
      
      if (isAdmin) {
        setError('Admin users should use the Admin Login page');
        setLoading(false);
        return;
      }

      // Store user info in localStorage
      localStorage.setItem('userId', user.uid);
      localStorage.setItem('username', user.displayName || user.email);
      localStorage.setItem('userEmail', user.email);

      // Navigate to feeds
      navigate('/Feeds');
    } catch (error) {
      console.error('Failed to login:', error);
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Failed to login. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/Register');
  };

  const handleAdminLogin = () => {
    navigate('/AdminLogin');
  };

  return (
    <div className="login-container">
      <div className='login-card'>
        <div className="login-header">
          <h1>Welcome Back!</h1>
          <p className="login-subtitle">Sign in to continue to your feed</p>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-login"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="other-options">
          <button 
            type="button" 
            className="btn btn-outline-primary w-100 mb-2"
            onClick={handleRegister}
          >
            Create New Account
          </button>
          <button 
            type="button" 
            className="btn btn-link w-100"
            onClick={handleAdminLogin}
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;