document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.querySelector('.toggle-button');
  const nav = document.querySelector('nav');

  toggleButton.addEventListener('click', () => {
    nav.classList.toggle('show');
  });
});