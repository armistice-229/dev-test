const API_URL = "https://dev-test-1-fnx1.onrender.com/api/auth";

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "profile.html"; // Redirige après connexion
    } else {
        document.getElementById("message").textContent = data.message;
    }
}    

async function register() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "profile.html"; // Redirection vers le profil après inscription
    } else {
        document.getElementById("registerMessage").textContent = data.message;
    }
}

// Afficher le formulaire de connexion
function showLogin() {
    document.getElementById("registerForm").classList.add("hidden");
    document.querySelector(".w-full.max-w-md").classList.remove("hidden");
}

// Afficher le formulaire d'inscription
function showRegister() {
    document.querySelector(".w-full.max-w-md").classList.add("hidden");
    document.getElementById("registerForm").classList.remove("hidden");
}
