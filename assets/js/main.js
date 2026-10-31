/* ══════════════════════════════════════════════════════════════
   ORBIT — interactions
   Vanilla JS · no dependencies · respects prefers-reduced-motion

   Design notes
   · One passive scroll listener, batched through requestAnimationFrame.
   · Section offsets are measured once and cached, so scrolling never
     forces a synchronous layout read.
   · DOM writes happen only when the active section actually changes.
   · No pointer tracking: the spotlight/tilt system was removed because
     it cost a document-level listener and produced no lasting value.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ── Mobile menu ───────────────────────────────────────────── */
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

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  navLinks.forEach(function (link) {
    /* Close the mobile menu after choosing a destination */
    link.addEventListener('click', function () { setMenu(false); });
  });

  /* ── Reveal on scroll ──────────────────────────────────────── */
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

  /* ── Active section → nav state + 01/08 counter ────────────── */
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-cnt]'));
  var counterEl = document.getElementById('counter-current');
  var indicator = document.getElementById('nav-indicator');
  var narrowNav = window.matchMedia('(max-width: 700px)');

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

  var offsets = [];
  var activeSectionId = null;

  /* Measure once; the cached offsets are reused on every scroll frame. */
  function measure() {
    var y = window.scrollY || 0;
    offsets = sections.map(function (s) {
      return s.getBoundingClientRect().top + y;
    });
  }

  function updateIndicator(link) {
    if (!indicator) return;
    /* The pill is a desktop affordance — the mobile menu keeps its dot. */
    if (narrowNav.matches || !link) {
      indicator.classList.remove('is-ready');
      return;
    }
    indicator.style.width = link.offsetWidth + 'px';
    indicator.style.height = link.offsetHeight + 'px';
    indicator.style.transform =
      'translate3d(' + link.offsetLeft + 'px,' + link.offsetTop + 'px,0)';
    indicator.classList.add('is-ready');
  }

  function updateActive() {
    if (!sections.length) return;

    var probe = (window.scrollY || 0) + window.innerHeight * 0.38;
    var current = sections[0];

    for (var i = 0; i < offsets.length; i++) {
      if (offsets[i] <= probe) current = sections[i];
    }

    /* Pin the last entry once the page bottom is reached */
    var atBottom = (window.innerHeight + window.scrollY) >=
      (document.documentElement.scrollHeight - 4);
    if (atBottom) current = sections[sections.length - 1];

    /* Nothing changed — skip every DOM write. */
    if (current.id === activeSectionId) return;
    activeSectionId = current.id;

    if (counterEl) {
      var n = String(current.getAttribute('data-cnt') || '1');
      var label = n.length < 2 ? '0' + n : n;
      if (counterEl.textContent !== label) counterEl.textContent = label;
    }

    var href = NAV_FOR[current.id];
    if (!href) return;

    var activeLink = null;
    navLinks.forEach(function (link) {
      var on = link.getAttribute('href') === href;
      link.classList.toggle('is-active', on);
      if (on) activeLink = link;
    });
    updateIndicator(activeLink);
  }

  /* ── Scroll handling ───────────────────────────────────────── */
  var header = document.getElementById('site-header');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      header.classList.toggle('is-scrolled', (window.scrollY || 0) > 24);
      updateActive();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Resize: re-measure, then re-evaluate the active section ── */
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      measure();
      activeSectionId = null;
      updateActive();
    }, 160);
  });

  /* Re-measure once fonts and lazy images have settled.
     The read is deliberately deferred two frames. Inside the load handler the
     webfont swap has already invalidated the layout, so reading rects there
     forces a synchronous full-page reflow on the critical path (~140ms).
     Waiting until the browser has laid out again makes the read free. */
  window.addEventListener('load', function () {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        measure();
        activeSectionId = null;
        updateActive();
      });
    });
  });

  measure();
  updateActive();

  /* ── Copy email ────────────────────────────────────────────── */
  var copyBtn = document.querySelector('[data-copy]');
  if (copyBtn) {
    var copyLabel = copyBtn.querySelector('[data-copy-label]');
    var original = copyLabel ? copyLabel.textContent : 'Copy email';

    copyBtn.addEventListener('click', function () {
      var value = copyBtn.getAttribute('data-copy') || '';
      var done = function () {
        if (!copyLabel) return;
        copyLabel.textContent = 'Copied ✓';
        copyBtn.classList.add('is-copied');
        window.setTimeout(function () {
          copyLabel.textContent = original;
          copyBtn.classList.remove('is-copied');
        }, 2200);
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

  /* ── Footer year ───────────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── Graceful fallback if a remote image fails ─────────────── */
  document.querySelectorAll('.tech-tile img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.classList.add('is-broken');
      var item = img.closest('.tech-tile');
      if (item) item.classList.add('is-icon-fallback');
    });
  });

  /* ── Rotating specialisation line ──────────────────────────── */
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
