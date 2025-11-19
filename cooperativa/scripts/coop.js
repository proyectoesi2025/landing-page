// PROTECCIÓN: si no hay user logueado → afuera
(function(){
    if (!localStorage.getItem("user_id")) {
        window.location.href = "../pages/login.html";
    }
    const name = localStorage.getItem("user_name");
    if (document.getElementById("userName"))
        document.getElementById("userName").textContent = name;
})();

// Cerrar sesión
function logout() {
    localStorage.clear();
    window.location.href = "../pages/login.html";
}

/* ---------------------------
   REGISTRO DE HORAS
-----------------------------*/
async function enviarHoras() {
    const body = {
        user_id: localStorage.getItem("user_id"),
        horas: document.getElementById("horas").value,
        motivo: document.getElementById("motivo").value,
    };

    await fetch("http://localhost:8000/api/horas", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    });

    alert("Horas registradas correctamente.");
}

/* ---------------------------
   SUBIR COMPROBANTE DE PAGO
-----------------------------*/
async function enviarPago() {
    const fd = new FormData();

    fd.append("user_id", localStorage.getItem("user_id"));
    fd.append("archivo", document.getElementById("pagoArchivo").files[0]);

    await fetch("http://localhost:8000/api/pagos", {
        method: "POST",
        body: fd
    });

    alert("Comprobante enviado correctamente.");
}

/* ---------------------------
   FORO DE CONSULTAS
-----------------------------*/
async function enviarConsulta() {
    const body = {
        user_id: localStorage.getItem("user_id"),
        consulta: document.getElementById("consulta").value
    };

    await fetch("http://localhost:8000/api/foro", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    });

    alert("Consulta enviada.");
}

/* ---------------------------
      LOGIN DE USUARIO
-----------------------------*/
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.message || "Error al iniciar sesión");
        return;
    }

    // Guardar datos del usuario
    localStorage.setItem("user_id", data.user.id);
    localStorage.setItem("user_name", data.user.name);
    localStorage.setItem("user_email", data.user.email);
    localStorage.setItem("is_admin", data.user.is_admin);

    // Redirecciones
    if (data.user.is_admin == 1) {
        window.location.href = "../pages/backoffice.html";
    } else {
        window.location.href = "../pages/formulario-interno.html";
    }
}
