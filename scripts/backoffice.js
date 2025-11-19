const ADMIN_API = "http://localhost:8000/api/admin";
const API_USERS = "http://localhost:8000/api/usuarios";

// Verificar si es admin
(function checkAdmin() {
    const isAdmin = localStorage.getItem("is_admin"); // CORREGIDO
    const adminName = localStorage.getItem("user_name");

    if (adminName) {
        const nameSpan = document.getElementById("boAdminName");
        if (nameSpan) nameSpan.textContent = adminName + " (admin)";
    }

    if (Number(isAdmin) !== 1) {
        alert("No tenés permisos para acceder al backoffice.");
        window.location.href = "login.html";
    }
})();

// Navegación entre secciones
document.querySelectorAll(".bo-nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".bo-nav-item").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const section = btn.dataset.section;

        document.querySelectorAll(".bo-section").forEach(sec => sec.classList.remove("active"));
        document.getElementById(`section-${section}`).classList.add("active");
    });
});

// Logout
document.getElementById("boLogout").addEventListener("click", () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("is_admin");
    window.location.href = "login.html";
});

// Cargar solicitudes pendientes
async function loadPendingRequests() {
    const tbody = document.getElementById("pendingTable");
    const countPending = document.getElementById("countPending");

    tbody.innerHTML = `<tr><td colspan="6">Cargando...</td></tr>`;

    try {
        const res = await fetch(`${ADMIN_API}/membership-requests/pending`);
        const data = await res.json();

        if (!Array.isArray(data)) {
            tbody.innerHTML = `<tr><td colspan="6">Error al cargar solicitudes.</td></tr>`;
            return;
        }

        tbody.innerHTML = "";
        countPending.textContent = data.length.toString();

        data.forEach(item => {
            const tr = document.createElement("tr");

            const email = item.user?.email ?? "-";
            const estado = item.status || "pending";

            tr.innerHTML = `
                <td>${item.nombre_completo ?? "-"}</td>
                <td>${item.ci ?? "-"}</td>
                <td>${email}</td>
                <td>${item.telefono ?? "-"}</td>
                <td>
                    <span class="bo-status-pill bo-status-${estado}">
                        ${estado === "pending" ? "Pendiente" : estado === "approved" ? "Aprobada" : "Rechazada"}
                    </span>
                </td>
                <td>
                    <button class="bo-table-btn bo-table-btn-secondary" data-action="ver">Ver</button>
                    <button class="bo-table-btn bo-table-btn-approve" data-action="aprobar">Aprobar</button>
                    <button class="bo-table-btn bo-table-btn-deny" data-action="denegar">Rechazar</button>
                </td>
            `;

            tr.querySelector('[data-action="ver"]').addEventListener("click", () => {
                openDetail(item);
            });

            tr.querySelector('[data-action="aprobar"]').addEventListener("click", async () => {
                await approveRequest(item.id);
            });

            tr.querySelector('[data-action="denegar"]').addEventListener("click", async () => {
                await denyRequest(item.id);
            });

            tbody.appendChild(tr);
        });

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6">Error de conexión.</td></tr>`;
    }
}

// Panel detalle
const overlay = document.getElementById("detailOverlay");
const closeDetailBtn = document.getElementById("closeDetail");

function openDetail(item) {
    document.getElementById("detailNombre").textContent = item.nombre_completo ?? "-";
    document.getElementById("detailCI").textContent = item.ci ?? "-";
    document.getElementById("detailTelefono").textContent = item.telefono ?? "-";
    document.getElementById("detailDireccion").textContent = item.direccion ?? "-";
    document.getElementById("detailEmail").textContent = item.user?.email ?? "-";
    document.getElementById("detailEstado").textContent =
        item.status === "pending" ? "Pendiente" :
        item.status === "approved" ? "Aprobada" : "Rechazada";

    const cont = document.getElementById("detailImageContainer");
    cont.innerHTML = "";

    if (item.comprobante_path) {
        const imgUrl = `http://localhost:8000/storage/${item.comprobante_path}`;

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = "Comprobante de pago";
        img.style.cursor = "pointer";

        img.addEventListener("click", () => {
            window.open(imgUrl, "_blank");
        });

        cont.appendChild(img);

    } else {
        cont.textContent = "Sin comprobante adjunto.";
    }

    overlay.classList.add("active");
}

closeDetailBtn.addEventListener("click", () => {
    overlay.classList.remove("active");
});

overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        overlay.classList.remove("active");
    }
});

// APROBAR SOLICITUD — ARREGLADO
async function approveRequest(id) {
    if (!confirm("¿Aprobar esta solicitud?")) return;

    await fetch(`${ADMIN_API}/membership-requests/${id}/approve`, {
        method: "POST"
    });

    alert("Solicitud aprobada correctamente.");

    await loadPendingRequests(); // RECARGA LA TABLA
}

// DENEGAR
async function denyRequest(id) {
    if (!confirm("¿Rechazar esta solicitud?")) return;

    await fetch(`${ADMIN_API}/membership-requests/${id}/deny`, { method: "POST" });

    await loadPendingRequests(); // RECARGA LA TABLA
}

// cargar lista de usuarios
async function loadUsers() {
    const tbody = document.getElementById("usersTable");
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="4">Cargando...</td></tr>`;

    try {
        const res = await fetch("http://localhost:8000/api/users");
        if (!res.ok) {
            tbody.innerHTML = `<tr><td colspan="4">Endpoint /api/users no implementado.</td></tr>`;
            return;
        }

        const data = await res.json();
        tbody.innerHTML = "";

        data.forEach(u => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.is_admin ? "Sí" : "No"}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="4">Error de conexión.</td></tr>`;
    }
}

// Inicial
loadPendingRequests();