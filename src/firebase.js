// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, setDoc, serverTimestamp } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBU0dV0s-gBPXMSlFsm3L4ylCwSK7vJXtM",
  authDomain: "feed-app-baf89.firebaseapp.com",
  projectId: "feed-app-baf89",
  storageBucket: "feed-app-baf89.firebasestorage.app",
  messagingSenderId: "164728623505",
  appId: "1:164728623505:web:60c37c9beb9c4ef46a8a30",
  measurementId: "G-5K8B5SVFV3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Email/Password Auth Functions
export const registerWithEmail = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with username
    await updateProfile(user, {
      displayName: username
    });
    
    // Create user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: username,
      photoURL: null,
      isAdmin: false,
      createdAt: serverTimestamp()
    });
    
    return user;
  } catch (error) {
    console.error("Error registering with email:", error);
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in with email:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Post Functions
export const createPost = async (userId, content, userDisplayName) => {
  try {
    const postRef = await addDoc(collection(db, "posts"), {
      userId,
      content,
      displayName: userDisplayName,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return postRef.id;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const getUserPosts = async (userId) => {
  try {
    const q = query(
      collection(db, "posts"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by createdAt manually since we can't use orderBy without an index
    return posts.sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      const aTime = a.createdAt.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime();
      const bTime = b.createdAt.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt).getTime();
      return bTime - aTime;
    });
  } catch (error) {
    console.error("Error getting user posts:", error);
    throw error;
  }
};

export const getApprovedPosts = async () => {
  try {
    const q = query(
      collection(db, "posts"),
      where("status", "==", "approved")
    );
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by createdAt manually
    return posts.sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      const aTime = a.createdAt.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime();
      const bTime = b.createdAt.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt).getTime();
      return bTime - aTime;
    });
  } catch (error) {
    console.error("Error getting approved posts:", error);
    throw error;
  }
};

export const getPendingPosts = async () => {
  try {
    const q = query(
      collection(db, "posts"),
      where("status", "==", "pending")
    );
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by createdAt manually
    return posts.sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      const aTime = a.createdAt.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime();
      const bTime = b.createdAt.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt).getTime();
      return bTime - aTime;
    });
  } catch (error) {
    console.error("Error getting pending posts:", error);
    throw error;
  }
};

export const updatePost = async (postId, content) => {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      content,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const approvePost = async (postId) => {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      status: "approved",
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error approving post:", error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, "posts", postId));
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export const checkIfAdmin = async (userId) => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", userId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return userData.isAdmin === true;
    }
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Helper function to set admin privileges
export const setAdminPrivileges = async (userId, isAdmin = true) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      isAdmin: isAdmin
    });
    console.log(`Admin privileges ${isAdmin ? 'granted' : 'revoked'} for user ${userId}`);
    return true;
  } catch (error) {
    console.error("Error setting admin privileges:", error);
    throw error;
  }
};

export { auth, db, analytics };
