/* Atmosphere Audit — page interactions, V3 */
(function () {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const lang = () => document.documentElement.dataset.lang === 'es' ? 'es' : 'en';

  const progress = $('.progress i');
  function updateProgress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${max ? scrollY / max : 0})`;
  }
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);
  updateProgress();

  const navTrack = $('.section-nav-track');
  const navLinks = $$('.section-nav a');
  const navNext = $('.section-nav-next');
  navNext?.addEventListener('click', () => {
    if (!navTrack) return;
    const nextLeft = Math.min(navTrack.scrollLeft + Math.max(220, innerWidth * .55), navTrack.scrollWidth - navTrack.clientWidth);
    navTrack.scrollTo({ left: nextLeft, behavior: 'smooth' });
    if (nextLeft >= navTrack.scrollWidth - navTrack.clientWidth - 4) navNext.disabled = true;
  });

  function updateNav() {
    let current = navLinks[0];
    const offset = innerWidth <= 900 ? 122 : 136;
    navLinks.forEach((link) => {
      const section = $(link.getAttribute('href'));
      if (section && section.getBoundingClientRect().top <= offset + 28) current = link;
    });
    navLinks.forEach((link) => {
      const active = link === current;
      link.classList.toggle('is-current', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  const lensData = {
    visible: {
      en: ['The property shows:', 'A room · A pool · A restaurant · A view'],
      es: ['La propiedad muestra:', 'Una habitación · Una alberca · Un restaurante · Una vista']
    },
    understood: {
      en: ['The guest needs to see:', 'The stillness · The privacy · The ambience · The experience'],
      es: ['El huésped necesita ver:', 'La calma · La privacidad · El ambiente · La experiencia']
    }
  };
  let lensState = 'visible';
  function renderLens() {
    const data = lensData[lensState][lang()];
    $('#lens-title').textContent = data[0];
    $('#lens-list').textContent = data[1];
    $('.lens').dataset.state = lensState;
    $$('[data-lens]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.lens === lensState));
    });
  }
  $$('[data-lens]').forEach((button) => {
    button.addEventListener('click', () => {
      lensState = button.dataset.lens;
      renderLens();
    });
  });

  const compareData = {
    property: {
      en: {
        reading: 'The stay itself',
        label: 'Score out of 100',
        a: 'Beautiful, distinctive stay in person',
        b: 'Less distinctive stay in person'
      },
      es: {
        reading: 'La estancia en sí',
        label: 'Puntuación sobre 100',
        a: 'Estancia hermosa y distintiva en persona',
        b: 'Estancia menos distintiva en persona'
      },
      scores: { a: '88', b: '56' },
      lead: 'a'
    },
    presentation: {
      en: {
        reading: 'What guests see online',
        label: 'Score out of 100',
        a: 'Weak online presence',
        b: 'Impactful first impression online'
      },
      es: {
        reading: 'Lo que el huésped ve en línea',
        label: 'Puntuación sobre 100',
        a: 'Presencia digital débil',
        b: 'Primera impresión digital de alto impacto'
      },
      scores: { a: '58', b: '91' },
      lead: 'b'
    }
  };
  let compareState = 'property';
  function renderCompare() {
    const base = compareData[compareState];
    const data = base[lang()];
    $('#compare-reading').textContent = data.reading;
    ['a', 'b'].forEach((key) => {
      $(`[data-score="${key}"]`).textContent = base.scores[key];
      $(`[data-score-label="${key}"]`).textContent = data.label;
      $(`[data-summary="${key}"]`).textContent = data[key];
      $(`[data-card="${key}"]`).classList.toggle('lead', base.lead === key);
      $(`[data-card="${key}"] small`).textContent = (lang() === 'es' ? 'Propiedad ' : 'Property ') + key.toUpperCase();
    });
    $$('[data-compare]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.compare === compareState));
    });
  }
  $$('[data-compare]').forEach((button) => {
    button.addEventListener('click', () => {
      compareState = button.dataset.compare;
      renderCompare();
    });
  });


  function bindSingleOpenGroup(triggerSelector, itemSelector, openClass) {
    $$(triggerSelector).forEach((button) => {
      button.addEventListener('click', () => {
        const item = button.closest(itemSelector);
        const wasOpen = item.classList.contains(openClass);
        $$(itemSelector).forEach((entry) => {
          entry.classList.remove(openClass);
          $(triggerSelector, entry)?.setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          item.classList.add(openClass);
          button.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
  bindSingleOpenGroup('.review-trigger', '.review-item', 'is-open');
  bindSingleOpenGroup('.audit-group-trigger', '.audit-group', 'is-open');

  $$('.faq-q').forEach((button) => {
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      $$('.faq-q').forEach((entry) => entry.setAttribute('aria-expanded', 'false'));
      if (!open) button.setAttribute('aria-expanded', 'true');
    });
  });

  function updatePlaceholders() {
    $$('[data-en-placeholder][data-es-placeholder]').forEach((element) => {
      element.placeholder = element.dataset[lang() + 'Placeholder'];
    });
  }

  const languageObserver = new MutationObserver(() => {
    renderLens();
    renderCompare();
    updatePlaceholders();
  });
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });

  const form = $('[data-aa-form]');
  const messages = {
    en: { required: 'Please complete the required fields.', sending: 'Sending…', success: 'Thank you. We’ll review the property before we reply.', error: 'Something went wrong. Please try again or email hello@exif.studio.', send: 'Send property details' },
    es: { required: 'Completa los campos obligatorios.', sending: 'Enviando…', success: 'Gracias. Revisaremos la propiedad antes de responder.', error: 'Algo salió mal. Intenta nuevamente o escribe a hello@exif.studio.', send: 'Enviar datos de la propiedad' }
  };
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = $('[data-form-status]', form);
    const button = $('[type="submit"]', form);
    const required = $$('[required]', form);
    let valid = true;
    required.forEach((field) => {
      const ok = field.checkValidity();
      field.setAttribute('aria-invalid', String(!ok));
      if (!ok) valid = false;
    });
    if (!valid) {
      status.textContent = messages[lang()].required;
      status.className = 'form-status is-error';
      required.find((field) => !field.checkValidity())?.focus();
      return;
    }
    button.disabled = true;
    button.textContent = messages[lang()].sending;
    status.textContent = '';
    try {
      const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error();
      form.reset();
      status.textContent = messages[lang()].success;
      status.className = 'form-status is-success';
    } catch (_) {
      status.textContent = messages[lang()].error;
      status.className = 'form-status is-error';
    } finally {
      button.disabled = false;
      button.textContent = messages[lang()].send;
    }
  });

  renderLens();
  renderCompare();
  renderTranslation();
  updatePlaceholders();
})();
