const form = document.getElementById("formPerfil");
const preview = document.getElementById("previewFoto");
const mensaje = document.getElementById("guardadoMensaje");
const inputFoto = document.getElementById("foto");

// Cargar datos guardados
window.addEventListener("DOMContentLoaded", () => {
  const datos = JSON.parse(localStorage.getItem("perfil")) || {};
  document.getElementById("nombre").value = datos.nombre || "";
  document.getElementById("apellido").value = datos.apellido || "";
  document.getElementById("email").value = datos.email || "";
  document.getElementById("telefono").value = datos.telefono || "";

  if (datos.foto) {
    preview.src = datos.foto;
  } else {
    preview.src = "https://via.placeholder.com/120?text=Foto";
  }
});

// Mostrar previsualización de la imagen
inputFoto.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    preview.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// Guardar datos
form.addEventListener("submit", e => {
  e.preventDefault();

  const datos = {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    email: document.getElementById("email").value,
    telefono: document.getElementById("telefono").value,
    foto: preview.src
  };

  localStorage.setItem("perfil", JSON.stringify(datos));

  mensaje.textContent = "✅ Cambios guardados correctamente.";
  setTimeout(() => mensaje.textContent = "", 4000);
});
