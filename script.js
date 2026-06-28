const root = document.documentElement;
const toggle = document.querySelector('[data-lang-toggle]');
const header = document.querySelector('[data-header]');

function setLanguage(lang) {
  root.dataset.lang = lang;
  root.lang = lang;
  document.querySelectorAll('[data-en][data-es]').forEach((el) => {
    el.textContent = el.dataset[lang];
  });
  localStorage.setItem('exif-lang', lang);
}

setLanguage(localStorage.getItem('exif-lang') || 'en');

toggle?.addEventListener('click', () => {
  setLanguage(root.dataset.lang === 'en' ? 'es' : 'en');
});

const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 30);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));


const sectionLinks = [...document.querySelectorAll('[data-section-link]')];
const trackedSections = sectionLinks
  .map((link) => document.getElementById(link.dataset.sectionLink))
  .filter(Boolean);

const updateActiveSection = () => {
  const headerHeight = header?.offsetHeight || 70;
  let current = trackedSections[0]?.id;

  trackedSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= headerHeight + 70) {
      current = section.id;
    }
  });

  sectionLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.sectionLink === current);
  });
};

updateActiveSection();
window.addEventListener('scroll', updateActiveSection, { passive: true });
window.addEventListener('resize', updateActiveSection);
