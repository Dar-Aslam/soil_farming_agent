// Simple logging module for tracking actions

import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function logEvent(action, details, userId = null) {
    console.log(`[${new Date().toISOString()}] ACTION: ${action}`, details);

    // Log to Firestore
    try {
        await addDoc(collection(db, "logs"), {
            action,
            details,
            userId,
            timestamp: serverTimestamp()
        });
    } catch (e) {
        console.error("Failed to log event to Firestore:", e);
    }
}