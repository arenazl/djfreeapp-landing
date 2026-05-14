// Mobile menu
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
function openMobileMenu()  { mobileMenu.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
function closeMobileMenu() { mobileMenu.classList.add('hidden');    document.body.style.overflow = ''; }
if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);

// Top bar shadow on scroll
const topBar = document.getElementById('topBar');
window.addEventListener('scroll', () => {
  if (!topBar) return;
  if (window.scrollY > 30) topBar.classList.add('scrolled');
  else                     topBar.classList.remove('scrolled');
});

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });
document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
