/**
 * audio-engine.js
 * ---------------------------------------------------------------
 * Generisches Klang-Demo-System auf Basis der Web Audio API.
 * Erzeugt synthetische, sprachrhythmus-ähnliche Klangbeispiele
 * (keine echten Aufnahmen) aus einem einfachen Konfigurations-
 * objekt: Pausenlänge, Rauschpegel, Filter-Cutoff, Lautstärke.
 *
 * Kennt weder Beispiel-Texte noch Karten-Markup — das liegt in
 * audio-examples.js. Hier steckt nur die Audio-/Wellenform-Logik,
 * damit sie unabhängig weiterentwickelt werden kann.
 * ---------------------------------------------------------------
 */
window.AudioEngine = (function () {

  // Silben-Rhythmus (ms), der als gemeinsame "Sprachbasis" für
  // alle Beispiele dient. Vorher/Nachher unterscheiden sich durch
  // Pausen, Rauschen, Filter und Lautstärke — nicht durch den
  // Grundrhythmus.
  var SYLLABLES = [150, 95, 170, 110, 140, 185, 105, 155, 125, 175, 95, 145, 165, 115];

  function buildSchedule(cfg) {
    var t = 0;
    var events = [];
    SYLLABLES.forEach(function (dur, i) {
      events.push({ start: t, dur: dur, kind: 'voice' });
      t += dur;
      var gap = cfg.gapBase;
      if (cfg.longPauseEvery > 0 && (i % cfg.longPauseEvery === cfg.longPauseEvery - 1)) {
        gap = cfg.longPauseMs;
        if (cfg.filler) {
          events.push({ start: t, dur: Math.round(gap * 0.55), kind: 'filler' });
        }
      }
      t += gap;
    });
    return { events: events, total: t };
  }

  function computeBars(schedule, sliceMs) {
    var bars = [];
    var n = Math.max(1, Math.round(schedule.total / sliceMs));
    for (var s = 0; s < n; s++) {
      var t = s * sliceMs;
      var ev = null;
      for (var e = 0; e < schedule.events.length; e++) {
        var cand = schedule.events[e];
        if (t >= cand.start && t < cand.start + cand.dur) { ev = cand; break; }
      }
      if (!ev) { bars.push({ h: 6, kind: 'gap' }); continue; }
      if (ev.kind === 'voice') {
        var local = (t - ev.start) / ev.dur;
        var h = 28 + 55 * Math.abs(Math.sin((local * Math.PI) + (ev.start * 0.01)));
        bars.push({ h: Math.round(h), kind: 'voice' });
      } else {
        bars.push({ h: 22, kind: 'filler' });
      }
    }
    return bars;
  }

  // ---------- Web Audio Playback ----------
  var audioCtx = null;
  var noiseBufCache = null;
  var currentStop = null;
  var currentTimeout = null;

  function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function getNoiseBuffer(ctx) {
    if (noiseBufCache) return noiseBufCache;
    var len = ctx.sampleRate * 2;
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var data = buf.getChannelData(0);
    var b0 = 0, b1 = 0, b2 = 0;
    for (var i = 0; i < len; i++) {
      var w = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + w * 0.1;
      b1 = 0.98 * b1 + w * 0.05;
      b2 = 0.95 * b2 + w * 0.02;
      data[i] = (b0 + b1 + b2) * 0.6;
    }
    noiseBufCache = buf;
    return buf;
  }

  function stopCurrent(onStopped) {
    if (currentStop) { try { currentStop(); } catch (e) {} currentStop = null; }
    if (currentTimeout) { clearTimeout(currentTimeout); currentTimeout = null; }
    if (typeof onStopped === 'function') onStopped();
  }

  /**
   * Spielt einen Schedule ab.
   * @param {Object} cfg - { noise, cutoff, gain, gainJitter }
   * @param {Object} schedule - Ergebnis von buildSchedule()
   * @param {Function} onDone - wird nach Ablauf der Gesamtdauer aufgerufen
   * @returns {number} Gesamtdauer in ms
   */
  function play(cfg, schedule, onDone) {
    var ctx = getCtx();
    stopCurrent();

    var master = ctx.createGain(); master.gain.value = 0.5;
    var comp = ctx.createDynamicsCompressor();
    master.connect(comp); comp.connect(ctx.destination);

    var nodes = [];

    if (cfg.noise > 0) {
      var src = ctx.createBufferSource();
      src.buffer = getNoiseBuffer(ctx);
      src.loop = true;
      var nfilt = ctx.createBiquadFilter(); nfilt.type = 'lowpass'; nfilt.frequency.value = 900;
      var ngain = ctx.createGain(); ngain.gain.value = cfg.noise;
      src.connect(nfilt); nfilt.connect(ngain); ngain.connect(master);
      var t0 = ctx.currentTime;
      src.start(t0); src.stop(t0 + schedule.total / 1000 + 0.05);
      nodes.push(src);
    }

    schedule.events.forEach(function (ev, i) {
      var startT = ctx.currentTime + ev.start / 1000;
      var durS = ev.dur / 1000;

      if (ev.kind === 'voice') {
        var osc = ctx.createOscillator(); osc.type = 'triangle';
        var pitch = 130 + 40 * Math.sin(i * 1.7) + (i % 3) * 8;
        osc.frequency.setValueAtTime(pitch, startT);
        osc.frequency.linearRampToValueAtTime(pitch * 0.9, startT + durS);

        var filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = cfg.cutoff;

        var g = ctx.createGain();
        var peak = Math.max(0.05, cfg.gain + Math.sin(i * 2.3) * cfg.gainJitter);
        g.gain.setValueAtTime(0.0001, startT);
        g.gain.linearRampToValueAtTime(peak, startT + durS * 0.3);
        g.gain.linearRampToValueAtTime(peak * 0.5, startT + durS * 0.7);
        g.gain.linearRampToValueAtTime(0.0001, startT + durS);

        osc.connect(filt); filt.connect(g); g.connect(master);
        osc.start(startT); osc.stop(startT + durS + 0.02);
        nodes.push(osc);
      } else if (ev.kind === 'filler') {
        var fosc = ctx.createOscillator(); fosc.type = 'sawtooth';
        fosc.frequency.setValueAtTime(115, startT);
        var lfo = ctx.createOscillator(); lfo.frequency.value = 5;
        var lfoGain = ctx.createGain(); lfoGain.gain.value = 6;
        lfo.connect(lfoGain); lfoGain.connect(fosc.frequency);

        var ffilt = ctx.createBiquadFilter(); ffilt.type = 'lowpass'; ffilt.frequency.value = cfg.cutoff * 0.5;
        var fg = ctx.createGain();
        fg.gain.setValueAtTime(0.0001, startT);
        fg.gain.linearRampToValueAtTime(cfg.gain * 0.3, startT + 0.05);
        fg.gain.linearRampToValueAtTime(0.0001, startT + durS);

        fosc.connect(ffilt); ffilt.connect(fg); fg.connect(master);
        lfo.start(startT); lfo.stop(startT + durS + 0.02);
        fosc.start(startT); fosc.stop(startT + durS + 0.02);
        nodes.push(fosc, lfo);
      }
    });

    currentStop = function () {
      nodes.forEach(function (n) {
        try { n.stop(); } catch (e) {}
        try { n.disconnect(); } catch (e) {}
      });
      try { master.disconnect(); } catch (e) {}
      try { comp.disconnect(); } catch (e) {}
    };

    currentTimeout = setTimeout(function () {
      stopCurrent();
      if (typeof onDone === 'function') onDone();
    }, schedule.total + 60);

    return schedule.total;
  }

  return {
    buildSchedule: buildSchedule,
    computeBars: computeBars,
    play: play,
    stopCurrent: stopCurrent
  };
})();
