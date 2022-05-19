// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBjcdFfW8K5y89GQTQtnZN4p8K0mZQ252U",
    authDomain: "session22-regina.firebaseapp.com",
    projectId: "session22-regina",
    storageBucket: "session22-regina.appspot.com",
    messagingSenderId: "856868712454",
    appId: "1:856868712454:web:957dbb1d372a4238f69387"
  };  

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// initalize components
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();

export const db = firebase.firestore();
