document.addEventListener("DOMContentLoaded", () => {
  const tablaBody = document.querySelector("#solicitudesTabla tbody");

  function cargarSolicitudes() {
    fetch("http://127.0.0.1:8000/api/solicitudes")
      .then(res => res.json())
      .then(solicitudes => {
        tablaBody.innerHTML = ""; // Limpiar tabla
        solicitudes.forEach(solicitud => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${solicitud.user_id}</td>
            <td>${solicitud.CI}</td>
            <td>${solicitud.Nombre}</td>
            <td>${solicitud.Email}</td>
            <td>
              <button class="btn aceptar">Aceptar</button>
              <button class="btn denegar">Denegar</button>
            </td>
          `;
          tablaBody.appendChild(tr);

          // Aceptar solo remueve la fila
          tr.querySelector(".aceptar").addEventListener("click", () => {
            tr.remove();
          });

          // Denegar elimina de la fila y de la DB
          tr.querySelector(".denegar").addEventListener("click", () => {
            const userId = solicitud.user_id; // campo exacto del JSON
            fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
              method: "DELETE",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            })
            .then(res => {
              if (!res.ok) throw new Error("Error al eliminar usuario");
              return res.json();
            })
            .then(() => {
              tr.remove(); // eliminar fila visualmente
              alert(`Usuario ${solicitud.Nombre} eliminado`);
            })
            .catch(err => console.error(err));
          });
        });
      })
      .catch(err => console.error("Error al cargar solicitudes:", err));
  }

  cargarSolicitudes();
});