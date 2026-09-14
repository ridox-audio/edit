/**
 * banner.js
 * ---------------------------------------------------------------
 * Baut den Ankündigungs-Banner aus banner-config.js und hängt ihn
 * als ERSTES Kind in <header> ein.
 *
 * Der <header> ist bereits "sticky top-0" (siehe index.html) — indem
 * der Banner ein Teil davon wird statt ein eigenes Element daneben,
 * bleibt er beim Scrollen automatisch zusammen mit der Navigation
 * oben stehen, ganz ohne eigene Scroll-Logik oder Offset-Berechnung.
 *
 * Ist "visible: false" oder kein Text gesetzt, wird gar nichts
 * eingefügt (kein leerer Balken, keine Lücke).
 * ---------------------------------------------------------------
 */
window.Banner = (function () {

  function init() {
    var cfg = window.BANNER_CONFIG;
    if (!cfg || !cfg.visible || !cfg.text) return;

    var header = document.querySelector('header');
    if (!header) return;

    var bar = document.createElement('div');
    bar.id = 'announcement-banner';
    bar.className = 'flex items-center justify-center gap-2 bg-teal px-4 py-2 text-center text-xs font-medium leading-snug text-bg sm:text-sm';

    var icon = document.createElement('span');
    icon.className = 'h-3.5 w-3.5 flex-shrink-0';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = (window.ICONS && window.ICONS.clock) || '';
    bar.appendChild(icon);

    var text = document.createElement('span');
    text.textContent = cfg.text;
    bar.appendChild(text);

    header.insertBefore(bar, header.firstChild);
  }

  return { init: init };
})();
