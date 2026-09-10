// EXIF Studio — site behavior

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-open', isOpen);
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      });
    });
  }

  // Dear EXIF form — submits to Formspree via fetch so we can show a
  // custom confirmation instead of redirecting to formspree.io
  var form = document.getElementById('dear-exif-form');
  var status = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var submitBtn = form.querySelector('button[type="submit"]');

      status.textContent = '';
      status.removeAttribute('data-state');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            status.dataset.state = 'success';
            status.textContent = 'Thank you. EXIF will review your property and respond personally.';
          } else {
            return response.json().then(function (json) {
              throw new Error((json && json.errors) ? json.errors.map(function (er) { return er.message; }).join(', ') : 'Something went wrong.');
            });
          }
        })
        .catch(function (err) {
          status.dataset.state = 'error';
          status.textContent = 'The form could not be sent (' + err.message + '). Please email hello@exif.studio directly.';
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send to EXIF'; }
        });
    });
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
});
