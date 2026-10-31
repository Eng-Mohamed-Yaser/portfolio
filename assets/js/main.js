/* ══════════════════════════════════════════════════════════════
   ORBIT — interactions
   Vanilla JS · no dependencies · respects prefers-reduced-motion
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Header state + subtle background parallax ───────────── */
  var header = document.getElementById('site-header');
  var root = document.documentElement;

  function onScrollFrame() {
    var y = window.scrollY || 0;
    header.classList.toggle('is-scrolled', y > 24);
    root.style.setProperty('--sy', String(y));
    updateActive();
  }

  /* Scroll events are already frame-aligned by the browser, so the
     handler stays cheap and never depends on requestAnimationFrame. */
  function requestScroll() {
    onScrollFrame();
  }

  /* ── Mobile menu ─────────────────────────────────────────── */
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('nav-menu');

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (!menu || !menu.classList.contains('is-open')) return;
    if (!menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
  });

  /* Close the mobile menu after choosing a destination */
  document.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });

  /* ── Reveal on scroll (single observer, grouped) ─────────── */
  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ── Active section → nav state + 01/08 counter ───────────── */
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-cnt]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var counterEl = document.getElementById('counter-current');

  /* Which nav item should light up for each tracked section */
  var NAV_FOR = {
    home: '#home',
    about: '#about',
    skills: '#skills',
    stack: '#skills',
    practices: '#skills',
    projects: '#projects',
    contact: '#contact',
    'site-footer': '#contact'
  };

  function updateActive() {
    if (!sections.length) return;

    var probe = window.innerHeight * 0.38;
    var current = sections[0];

    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= probe) current = sections[i];
    }

    /* Pin the last entry once the page bottom is reached */
    var atBottom = (window.innerHeight + window.scrollY) >=
      (document.documentElement.scrollHeight - 4);
    if (atBottom) current = sections[sections.length - 1];

    if (counterEl) {
      var n = String(current.getAttribute('data-cnt') || '1');
      counterEl.textContent = n.length < 2 ? '0' + n : n;
    }

    var href = NAV_FOR[current.id];
    if (!href) return;
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === href);
    });
  }

  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll);
  updateActive();

  /* ── Copy email ──────────────────────────────────────────── */
  var copyBtn = document.querySelector('[data-copy]');
  if (copyBtn) {
    var copyLabel = copyBtn.querySelector('[data-copy-label]');
    var original = copyLabel ? copyLabel.textContent : 'Copy email';

    copyBtn.addEventListener('click', function () {
      var value = copyBtn.getAttribute('data-copy') || '';
      var done = function () {
        if (!copyLabel) return;
        copyLabel.textContent = 'Copied ✓';
        window.setTimeout(function () { copyLabel.textContent = original; }, 2200);
      };
      var fallback = function () {
        var temp = document.createElement('textarea');
        temp.value = value;
        temp.setAttribute('readonly', '');
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        try { document.execCommand('copy'); done(); } catch (err) { /* no-op */ }
        document.body.removeChild(temp);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(fallback);
      } else {
        fallback();
      }
    });
  }

  /* ── Footer year ─────────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── Graceful fallback if a remote image fails ───────────── */
  document.querySelectorAll('.stack-cat__item img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.classList.add('is-broken');
      var item = img.closest('.stack-cat__item');
      if (item) item.classList.add('is-icon-fallback');
    });
  });

  /* ── Rotating specialisation line ────────────────────────── */
  var ROTATIONS = [
    'Specializing in .NET Backend',
    'Full-Stack Development',
    'MEAN Stack Developer',
    'Architecting Secure APIs',
    'Real-Time Data Processing',
    'High-Performance Backend Systems'
  ];

  var rotator = document.getElementById('rotator-text');
  if (rotator && !reduceMotion) {
    var index = 0;
    window.setInterval(function () {
      index = (index + 1) % ROTATIONS.length;
      rotator.style.opacity = '0';
      window.setTimeout(function () {
        rotator.textContent = ROTATIONS[index];
        rotator.style.opacity = '1';
      }, 240);
    }, 2800);
  }
})();
