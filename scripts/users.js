// Validación básica del formulario
function validarFormularioRegister(form) {
    const campos = form.querySelectorAll('input');
    for (let campo of campos) {
        if (!campo.value.trim()) {
            alert('Por favor, complete todos los campos.');
            return false;
        }
    }

    const email = form.querySelector('input[name="email"]').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, ingrese un correo electrónico válido.');
        return false;
    }

    return true;
}

// Evento submit del formulario de registro
document.getElementById("register").addEventListener("submit", function(e){
    e.preventDefault(); // Evita que se recargue la página

    const form = e.target;

    if (!validarFormularioRegister(form)) return; // Validamos campos antes de enviar

    // Obtenemos los valores del formulario
    const datos = {
        ci: document.getElementById("cedula").value,
        name: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    // Enviamos los datos al backend Laravel
    fetch("http://127.0.0.1:8000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(data => {
        if (data.message) {
            alert(data.message); // Muestra "usuario creado con exito"
            form.reset(); // Limpiamos el formulario
        }
    })
    .catch(err => console.error("Error:", err));
});

document.getElementById("login").addEventListener("submit", function(e){
    e.preventDefault(); // Evita que se recargue la página

    const form = e.target;

    if (!validarFormularioRegister(form)) return; // Validamos campos antes de enviar

    // Obtenemos los valores del formulario
    const datos = {
        email: encodeURIComponent(document.getElementById("emaillogin").value),
        password: document.getElementById("passwordlogin").value
    };
   // Enviamos los datos al backend Laravel
    fetch('http://127.0.0.1:8000/api/login?email=' + datos.email + '&password=' + datos.password) 
    .then(res => res.json())
    .then(data => {
        localStorage.setItem('user', data.user.ci)
        localStorage.setItem('nombre', data.user.name)
        localStorage.setItem('email', data.user.email)
        window.open('/pages/frontend.html', '_self')    
    })
    .catch(err => console.error("Error:", err));
});