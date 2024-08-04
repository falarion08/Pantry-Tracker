// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore}  from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmMndGKmmAL5CyM2USGvL7iCFAOAzj2Q4",
  authDomain: "inventor-management.firebaseapp.com",
  projectId: "inventor-management",
  storageBucket: "inventor-management.appspot.com",
  messagingSenderId: "692008670683",
  appId: "1:692008670683:web:4ef7031d77979796fc43fe",
  measurementId: "G-EQ39P0Y9KC"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}