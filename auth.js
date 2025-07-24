// Authentication module (Email/Password only)

import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { logEvent } from "./logger.js";

export async function register(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await logEvent("register", {email}, userCredential.user.uid);
        return userCredential.user;
    } catch (error) {
        await logEvent("register_failed", {email, error: error.message});
        throw error;
    }
}

export async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await logEvent("login", {email}, userCredential.user.uid);
        return userCredential.user;
    } catch (error) {
        await logEvent("login_failed", {email, error: error.message});
        throw error;
    }
}

export async function logout() {
    try {
        await signOut(auth);
        await logEvent("logout", {});
    } catch (error) {
        await logEvent("logout_failed", {error: error.message});
        throw error;
    }
}