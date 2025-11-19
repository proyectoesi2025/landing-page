(function loadHome() {

    const name = localStorage.getItem("user_name");
    const status = localStorage.getItem("status");

    document.getElementById("userName").textContent = name;
    document.getElementById("welcomeTitle").textContent = "Bienvenido, " + name;

    // Mostrar estado
    const estadoTexto = document.getElementById("estadoTexto");

    if (status === "approved") {
        estadoTexto.innerHTML = `<span style="color: green; font-weight:bold;">APROBADO ✔</span><br>Ya sos parte oficial de la cooperativa.`;
    } 
    else if (status === "pending") {
        estadoTexto.innerHTML = `<span style="color: orange; font-weight:bold;">EN REVISIÓN ⏳</span><br>Un administrador revisará tu solicitud.`;
    } 
    else {
        estadoTexto.innerHTML = `<span style="color: red; font-weight:bold;">SIN SOLICITUD ⚠</span><br>Debés completar el formulario interno.`;
    }

    // Datos de API (horas y pagos)
    const userId = localStorage.getItem("user_id");

    fetch(`http://localhost:8000/api/user/${userId}/horas`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("horasSemana").textContent = data.horas ?? "0";
        });

    fetch(`http://localhost:8000/api/user/${userId}/pagos`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("ultimoPago").textContent = data.fecha ?? "Sin pagos";
        });

})();