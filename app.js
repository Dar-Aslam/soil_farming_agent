// Soil Farming Agent Frontend Logic

import { app, auth, db } from "./firebase.js";
import { register, login, logout } from "./auth.js";
import { postSoilDetails, getSoilDetails } from "./soil.js";
import { postDistributorDetails, getDistributorDetails } from "./distributor.js";
import { logEvent } from "./logger.js";

let currentUser = null;

// UI Elements
const navLogin = document.getElementById("nav-login");
const navLogout = document.getElementById("nav-logout");
const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const showRegister = document.getElementById("show-register");
const showLogin = document.getElementById("show-login");
const loginError = document.getElementById("login-error");
const registerError = document.getElementById("register-error");
const userInfo = document.getElementById("user-info");
const tabBtns = document.querySelectorAll(".tab-btn");
const soilList = document.getElementById("soil-list");
const distributorList = document.getElementById("distributor-list");
const postSoilForm = document.getElementById("post-soil-form");
const postDistributorForm = document.getElementById("post-distributor-form");
const submitSoilBtn = document.getElementById("submit-soil");
const submitDistributorBtn = document.getElementById("submit-distributor");
const postSoilError = document.getElementById("post-soil-error");
const postDistributorError = document.getElementById("post-distributor-error");

// Tab switching logic
tabBtns.forEach(btn => btn.addEventListener("click", () => {
    tabBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    soilList.style.display = "none";
    distributorList.style.display = "none";
    postSoilForm.style.display = "none";
    postDistributorForm.style.display = "none";
    if (btn.id === "tab-soil") {
        soilList.style.display = "block";
        renderSoilList();
    } else if (btn.id === "tab-distributor") {
        distributorList.style.display = "block";
        renderDistributorList();
    } else if (btn.id === "tab-post-soil") {
        postSoilForm.style.display = "block";
    } else if (btn.id === "tab-post-distributor") {
        postDistributorForm.style.display = "block";
    }
}));

// Auth Logic
showRegister.onclick = () => {
    loginForm.style.display = "none";
    registerForm.style.display = "flex";
};
showLogin.onclick = () => {
    registerForm.style.display = "none";
    loginForm.style.display = "flex";
};

loginBtn.onclick = async () => {
    loginError.textContent = "";
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;
    try {
        let user = await login(email, password);
        currentUser = user;
        handleAuthChange(true);
    } catch (err) {
        loginError.textContent = err.message;
    }
};
registerBtn.onclick = async () => {
    registerError.textContent = "";
    let email = document.getElementById("register-email").value;
    let password = document.getElementById("register-password").value;
    try {
        let user = await register(email, password);
        currentUser = user;
        handleAuthChange(true);
    } catch (err) {
        registerError.textContent = err.message;
    }
};
navLogin.onclick = () => {
    authSection.style.display = "block";
    appSection.style.display = "none";
};
navLogout.onclick = async () => {
    await logout();
    currentUser = null;
    handleAuthChange(false);
};

// Auth state UI
function handleAuthChange(isLoggedIn) {
    if (isLoggedIn) {
        authSection.style.display = "none";
        appSection.style.display = "block";
        navLogin.style.display = "none";
        navLogout.style.display = "inline-block";
        userInfo.textContent = `Logged in as ${currentUser.email}`;
        renderSoilList();
        renderDistributorList();
        tabBtns[0].click();
    } else {
        authSection.style.display = "block";
        appSection.style.display = "none";
        navLogin.style.display = "inline-block";
        navLogout.style.display = "none";
        userInfo.textContent = "";
        loginForm.style.display = "flex";
        registerForm.style.display = "none";
    }
}

// Soil posting
submitSoilBtn.onclick = async () => {
    postSoilError.textContent = "";
    let type = document.getElementById("soil-type").value;
    let location = document.getElementById("soil-location").value;
    let desc = document.getElementById("soil-description").value;
    if (!type || !location) {
        postSoilError.textContent = "Type and Location are required.";
        return;
    }
    try {
        await postSoilDetails({ type, location, description: desc }, currentUser.uid);
        document.getElementById("soil-type").value = "";
        document.getElementById("soil-location").value = "";
        document.getElementById("soil-description").value = "";
        renderSoilList();
        tabBtns[0].click();
    } catch (err) {
        postSoilError.textContent = err.message;
    }
};

// Distributor posting
submitDistributorBtn.onclick = async () => {
    postDistributorError.textContent = "";
    let name = document.getElementById("distributor-name").value;
    let contact = document.getElementById("distributor-contact").value;
    let details = document.getElementById("distributor-details").value;
    if (!name || !contact) {
        postDistributorError.textContent = "Name and Contact are required.";
        return;
    }
    try {
        await postDistributorDetails({ name, contact, details }, currentUser.uid);
        document.getElementById("distributor-name").value = "";
        document.getElementById("distributor-contact").value = "";
        document.getElementById("distributor-details").value = "";
        renderDistributorList();
        tabBtns[1].click();
    } catch (err) {
        postDistributorError.textContent = err.message;
    }
};

// Soil List rendering
async function renderSoilList() {
    soilList.innerHTML = "<h3>Soil Details</h3><div>Loading...</div>";
    try {
        let soils = await getSoilDetails();
        if (soils.length === 0) {
            soilList.innerHTML = "<h3>Soil Details</h3><div>No records found.</div>";
            return;
        }
        let html = "<h3>Soil Details</h3>";
        html += soils.map(s =>
            `<div class="card">
                <strong>Type:</strong> ${s.type}<br>
                <strong>Location:</strong> ${s.location}<br>
                <strong>Description:</strong> ${s.description || "N/A"}<br>
            </div>`
        ).join("");
        soilList.innerHTML = html;
    } catch (err) {
        soilList.innerHTML = "<div>Error loading soil details.</div>";
    }
}

// Distributor List rendering
async function renderDistributorList() {
    distributorList.innerHTML = "<h3>Distributor Details</h3><div>Loading...</div>";
    try {
        let distributors = await getDistributorDetails();
        if (distributors.length === 0) {
            distributorList.innerHTML = "<h3>Distributor Details</h3><div>No records found.</div>";
            return;
        }
        let html = "<h3>Distributor Details</h3>";
        html += distributors.map(d =>
            `<div class="card">
                <strong>Name:</strong> ${d.name}<br>
                <strong>Contact:</strong> ${d.contact}<br>
                <strong>Details:</strong> ${d.details || "N/A"}<br>
            </div>`
        ).join("");
        distributorList.innerHTML = html;
    } catch (err) {
        distributorList.innerHTML = "<div>Error loading distributor details.</div>";
    }
}

// Initial UI setup
handleAuthChange(false);

// Firebase Auth listener
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
onAuthStateChanged(auth, user => {
    if (user) {
        currentUser = user;
        handleAuthChange(true);
    } else {
        handleAuthChange(false);
    }
});
