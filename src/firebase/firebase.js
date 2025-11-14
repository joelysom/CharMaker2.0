// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwM5QNo0lpoSMDliJ0_VoA-vHJZug58K8",
  authDomain: "charmaker-senac.firebaseapp.com",
  projectId: "charmaker-senac",
  storageBucket: "charmaker-senac.firebasestorage.app",
  messagingSenderId: "1047305492427",
  appId: "1:1047305492427:web:788c96e3ee167401f3c84e",
  measurementId: "G-E188RW5NBP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;