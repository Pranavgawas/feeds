// Script to set admin privileges for admin@gmail.com
// Run this in the browser console when logged in as admin@gmail.com

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBU0dV0s-gBPXMSlFsm3L4ylCwSK7vJXtM",
  authDomain: "feed-app-baf89.firebaseapp.com",
  projectId: "feed-app-baf89",
  storageBucket: "feed-app-baf89.firebasestorage.app",
  messagingSenderId: "164728623505",
  appId: "1:164728623505:web:60c37c9beb9c4ef46a8a30",
  measurementId: "G-5K8B5SVFV3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function setAdminPrivileges(email) {
  try {
    // First, you need to register the user with this email
    // Then get their userId from authentication
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("No user is currently logged in. Please login first.");
      return;
    }

    if (currentUser.email !== email) {
      console.error(`Current user email (${currentUser.email}) does not match the specified email (${email})`);
      return;
    }

    const userId = currentUser.uid;
    const userRef = doc(db, "users", userId);

    // Check if user document exists
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // Update existing user
      await setDoc(userRef, {
        ...userDoc.data(),
        isAdmin: true
      }, { merge: true });
      console.log(`✅ Admin privileges granted to ${email} (UID: ${userId})`);
    } else {
      // Create new user document with admin privileges
      await setDoc(userRef, {
        uid: userId,
        email: email,
        displayName: currentUser.displayName || "Admin",
        isAdmin: true,
        createdAt: new Date()
      });
      console.log(`✅ Created user document with admin privileges for ${email} (UID: ${userId})`);
    }

    console.log("Admin privileges have been set successfully!");
    console.log("You can now access the admin dashboard at /adminpost");
    
  } catch (error) {
    console.error("Error setting admin privileges:", error);
  }
}

// Call the function
setAdminPrivileges("admin@gmail.com");
