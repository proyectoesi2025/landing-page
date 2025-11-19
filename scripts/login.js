const API_URL = "http://localhost:8000/api/auth/login";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value;
    const msg = document.getElementById("loginMessage");

    msg.style.color = "red";

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!emailRegex.test(email)) {
        msg.textContent = "El email debe ser válido y terminar en @gmail.com";
        return;
    }

    if (pass.length < 8) {
        msg.textContent = "La contraseña debe tener mínimo 8 caracteres.";
        return;
    }

    msg.style.color = "blue";
    msg.textContent = "Ingresando...";

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: pass
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            msg.style.color = "red";
            msg.textContent = data.message || "Credenciales incorrectas.";
            return;
        }

        // 🔥 Guardar datos en localStorage
        localStorage.setItem("user_id", data.user.id);
        localStorage.setItem("user_name", data.user.name);
        localStorage.setItem("user_email", data.user.email);
        localStorage.setItem("is_admin", data.user.is_admin ? "1" : "0");
        localStorage.setItem("status", data.user.status ?? "none");

        msg.style.color = "green";
        msg.textContent = "Ingreso exitoso. Redirigiendo...";

        // 🔥 Redirección según estado/rol
        setTimeout(() => {

            if (data.user.is_admin == 1) {
                window.location.href = "../pages/backoffice.html";
                return;
            }

            if (data.user.status === "approved") {
                window.location.href = "../cooperativa/home.html";
                return;
            }

            // pendiente o sin solicitud
            window.location.href = "../pages/formulario-interno.html";

        }, 800);

    } catch (error) {
        msg.style.color = "red";
        msg.textContent = "Error de conexión.";
    }
});