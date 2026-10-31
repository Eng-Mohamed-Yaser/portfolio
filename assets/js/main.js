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
    updateProgress();
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
    var activeLink = null;
    navLinks.forEach(function (link) {
      var on = link.getAttribute('href') === href;
      link.classList.toggle('is-active', on);
      if (on) activeLink = link;
    });
    updateIndicator(activeLink);
  }

  /* ── Scroll progress ──────────────────────────────────────── */
  /* A single custom property drives the bar, so the browser animates it
     without any extra DOM writes per frame. */
  function updateProgress() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? (window.scrollY || 0) / max : 0;
    if (p < 0) p = 0; else if (p > 1) p = 1;
    root.style.setProperty('--progress', p.toFixed(4));
  }

  /* ── Nav sliding pill ─────────────────────────────────────── */
  var indicator = document.getElementById('nav-indicator');
  var narrowNav = window.matchMedia('(max-width: 700px)');

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

  /* ── Cursor spotlight + 3D tilt ───────────────────────────── */
  /* Both effects are pointer-driven, so they are enabled only where a
     real hovering pointer exists and motion is welcome. */
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var pointerFX = !reduceMotion && finePointer.matches;

  var tiltCard = null;
  var tiltPoint = null;
  var tiltFrame = 0;

  function paintTilt() {
    tiltFrame = 0;
    var card = tiltCard;
    if (!card || !tiltPoint) return;
    var rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    var px = (tiltPoint.x - rect.left) / rect.width;
    var py = (tiltPoint.y - rect.top) / rect.height;
    if (px < 0) px = 0; else if (px > 1) px = 1;
    if (py < 0) py = 0; else if (py > 1) py = 1;

    /* Spotlight position, in percentages of the card box */
    card.style.setProperty('--mx', (px * 100).toFixed(2) + '%');
    card.style.setProperty('--my', (py * 100).toFixed(2) + '%');
    /* A restrained tilt — 3.5 degrees at the corners */
    card.style.setProperty('--rx', ((0.5 - py) * 3.5).toFixed(2) + 'deg');
    card.style.setProperty('--ry', ((px - 0.5) * 3.5).toFixed(2) + 'deg');
  }

  function resetTilt(card) {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
  }

  if (pointerFX) {
    document.addEventListener('pointermove', function (e) {
      var card = e.target && e.target.closest
        ? e.target.closest('.spotlight, .stack-cat')
        : null;
      if (!card) return;
      tiltCard = card;
      tiltPoint = { x: e.clientX, y: e.clientY };
      if (!tiltFrame) tiltFrame = window.requestAnimationFrame(paintTilt);
    }, { passive: true });

    document.addEventListener('pointerout', function (e) {
      var card = e.target && e.target.closest
        ? e.target.closest('.spotlight, .stack-cat')
        : null;
      if (!card) return;
      /* Only reset when the pointer genuinely left the card */
      var to = e.relatedTarget;
      if (to && card.contains(to)) return;
      if (tiltCard === card) { tiltCard = null; tiltPoint = null; }
      resetTilt(card);
    }, { passive: true });
  }

  /* ── Tech stack tooltips ──────────────────────────────────── */
  /* Each tile names the category it belongs to. The technology name is
     already visible as text, so nothing is communicated by tooltip alone. */
  document.querySelectorAll('.stack-cat').forEach(function (cat) {
    var heading = cat.querySelector('.stack-cat__title');
    if (!heading) return;
    var label = heading.textContent.trim();
    if (!label) return;
    cat.querySelectorAll('.stack-cat__item').forEach(function (item) {
      item.setAttribute('data-tip', label);
    });
  });

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
        /* The class carries the restrained glow; the label carries the check */
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
