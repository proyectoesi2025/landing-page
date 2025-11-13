/* =========================================================
   utilidades: seleccionar inputs por id o name
   ========================================================= */
function pick(selectorId, selectorName) {
  // Intenta por id
  const byId = selectorId ? document.getElementById(selectorId) : null;
  if (byId) return byId;
  // Si no hay id, intenta por name
  const byName = selectorName
    ? document.querySelector(`[name="${selectorName}"]`)
    : null;
  return byName || null;
}

function showMsg(targetIdOrSelector, text, isError = false) {
  let el = document.getElementById(targetIdOrSelector);
  if (!el) el = document.querySelector(targetIdOrSelector);
  if (!el) {
    alert(text); // fallback
    return;
  }
  el.textContent = text;
  el.style.color = isError ? 'red' : 'green';
}

/* =========================================================
   CONFIG: endpoint base de tu API Laravel
   ========================================================= */
const API_BASE = 'http://127.0.0.1:8000/api';

/* =========================================================
   REGISTRO
   Busca form con id=formRegistro (o name=formRegistro).
   Campos esperados (cualquiera de estas variantes):
   - CI:         id="ci"         o name="CI" / "ci"
   - Nombre:     id="nombre"     o name="Nombre" / "nombre"
   - Email:      id="email"      o name="Email"  / "email"
   - Contrasena: id="contrasena" o name="Contrasena" / "contrasena"
   ========================================================= */
(function setupRegistro() {
  const form =
    document.getElementById('formRegistro') ||
    document.querySelector('form[name="formRegistro"]');
  if (!form) return; // si no existe este form, seguimos con login

  const fldCI         = pick('ci', 'CI') || pick(null, 'ci');
  const fldNombre     = pick('nombre', 'Nombre') || pick(null, 'nombre');
  const fldEmail      = pick('email', 'Email')   || pick(null, 'email');
  const fldContrasena = pick('contrasena', 'Contrasena') || pick(null, 'contrasena');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!fldCI || !fldNombre || !fldEmail || !fldContrasena) {
      showMsg('resultado', 'Faltan campos en el formulario de registro (CI, Nombre, Email o Contraseña). Verifica los ids o names.', true);
      return;
    }

    const datos = {
      CI:         (fldCI.value || '').trim(),
      Nombre:     (fldNombre.value || '').trim(),
      Email:      (fldEmail.value || '').trim(),
      Contrasena: fldContrasena.value || ''
    };

    try {
      const resp = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const json = await resp.json();

      if (resp.ok) {
        localStorage.setItem('token', json.token);
        localStorage.setItem('user', JSON.stringify(json.user));
        showMsg('resultado', 'Registrado correctamente.');
        // window.location.href = '/home.html'; // <- tu ruta si querés redirigir
      } else {
        showMsg('resultado', json.error || (json.message ?? 'Error al registrar'), true);
      }
    } catch (err) {
      showMsg('resultado', 'No se pudo conectar con la API. Verifica que Laravel esté en 127.0.0.1:8000.', true);
      console.error(err);
    }
  });
})();

/* =========================================================
   LOGIN
   Busca form con id=formLogin (o name=formLogin).
   Campos esperados:
   - Email:      id="emaillogin"    o name="Email" / "email"
   - Contrasena: id="passwordlogin" o name="Contrasena" / "contrasena"
   ========================================================= */
(function setupLogin() {
  const form =
    document.getElementById('formLogin') ||
    document.querySelector('form[name="formLogin"]');
  if (!form) return; // si no hay form de login en esta página, termina

  const fldEmail      = pick('emaillogin', 'Email') || pick(null, 'email');
  const fldContrasena = pick('passwordlogin', 'Contrasena') || pick(null, 'contrasena');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!fldEmail || !fldContrasena) {
      showMsg('resultadoLogin', 'Faltan campos en el formulario de login (Email o Contraseña). Verifica los ids o names.', true);
      return;
    }

    const datos = {
      Email:      (fldEmail.value || '').trim(),
      Contrasena: fldContrasena.value || ''
    };

    try {
      const resp = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const json = await resp.json();

      if (resp.ok) {
        localStorage.setItem('token', json.token);
        localStorage.setItem('user', JSON.stringify(json.user));
        showMsg('resultadoLogin', 'Login exitoso.');
        // window.location.href = '/panel.html'; // <- tu ruta si querés redirigir
      } else {
        showMsg('resultadoLogin', json.error || (json.message ?? 'Credenciales inválidas'), true);
      }
    } catch (err) {
      showMsg('resultadoLogin', 'No se pudo conectar con la API. Verifica que Laravel esté en 127.0.0.1:8000.', true);
      console.error(err);
    }
  });
})();

/* =========================================================
   UTIL: ejemplo de consumo autenticado con token
   ========================================================= */
async function apiAutenticada(ruta, options = {}) {
  const token = localStorage.getItem('token');
  const headers = Object.assign(
    { 'Content-Type': 'application/json' },
    options.headers || {},
    token ? { 'Authorization': `Bearer ${token}` } : {}
  );
  const resp = await fetch(`${API_BASE}${ruta}`, { ...options, headers });
  return resp.json();
}