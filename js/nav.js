/**
 * nav.js
 * ---------------------------------------------------------------
 * Mobiles Menü: öffnen/schließen per Hamburger-Button, schließt
 * sich automatisch nach Klick auf einen Link.
 * ---------------------------------------------------------------
 */
window.Nav = (function () {
  function init() {
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var isHidden = menu.classList.contains('hidden');
      menu.classList.toggle('hidden');
      toggle.setAttribute('aria-expanded', String(isHidden));
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.add('hidden'); });
    });
  }
  return { init: init };
})();
