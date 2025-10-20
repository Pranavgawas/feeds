# Admin Setup Guide

## How to Grant Admin Privileges to admin@gmail.com

### Method 1: Using the Setup Admin Page (Recommended)

1. **Register the admin account** (if not already done):
   - Go to http://localhost:3001/register
   - Register with email: `admin@gmail.com`
   - Choose a password and username

2. **Login with the admin account**:
   - Go to http://localhost:3001/login
   - Login with `admin@gmail.com` and your password

3. **Access the Admin Setup page**:
   - Navigate to http://localhost:3001/setup-admin
   - Click the "Grant Admin Privileges" button
   - You should see a success message: "✅ Admin privileges granted to admin@gmail.com"

4. **Access the Admin Dashboard**:
   - Go to http://localhost:3001/adminlogin
   - Login with `admin@gmail.com`
   - You will be redirected to the Admin Dashboard at /adminpost

### Method 2: Using Firebase Console

1. **Go to Firebase Console**:
   - Visit https://console.firebase.google.com/
   - Select your project: `feed-app-baf89`

2. **Navigate to Firestore Database**:
   - Click on "Firestore Database" in the left sidebar

3. **Find the user document**:
   - Open the `users` collection
   - Find the document with the email `admin@gmail.com`
   - You can search by the `email` field

4. **Add the admin field**:
   - Click on the user document
   - Add a new field:
     - Field name: `isAdmin`
     - Field type: `boolean`
     - Value: `true`
   - Click "Update"

### Method 3: Using Browser Console (Developer)

1. **Login to the app** with `admin@gmail.com`

2. **Open Browser Console**:
   - Press F12 or right-click and select "Inspect"
   - Go to the Console tab

3. **Run this code**:
   ```javascript
   import { doc, setDoc, getDoc } from 'firebase/firestore';
   import { db, auth } from './firebase';

   const userId = auth.currentUser.uid;
   const userRef = doc(db, "users", userId);
   
   getDoc(userRef).then(userDoc => {
     if (userDoc.exists()) {
       setDoc(userRef, { ...userDoc.data(), isAdmin: true }, { merge: true })
         .then(() => console.log("✅ Admin privileges granted!"));
     }
   });
   ```

## Verifying Admin Access

After setting up admin privileges:

1. **Logout and Login again** as admin@gmail.com
2. Go to http://localhost:3001/adminlogin
3. Login with admin@gmail.com credentials
4. You should be redirected to the Admin Dashboard
5. You can now approve or delete pending posts

## Admin Dashboard Features

- **View pending posts**: See all posts waiting for approval
- **Approve posts**: Click "Approve" to make a post visible to all users
- **Delete posts**: Remove inappropriate or spam posts
- **Pending count**: See how many posts are waiting for review
- **Author information**: View who created each post

## Troubleshooting

### "Access denied. Admin privileges required"
- Make sure the `isAdmin` field is set to `true` in Firestore
- Try logging out and logging in again
- Check that you're using the correct email address

### Can't see pending posts
- Make sure users have created posts
- Posts are created as "pending" by default
- Check Firestore console to verify posts exist

### Admin field not persisting
- Check Firestore rules allow writing to the users collection
- Make sure you're logged in when setting admin privileges
- Verify the user document exists in the `users` collection

## Security Notes

⚠️ **Important**: 
- The `/setup-admin` route should be removed in production
- Use Firebase Console to manage admin users in production
- Consider implementing proper admin role management
- Add Firebase Security Rules to protect admin operations

## Next Steps

1. Remove the `/setup-admin` route before deploying to production
2. Set up proper Firestore security rules
3. Consider adding role-based access control (RBAC)
4. Add audit logging for admin actions
