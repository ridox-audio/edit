/**
 * main.js
 * ---------------------------------------------------------------
 * Startpunkt der Seite. Reihenfolge ist wichtig:
 * 1) RenderContent.renderAll() — baut Texte & Karten aus CONTENT,
 *    inklusive der leeren Container für die Audio-Beispiele.
 * 2) AudioExamples.init() — braucht die Container aus Schritt 1.
 * 3) Nav.init(), HeroWaveform.init() — unabhängig vom Rest.
 * ---------------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', function () {
  window.RenderContent.renderAll();
  window.AudioExamples.init();
  window.Nav.init();
  window.HeroWaveform.init();
});
