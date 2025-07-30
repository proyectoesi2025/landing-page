function validarFormulario(form) {
  const campos = form.querySelectorAll('input');
  for (let campo of campos) {
    if (!campo.value.trim()) {
      alert('Por favor, complete todos los campos.');
      return false;
    }
  }
  return true;
}

function validarFormularioRegister(form) {
  if (!validarFormulario(form)) return false;

  const email = form.querySelector('input[name="email"]').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Por favor, ingrese un correo electrónico válido.');
    return false;
  }

  return true;
}

function validarFormularioLogin(form) {
  if (!validarFormulario(form)) return false;
  return true; 
}

function toggleSections(showRegister) {
  const registerSection = document.getElementById('registerSection');
  const loginSection = document.getElementById('loginSection');

  if (showRegister) {
    registerSection.classList.add('active');
    loginSection.classList.remove('active');
  } else {
    registerSection.classList.remove('active');
    loginSection.classList.add('active');
  }
}

document.getElementById("registerform").addEventListener("submit", function(e){
  e.preventDefault();

  const datos = {
    ci: document.getElementById("cedula").value,
    nombre: document.getElementById("nombre").value,
    email: document.getElementById("email").value,
    contrasena: document.getElementById("password").value
  }
  fetch("http://127.0.0.1:8000/api/users", {
  method: "POST",
  headers: {
      "Content-Type": "application/json"
  },
  body: JSON.stringify(datos)
})
})

document.getElementById('switchToLogin').onclick = () => toggleSections(false);
document.getElementById('switchToRegister').onclick = () => toggleSections(true);