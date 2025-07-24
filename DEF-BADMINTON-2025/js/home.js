// ✅ Mobile toggle for navigation
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

// Enhance ARIA support for accessibility
menuToggle.setAttribute("aria-label", "Toggle navigation menu");
menuToggle.setAttribute("aria-controls", "nav-links");
menuToggle.setAttribute("aria-expanded", "false");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
  const isExpanded = navLinks.classList.contains("show");
  menuToggle.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isExpanded);
});

// ✅ Highlight current page in the navigation menu
document.querySelectorAll("nav a").forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

// ✅ Sticky Header with Shadow on Scroll
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 0);
  }
});