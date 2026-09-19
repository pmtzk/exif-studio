// 180902 — restrained motion + a small working-interface moment.
document.addEventListener('DOMContentLoaded', function () {
  var elements = document.querySelectorAll('.reveal, .reveal-media');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    elements.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    elements.forEach(function (el) { observer.observe(el); });
  }

  var signals = document.querySelectorAll('.signal[data-panel]');
  var panels = document.querySelectorAll('.canvas-panel[data-content]');
  signals.forEach(function (signal) {
    signal.addEventListener('click', function () {
      var target = signal.getAttribute('data-panel');
      signals.forEach(function (item) { item.classList.remove('active'); });
      panels.forEach(function (panel) { panel.classList.toggle('active', panel.getAttribute('data-content') === target); });
      signal.classList.add('active');
    });
  });

  var steps = document.querySelectorAll('.sequence-step');
  steps.forEach(function (step) {
    step.addEventListener('click', function () {
      steps.forEach(function (item) { item.classList.remove('active'); });
      step.classList.add('active');
    });
  });
});
