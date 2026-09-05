/**
 * audio-examples.js
 * ---------------------------------------------------------------
 * Verbindet die von render-content.js gebauten Beispiel-Karten mit
 * echten Audiodateien:
 *  - lädt jede Datei und zeichnet ihre echte Wellenform
 *  - zeigt die echte Dauer an
 *  - bewegt die Nadel (Playhead) exakt synchron zur Wiedergabe
 *  - erlaubt Klick auf die Wellenform zum Springen (Seek)
 *  - stoppt automatisch jede andere Spur, wenn eine neue startet
 *
 * Kein synthetisches Audio mehr — audio-engine.js wird dafür nicht
 * mehr gebraucht und kann aus dem Projekt gelöscht werden.
 * ---------------------------------------------------------------
 */
window.AudioExamples = (function () {

  var NUM_BARS = 64;
  var currentRAF = null;

  function renderFlatBars(container) {
    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'flex h-full w-full items-end gap-[2px] example-bars-loading';
    for (var i = 0; i < NUM_BARS; i++) {
      var d = document.createElement('div');
      d.className = 'w-[3px] flex-shrink-0 rounded-sm bg-edge';
      d.style.height = '14%';
      wrap.appendChild(d);
    }
    container.appendChild(wrap);
    addPlayhead(container);
  }

  function renderPeakBars(container, peaks, colorClass) {
    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'flex h-full w-full items-end gap-[2px]';
    peaks.forEach(function (p) {
      var d = document.createElement('div');
      var h = Math.max(6, Math.round(p * 100));
      d.className = 'w-[3px] flex-shrink-0 rounded-sm ' + colorClass;
      d.style.height = h + '%';
      wrap.appendChild(d);
    });
    container.appendChild(wrap);
    addPlayhead(container);
  }

  function addPlayhead(container) {
    var head = document.createElement('div');
    head.className = 'playhead absolute top-0 bottom-0 left-0 w-[2px] bg-amber';
    container.appendChild(head);
  }

  function stopAllExcept(exceptAudio) {
    document.querySelectorAll('audio[data-role="example"]').forEach(function (a) {
      if (a !== exceptAudio && !a.paused) a.pause();
    });
  }

  function setupRow(idx, variant, colorClass) {
    var barsEl = document.getElementById('ex' + idx + '-' + variant + '-bars');
    var durEl = document.getElementById('ex' + idx + '-' + variant + '-dur');
    var audioEl = document.getElementById('ex' + idx + '-' + variant + '-audio');
    var btn = document.querySelector('[data-play="' + idx + ':' + variant + '"]');
    if (!barsEl || !audioEl || !btn) return;

    renderFlatBars(barsEl);

    var loaded = false;
    var loadFailed = false;

    function ensureLoaded() {
      if (loaded || loadFailed) return Promise.resolve();
      return window.WaveformAnalysis.loadBuffer(audioEl.src).then(function (buffer) {
        loaded = true;
        var peaks = window.WaveformAnalysis.computePeaks(buffer, NUM_BARS);
        renderPeakBars(barsEl, peaks, colorClass);
        if (durEl) durEl.textContent = window.WaveformAnalysis.formatDuration(buffer.duration);
      }).catch(function (err) {
        loadFailed = true;
        console.warn('[audio-examples] Wellenform nicht ladbar für', audioEl.src, err);
      });
    }

    // Dauer notfalls auch über das native <audio>-Element anzeigen,
    // falls die fetch-basierte Wellenform-Analyse (noch) nicht möglich
    // ist (z. B. beim Testen per Doppelklick ohne lokalen Server).
    audioEl.addEventListener('loadedmetadata', function () {
      if (durEl && (durEl.textContent === '—')) {
        durEl.textContent = window.WaveformAnalysis.formatDuration(audioEl.duration);
      }
    });

    function getHead() { return barsEl.querySelector('.playhead'); }

    function tick() {
      if (audioEl.paused || audioEl.ended) return;
      var pct = audioEl.duration ? (audioEl.currentTime / audioEl.duration) * 100 : 0;
      var head = getHead();
      if (head) head.style.left = pct + '%';
      currentRAF = requestAnimationFrame(tick);
    }

    function setPlayingIcon(isPlaying) {
      var p = btn.querySelector('[data-icon="play"]');
      var s = btn.querySelector('[data-icon="stop"]');
      if (p) p.classList.toggle('hidden', isPlaying);
      if (s) s.classList.toggle('hidden', !isPlaying);
      btn.classList.toggle('is-playing', isPlaying);
    }

    btn.addEventListener('click', function () {
      ensureLoaded().then(function () {
        if (audioEl.paused) {
          stopAllExcept(audioEl);
          audioEl.play();
        } else {
          audioEl.pause();
        }
      });
    });

    barsEl.addEventListener('click', function (e) {
      ensureLoaded().then(function () {
        var rect = barsEl.getBoundingClientRect();
        var pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        var head = getHead();
        if (audioEl.duration) {
          audioEl.currentTime = pct * audioEl.duration;
          if (head) head.style.left = (pct * 100) + '%';
        }
        if (audioEl.paused) {
          stopAllExcept(audioEl);
          audioEl.play();
        }
      });
    });

    audioEl.addEventListener('play', function () {
      setPlayingIcon(true);
      cancelAnimationFrame(currentRAF);
      currentRAF = requestAnimationFrame(tick);
    });
    audioEl.addEventListener('pause', function () {
      setPlayingIcon(false);
      cancelAnimationFrame(currentRAF);
    });
    audioEl.addEventListener('ended', function () {
      var head = getHead();
      if (head) head.style.left = '0%';
    });

    // Wellenform direkt beim Laden der Seite berechnen, nicht erst
    // beim ersten Klick — ein professioneller Player zeigt die Form
    // der Aufnahme sofort, bevor überhaupt abgespielt wird.
    ensureLoaded();
  }

  function init() {
    for (var i = 0; i < 3; i++) {
      setupRow(i, 'vorher', 'bg-mute/70');
      setupRow(i, 'nachher', 'bg-teal');
    }
  }

  return { init: init };
})();
