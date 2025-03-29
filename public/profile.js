const API_URL = "http://localhost:5000/api/auth";

async function fetchProfile() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html"; // Rediriger si pas connecté
        return;
    }

    const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (response.ok) {
        document.getElementById("profileInfo").innerHTML = `
            <p><strong>Nom:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
        `;
    } else {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    }
}

async function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

async function updateProfile() {
    const token = localStorage.getItem("token");
    const name = document.getElementById("editName").value;
    const email = document.getElementById("editEmail").value;

    if (!name && !email) {
        document.getElementById("updateMessage").textContent = "Veuillez remplir au moins un champ.";
        return;
    }

    const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
    });

    const data = await response.json();

    if (response.ok) {
        document.getElementById("updateMessage").textContent = "Mise à jour réussie !";
        document.getElementById("updateMessage").classList.add("text-green-500");
        fetchProfile(); // Rafraîchir les infos après modification
    } else {
        document.getElementById("updateMessage").textContent = data.message;
    }
}

fetchProfile();
