(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-site-menu]');
  const theme = document.querySelector('#theme-color');
  const progress = document.querySelector('[data-scroll-progress]');
  const menuLinks = [...document.querySelectorAll('[data-menu-link]')];
  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let previousFocus = null;
  let scrollY = 0;

  function menuFocusable(){ return [...menu.querySelectorAll(focusableSelector)].filter(el => !el.hasAttribute('hidden')); }
  function setMenu(open){
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    menu.classList.toggle('is-open', open);
    header.classList.toggle('menu-active', open);
    body.classList.toggle('menu-open', open);
    theme?.setAttribute('content', open ? '#071A18' : (header.classList.contains('is-green') ? '#071A18' : '#F2EDE4'));
    if(open){
      previousFocus = document.activeElement;
      scrollY = window.scrollY;
      body.style.position = 'fixed'; body.style.top = `-${scrollY}px`; body.style.width = '100%';
      requestAnimationFrame(() => menuFocusable()[0]?.focus());
    } else {
      body.style.position = ''; body.style.top = ''; body.style.width = '';
      window.scrollTo(0, scrollY);
      previousFocus?.focus();
    }
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menuLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if(toggle.getAttribute('aria-expanded') !== 'true') return;
    if(event.key === 'Escape'){ event.preventDefault(); setMenu(false); return; }
    if(event.key !== 'Tab') return;
    const focusable = menuFocusable(); if(!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if(event.shiftKey && document.activeElement === first){ event.preventDefault(); last.focus(); }
    else if(!event.shiftKey && document.activeElement === last){ event.preventDefault(); first.focus(); }
  });


  function updateProgress(){
    if(!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress.style.transform = `scaleX(${ratio})`;
  }
  let progressFrame = 0;
  function requestProgressUpdate(){
    if(progressFrame) return;
    progressFrame = requestAnimationFrame(() => {
      progressFrame = 0;
      updateProgress();
    });
  }
  updateProgress();
  addEventListener('scroll', requestProgressUpdate, {passive:true});
  addEventListener('resize', requestProgressUpdate, {passive:true});

  const themed = [...document.querySelectorAll('[data-header-theme]')];
  const observer = new IntersectionObserver(entries => {
    if(toggle.getAttribute('aria-expanded') === 'true') return;
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible) return;
    const green = visible.target.dataset.headerTheme === 'green';
    header.classList.toggle('is-green', green);
    theme?.setAttribute('content', green ? '#071A18' : '#F2EDE4');
  }, {rootMargin:'-8% 0px -82% 0px', threshold:[0,.01,.5]});
  themed.forEach(section => observer.observe(section));

  const form = document.querySelector('[data-contact-form]');
  const status = document.querySelector('[data-form-status]');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if(!form.reportValidity()) return;
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true; status.textContent = 'Sending…';
    try {
      const response = await fetch(form.action, {method:'POST', body:new FormData(form), headers:{Accept:'application/json'}});
      if(!response.ok) throw new Error('Submission failed');
      form.reset(); status.textContent = 'Sent. EXIF will reply by email.';
    } catch(error) {
      status.innerHTML = 'The form could not send. Email <a href="mailto:hello@exif.studio">hello@exif.studio</a>.';
    } finally { button.disabled = false; }
  });
})();
