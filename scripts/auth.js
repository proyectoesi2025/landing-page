document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("form-login");
  const formRegister = document.getElementById("form-register");

  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      const res = await fetch("api/login.php", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) window.location.href = "dashboard.html";
    });
  }

  if (formRegister) {
    formRegister.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombre = document.getElementById("reg-nombre").value;
      const email = document.getElementById("reg-email").value;
      const password = document.getElementById("reg-password").value;

      const res = await fetch("api/register.php", {
        method: "POST",
        body: JSON.stringify({ nombre, email, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) window.location.href = "dashboard.html";
    });
  }
});