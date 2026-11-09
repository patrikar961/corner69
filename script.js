/* =========================================================
   CORNER69 — interactions
   Sobre : chargement, défilement, compteurs, menu.
   ========================================================= */
(function () {
  'use strict';

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------
     1. Écran de chargement — le C69
     Quand il s'efface, l'accueil fait son entrée.
     ------------------------------------------------------- */
  function chargement() {
    var loader = document.getElementById('loader');
    var fini = function () {
      if (loader) {
        loader.classList.add('is-off');
        setTimeout(function () { loader.style.display = 'none'; }, 800);
      }
      // déclenche l'entrée du titre et du texte de l'accueil
      setTimeout(function () {
        document.body.classList.add('pret');
      }, 120);
    };

    if (calm) {
      document.body.classList.add('pret');
      if (loader) loader.style.display = 'none';
      return;
    }

    var delai = new Promise(function (r) { setTimeout(r, 1600); });
    var image = document.getElementById('bgImage');
    var prete = new Promise(function (r) {
      if (!image || image.complete) { r(); return; }
      image.addEventListener('load', r, { once: true });
      image.addEventListener('error', r, { once: true });
    });

    Promise.all([delai, prete]).then(fini);
    setTimeout(fini, 3500);
  }

  /* -------------------------------------------------------
     2. Barre de navigation au défilement
     ------------------------------------------------------- */
  function barre() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    var occupe = false;
    function maj() {
      nav.classList.toggle('is-fixed', window.scrollY > 30);
    }
    window.addEventListener('scroll', function () {
      if (occupe) return;
      occupe = true;
      requestAnimationFrame(function () { maj(); occupe = false; });
    }, { passive: true });
    maj();
  }

  /* -------------------------------------------------------
     3. Apparition douce des sections
     Le bloc entier monte, puis ses éléments l'un après l'autre.
     ------------------------------------------------------- */
  function apparitions() {
    var blocs = document.querySelectorAll('.block');
    if (!blocs.length) return;

    if (calm || !('IntersectionObserver' in window)) {
      blocs.forEach(function (el) { el.classList.add('soft', 'on'); });
      document.querySelectorAll('.lift').forEach(function (el) {
        el.classList.add('on');
      });
      return;
    }

    blocs.forEach(function (el) { el.classList.add('soft'); });

    var io = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        var bloc = e.target;
        bloc.classList.add('on');

        // les paragraphes du bloc montent l'un après l'autre
        bloc.querySelectorAll('.lift').forEach(function (el, i) {
          setTimeout(function () { el.classList.add('on'); }, 180 + i * 90);
        });

        io.unobserve(bloc);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    blocs.forEach(function (el) { io.observe(el); });
  }

  /* -------------------------------------------------------
     4. Compteurs
     ------------------------------------------------------- */
  function compteurs() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length || calm || !('IntersectionObserver' in window)) return;

    els.forEach(function (el) { el.textContent = '0'; });

    var io = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var cible = parseInt(el.getAttribute('data-count'), 10) || 0;
        var debut = performance.now();
        var duree = 1400;

        (function pas(now) {
          var t = Math.min((now - debut) / duree, 1);
          var doux = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(cible * doux);
          if (t < 1) requestAnimationFrame(pas);
        })(debut);

        io.unobserve(el);
      });
    }, { threshold: 0.5 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* -------------------------------------------------------
     5. Menu mobile
     ------------------------------------------------------- */
  function menu() {
    var bouton = document.getElementById('burger');
    var tiroir = document.getElementById('drawer');
    if (!bouton) return;

    function basculer() {
      var ouvert = document.body.classList.toggle('menu-open');
      bouton.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
      bouton.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
    }

    bouton.addEventListener('click', basculer);

    if (tiroir) {
      tiroir.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          document.body.classList.remove('menu-open');
          bouton.setAttribute('aria-expanded', 'false');
        });
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
        document.body.classList.remove('menu-open');
        bouton.setAttribute('aria-expanded', 'false');
        bouton.focus();
      }
    });
  }

  /* -------------------------------------------------------
     Démarrage
     ------------------------------------------------------- */
  function init() {
    chargement();
    barre();
    apparitions();
    compteurs();
    menu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
