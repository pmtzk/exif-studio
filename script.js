const root = document.documentElement;
const languageToggle = document.querySelector('[data-lang-toggle]');
const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const siteMenu = document.querySelector('[data-site-menu]');
const menuLinks = document.querySelectorAll('[data-menu-link]');

function setLanguage(lang) {
  root.dataset.lang = lang;
  root.lang = lang;

  document.querySelectorAll('[data-en][data-es]').forEach((element) => {
    element.textContent = element.dataset[lang];
  });

  localStorage.setItem('exif-lang', lang);
}

setLanguage(localStorage.getItem('exif-lang') || 'en');

languageToggle?.addEventListener('click', () => {
  setLanguage(root.dataset.lang === 'en' ? 'es' : 'en');
});

function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  menuToggle?.setAttribute('aria-expanded', String(open));
  menuToggle?.setAttribute('aria-label', open ? 'Close site menu' : 'Open site menu');
  siteMenu?.setAttribute('aria-hidden', String(!open));

  if (open) {
    siteMenu?.querySelector('a')?.focus();
  } else {
    menuToggle?.focus();
  }
}

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  setMenu(open);
});

menuLinks.forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
    setMenu(false);
  }
});

const onScroll = () => {
  header?.classList.toggle('scrolled', window.scrollY > 30);
};

onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => {
  revealObserver.observe(element);
});

const sectionLinks = [...document.querySelectorAll('[data-section-link]')];
const trackedSections = sectionLinks
  .map((link) => document.getElementById(link.dataset.sectionLink))
  .filter(Boolean);

function updateActiveSection() {
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
}

updateActiveSection();
window.addEventListener('scroll', updateActiveSection, { passive: true });
window.addEventListener('resize', updateActiveSection);
