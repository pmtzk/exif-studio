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

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

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

const contactForm = document.querySelector('[data-contact-form]');

function getFormMessage(key) {
  const messages = {
    en: {
      required: 'Please complete the required fields.',
      sending: 'Sending…',
      success: 'Thank you. We’ll review the property before we reply.',
      error: 'Something went wrong. Please try again or email hello@exif.studio.',
      send: 'Send inquiry'
    },
    es: {
      required: 'Completa los campos obligatorios.',
      sending: 'Enviando…',
      success: 'Gracias. Revisaremos la propiedad antes de responder.',
      error: 'Algo salió mal. Intenta nuevamente o escribe a hello@exif.studio.',
      send: 'Enviar consulta'
    }
  };

  return messages[root.dataset.lang || 'en'][key];
}

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const status = contactForm.querySelector('[data-form-status]');
  const button = contactForm.querySelector('[type="submit"]');
  const requiredFields = [...contactForm.querySelectorAll('[required]')];

  let valid = true;

  requiredFields.forEach((field) => {
    const fieldIsValid = field.checkValidity();
    field.setAttribute('aria-invalid', String(!fieldIsValid));
    if (!fieldIsValid) valid = false;
  });

  if (!valid) {
    status.textContent = getFormMessage('required');
    status.className = 'form-status is-error';
    requiredFields.find((field) => !field.checkValidity())?.focus();
    return;
  }

  const data = new FormData(contactForm);
  button.disabled = true;
  button.textContent = getFormMessage('sending');
  status.textContent = '';
  status.className = 'form-status';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' }
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const formspreeError =
        result?.errors?.map((item) => item.message).filter(Boolean).join(' ') ||
        result?.error ||
        result?.message;

      throw new Error(formspreeError || 'Request failed');
    }

    contactForm.reset();
    status.textContent = getFormMessage('success');
    status.className = 'form-status is-success';
  } catch (error) {
    console.error('Contact form error:', error);
    status.textContent = error.message || getFormMessage('error');
    status.className = 'form-status is-error';
  } finally {
    button.disabled = false;
    button.textContent = getFormMessage('send');
  }
});

const localSectionNav = document.querySelector('.section-nav');

function updateSectionNavHint() {
  if (!localSectionNav) return;

  const reachedEnd =
    localSectionNav.scrollLeft + localSectionNav.clientWidth >=
    localSectionNav.scrollWidth - 12;

  localSectionNav.classList.toggle('has-reached-end', reachedEnd);
}

localSectionNav?.addEventListener('scroll', updateSectionNavHint, { passive: true });
window.addEventListener('resize', updateSectionNavHint);
updateSectionNavHint();
