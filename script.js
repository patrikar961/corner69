/* =========================================================
   CORNER69 — interactions
   Version vanilla, aucune dependance externe.
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none)').matches;

  /* -------------------------------------------------------
     1. Decoupage des lettres du titre (animation d'entree)
     ------------------------------------------------------- */
  function splitText() {
    document.querySelectorAll('[data-split]').forEach(function (el) {
      var text = el.textContent;
      el.textContent = '';
      for (var i = 0; i < text.length; i++) {
        var span = document.createElement('span');
        span.className = 'char';
        span.textContent = text[i];
        span.style.transitionDelay = (i * 55 + 200) + 'ms';
        el.appendChild(span);
      }
    });
  }

  /* -------------------------------------------------------
     2. Preloader
     ------------------------------------------------------- */
  function preload() {
    var loader = document.getElementById('loader');
    var done = function () {
      document.body.classList.add('is-ready');
      if (loader) {
        loader.classList.add('is-done');
        setTimeout(function () { loader.style.display = 'none'; }, 900);
      }
    };

    if (reduceMotion) { done(); return; }

    var minDelay = new Promise(function (res) { setTimeout(res, 1700); });
    var img = document.getElementById('bgImage');
    var imgReady = new Promise(function (res) {
      if (!img || img.complete) { res(); return; }
      img.addEventListener('load', res, { once: true });
      img.addEventListener('error', res, { once: true });
    });

    Promise.all([minDelay, imgReady]).then(done);
    setTimeout(done, 4000);
  }

  /* -------------------------------------------------------
     3. Apparition des sections au defilement
     ------------------------------------------------------- */
  function reveals() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        setTimeout(function () { el.classList.add('is-visible'); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  /* -------------------------------------------------------
     4. Barre de progression + ombre de navigation
     ------------------------------------------------------- */
  function scrollUI() {
    var bar = document.getElementById('progress');
    var nav = document.getElementById('nav');

    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.scrollY / max : 0;
      if (bar) bar.style.transform = 'scaleX(' + p + ')';
      if (nav) nav.classList.toggle('is-stuck', window.scrollY > 40);
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });

    update();
  }

  /* -------------------------------------------------------
     5. Parallaxe sur l'image de fond
     ------------------------------------------------------- */
  function parallax() {
    var img = document.getElementById('bgImage');
    if (!img || reduceMotion) return;

    var ticking = false;
    function update() {
      var y = window.scrollY * 0.18;
      var scale = 1.02 + Math.min(window.scrollY / 4000, 0.08);
      img.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0) scale(' + scale.toFixed(3) + ')';
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    update();
  }

  /* -------------------------------------------------------
     6. Halo qui suit la souris
     ------------------------------------------------------- */
  function torch() {
    var el = document.getElementById('torch');
    if (!el || isTouch || reduceMotion) return;

    var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    var cx = tx, cy = ty;
    var started = false;

    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!started) { el.classList.add('is-on'); started = true; }
    }, { passive: true });

    (function loop() {
      cx += (tx - cx) * 0.09;
      cy += (ty - cy) * 0.09;
      el.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      requestAnimationFrame(loop);
    })();
  }

  /* -------------------------------------------------------
     7. Curseur personnalise
     ------------------------------------------------------- */
  function cursor() {
    if (isTouch || reduceMotion) return;
    var ring = document.getElementById('cursor');
    var dot = document.getElementById('cursorDot');
    if (!ring || !dot) return;

    document.body.classList.add('has-cursor');

    var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    var rx = tx, ry = ty;

    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
    }, { passive: true });

    (function loop() {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button, .card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-hover'); });
    });
  }

  /* -------------------------------------------------------
     8. Effet magnetique sur les boutons et liens de nav
     ------------------------------------------------------- */
  function magnetic() {
    if (isTouch || reduceMotion) return;
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate3d(' + (mx * 0.28).toFixed(1) + 'px,' +
                             (my * 0.34).toFixed(1) + 'px,0)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'translate3d(0,0,0)';
      });
    });
  }

  /* -------------------------------------------------------
     9. Inclinaison 3D des cartes
     ------------------------------------------------------- */
  function tilt() {
    if (isTouch || reduceMotion) return;
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          'perspective(900px) rotateY(' + (px * 7).toFixed(2) + 'deg) ' +
          'rotateX(' + (-py * 7).toFixed(2) + 'deg) translateY(-6px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(900px) rotateY(0) rotateX(0) translateY(0)';
      });
    });
  }

  /* -------------------------------------------------------
     10. Compteurs animes
     ------------------------------------------------------- */
  function counters() {
    var els = document.querySelectorAll('.counter');
    if (!els.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.textContent = el.getAttribute('data-target'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target'), 10) || 0;
        var start = performance.now();
        var dur = 1600;

        (function step(now) {
          var t = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased);
          if (t < 1) requestAnimationFrame(step);
        })(start);

        io.unobserve(el);
      });
    }, { threshold: 0.6 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* -------------------------------------------------------
     11. Navigation : pilule glissante, onglet actif, menu plein ecran
     ------------------------------------------------------- */
  function navigation() {
    var linksWrap = document.getElementById('navLinks');
    var pill = document.getElementById('navPill');
    var links = document.querySelectorAll('.nav__link');
    var burst = document.getElementById('navBurst');
    var overlay = document.getElementById('navOverlay');
    var overlayLinks = document.querySelectorAll('.overlay__link');

    var activeLink = null;

    function movePill(el) {
      if (!pill || !el || !linksWrap) return;
      var wrapRect = linksWrap.getBoundingClientRect();
      var r = el.getBoundingClientRect();
      pill.style.width = r.width + 'px';
      pill.style.transform = 'translateX(' + (r.left - wrapRect.left) + 'px)';
      pill.classList.add('is-on');
    }

    function hidePill() {
      if (!pill) return;
      if (activeLink) { movePill(activeLink); return; }
      pill.classList.remove('is-on');
    }

    links.forEach(function (a) {
      a.addEventListener('mouseenter', function () { movePill(a); });
    });
    if (linksWrap) linksWrap.addEventListener('mouseleave', hidePill);

    function setActive(id) {
      links.forEach(function (a) {
        var on = a.getAttribute('data-link') === id;
        a.classList.toggle('is-active', on);
        if (on) activeLink = a;
      });
      if (activeLink) movePill(activeLink); else hidePill();
    }

    var chapitres = ['apropos', 'services', 'contact'];
    var sections = chapitres
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    function updateActive() {
      if (!sections.length) return;
      var seuil = window.innerHeight * 0.45;
      var courant = null;

      sections.forEach(function (s) {
        var r = s.getBoundingClientRect();
        if (r.top <= seuil && r.bottom > seuil) courant = s.id;
      });

      if (!courant && window.scrollY < window.innerHeight * 0.6) {
        links.forEach(function (a) { a.classList.remove('is-active'); });
        activeLink = null;
        hidePill();
        return;
      }
      if (courant) setActive(courant);
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { updateActive(); ticking = false; });
    }, { passive: true });
    window.addEventListener('resize', function () { updateActive(); });
    setTimeout(updateActive, 1800);

    function ouvrir() {
      document.body.classList.add('overlay-open');
      document.body.classList.add('is-locked');
      if (burst) {
        burst.setAttribute('aria-expanded', 'true');
        burst.setAttribute('aria-label', 'Fermer le menu');
      }
      var premier = overlay ? overlay.querySelector('.overlay__link') : null;
      if (premier) setTimeout(function () { premier.focus(); }, 320);
    }

    function fermer() {
      document.body.classList.remove('overlay-open');
      document.body.classList.remove('is-locked');
      if (burst) {
        burst.setAttribute('aria-expanded', 'false');
        burst.setAttribute('aria-label', 'Ouvrir le menu');
      }
    }

    function basculer() {
      if (document.body.classList.contains('overlay-open')) fermer();
      else ouvrir();
    }

    if (burst) burst.addEventListener('click', basculer);

    overlayLinks.forEach(function (a) {
      a.addEventListener('click', function () { fermer(); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('overlay-open')) {
        fermer();
        if (burst) burst.focus();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) fermer();
      });
    }
  }

  /* -------------------------------------------------------
     12. Le son se coupe quand l'onglet passe en arriere-plan
     ------------------------------------------------------- */
  function pauseEnArrierePlan() {
    function toutesLesPistes() {
      return document.querySelectorAll('audio');
    }

    document.addEventListener('visibilitychange', function () {
      toutesLesPistes().forEach(function (a) {
        if (document.hidden) {
          if (!a.paused) {
            a.setAttribute('data-reprise', '1');
            a.pause();
          }
        } else if (a.getAttribute('data-reprise') === '1') {
          a.removeAttribute('data-reprise');
          var p = a.play();
          if (p && p.catch) p.catch(function () {});
        }
      });
    });

    /* si la fenetre perd le focus (autre onglet, autre application) */
    window.addEventListener('blur', function () {
      toutesLesPistes().forEach(function (a) {
        if (!a.paused) {
          a.setAttribute('data-reprise', '1');
          a.pause();
        }
      });
    });

    window.addEventListener('focus', function () {
      toutesLesPistes().forEach(function (a) {
        if (a.getAttribute('data-reprise') === '1') {
          a.removeAttribute('data-reprise');
          var p = a.play();
          if (p && p.catch) p.catch(function () {});
        }
      });
    });
  }

  /* -------------------------------------------------------
     Demarrage
     ------------------------------------------------------- */
  function init() {
    document.body.classList.add('is-locked');
    splitText();
    preload();
    reveals();
    scrollUI();
    parallax();
    torch();
    cursor();
    magnetic();
    tilt();
    counters();
    navigation();
    pauseEnArrierePlan();

    setTimeout(function () { document.body.classList.remove('is-locked'); }, 1800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
