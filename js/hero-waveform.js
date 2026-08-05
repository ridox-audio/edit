/**
 * hero-waveform.js
 * ---------------------------------------------------------------
 * Rein dekorative, animierte Wellenform im Hero-Hintergrund.
 * Keine Verbindung zu echten Audiodaten — reine Ambient-Optik.
 * Respektiert prefers-reduced-motion über css/styles.css.
 * ---------------------------------------------------------------
 */
window.HeroWaveform = (function () {
  function init() {
    var track = document.getElementById('hero-amb-track');
    if (!track) return;
    var barCount = 70;
    for (var i = 0; i < barCount; i++) {
      var bar = document.createElement('div');
      var h = 20 + Math.round(60 * Math.abs(Math.sin(i * 0.35) * Math.cos(i * 0.12)));
      bar.className = 'hero-amb-bar w-[3px] flex-shrink-0 rounded-t-sm bg-edge';
      bar.style.height = h + '%';
      bar.style.animationDelay = (i * 0.045) + 's';
      track.appendChild(bar);
    }
  }
  return { init: init };
})();
