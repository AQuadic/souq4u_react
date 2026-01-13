// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRpxFqrKLULWifX8ARI06w8MjgitMgqVs",
  authDomain: "souq-4u.firebaseapp.com",
  projectId: "souq-4u",
  storageBucket: "souq-4u.firebasestorage.app",
  messagingSenderId: "701990273855",
  appId: "1:701990273855:web:d31afb1654315d4e2e498a",
  measurementId: "G-XXH5BCZRXF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
