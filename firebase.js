// Firebase configuration and initialization for Soil Farming Agent

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAumg_k0bi4kiOiXoZg1MM1f2bm-5blQ6w",
    authDomain: "soilfarmagent.firebaseapp.com",
    projectId: "soilfarmagent",
    storageBucket: "soilfarmagent.firebasestorage.app",
    messagingSenderId: "780920993791",
    appId: "1:780920993791:web:05dc720d86ef44f7ce19ca"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };