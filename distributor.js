// Distributor Details CRUD operations

import { db } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { logEvent } from "./logger.js";

export async function postDistributorDetails(distributorData, userId) {
    try {
        const docRef = await addDoc(collection(db, "distributors"), {...distributorData, userId});
        await logEvent("post_distributor_details", distributorData, userId);
        return docRef.id;
    } catch (error) {
        await logEvent("post_distributor_details_failed", {distributorData, error: error.message}, userId);
        throw error;
    }
}

export async function getDistributorDetails() {
    try {
        const querySnapshot = await getDocs(collection(db, "distributors"));
        const distributors = [];
        querySnapshot.forEach(doc => distributors.push({...doc.data(), id: doc.id}));
        await logEvent("get_distributor_details", {count: distributors.length});
        return distributors;
    } catch (error) {
        await logEvent("get_distributor_details_failed", {error: error.message});
        throw error;
    }
}