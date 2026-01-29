import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// 🔥 replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAcfis_iDNWj-9QbenYFIcOQGY6ZStEQn8",
    authDomain: "buzz-off-8f4a5.firebaseapp.com",
    projectId: "buzz-off-8f4a5",
    storageBucket: "buzz-off-8f4a5.firebasestorage.app",
    messagingSenderId: "302820370687",
    appId: "1:302820370687:web:6ea1fa8eafa2b2ee0a04ca",
    measurementId: "G-YVNHVN80LD"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);