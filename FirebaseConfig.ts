import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1PT1gOqgWuY8OvBTErWgXDyN3ynk15-c",
  authDomain: "gacha-8d56f.firebaseapp.com",
  projectId: "gacha-8d56f",
  storageBucket: "gacha-8d56f.appspot.com",
  messagingSenderId: "775589812887",
  appId: "1:775589812887:web:e1bb830076b39032e467d2",
  measurementId: "G-Y5SMLC7ZD2",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP); // provider for authentication
const analytics = getAnalytics(FIREBASE_APP);
