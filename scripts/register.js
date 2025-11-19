const API_URL = "http://localhost:8000/api/auth";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value;
    const pass2 = document.getElementById("password_confirmation").value;
    const msg = document.getElementById("registerMessage");

    msg.style.color = "red";

    // --------------------------
    // VALIDACIÓN: Nombre
    // --------------------------
    const nameRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{3,50}$/;

    if (!nameRegex.test(name)) {
        msg.textContent = "El nombre solo puede contener letras y espacios (3 a 50 caracteres).";
        return;
    }

    // --------------------------
    // VALIDACIÓN: Email Gmail
    // --------------------------
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!emailRegex.test(email)) {
        msg.textContent = "El email debe ser válido y terminar en @gmail.com";
        return;
    }

    // --------------------------
    // VALIDACIÓN: Contraseña segura
    // --------------------------
    const passRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passRegex.test(pass)) {
        msg.textContent =
            "La contraseña no cumple los requisitos.";
        return;
    }

    // --------------------------
    // VALIDACIÓN: Coincidencia
    // --------------------------
    if (pass !== pass2) {
        msg.textContent = "Las contraseñas no coinciden.";
        return;
    }

    // --------------------------
    // ENVÍO AL BACKEND
    // --------------------------
    msg.style.color = "blue";
    msg.textContent = "Creando cuenta...";

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: pass,
                password_confirmation: pass2
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            msg.style.color = "red";
            msg.textContent = data.message || "Error al registrarse.";
            return;
        }

        msg.style.color = "green";
        msg.textContent = "Cuenta creada correctamente. Redirigiendo...";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {
        msg.style.color = "red";
        msg.textContent = "Error de conexión.";
    }
});