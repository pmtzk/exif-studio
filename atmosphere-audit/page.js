/* Atmosphere Audit — page interactions */

(function () {
  'use strict';

  /* ── Reading progress bar ── */
  const progressFill = document.querySelector('.progress i');
  let progTicking = false;

  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressFill) {
      progressFill.style.transform = `scaleX(${max ? window.scrollY / max : 0})`;
    }
    progTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!progTicking) {
      requestAnimationFrame(updateProgress);
      progTicking = true;
    }
  }, { passive: true });

  updateProgress();

  /* ── Lens toggle ── */
  const lensData = {
    visible:     { title: 'What is visible',    list: 'Room · Pool · Restaurant · View' },
    understood:  { title: 'What is understood', list: 'Stillness · Privacy · Ritual · Place' }
  };

  const lensEl    = document.querySelector('.lens');
  const lensTitle = document.getElementById('lens-title');
  const lensList  = document.getElementById('lens-list');

  document.querySelectorAll('[data-lens]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const state = btn.dataset.lens;
      document.querySelectorAll('[data-lens]').forEach((b) =>
        b.setAttribute('aria-pressed', String(b === btn))
      );
      if (lensEl)    lensEl.dataset.state = state;
      if (lensTitle) lensTitle.textContent = lensData[state].title;
      if (lensList)  lensList.textContent  = lensData[state].list;
    });
  });

  /* ── Compare switch ── */
  const compareData = {
    property: {
      a: { score: '88', items: ['Stronger setting', 'More considered stay', 'Clearer sense of place'], lead: true },
      b: { score: '72', items: ['More ordinary offer', 'Less distinctive setting', 'Fewer memorable details'], lead: false }
    },
    presentation: {
      a: { score: '58', items: ['Best images appear late', 'Repeated room coverage', 'Atmosphere left implicit'], lead: false },
      b: { score: '91', items: ['Clear opening sequence', 'Disciplined hierarchy', 'Distinct first impression'], lead: true }
    }
  };

  document.querySelectorAll('[data-compare]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const d = compareData[btn.dataset.compare];
      document.querySelectorAll('[data-compare]').forEach((b) =>
        b.setAttribute('aria-pressed', String(b === btn))
      );
      ['a', 'b'].forEach((k) => {
        const scoreEl = document.querySelector(`[data-score="${k}"]`);
        const listEl  = document.querySelector(`[data-list="${k}"]`);
        const cardEl  = document.querySelector(`[data-card="${k}"]`);
        if (scoreEl) scoreEl.textContent = d[k].score;
        if (listEl)  listEl.innerHTML = d[k].items.map((x) => `<li>${x}</li>`).join('');
        if (cardEl)  cardEl.classList.toggle('lead', d[k].lead);
      });
    });
  });

  /* ── Criteria explorer ── */
  const insights = [
    'Recognition is the difference between showing a beautiful property and showing this property.',
    'Translation asks whether the experience promised in words becomes visible in evidence.',
    'Hierarchy determines what the viewer understands before attention begins to fade.',
    'Consistency allows every active channel to reinforce the same impression.',
    'Coverage reveals whether the reasons behind the booking decision are actually present.',
    'Currency protects the property from being represented by a version that no longer exists.',
    'Direction gives future collaborators a world they can continue without diluting it.'
  ];

  const mcount  = document.getElementById('mcount');
  const mfill   = document.getElementById('mfill');
  const insight = document.getElementById('insight');

  document.querySelectorAll('.criterion').forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.i;
      document.querySelectorAll('.criterion').forEach((b) =>
        b.setAttribute('aria-selected', String(b === btn))
      );
      if (mcount)  mcount.textContent  = `${String(i + 1).padStart(2, '0')} / 07`;
      if (mfill)   mfill.style.width   = `${((i + 1) / 7) * 100}%`;
      if (insight) insight.textContent = insights[i];
    });
  });

  /* ── Absence scroll animation ── */
  const absenceSection = document.querySelector('.aa-absence');

  function updateAbsence() {
    if (!absenceSection) return;
    const r = absenceSection.getBoundingClientRect();
    const total = absenceSection.offsetHeight - window.innerHeight;
    const p = Math.min(Math.max(-r.top, 0), total) / (total || 1);

    document.querySelectorAll('[data-absence]').forEach((el, i) => {
      el.classList.toggle('fade', p > 0.18 + i * 0.15 && i % 2 === 0);
    });
  }

  window.addEventListener('scroll', updateAbsence, { passive: true });
  updateAbsence();

  /* ── Role selector ── */
  const rolesData = {
    owner: {
      pill:     'Reading as: Property Owner',
      title:    'You already know the place deserves a stronger position.',
      copy:     'The Audit shows what should change, what can already be used and where new investment will matter most, without turning the process into another full-time project.',
      benefits: ['Clear priorities', 'Investment decisions', 'Stronger positioning', 'Minimal operational burden']
    },
    marketing: {
      pill:     'Reading as: Marketing Lead',
      title:    'The work is already moving. The scope still needs to become clear.',
      copy:     'EXIF provides a focused outside reading and returns the problem as a usable scope your team can align around.',
      benefits: ['External perspective', 'Stakeholder alignment', 'Production clarity', 'Time returned']
    },
    manager: {
      pill:     'Reading as: Property or Portfolio Manager',
      title:    'You need to separate what is urgent from what is merely visible.',
      copy:     'The Audit identifies where standards have drifted, what can be corrected and where investment is required.',
      benefits: ['Portfolio consistency', 'Asset reuse', 'Operational priorities', 'Smarter investment']
    },
    concept: {
      pill:     'Reading as: Hospitality Concept',
      title:    'The parts are strong. They still need to belong to one place.',
      copy:     'EXIF reads the food, space, service and rituals together before photography, identity or launch materials are commissioned.',
      benefits: ['Concept coherence', 'Pre-production clarity', 'Launch direction', 'A recognizable world']
    }
  };

  const rolePill     = document.getElementById('role-reading');
  const roleTitle    = document.getElementById('role-title');
  const roleCopy     = document.getElementById('role-copy');
  const roleBenefits = document.getElementById('role-benefits');

  document.querySelectorAll('[data-role]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const d = rolesData[btn.dataset.role];
      document.querySelectorAll('[data-role]').forEach((b) =>
        b.setAttribute('aria-selected', String(b === btn))
      );
      if (rolePill)     rolePill.textContent     = d.pill;
      if (roleTitle)    roleTitle.textContent     = d.title;
      if (roleCopy)     roleCopy.textContent      = d.copy;
      if (roleBenefits) roleBenefits.innerHTML    = d.benefits.map((x) => `<span>${x}</span>`).join('');
    });
  });

  /* ── Layer buttons + card stack ── */
  document.querySelectorAll('[data-layer]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.layer;
      document.querySelectorAll('[data-layer]').forEach((b) =>
        b.setAttribute('aria-pressed', String(b === btn))
      );
      document.querySelectorAll('.stack-card').forEach((card, j) =>
        card.classList.toggle('active', i === j)
      );
    });
  });

  /* ── Process steps IntersectionObserver ── */
  const stepObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('show');
      });
    },
    { threshold: 0.35 }
  );

  document.querySelectorAll('.process-step').forEach((step) => {
    stepObserver.observe(step);
  });

  /* ── Report tabs ── */
  const reportData = [
    { title: 'Overall Read',  copy: 'How the property is currently understood across its presentation, and where that understanding begins to lose clarity.',          bars: [72, 88, 58, 82] },
    { title: 'Score',         copy: 'A structured view of where the presentation is clear, consistent and recognizable.',                                             bars: [42, 76, 63, 91, 55, 69, 80] },
    { title: 'Evidence',      copy: 'The specific assets, sequences, gaps and contradictions behind each finding.',                                                   bars: [82, 24, 66, 38, 92] },
    { title: 'Channels',      copy: 'How the website, listings, social presence and other materials compare.',                                                        bars: [88, 61, 46, 72] },
    { title: 'Priorities',    copy: 'What can be corrected now, what needs definition and what requires investment.',                                                  bars: [100, 74, 48] },
    { title: 'Next Scope',    copy: 'A clear recommendation for what should happen next.',                                                                            bars: [34, 55, 78, 100] }
  ];

  const rTitle   = document.getElementById('report-title');
  const rCopy    = document.getElementById('report-copy');
  const rCounter = document.getElementById('report-counter');
  const rBars    = document.getElementById('report-bars');

  function renderReport(i) {
    const d = reportData[i];
    if (rTitle)   rTitle.textContent   = d.title;
    if (rCopy)    rCopy.textContent    = d.copy;
    if (rCounter) rCounter.textContent = `Explore the report ${String(i + 1).padStart(2, '0')} / 06`;
    if (rBars)    rBars.innerHTML      = d.bars
      .map((h, j) => `<i style="height:${h}%;animation-delay:${j * .06}s"></i>`)
      .join('');
  }

  document.querySelectorAll('[data-report]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.report;
      document.querySelectorAll('[data-report]').forEach((b) =>
        b.setAttribute('aria-selected', String(b === btn))
      );
      renderReport(i);
    });
  });

  renderReport(0);

  /* ── Mode tabs ── */
  const modesData = {
    sharp: {
      title: 'Sharp',
      copy:  'A concentrated review built around one defined question. Best suited to a smaller property or a specific decision.',
      ring:  'One defined question',
      size:  '',
      meta:  [['Focus', 'One problem'], ['Channels', 'Limited'], ['Outcome', 'Clear next step']]
    },
    exhaustive: {
      title: 'Exhaustive',
      copy:  'A full reading of the active presentation as one system.',
      ring:  'The active system',
      size:  'med',
      meta:  [['Focus', 'Full presentation'], ['Channels', 'Several'], ['Outcome', 'Connected priorities']]
    },
    catalyst: {
      title: 'Catalyst',
      copy:  'A review for properties preparing to open or undergo a substantial change.',
      ring:  'A property in transformation',
      size:  'big',
      meta:  [['Focus', 'Open decisions'], ['Channels', 'Still forming'], ['Outcome', 'Direction before production']]
    }
  };

  const modeTitle = document.getElementById('mode-title');
  const modeCopy  = document.getElementById('mode-copy');
  const ringEl    = document.getElementById('ring');
  const metaEl    = document.getElementById('mode-meta');

  document.querySelectorAll('[data-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const d = modesData[btn.dataset.mode];
      document.querySelectorAll('[data-mode]').forEach((b) =>
        b.setAttribute('aria-selected', String(b === btn))
      );
      if (modeTitle) modeTitle.textContent = d.title;
      if (modeCopy)  modeCopy.textContent  = d.copy;
      if (ringEl) {
        ringEl.textContent  = d.ring;
        ringEl.className    = 'ring' + (d.size ? ' ' + d.size : '');
      }
      if (metaEl) {
        metaEl.innerHTML = d.meta
          .map((x) => `<div><b>${x[0]}</b><br>${x[1]}</div>`)
          .join('');
      }
    });
  });

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-q').forEach((b) =>
        b.setAttribute('aria-expanded', 'false')
      );
      if (!isOpen) btn.setAttribute('aria-expanded', 'true');
    });
  });

  /* ── Contact form (Atmosphere Audit) ── */
  const aaForm = document.querySelector('[data-aa-form]');

  function getMsg(key) {
    const lang = document.documentElement.dataset.lang || 'en';
    const msgs = {
      en: {
        required: 'Please complete the required fields.',
        sending:  'Sending…',
        success:  'Thank you. We will review the property before we reply.',
        error:    'Something went wrong. Please try again or email hello@exif.studio.',
        send:     'Share the context'
      },
      es: {
        required: 'Completa los campos obligatorios.',
        sending:  'Enviando…',
        success:  'Gracias. Revisaremos la propiedad antes de responder.',
        error:    'Algo salió mal. Intenta de nuevo o escribe a hello@exif.studio.',
        send:     'Compartir el contexto'
      }
    };
    return msgs[lang][key];
  }

  aaForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status  = aaForm.querySelector('[data-form-status]');
    const button  = aaForm.querySelector('[type="submit"]');
    const required = [...aaForm.querySelectorAll('[required]')];
    let valid = true;

    required.forEach((f) => {
      const ok = f.checkValidity();
      f.setAttribute('aria-invalid', String(!ok));
      if (!ok) valid = false;
    });

    if (!valid) {
      status.textContent = getMsg('required');
      status.className   = 'form-status is-error';
      required.find((f) => !f.checkValidity())?.focus();
      return;
    }

    button.disabled     = true;
    button.textContent  = getMsg('sending');
    status.textContent  = '';
    status.className    = 'form-status';

    try {
      const res    = await fetch(aaForm.action, { method: 'POST', body: new FormData(aaForm), headers: { Accept: 'application/json' } });
      const result = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(result?.errors?.map((x) => x.message).join(' ') || result?.error || 'Request failed');

      aaForm.reset();
      status.textContent = getMsg('success');
      status.className   = 'form-status is-success';
    } catch (err) {
      status.textContent = err.message || getMsg('error');
      status.className   = 'form-status is-error';
    } finally {
      button.disabled    = false;
      button.textContent = getMsg('send');
    }
  });

})();
