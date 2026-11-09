/* =========================================================
   CORNER69 — fond sonore
   Aucune interface visible : le son se lance au premier clic
   sur la page, avec le volume fixe ci-dessous.
   La piste est jouee UNE SEULE FOIS.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     RÉGLAGE DU VOLUME — la seule valeur à modifier.
     0 = muet · 0.2 = discret (par défaut) · 0.35 = fond sonore ·
     0.5 = moyen · 1 = maximum
     --------------------------------------------------------- */
  var VOLUME = 0.2;

  /* ---------------------------------------------------------
     FICHIERS SOURCES — le navigateur prend le premier format
     qu'il sait lire. Le m4a passe sur Safari et Chrome ;
     ajoutez ambiance.mp3 si vous voulez couvrir tous les cas.
     --------------------------------------------------------- */
  var SOURCES = [
    { src: 'ambiance.m4a', type: 'audio/mp4' },
    { src: 'ambiance.mp3', type: 'audio/mpeg' }
  ];

  var audio = document.createElement('audio');

  SOURCES.forEach(function (s) {
    var source = document.createElement('source');
    source.src = s.src;
    source.type = s.type;
    audio.appendChild(source);
  });

  /* pas de boucle : la piste joue une seule fois */
  audio.loop = false;
  audio.preload = 'none';
  audio.volume = VOLUME;

  var termine = false; // devient vrai quand la piste est finie ou coupee

  function demarrer() {
    if (termine) return;
    var p = audio.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function () { /* fichier absent ou lecture bloquee */ });
    }
  }

  /* la piste s'arrete d'elle-meme a la fin : on ne la relance pas */
  audio.addEventListener('ended', function () {
    termine = true;
  });

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
