import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAFSTcYtDXQexmLVD2vTpslRbDrG8xxkk",
  authDomain: "fynance-f9226.firebaseapp.com",
  projectId: "fynance-f9226",
  storageBucket: "fynance-f9226.firebasestorage.app",
  messagingSenderId: "270458736409",
  appId: "1:270458736409:web:75603607822e4fb9567f88",
  measurementId: "G-71YY894H5V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
