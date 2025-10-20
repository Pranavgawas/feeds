import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './Welcome.css';

function NavigationBar() {
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await auth.signOut();
            console.log('User logged out');
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Don't show navbar on home page
    if (location.pathname === '/') {
        return null;
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand" onClick={closeMenu}>
                    Feed Application
                </Link>
                
                <button className="navbar-toggle" onClick={toggleMenu}>
                    <span className="navbar-toggle-icon"></span>
                    <span className="navbar-toggle-icon"></span>
                    <span className="navbar-toggle-icon"></span>
                </button>

                <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
                    {!user ? (
                        <>
                            <Link to="/" className="navbar-link" onClick={closeMenu}>
                                Home
                            </Link>
                            <Link to="/login" className="navbar-link" onClick={closeMenu}>
                                Login
                            </Link>
                            <Link to="/register" className="navbar-link" onClick={closeMenu}>
                                Register
                            </Link>
                            <Link to="/adminlogin" className="navbar-link" onClick={closeMenu}>
                                Admin
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/feeds" className="navbar-link" onClick={closeMenu}>
                                Create Post
                            </Link>
                            <Link to="/mypost" className="navbar-link" onClick={closeMenu}>
                                My Posts
                            </Link>
                            <Link to="/otherpost" className="navbar-link" onClick={closeMenu}>
                                Community
                            </Link>
                            <button className="navbar-link navbar-btn" onClick={(e) => { handleLogout(e); closeMenu(); }}>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavigationBar;