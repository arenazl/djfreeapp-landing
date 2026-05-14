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

// Scroll-spy — only runs if the page has nav items with data-spy AND sections with matching IDs.
// Highlights the nav link that maps to the section currently nearest the viewport top.
const spyLinks = document.querySelectorAll('.nav-link[data-spy]');
if (spyLinks.length) {
  const sectionMap = {};
  spyLinks.forEach((link) => {
    const id = link.dataset.spy;
    const sec = document.getElementById(id);
    if (sec) sectionMap[id] = { link, sec };
  });
  const ids = Object.keys(sectionMap);
  if (ids.length) {
    const setActive = (activeId) => {
      ids.forEach((id) => {
        const { link } = sectionMap[id];
        if (id === activeId) {
          link.classList.add('text-white', 'bg-white/5');
          link.classList.remove('text-gray-300');
        } else {
          link.classList.remove('text-white', 'bg-white/5');
          link.classList.add('text-gray-300');
        }
      });
    };
    const onScroll = () => {
      const offset = 120; // header height + breathing room
      let current = null;
      for (const id of ids) {
        const top = sectionMap[id].sec.getBoundingClientRect().top;
        if (top - offset <= 0) current = id;
        else break;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}
