/**
 * audio-examples.js
 * ---------------------------------------------------------------
 * Verbindet die von render-content.js gebauten Beispiel-Karten mit
 * echten Audiodateien:
 *  - lädt jede mp3 selbst und berechnet daraus eine statische
 *    Wellenform, die sofort beim Öffnen der Seite korrekt angezeigt
 *    wird (nicht erst beim Klick auf Play)
 *  - zeigt die echte Dauer an
 *  - bewegt die Nadel (Playhead) exakt synchron zur Wiedergabe
 *  - erlaubt Klick auf die Wellenform zum Springen (Seek)
 *  - stoppt automatisch jede andere Spur, wenn eine neue startet
 *  - während der Wiedergabe pulsieren die Balken ganz dezent
 *    (reine CSS-Animation, kostet während der Wiedergabe nichts)
 *
 * Die Wellenform-Berechnung steckt komplett in dieser Datei (ein
 * einziger, geteilter AudioContext für alle Beispiele). Mehrere
 * gleichzeitige AudioContexts waren der Hauptgrund, warum die
 * Wellenform je nach Browser (v. a. Safari, das aktive Contexts
 * begrenzt) mal angezeigt wurde und mal nicht. waveform-analysis.js
 * wird dafür nicht mehr gebraucht.
 *
 * Kann eine Datei ausnahmsweise nicht geladen/dekodiert werden (z. B.
 * beim Testen per Doppelklick ohne lokalen Server, wo Browser den
 * Zugriff auf lokale Dateien per fetch() blockieren), wird ein
 * deterministischer Platzhalter-Verlauf gezeichnet statt für immer
 * beim flachen 14%-Strich zu bleiben.
 * ---------------------------------------------------------------
 */
window.AudioExamples = (function () {

  var NUM_BARS = 120;          // Auflösung der Wellenform
  var SAMPLE_POINTS = 200;     // max. Stützstellen pro Balken (rechenschonend)
  var PULSE_STYLE_ID = 'audio-examples-pulse-style';

  var sharedAudioCtx = null;
  var peaksCache = Object.create(null);

  // ---------------------------------------------------------------
  // Ein einziger AudioContext für alle Beispiele auf der Seite.
  // ---------------------------------------------------------------
  function getAudioContext() {
    if (sharedAudioCtx) return sharedAudioCtx;
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    try {
      sharedAudioCtx = new Ctx();
    } catch (e) {
      sharedAudioCtx = null;
    }
    return sharedAudioCtx;
  }

  // decodeAudioData promise-basiert nutzen, mit Callback-Fallback für
  // ältere Safari-Versionen, die nur die Callback-Signatur unterstützen.
  // arrayBuffer.slice(0) verhindert Probleme durch "detached" Buffer,
  // die manche älteren Implementierungen beim Dekodieren erzeugen.
  function decodeAudioData(ctx, arrayBuffer) {
    return new Promise(function (resolve, reject) {
      var maybePromise = ctx.decodeAudioData(arrayBuffer.slice(0), resolve, reject);
      if (maybePromise && typeof maybePromise.then === 'function') {
        maybePromise.then(resolve, reject);
      }
    });
  }

  // Peaks per RMS pro Block. Statt jedes einzelne Sample zu lesen wird
  // pro Balken nur eine begrenzte Zahl Stützstellen abgetastet – für
  // mono-mp3s in Podcast-Länge bleibt das auch auf schwacher Hardware
  // spürbar günstig.
  function computePeaks(buffer, numBars) {
    var data = buffer.getChannelData(0);
    var blockSize = Math.max(1, Math.floor(data.length / numBars));
    var peaks = new Array(numBars);
    var max = 0;

    for (var i = 0; i < numBars; i++) {
      var start = i * blockSize;
      var end = Math.min(start + blockSize, data.length);
      var step = Math.max(1, Math.floor((end - start) / SAMPLE_POINTS));
      var sumSquares = 0;
      var count = 0;
      for (var j = start; j < end; j += step) {
        var v = data[j];
        sumSquares += v * v;
        count++;
      }
      var rms = count ? Math.sqrt(sumSquares / count) : 0;
      peaks[i] = rms;
      if (rms > max) max = rms;
    }

    if (max > 0) {
      for (i = 0; i < numBars; i++) peaks[i] = peaks[i] / max;
    }
    return peaks;
  }

  // Deterministischer, organisch aussehender Ersatz-Verlauf, falls
  // eine Datei sich nicht laden/dekodieren lässt. Verhindert, dass die
  // Karte auf einen flachen Platzhalter zurückfällt.
  function fallbackPeaks(seedStr, numBars) {
    var seed = 0;
    for (var i = 0; i < seedStr.length; i++) {
      seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
    }
    function rand() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    }
    var peaks = new Array(numBars);
    for (i = 0; i < numBars; i++) {
      var envelope = 0.55 + 0.45 * Math.sin((i / numBars) * Math.PI);
      peaks[i] = Math.max(0.08, Math.min(1, envelope * (0.55 + rand() * 0.5)));
    }
    return peaks;
  }

  function formatDuration(seconds) {
    if (window.WaveformAnalysis && window.WaveformAnalysis.formatDuration) {
      return window.WaveformAnalysis.formatDuration(seconds);
    }
    if (!isFinite(seconds)) return '—';
    var m = Math.floor(seconds / 60);
    var s = Math.round(seconds % 60);
    if (s === 60) { m += 1; s = 0; }
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function loadPeaks(src) {
    if (peaksCache[src]) return peaksCache[src];

    var ctx = getAudioContext();
    var promise = !ctx
      ? Promise.reject(new Error('Web Audio API nicht verfügbar'))
      : fetch(src)
          .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.arrayBuffer();
          })
          .then(function (arrayBuffer) { return decodeAudioData(ctx, arrayBuffer); })
          .then(function (buffer) {
            return { peaks: computePeaks(buffer, NUM_BARS), duration: buffer.duration };
          });

    peaksCache[src] = promise;
    return promise;
  }

  // ---------------------------------------------------------------
  // Dezente Puls-Animation der Balken während der Wiedergabe. Reines
  // CSS (kein JS-Tick, kostet also nichts während der Wiedergabe) mit
  // leicht versetztem Timing pro Balken, damit es organisch statt
  // mechanisch wirkt. Respektiert prefers-reduced-motion.
  // ---------------------------------------------------------------
  function ensurePulseStyle() {
    if (document.getElementById(PULSE_STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = PULSE_STYLE_ID;
    style.textContent =
      '@keyframes exampleBarPulse{0%,100%{transform:scaleY(1);}50%{transform:scaleY(var(--pulse-scale,1.05));}}' +
      '.example-bar{transform-origin:bottom;will-change:transform;}' +
      '.example-bars.is-playing .example-bar{animation:exampleBarPulse var(--pulse-duration,1100ms) ease-in-out infinite;animation-delay:var(--pulse-delay,0ms);}' +
      '@media (prefers-reduced-motion: reduce){.example-bars.is-playing .example-bar{animation:none;}}';
    document.head.appendChild(style);
  }

  function renderFlatBars(container) {
    container.innerHTML = '';
    container.classList.add('example-bars');
    var wrap = document.createElement('div');
    wrap.className = 'flex h-full w-full items-end gap-[2px] example-bars-loading';
    for (var i = 0; i < NUM_BARS; i++) {
      var d = document.createElement('div');
      d.className = 'flex-1 flex-shrink-0 rounded-sm bg-edge example-bar';
      d.style.height = '14%';
      wrap.appendChild(d);
    }
    container.appendChild(wrap);
    addPlayhead(container);
  }

  function renderPeakBars(container, peaks, colorClass) {
    container.innerHTML = '';
    container.classList.add('example-bars');
    var wrap = document.createElement('div');
    wrap.className = 'flex h-full w-full items-end gap-[2px]';
    peaks.forEach(function (p, i) {
      var d = document.createElement('div');
      var h = Math.max(6, Math.round(p * 100));
      d.className = 'flex-1 flex-shrink-0 rounded-sm ' + colorClass + ' example-bar';
      d.style.height = h + '%';
      // leichte, deterministische Variation pro Balken statt
      // synchronem Blinken aller Balken zugleich
      d.style.setProperty('--pulse-delay', ((i * 53) % 900) + 'ms');
      d.style.setProperty('--pulse-duration', (900 + (i % 5) * 80) + 'ms');
      d.style.setProperty('--pulse-scale', (1.03 + p * 0.05).toFixed(3));
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

    ensurePulseStyle();
    renderFlatBars(barsEl);

    var loaded = false;
    var loadPromise = null;
    var rafId = null;

    function ensureLoaded() {
      if (loaded) return Promise.resolve();
      if (loadPromise) return loadPromise;

      loadPromise = loadPeaks(audioEl.src)
        .then(function (result) {
          loaded = true;
          renderPeakBars(barsEl, result.peaks, colorClass);
          if (durEl) durEl.textContent = formatDuration(result.duration);
        })
        .catch(function (err) {
          console.warn('[audio-examples] Echte Wellenform nicht ladbar für', audioEl.src, '– verwende Platzhalter-Verlauf.', err);
          loaded = true; // kein erneuter Ladeversuch, Platzhalter reicht
          renderPeakBars(barsEl, fallbackPeaks(audioEl.src, NUM_BARS), colorClass);
        });

      return loadPromise;
    }

    // Dauer notfalls auch über das native <audio>-Element anzeigen,
    // falls sie noch nicht aus der dekodierten Datei bekannt ist.
    audioEl.addEventListener('loadedmetadata', function () {
      if (durEl && (durEl.textContent === '—' || !durEl.textContent)) {
        durEl.textContent = formatDuration(audioEl.duration);
      }
    });

    function getHead() { return barsEl.querySelector('.playhead'); }

    function tick() {
      if (audioEl.paused || audioEl.ended) return;
      var pct = audioEl.duration ? (audioEl.currentTime / audioEl.duration) * 100 : 0;
      var head = getHead();
      if (head) head.style.left = pct + '%';
      rafId = requestAnimationFrame(tick);
    }

    function setPlayingIcon(isPlaying) {
      var p = btn.querySelector('[data-icon="play"]');
      var s = btn.querySelector('[data-icon="stop"]');
      if (p) p.classList.toggle('hidden', isPlaying);
      if (s) s.classList.toggle('hidden', !isPlaying);
      btn.classList.toggle('is-playing', isPlaying);
      barsEl.classList.toggle('is-playing', isPlaying);
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
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    });
    audioEl.addEventListener('pause', function () {
      setPlayingIcon(false);
      cancelAnimationFrame(rafId);
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
