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

document.getElementById('switchToLogin').onclick = () => toggleSections(false); 
document.getElementById('switchToRegister').onclick = () => toggleSections(true);