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
  $('.section-nav-next')?.addEventListener('click', () => {
    navTrack?.scrollBy({ left: Math.max(220, innerWidth * .55), behavior: 'smooth' });
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
      en: ['What the property shows', 'Room · Pool · Restaurant · View'],
      es: ['Lo que muestra la propiedad', 'Habitación · Alberca · Restaurante · Vista']
    },
    understood: {
      en: ['What the guest understands', 'Stillness · Privacy · Ritual · Place'],
      es: ['Lo que entiende el huésped', 'Quietud · Privacidad · Ritual · Lugar']
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
        reading: 'Comparing the stay itself',
        label: 'Property strength',
        a: 'Stronger stay',
        b: 'Less distinctive stay'
      },
      es: {
        reading: 'Comparando la estancia en sí',
        label: 'Solidez de la propiedad',
        a: 'Estancia más sólida',
        b: 'Estancia menos distintiva'
      },
      scores: { a: '88', b: '72' },
      lead: 'a'
    },
    presentation: {
      en: {
        reading: 'Comparing what appears on screen',
        label: 'Presentation strength',
        a: 'Harder to recognize',
        b: 'Clearer first impression'
      },
      es: {
        reading: 'Comparando lo que aparece en pantalla',
        label: 'Solidez de la presentación',
        a: 'Más difícil de reconocer',
        b: 'Primera impresión más clara'
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

  const translationData = {
    room: {
      en: ['A well-designed room.', 'The stillness, privacy and pace of the stay.'],
      es: ['Una habitación bien diseñada.', 'La quietud, la privacidad y el ritmo de la estancia.']
    },
    dining: {
      en: ['A restaurant and its food.', 'The ritual, mood and sense of occasion around them.'],
      es: ['Un restaurante y su comida.', 'El ritual, el ambiente y el sentido de ocasión que los rodea.']
    },
    arrival: {
      en: ['An entrance and a lobby.', 'The first feeling of being received by this particular place.'],
      es: ['Una entrada y un lobby.', 'La primera sensación de ser recibido por este lugar en particular.']
    }
  };
  let translationState = 'room';
  function renderTranslation() {
    const data = translationData[translationState][lang()];
    $('#translation-visible').textContent = data[0];
    $('#translation-understood').textContent = data[1];
    $$('[data-translation]').forEach((button) => {
      button.setAttribute('aria-selected', String(button.dataset.translation === translationState));
    });
  }
  $$('[data-translation]').forEach((button) => {
    button.addEventListener('click', () => {
      translationState = button.dataset.translation;
      renderTranslation();
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

  const reportData = {
    en: [
      ['Overall Read', 'How the property is currently understood, and where that understanding begins to lose clarity.'],
      ['Score', 'A structured view of where the presentation is clear, consistent and recognizable.'],
      ['Evidence', 'The specific assets, sequences, gaps and contradictions behind each finding.'],
      ['Channels', 'How the website, listings, social presence and selected materials compare.'],
      ['Priorities', 'What can be corrected now, what needs definition and what requires investment.'],
      ['Next Scope', 'A clear recommendation for what should happen next.']
    ],
    es: [
      ['Lectura general', 'Cómo se entiende actualmente la propiedad y dónde esa lectura comienza a perder claridad.'],
      ['Puntuación', 'Una lectura estructurada de dónde la presentación es clara, coherente y reconocible.'],
      ['Evidencia', 'Los activos, secuencias, vacíos y contradicciones específicos detrás de cada hallazgo.'],
      ['Canales', 'Cómo se comparan el sitio web, los listados, la presencia social y los materiales seleccionados.'],
      ['Prioridades', 'Qué puede corregirse ahora, qué necesita definición y qué requiere inversión.'],
      ['Siguiente alcance', 'Una recomendación clara sobre lo que debe ocurrir después.']
    ]
  };
  const bars = [[72,88,58,82],[42,76,63,91,55,69],[82,24,66,38,92],[88,61,46,72],[100,74,48],[34,55,78,100]];
  let reportIndex = 0;
  function renderReport() {
    const data = reportData[lang()][reportIndex];
    $('#report-title').textContent = data[0];
    $('#report-copy').textContent = data[1];
    $('#report-counter').textContent = (lang() === 'es' ? 'Explora el informe ' : 'Explore the report ') + `${String(reportIndex + 1).padStart(2, '0')} / 06`;
    $('#report-bars').innerHTML = bars[reportIndex].map((height, index) => `<i style="height:${height}%;animation-delay:${index * .05}s"></i>`).join('');
    $$('[data-report]').forEach((button, index) => button.setAttribute('aria-selected', String(index === reportIndex)));
  }
  $$('[data-report]').forEach((button, index) => {
    button.addEventListener('click', () => {
      reportIndex = index;
      renderReport();
    });
  });

  const modes = {
    sharp: {
      en: { title: 'Sharp', copy: 'A concentrated review built around one defined question. Best suited to a smaller property or a specific decision.', mark: 'One defined question', meta: [['Focus','One problem'],['Channels','Limited'],['Outcome','Clear next step']] },
      es: { title: 'Sharp', copy: 'Una revisión concentrada en una pregunta definida. Ideal para una propiedad más pequeña o una decisión específica.', mark: 'Una pregunta definida', meta: [['Enfoque','Un problema'],['Canales','Limitados'],['Resultado','Siguiente paso claro']] }
    },
    exhaustive: {
      en: { title: 'Exhaustive', copy: 'A full reading of the property’s active presentation as one connected system.', mark: 'The active system', meta: [['Focus','Full presentation'],['Channels','Several'],['Outcome','Connected priorities']] },
      es: { title: 'Exhaustive', copy: 'Una lectura completa de la presentación activa de la propiedad como un sistema conectado.', mark: 'El sistema activo', meta: [['Enfoque','Presentación completa'],['Canales','Varios'],['Resultado','Prioridades conectadas']] }
    },
    catalyst: {
      en: { title: 'Catalyst', copy: 'A broader review for a property approaching renovation, repositioning, launch or significant investment.', mark: 'A defining change', meta: [['Focus','Major decision'],['Channels','Current + planned'],['Outcome','Direction before investment']] },
      es: { title: 'Catalyst', copy: 'Una revisión más amplia para una propiedad que se acerca a una renovación, reposicionamiento, lanzamiento o inversión significativa.', mark: 'Un cambio decisivo', meta: [['Enfoque','Decisión importante'],['Canales','Actuales + previstos'],['Resultado','Dirección antes de invertir']] }
    }
  };
  let mode = 'sharp';
  function renderMode() {
    const data = modes[mode][lang()];
    $('#mode-title').textContent = data.title;
    $('#mode-copy').textContent = data.copy;
    $('#mode-mark').textContent = data.mark;
    $('#mode-mark').classList.toggle('is-large', mode === 'catalyst');
    $('#mode-meta').innerHTML = data.meta.map((item) => `<div><small>${item[0]}</small>${item[1]}</div>`).join('');
    $$('[data-mode]').forEach((button) => button.setAttribute('aria-selected', String(button.dataset.mode === mode)));
  }
  $$('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      mode = button.dataset.mode;
      renderMode();
    });
  });

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
    renderTranslation();
    renderReport();
    renderMode();
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
  renderReport();
  renderMode();
  updatePlaceholders();
})();
