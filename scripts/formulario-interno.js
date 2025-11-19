const API_URL = "http://localhost:8000/api/membership-requests";

document.getElementById("internalForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const msg = document.getElementById("internalMessage");
    msg.textContent = "Enviando...";
    msg.classList.remove("error", "success");

    const formData = new FormData();
    formData.append("user_id", localStorage.getItem("user_id"));
    formData.append("nombre_completo", document.getElementById("nombre_completo").value);
    formData.append("ci", document.getElementById("ci").value);
    formData.append("telefono", document.getElementById("telefono").value);
    formData.append("direccion", document.getElementById("direccion").value);

    const file = document.getElementById("comprobante").files[0];
    if (file) formData.append("comprobante", file);

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            msg.textContent = data.message || "Error en el envío.";
            msg.classList.add("error");
            return;
        }

        msg.textContent = "Solicitud enviada correctamente.";
        msg.classList.add("success");

    } catch (error) {
        msg.textContent = "Error de conexión.";
        msg.classList.add("error");
    }
});