const root = document.documentElement;
const languageToggle = document.querySelector('[data-lang-toggle]');
const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const siteMenu = document.querySelector('[data-site-menu]');
const menuLinks = document.querySelectorAll('[data-menu-link]');
const progressBar = document.querySelector('[data-scroll-progress]');

function setLanguage(lang) {
  root.dataset.lang = lang;
  root.lang = lang;

  document.querySelectorAll('[data-en][data-es]').forEach((element) => {
    element.textContent = element.dataset[lang];
  });

  document.querySelectorAll('[data-en-placeholder][data-es-placeholder]').forEach((element) => {
    element.placeholder = element.dataset[`${lang}Placeholder`];
  });

  updateCompareCopy();
  updateChannelCopy();
  localStorage.setItem('exif-lang', lang);
}

languageToggle?.addEventListener('click', () => {
  setLanguage(root.dataset.lang === 'en' ? 'es' : 'en');
});

function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  menuToggle?.setAttribute('aria-expanded', String(open));
  menuToggle?.setAttribute('aria-label', open ? 'Close site menu' : 'Open site menu');
  siteMenu?.setAttribute('aria-hidden', String(!open));

  if (open) siteMenu?.querySelector('a')?.focus();
}

menuToggle?.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

menuLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false);
});

function updateScrollState() {
  const hasScrolled = window.scrollY > 30;
  header?.classList.toggle('scrolled', hasScrolled);
  document.querySelector('.scroll-progress')?.classList.toggle('is-visible', hasScrolled);
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
  if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
}

updateScrollState();
window.addEventListener('scroll', updateScrollState, { passive: true });
window.addEventListener('resize', updateScrollState);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
const discrepancyConclusion = document.querySelector('.discrepancy-conclusion');
const conclusionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) { discrepancyConclusion?.classList.add('is-visible'); conclusionObserver.disconnect(); }
}), { threshold: .5 });
if (discrepancyConclusion) conclusionObserver.observe(discrepancyConclusion);

const sectionLinks = [...document.querySelectorAll('[data-section-link]')];
const trackedSections = sectionLinks.map((link) => document.getElementById(link.dataset.sectionLink)).filter(Boolean);

const homeNavTrack = document.querySelector('[data-home-nav-track]');
const homeNavNext = document.querySelector('[data-home-nav-next]');
let lastCenteredSection = null;

function centerHomeNavLink(link) {
  if (!homeNavTrack || !link) return;
  const target = link.offsetLeft - (homeNavTrack.clientWidth - link.offsetWidth) / 2;
  homeNavTrack.scrollTo({
    left: Math.max(0, target),
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  });
}

function updateActiveSection() {
  const headerHeight = header?.offsetHeight || 70;
  let current = trackedSections[0]?.id;
  trackedSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= headerHeight + 86) current = section.id;
  });
  sectionLinks.forEach((link) => link.classList.toggle('active', link.dataset.sectionLink === current));
  if (current && current !== lastCenteredSection) {
    lastCenteredSection = current;
    centerHomeNavLink(sectionLinks.find((link) => link.dataset.sectionLink === current));
  }
}

homeNavNext?.addEventListener('click', () => {
  homeNavTrack?.scrollBy({
    left: Math.max(180, window.innerWidth * 0.5),
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  });
});

updateActiveSection();
window.addEventListener('scroll', updateActiveSection, { passive: true });
window.addEventListener('resize', updateActiveSection);

const compare = document.querySelector('[data-property-compare]');
let compareState = 'person';

function updateCompareCopy() {
  if (!compare) return;
  const lang = root.dataset.lang || 'en';
  const observation = compare.querySelector('[data-compare-observation]');
  const context = compare.querySelector('[data-compare-context]');
  const image = compare.querySelector('[data-compare-image]');
  if (observation) observation.textContent = observation.dataset[`${compareState}${lang === 'en' ? 'En' : 'Es'}`];
  if (context) context.textContent = context.dataset[`${compareState}${lang === 'en' ? 'En' : 'Es'}`];
  image?.classList.toggle('image-person', compareState === 'person');
  image?.classList.toggle('image-screen', compareState === 'screen');
}

let compareAutoTimer;
let compareAutoStopped = false;
function setHomeCompare(state, animate = true) {
  if (!compare) return;
  compareState = state;
  const stage = compare.querySelector('.compare-image');
  const copy = compare.querySelector('.compare-copy');
  if (animate) { stage?.classList.add('is-transitioning'); copy?.classList.add('is-transitioning'); }
  window.setTimeout(() => {
    compare.querySelectorAll('[data-compare-tab]').forEach((tab) => {
      const active = tab.dataset.compareTab === state;
      tab.classList.toggle('is-active', active);
      tab.classList.toggle('is-pulsing', active && animate);
      tab.setAttribute('aria-selected', String(active));
    });
    updateCompareCopy();
    stage?.classList.remove('is-transitioning'); copy?.classList.remove('is-transitioning');
    window.setTimeout(() => compare.querySelectorAll('[data-compare-tab]').forEach(tab => tab.classList.remove('is-pulsing')), 800);
  }, animate ? 220 : 0);
}
function stopHomeCompareAuto() {
  compareAutoStopped = true;
  window.clearInterval(compareAutoTimer);
}
compare?.querySelectorAll('[data-compare-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    stopHomeCompareAuto();
    setHomeCompare(button.dataset.compareTab, true);
  });
});
const homeCompareObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (!entry.isIntersecting || compareAutoStopped || compareAutoTimer) return;
  setHomeCompare('person', true);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    compareAutoTimer = window.setInterval(() => {
      setHomeCompare(compareState === 'person' ? 'screen' : 'person', true);
    }, 4600);
  }
}), { threshold: .38 });
if (compare) homeCompareObserver.observe(compare);

const channelReader = document.querySelector('[data-channel-reader]');
let channelState = 'website';

function updateChannelCopy() {
  if (!channelReader) return;
  const lang = root.dataset.lang || 'en';
  const copy = channelReader.querySelector('[data-channel-copy]');
  if (copy) copy.textContent = copy.dataset[`${channelState}${lang === 'en' ? 'En' : 'Es'}`];
}

let channelSequencePlayed = false;
let channelSequenceTimers = [];
function setHomeChannel(state, animate = true) {
  if (!channelReader) return;
  channelState = state;
  const result = channelReader.querySelector('.channel-result');
  if (animate) result?.classList.add('is-transitioning');
  window.setTimeout(() => {
    channelReader.querySelectorAll('[data-channel-tab]').forEach((tab) => {
      const active = tab.dataset.channelTab === state;
      tab.classList.toggle('is-active', active);
      tab.classList.toggle('is-pulsing', active && animate);
      tab.setAttribute('aria-selected', String(active));
    });
    updateChannelCopy();
    result?.classList.remove('is-transitioning');
    window.setTimeout(() => channelReader.querySelectorAll('[data-channel-tab]').forEach(tab => tab.classList.remove('is-pulsing')), 800);
  }, animate ? 200 : 0);
}
channelReader?.querySelectorAll('[data-channel-tab]').forEach((button) => {
  button.addEventListener('click', () => { channelSequenceTimers.forEach(clearTimeout); setHomeChannel(button.dataset.channelTab, true); });
});
const channelObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (!entry.isIntersecting || channelSequencePlayed) return;
  channelSequencePlayed = true;
  setHomeChannel('website', true);
  channelSequenceTimers.push(window.setTimeout(() => setHomeChannel('ota', true), 1550));
  channelSequenceTimers.push(window.setTimeout(() => setHomeChannel('social', true), 3100));
  channelObserver.disconnect();
}), { threshold: .42 });
if (channelReader) channelObserver.observe(channelReader);

const faqItems = [...document.querySelectorAll('.faq-list details')];
faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const contactForm = document.querySelector('[data-contact-form]');
function getFormMessage(key) {
  const messages = {
    en: {
      required: 'Please complete the required fields.',
      sending: 'Sending…',
      success: 'Thank you. We’ll review the property before we reply.',
      error: 'Something went wrong. Please try again or email hello@exif.studio.',
      send: 'Send property details'
    },
    es: {
      required: 'Completa los campos obligatorios.',
      sending: 'Enviando…',
      success: 'Gracias. Revisaremos la propiedad antes de responder.',
      error: 'Algo salió mal. Intenta nuevamente o escribe a hello@exif.studio.',
      send: 'Enviar datos de la propiedad'
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
    const response = await fetch(contactForm.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const formspreeError = result?.errors?.map((item) => item.message).filter(Boolean).join(' ') || result?.error || result?.message;
      throw new Error(formspreeError || 'Request failed');
    }
    contactForm.reset();
    setLanguage(root.dataset.lang || 'en');
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
  const reachedEnd = localSectionNav.scrollLeft + localSectionNav.clientWidth >= localSectionNav.scrollWidth - 12;
  localSectionNav.classList.toggle('has-reached-end', reachedEnd);
}
localSectionNav?.addEventListener('scroll', updateSectionNavHint, { passive: true });
window.addEventListener('resize', updateSectionNavHint);
updateSectionNavHint();

setLanguage(localStorage.getItem('exif-lang') || 'en');
