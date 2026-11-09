/* =========================================================
   CORNER69 — fond sonore
   Aucune interface visible : le son se lance au premier clic
   sur la page, avec le volume fixe ci-dessous.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     RÉGLAGE DU VOLUME — la seule valeur à modifier.
     0 = muet · 0.2 = discret (par défaut) · 0.35 = fond sonore ·
     0.5 = moyen · 1 = maximum
     --------------------------------------------------------- */
  var VOLUME = 0.2;

  var audio = document.createElement('audio');
  audio.src = 'ambiance.mp3';
  audio.loop = true;
  audio.preload = 'none';
  audio.volume = VOLUME;

  var lance = false;

  function demarrer() {
    if (lance) return;
    var p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(function () { lance = true; })
       .catch(function () { lance = false; });
    } else {
      lance = true;
    }
  }

  function premierGeste() {
    demarrer();
    document.removeEventListener('click', premierGeste, true);
    document.removeEventListener('keydown', premierGeste, true);
    document.removeEventListener('touchstart', premierGeste, true);
  }

  document.addEventListener('click', premierGeste, true);
  document.addEventListener('keydown', premierGeste, true);
  document.addEventListener('touchstart', premierGeste, true);
})();
