/*
  js.js
  Controla la página de login:
  - Mostrar/ocultar contraseña
  - Validar campos obligatorios
  - Enviar credenciales al servidor
  - Manejar los botones sociales
*/

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.querySelector('.btn-login');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const togglePwBtn = document.querySelector('.toggle-pw');
  const googleBtn = document.querySelector('.btn-social');
  const appleBtn = document.querySelectorAll('.btn-social')[1];

  // Toggle password visibility
  if (togglePwBtn) {
    togglePwBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      togglePwBtn.classList.toggle('active');
    });
  }

  // Google button alert
  if (googleBtn) {
    googleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('No tienes correo que conectar');
    });
  }

  // Apple button alert
  if (appleBtn) {
    appleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('No tienes cuenta de Apple que conectar');
    });
  }
  
    // VALIDAR TELÉFONO EN AGREGAR CONTACTO
  loginBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert('Por favor completa todos los campos.');
      return;
    }

    // Validación fija
    if (email !== "admin" || password !== "1234") {
      alert('Credenciales inválidas');
      return;
    }

    // Si pasa validación → enviar al servidor
    fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.href = '/menu'; // redirige a menú
      } else {
        alert(data.error || 'Error en las credenciales');
      }
    })
    .catch(err => console.error(err));
  });
});
