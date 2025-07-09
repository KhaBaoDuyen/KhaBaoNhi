// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAm2IHYdZYxlu7JAhSVKeBrXK17HPuBgFQ",
  authDomain: "happy-day-baonhi.firebaseapp.com",
  projectId: "happy-day-baonhi",
  storageBucket: "happy-day-baonhi.firebasestorage.app",
  messagingSenderId: "109860491227",
  appId: "1:109860491227:web:eed4e775404ef236f6e1fe",
  measurementId: "G-4EH2BPLYZG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
