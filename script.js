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
     11. Menu mobile
     ------------------------------------------------------- */
  function mobileMenu() {
    var btn = document.getElementById('navToggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
    document.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
      });
    });
  }

  /* -------------------------------------------------------
     12. Lecteur audio
     - demarre au premier clic n'importe ou sur la page,
       a chaque nouvelle visite
     - bouton pour activer / couper
     - curseur de volume
     ------------------------------------------------------- */
  function audioPlayer() {
    var player = document.getElementById('player');
    var audio = document.getElementById('ambiance');
    var toggle = document.getElementById('playerToggle');
    var mute = document.getElementById('playerMute');
    var range = document.getElementById('playerVolume');
    var pct = document.getElementById('playerPct');
    var hint = document.getElementById('playerHint');
    var cue = document.getElementById('soundCue');

    if (!player || !audio) return;

    var KEY = 'corner69-volume';
    var lastVolume = 0.45;
    var armed = true;
    var userStopped = false;

    try {
      var saved = parseFloat(localStorage.getItem(KEY));
      if (!isNaN(saved) && saved >= 0 && saved <= 1) lastVolume = saved;
    } catch (e) {}

    audio.loop = true;
    audio.volume = lastVolume;
    if (range) { range.value = lastVolume; setFill(lastVolume); }
    if (pct) pct.textContent = Math.round(lastVolume * 100);

    function setFill(v) {
      if (range) range.style.setProperty('--fill', (v * 100) + '%');
    }

    function setState(state) {
      player.setAttribute('data-state', state);
      if (toggle) toggle.setAttribute('aria-pressed', state === 'playing' ? 'true' : 'false');
      if (hint) {
        hint.textContent =
          state === 'playing' ? 'Son actif' :
          state === 'muted'   ? 'Son coupé' : 'Cliquez pour activer le son';
      }
    }

    function start() {
      var p = audio.play();
      if (p && typeof p.then === 'function') {
        p.then(function () {
          setState('playing');
          player.classList.remove('is-idle');
          hideCue();
        }).catch(function () {
          setState('idle');
        });
      } else {
        setState('playing');
        hideCue();
      }
    }

    function stop() {
      audio.pause();
      setState('muted');
    }

    function hideCue() {
      if (cue) cue.classList.remove('is-shown');
    }

    function removeArmed() {
      if (!armed) return;
      armed = false;
      document.removeEventListener('click', onFirstClick, true);
      document.removeEventListener('keydown', onFirstKey, true);
      document.removeEventListener('touchstart', onFirstClick, true);
    }

    function onFirstClick(e) {
      if (player.contains(e.target)) { removeArmed(); return; }
      removeArmed();
      if (!userStopped) start();
    }

    function onFirstKey(e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (player.contains(e.target)) { removeArmed(); return; }
      removeArmed();
      if (!userStopped) start();
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        removeArmed();
        if (audio.paused) {
          userStopped = false;
          start();
        } else {
          userStopped = true;
          stop();
        }
      });
    }

    if (mute) {
      mute.addEventListener('click', function () {
        if (audio.volume > 0) {
          lastVolume = audio.volume;
          audio.volume = 0;
          if (range) { range.value = 0; setFill(0); }
          if (pct) pct.textContent = '0';
          setState('muted');
        } else {
          audio.volume = lastVolume || 0.45;
          if (range) { range.value = audio.volume; setFill(audio.volume); }
          if (pct) pct.textContent = Math.round(audio.volume * 100);
          setState(audio.paused ? 'idle' : 'playing');
        }
      });
    }

    if (range) {
      range.addEventListener('input', function () {
        var v = parseFloat(range.value);
        audio.volume = v;
        setFill(v);
        if (pct) pct.textContent = Math.round(v * 100);
        if (v > 0) lastVolume = v;
        try { localStorage.setItem(KEY, String(v)); } catch (e) {}
        if (v > 0 && audio.paused && !userStopped) start();
      });
      range.addEventListener('click', function (e) { e.stopPropagation(); });
      range.addEventListener('mousedown', function (e) { e.stopPropagation(); });
    }

    setState('idle');
    player.classList.add('is-idle');

    setTimeout(function () {
      if (armed && cue) cue.classList.add('is-shown');
    }, 2200);

    document.addEventListener('click', onFirstClick, true);
    document.addEventListener('keydown', onFirstKey, true);
    document.addEventListener('touchstart', onFirstClick, { capture: true, passive: true });

    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        userStopped = false;
        setState(audio.paused ? 'idle' : 'playing');
      }
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
    mobileMenu();
    audioPlayer();

    setTimeout(function () { document.body.classList.remove('is-locked'); }, 1800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
