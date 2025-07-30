const formulario = document.getElementById('formularioHoras');
const tabla = document.querySelector('#tablaHoras tbody');
const estadoHoras = document.getElementById('estadoHoras');
const btnSolicitud = document.getElementById('btnSolicitud');

const horasRegistradas = JSON.parse(localStorage.getItem('horas')) || [];

function actualizarTabla() {
  tabla.innerHTML = "";
  let total = 0;

  horasRegistradas.forEach(registro => {
    const fila = document.createElement('tr');
    fila.innerHTML = `<td>${registro.fecha}</td><td>${registro.horas}</td>`;
    tabla.appendChild(fila);
    total += registro.horas;
  });

  if (total >= 80) {
    estadoHoras.textContent = `✅ Has registrado ${total} horas. Ya podés solicitar el ingreso.`;
    estadoHoras.className = 'estado ok';
    btnSolicitud.style.display = 'block';
  } else {
    estadoHoras.textContent = `❌ Solo llevás ${total} horas. Te faltan ${80 - total} para poder ingresar.`;
    estadoHoras.className = 'estado no';
    btnSolicitud.style.display = 'none';
  }
}

formulario.addEventListener('submit', e => {
  e.preventDefault();

  const fecha = document.getElementById('fecha').value;
  const horas = parseInt(document.getElementById('horas').value);

  if (horasRegistradas.find(r => r.fecha === fecha)) {
    alert("Ya registraste horas para esa fecha.");
    return;
  }

  horasRegistradas.push({ fecha, horas });
  localStorage.setItem('horas', JSON.stringify(horasRegistradas));
  actualizarTabla();
  formulario.reset();
});

btnSolicitud.addEventListener('click', () => {
  alert("Solicitud de ingreso enviada. Pronto recibirás respuesta.");
});

actualizarTabla();
