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
const exampleModalMedia = document.getElementById('exampleModalMedia');
const exampleModalCaption = document.getElementById('exampleModalCaption');
const exampleModalLink = document.getElementById('exampleModalLink');
const exampleModalFooter = document.getElementById('exampleModalFooter');
const exampleModalClose = document.getElementById('exampleModalClose');
const exampleModalBackdrop = document.getElementById('exampleModalBackdrop');
const exampleNavPrev = document.getElementById('exampleNavPrev');
const exampleNavNext = document.getElementById('exampleNavNext');
const exampleCounter = document.getElementById('exampleCounter');
const exampleBackGrid = document.getElementById('exampleBackGrid');

let galleryItems = [];
let galleryIndex = 0;
let cameFromGrid = false;

function renderGalleryItem(index) {
  const item = galleryItems[index];
  exampleModalMedia.innerHTML = '';
  exampleModalFooter.style.display = '';

  if (item.type === 'image') {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.caption || 'Work example';
    exampleModalMedia.appendChild(img);
  } else if (item.type === 'video') {
    const video = document.createElement('video');
    video.src = item.src;
    video.controls = true;
    video.autoplay = true;
    exampleModalMedia.appendChild(video);
  }

  exampleModalCaption.textContent = item.caption || '';
  exampleModalLink.href = item.link || '#';

  const multi = galleryItems.length > 1;
  exampleNavPrev.hidden = !multi;
  exampleNavNext.hidden = !multi;
  exampleCounter.hidden = !multi;
  if (multi) exampleCounter.textContent = `${index + 1} / ${galleryItems.length}`;
  exampleBackGrid.hidden = !cameFromGrid;
}

function renderGrid(items) {
  galleryItems = items;
  exampleModalMedia.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'example-grid';
  items.forEach((item, index) => {
    const btn = document.createElement('button');
    btn.className = 'example-grid-item';
    btn.type = 'button';
    btn.setAttribute('aria-label', item.caption || `Example ${index + 1}`);
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.caption || 'Work example thumbnail';
    btn.appendChild(img);
    btn.addEventListener('click', () => {
      cameFromGrid = true;
      galleryIndex = index;
      renderGalleryItem(galleryIndex);
    });
    grid.appendChild(btn);
  });
  exampleModalMedia.appendChild(grid);

  exampleNavPrev.hidden = true;
  exampleNavNext.hidden = true;
  exampleCounter.hidden = true;
  exampleBackGrid.hidden = true;
  exampleModalFooter.style.display = 'none';
}

function renderGridLinks(items) {
  exampleModalMedia.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'example-grid';
  items.forEach((item, index) => {
    const btn = document.createElement('button');
    btn.className = 'example-grid-item';
    btn.type = 'button';
    btn.setAttribute('aria-label', item.caption || `Example ${index + 1}`);
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.caption || 'Work example thumbnail';
    img.loading = 'lazy';
    btn.appendChild(img);
    btn.addEventListener('click', () => window.open(item.link, '_blank', 'noopener'));
    grid.appendChild(btn);
  });
  exampleModalMedia.appendChild(grid);

  exampleNavPrev.hidden = true;
  exampleNavNext.hidden = true;
  exampleCounter.hidden = true;
  exampleBackGrid.hidden = true;
  exampleModalFooter.style.display = 'none';
}

function renderLinksList(items) {
  exampleModalMedia.innerHTML = '';
  const list = document.createElement('div');
  list.className = 'example-links-list';
  items.forEach(item => {
    const a = document.createElement('a');
    a.className = 'example-link-item';
    a.href = item.href;
    a.target = '_blank';
    a.rel = 'noopener';
    const strong = document.createElement('strong');
    strong.textContent = item.label;
    const span = document.createElement('span');
    span.textContent = item.caption || '';
    a.appendChild(strong);
    a.appendChild(span);
    list.appendChild(a);
  });
  exampleModalMedia.appendChild(list);
  exampleNavPrev.hidden = true;
  exampleNavNext.hidden = true;
  exampleCounter.hidden = true;
  exampleModalFooter.style.display = 'none';
}

function openExampleModal(card) {
  const mode = card.dataset.mode;

  if (mode === 'external') {
    window.open(card.dataset.link, '_blank', 'noopener');
    return;
  }

  exampleModalFooter.style.display = '';
  cameFromGrid = false;
  const items = JSON.parse(card.dataset.items);

  if (mode === 'links') {
    renderLinksList(items);
  } else if (mode === 'grid') {
    renderGrid(items);
  } else if (mode === 'grid-links') {
    renderGridLinks(items);
  } else {
    galleryItems = items;
    galleryIndex = 0;
    renderGalleryItem(galleryIndex);
  }

  exampleModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeExampleModal() {
  exampleModal.classList.remove('open');
  document.body.style.overflow = '';
  exampleModalMedia.innerHTML = '';
  galleryItems = [];
  cameFromGrid = false;
}

exampleBackGrid.addEventListener('click', () => {
  cameFromGrid = false;
  renderGrid(galleryItems);
});

exampleNavPrev.addEventListener('click', () => {
  galleryIndex = (galleryIndex - 1 + galleryItems.length) % galleryItems.length;
  renderGalleryItem(galleryIndex);
});
exampleNavNext.addEventListener('click', () => {
  galleryIndex = (galleryIndex + 1) % galleryItems.length;
  renderGalleryItem(galleryIndex);
});

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
  if (!exampleModal.classList.contains('open')) return;
  if (e.key === 'Escape') closeExampleModal();
  if (e.key === 'ArrowLeft' && !exampleNavPrev.hidden) exampleNavPrev.click();
  if (e.key === 'ArrowRight' && !exampleNavNext.hidden) exampleNavNext.click();
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
