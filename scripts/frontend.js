document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".sidebar nav a");
  const vistas = document.querySelectorAll(".vista");
  const solicitarBtn = document.getElementById("solicitarIngreso");

  // Navegación
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      const viewId = link.getAttribute("data-view") + "View";
      vistas.forEach(v => v.style.display = "none");
      const vista = document.getElementById(viewId);
      if(vista) vista.style.display = "block";

      cargarDatos();
      checkCompleto();
    });
  });

  // Cargar datos en vistas
  function cargarDatos() {
    // Perfil
    document.getElementById("perfilNombre").textContent = localStorage.getItem("nombre") || "No registrado";
    document.getElementById("perfilEmail").textContent = localStorage.getItem("email") || "No registrado";
    document.getElementById("inputNombre").value = localStorage.getItem("nombre") || "";
    document.getElementById("inputEmail").value = localStorage.getItem("email") || "";

    // Horas
    const horasInfo = document.getElementById("horasInfo");
    const horas = localStorage.getItem("horasRegistradas");
    horasInfo.textContent = horas ? `${horas} horas registradas` : "Pendientes";

    // Estado de pagos
    document.getElementById("saldoInfo").textContent = localStorage.getItem("saldo") || 0;
    document.getElementById("atrasoInfo").textContent = localStorage.getItem("atraso") || 0;

    // Mis datos
    document.getElementById("datosNombre").textContent = localStorage.getItem("nombre") || "No registrado";
    document.getElementById("datosEmail").textContent = localStorage.getItem("email") || "No registrado";
    document.getElementById("datosHoras").textContent = horas ? `${horas} horas registradas` : "Pendientes";
    document.getElementById("datosSaldo").textContent = localStorage.getItem("saldo") || 0;
    document.getElementById("datosAtraso").textContent = localStorage.getItem("atraso") || 0;
  }

  // Check si se puede solicitar ingreso
  function checkCompleto() {
    const perfil = localStorage.getItem("email");
    const horas = localStorage.getItem("horasRegistradas");
    if(solicitarBtn) solicitarBtn.disabled = !(perfil && horas);
  }

  // Guardar perfil
  const perfilForm = document.getElementById("perfilForm");
  if(perfilForm) {
    perfilForm.addEventListener("submit", e => {
      e.preventDefault();
      const datos = Object.fromEntries(new FormData(e.target).entries());
      if(!datos.nombre || !datos.email){
        alert("Debes completar todos los campos del perfil.");
        return;
      }

      fetch("http://127.0.0.1:8000/api/users", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ ci: "pendiente", name: datos.nombre, email: datos.email, password: "123456" })
      })
      .then(async r => {
        try {
          const data = await r.json();
          localStorage.setItem("nombre", datos.nombre);
          localStorage.setItem("email", datos.email);
          alert("Perfil guardado con éxito");
          cargarDatos();
          checkCompleto();
        } catch {
          alert("Error: no se recibió respuesta válida del servidor al guardar el perfil.");
        }
      })
      .catch(err => alert("Error al guardar el perfil: " + err));
    });
  }

  // Registrar horas
  const horasForm = document.getElementById("horasForm");
  if(horasForm) {
    horasForm.addEventListener("submit", e => {
      e.preventDefault();
      const formData = new FormData(horasForm);
      const horas = formData.get("horas");
      if(!horas){
        alert("Debes ingresar la cantidad de horas.");
        return;
      }
      localStorage.setItem("horasRegistradas", horas);
      alert(`Se registraron ${horas} horas correctamente`);
      cargarDatos();
      checkCompleto();
    });
  }

  // Subir comprobantes
  const compForm = document.getElementById("compForm");
  if(compForm) {
    compForm.addEventListener("submit", e => {
      e.preventDefault();
      alert("Comprobante subido (simulación)");
      cargarDatos();
      checkCompleto();
    });
  }

  // Solicitar ingreso
  if(solicitarBtn) {
    solicitarBtn.addEventListener("click", () => {
      const email = localStorage.getItem("email");
      if(!email) {
        alert("Debes completar tu perfil antes de solicitar ingreso");
        return;
      }

      fetch("http://127.0.0.1:8000/api/solicitud", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email })
      })
      .then(async r => {
        try {
          const data = await r.json();
          alert(data.message || "Solicitud enviada correctamente");
        } catch {
          alert("Error: la respuesta del servidor no es válida");
        }
      })
      .catch(err => alert("Error al enviar la solicitud: " + err));
    });
  }

  // Inicializar
  cargarDatos();
  checkCompleto();
});