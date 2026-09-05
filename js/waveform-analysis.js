/**
 * waveform-analysis.js
 * ---------------------------------------------------------------
 * Lädt eine echte Audiodatei und berechnet daraus:
 *  - die tatsächliche Dauer
 *  - echte Wellenform-Balken (Peak-Werte aus den PCM-Samples)
 *
 * Kein synthetisches Audio mehr — alles hier kommt direkt aus der
 * Datei. Reine Analyse-Funktionen, kein DOM-Zugriff (siehe
 * audio-examples.js für die Anbindung ans Markup).
 *
 * WICHTIG BEIM LOKALEN TESTEN: decodeAudioData() lädt die Datei
 * per fetch(). Chrome blockiert fetch() auf file:// aus
 * Sicherheitsgründen. Zum Testen auf dem eigenen Rechner reicht
 * ein einfacher lokaler Server, z. B.:
 *   python3 -m http.server
 * und dann http://localhost:8000 öffnen — auf jedem echten
 * Webserver (http/https) läuft es ohnehin ohne weiteres Zutun.
 * ---------------------------------------------------------------
 */
window.WaveformAnalysis = (function () {

  var sharedCtx = null;
  function getDecodeContext() {
    if (!sharedCtx) sharedCtx = new (window.AudioContext || window.webkitAudioContext)();
    return sharedCtx;
  }

  /**
   * Lädt eine Audiodatei und liefert { duration, peaks(numBars) }.
   * @param {string} url
   * @returns {Promise<AudioBuffer>}
   */
  function loadBuffer(url) {
    var ctx = getDecodeContext();
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Audio nicht ladbar: ' + url);
        return res.arrayBuffer();
      })
      .then(function (arrayBuffer) {
        return ctx.decodeAudioData(arrayBuffer);
      });
  }

  /**
   * Berechnet Peak-Werte (0..1) für eine feste Anzahl Balken aus
   * einem AudioBuffer — Mittelwert über alle Kanäle je Zeitfenster.
   */
  function computePeaks(audioBuffer, numBars) {
    var channels = [];
    for (var c = 0; c < audioBuffer.numberOfChannels; c++) {
      channels.push(audioBuffer.getChannelData(c));
    }
    var length = audioBuffer.length;
    var bucketSize = Math.max(1, Math.floor(length / numBars));
    var peaks = new Array(numBars).fill(0);

    for (var i = 0; i < numBars; i++) {
      var start = i * bucketSize;
      var end = Math.min(length, start + bucketSize);
      var max = 0;
      // Aus Performance-Gründen nicht jedes Sample einzeln lesen,
      // sondern in kleinen Schritten abtasten — für Balkenhöhen
      // reicht das völlig und bleibt auch bei langen Dateien schnell.
      var step = Math.max(1, Math.floor((end - start) / 200));
      for (var j = start; j < end; j += step) {
        var sum = 0;
        for (var c2 = 0; c2 < channels.length; c2++) {
          sum += Math.abs(channels[c2][j]);
        }
        var avg = sum / channels.length;
        if (avg > max) max = avg;
      }
      peaks[i] = max;
    }

    // Auf den lautesten Balken normalisieren, damit auch leise
    // Aufnahmen eine gut sichtbare Wellenform zeigen.
    var globalMax = Math.max.apply(null, peaks.concat([0.0001]));
    return peaks.map(function (p) { return p / globalMax; });
  }

  function formatDuration(seconds) {
    if (!isFinite(seconds)) return '—';
    var m = Math.floor(seconds / 60);
    var s = Math.round(seconds - m * 60);
    if (s === 60) { m += 1; s = 0; }
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  return {
    loadBuffer: loadBuffer,
    computePeaks: computePeaks,
    formatDuration: formatDuration
  };
})();
