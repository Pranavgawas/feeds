import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import '../Components/Login.css';

function SetupAdmin() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetupAdmin = async () => {
    setLoading(true);
    setMessage('');

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setMessage('❌ No user is logged in. Please login with admin@gmail.com first.');
        setLoading(false);
        return;
      }

      try {
        const userId = currentUser.uid;
        const userEmail = currentUser.email;
        const userRef = doc(db, "users", userId);

        // Check if user document exists
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          // Update existing user to make them admin
          await setDoc(userRef, {
            ...userDoc.data(),
            isAdmin: true
          }, { merge: true });
          setMessage(`✅ Admin privileges granted to ${userEmail}`);
        } else {
          // Create new user document with admin privileges
          await setDoc(userRef, {
            uid: userId,
            email: userEmail,
            displayName: currentUser.displayName || userEmail.split('@')[0],
            isAdmin: true,
            createdAt: new Date()
          });
          setMessage(`✅ Created admin account for ${userEmail}`);
        }

        console.log('Admin setup complete!');
        
      } catch (error) {
        console.error('Error setting up admin:', error);
        setMessage(`❌ Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup
    setTimeout(() => unsubscribe(), 3000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Admin Setup</h1>
          <p className="subtitle">Grant admin privileges to current user</p>
        </div>

        {message && (
          <div className={`error-message ${message.includes('✅') ? 'success-message' : ''}`}>
            {message}
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <p style={{ color: '#718096', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Make sure you are logged in with the account you want to make admin.
            <br />
            <strong>Current email will be granted admin access.</strong>
          </p>
        </div>

        <button 
          className="btn-submit" 
          onClick={handleSetupAdmin}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Setting up...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                <path fillRule="evenodd" d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
              </svg>
              Grant Admin Privileges
            </>
          )}
        </button>

        <div className="login-footer">
          <p style={{ fontSize: '0.85rem', color: '#a0aec0' }}>
            ⚠️ Only use this for initial admin setup
          </p>
        </div>
      </div>
    </div>
  );
}

export default SetupAdmin;
