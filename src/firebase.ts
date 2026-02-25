import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC1phDEwFAqMKdBk5R7sVb0yf87UOgIyis",
  authDomain: "rrepohub.firebaseapp.com",
  projectId: "rrepohub",
  storageBucket: "rrepohub.firebasestorage.app",
  messagingSenderId: "337942603496",
  appId: "1:337942603496:web:d37b2ba55d37c95cc30b5d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
