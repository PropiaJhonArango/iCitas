// import firebase from 'firebase/app'
// import 'firebase/firestore'

//   const firebaseConfig = {
//     apiKey: "AIzaSyDCQlFts75oWlXhCh9mF-t4PsN5JKSspeI",
//     authDomain: "icitas-6e1b2.firebaseapp.com",
//     projectId: "icitas-6e1b2",
//     storageBucket: "icitas-6e1b2.appspot.com",
//     messagingSenderId: "1051790192767",
//     appId: "1:1051790192767:web:5d70485b54730b0c98cf4a"
//   }

//   export const firebaseApp = firebase.initializeApp(firebaseConfig);

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDCQlFts75oWlXhCh9mF-t4PsN5JKSspeI",
  authDomain: "icitas-6e1b2.firebaseapp.com",
  projectId: "icitas-6e1b2",
  storageBucket: "icitas-6e1b2.appspot.com",
  messagingSenderId: "1051790192767",
  appId: "1:1051790192767:web:5d70485b54730b0c98cf4a",
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
