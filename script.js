// ---------- Year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Header scroll state + progress bar ----------
const header = document.getElementById('siteHeader');
const progressBar = document.getElementById('progressBar');
const backToTop = document.getElementById('backToTop');

function onScroll() {
  const scrollTop = window.scrollY;
  header.classList.toggle('scrolled', scrollTop > 10);
  backToTop.classList.toggle('visible', scrollTop > 500);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ---------- Animated stat counters ----------
const statEls = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isDecimal = String(el.dataset.count).includes('.');
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });

statEls.forEach(el => statObserver.observe(el));

// ---------- Service card example modal ----------
const exampleModal = document.getElementById('exampleModal');
const exampleModalFrame = document.getElementById('exampleModalFrame');
const exampleModalCaption = document.getElementById('exampleModalCaption');
const exampleModalLink = document.getElementById('exampleModalLink');
const exampleModalClose = document.getElementById('exampleModalClose');
const exampleModalBackdrop = document.getElementById('exampleModalBackdrop');

function openExampleModal(card) {
  const mode = card.dataset.mode;
  const link = card.dataset.link;

  if (mode === 'external') {
    window.open(link, '_blank', 'noopener');
    return;
  }

  exampleModalFrame.src = card.dataset.src;
  exampleModalCaption.textContent = card.dataset.caption || '';
  exampleModalLink.href = link;
  exampleModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeExampleModal() {
  exampleModal.classList.remove('open');
  document.body.style.overflow = '';
  exampleModalFrame.src = '';
}

document.querySelectorAll('.service-card[data-mode]').forEach(card => {
  card.addEventListener('click', () => openExampleModal(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openExampleModal(card);
    }
  });
});

exampleModalClose.addEventListener('click', closeExampleModal);
exampleModalBackdrop.addEventListener('click', closeExampleModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && exampleModal.classList.contains('open')) closeExampleModal();
});

// ---------- Contact form (static — mailto fallback) ----------
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const business = document.getElementById('business').value.trim();

  const subject = encodeURIComponent(`Discovery Call Request from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nWhat I need help with:\n${business}`);
  window.location.href = `mailto:santosrhonalhy@gmail.com?subject=${subject}&body=${body}`;

  formNote.textContent = "Opening your email client — thanks for reaching out!";
});
