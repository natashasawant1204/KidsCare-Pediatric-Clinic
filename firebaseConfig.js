import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCenJq_S9MdtrWQP_CY7lTqRdk9NrQ_7ro",
    authDomain: "final-projects-a6e1f.firebaseapp.com",
    projectId: "final-projects-a6e1f",
    storageBucket: "final-projects-a6e1f.firebasestorage.app",
    messagingSenderId: "1087406206268",
    appId: "1:1087406206268:web:81db32cb637a47a0658239",
    measurementId: "G-X1S36K5G60"
  };

  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

  // Export Firestore functions
export { db, collection, addDoc, getDocs };