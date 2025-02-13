import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBlNdM-3D3ThyuMA8t7uG5XTOyD9OkFvNI",
    authDomain: "tmaz-10fd2.firebaseapp.com",
    projectId: "tmaz-10fd2",
    storageBucket: "tmaz-10fd2.firebasestorage.app",
    messagingSenderId: "705911798895",
    appId: "1:705911798895:web:d449f7f9549033303f219a",
    measurementId: "G-KWQ2RNTT6N"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User signed in:", result.user);
    return result.user;
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

export { auth, provider, signInWithGoogle };
