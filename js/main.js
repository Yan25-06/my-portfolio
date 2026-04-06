/* ============================================================
   PORTFOLIO — Lê Huy Toàn
   main.js — Theme toggle, cursor, particles, scroll, nav
   ============================================================ */

/* ---------- THEME TOGGLE ----------
   NOTE: Theme khởi tạo từ localStorage được xử lý bởi inline
   script trong <head> của index.html (trước khi render) để tránh
   flash. File này chỉ lo phần sync icon + gắn sự kiện click.
   ---------------------------------------------------------------- */
(function initTheme() {
  const root   = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const icon   = document.getElementById('themeIcon');

  function syncIcon() {
    const isDark = root.getAttribute('data-theme') !== 'light';
    icon.textContent = isDark ? '☀️' : '🌙';
  }

  function setTheme(dark) {
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    syncIcon();
  }

  // Sync icon với trạng thái đã được set từ <head>
  syncIcon();

  toggle.addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') !== 'light' ? false : true);
  });
  icon.addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') !== 'light' ? false : true);
  });
})();

/* ---------- CUSTOM CURSOR ---------- */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animate() {
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  const hoverTargets = 'a, button, .project-card, .skill-category, .contact-link-card, .theme-toggle, .stat-box';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '20px'; cursor.style.height = '20px';
      ring.style.width    = '60px'; ring.style.height   = '60px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '12px'; cursor.style.height = '12px';
      ring.style.width    = '36px'; ring.style.height   = '36px';
    });
  });
})();

/* ---------- HERO PARTICLES ---------- */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const colors = ['#00d4ff', '#39ff14', '#bf5fff'];
  for (let i = 0; i < 40; i++) {
    const p     = document.createElement('div');
    p.className = 'particle';
    const size  = Math.random() * 3 + 1;
    const x     = Math.random() * 100;
    const dur   = Math.random() * 15 + 8;
    const delay = Math.random() * 15;
    const dx    = (Math.random() - 0.5) * 200 + 'px';
    p.style.cssText = `left:${x}%;width:${size}px;height:${size}px;animation-duration:${dur}s;animation-delay:${delay}s;background:${colors[Math.floor(Math.random()*3)]};--dx:${dx};box-shadow:0 0 6px currentColor;`;
    container.appendChild(p);
  }
})();

/* ---------- SCROLL REVEAL ---------- */
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  reveals.forEach(r => obs.observe(r));
})();

/* ---------- HAMBURGER NAV ---------- */
(function initNav() {
  const ham = document.getElementById('hamburger');
  const nav = document.getElementById('navLinks');
  ham.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
})();

/* ---------- ACTIVE NAV HIGHLIGHT ---------- */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const y = window.scrollY + 100;
    sections.forEach(s => {
      const a = document.querySelector(`.nav-links a[href="#${s.id}"]`);
      if (!a) return;
      if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) a.classList.add('active');
      else a.classList.remove('active');
    });
  });
})();