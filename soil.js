// Soil Details CRUD operations

import { db } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { logEvent } from "./logger.js";

export async function postSoilDetails(soilData, userId) {
    try {
        const docRef = await addDoc(collection(db, "soils"), {...soilData, userId});
        await logEvent("post_soil_details", soilData, userId);
        return docRef.id;
    } catch (error) {
        await logEvent("post_soil_details_failed", {soilData, error: error.message}, userId);
        throw error;
    }
}

export async function getSoilDetails() {
    try {
        const querySnapshot = await getDocs(collection(db, "soils"));
        const soils = [];
        querySnapshot.forEach(doc => soils.push({...doc.data(), id: doc.id}));
        await logEvent("get_soil_details", {count: soils.length});
        return soils;
    } catch (error) {
        await logEvent("get_soil_details_failed", {error: error.message});
        throw error;
    }
}