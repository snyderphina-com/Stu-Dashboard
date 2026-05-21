// Import the functions you need from the SDKs you need
import { initializeApp,getApps,getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB70u-xtOXjCk3PeXej6UX9FRC5Cvf6ksk",
  authDomain: "student-login-18f52.firebaseapp.com",
  projectId: "student-login-18f52",
  storageBucket: "student-login-18f52.appspot.com",
  messagingSenderId: "949723969355",
  appId: "1:949723969355:web:922027b360fcc7d9939ace",
  measurementId: "G-TE3TFWV3G4"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;