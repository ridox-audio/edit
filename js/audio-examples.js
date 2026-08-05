/**
 * audio-examples.js
 * ---------------------------------------------------------------
 * Technische Parameter der drei Klangbeispiele (Rauschen, Filter,
 * Lautstärke, Pausen). Die Reihenfolge hier MUSS zur Reihenfolge
 * von CONTENT.beispiele.items in content-de.js passen (Index 0-2) —
 * dort stehen Titel/Text, hier die Klang-Parameter.
 *
 * Läuft NACH RenderContent.renderAll(), weil die Ziel-Container
 * (ex0-vorher-bars usw.) erst dadurch existieren.
 * ---------------------------------------------------------------
 */
window.AudioExamples = (function () {

  var EXAMPLES = [
    {
      // Beispiel 0: Rauschunterdrückung
      metric: 'noise',
      vorher: { gapBase: 70, longPauseEvery: 4, longPauseMs: 220, filler: false, noise: 0.09, cutoff: 1600, gain: 0.50, gainJitter: 0.15 },
      nachher: { gapBase: 70, longPauseEvery: 4, longPauseMs: 220, filler: false, noise: 0.006, cutoff: 5200, gain: 0.75, gainJitter: 0.03 }
    },
    {
      // Beispiel 1: Schnitt / tote Luft
      metric: 'duration',
      vorher: { gapBase: 90, longPauseEvery: 3, longPauseMs: 650, filler: true, noise: 0.015, cutoff: 3200, gain: 0.65, gainJitter: 0.05 },
      nachher: { gapBase: 45, longPauseEvery: 0, longPauseMs: 0, filler: false, noise: 0.01, cutoff: 3400, gain: 0.70, gainJitter: 0.03 }
    },
    {
      // Beispiel 2: Mastering / Lautheit
      metric: 'loudness',
      vorher: { gapBase: 70, longPauseEvery: 4, longPauseMs: 200, filler: false, noise: 0.02, cutoff: 1200, gain: 0.35, gainJitter: 0.25 },
      nachher: { gapBase: 70, longPauseEvery: 4, longPauseMs: 200, filler: false, noise: 0.01, cutoff: 6000, gain: 0.85, gainJitter: 0.02 }
    }
  ];

  var schemeGrey = { gap: 'bg-edge', voice: 'bg-mute/70', filler: 'bg-coral/70' };
  var schemeTeal = { gap: 'bg-edge', voice: 'bg-teal', filler: 'bg-teal' };

  function fmt(ms) {
    return (ms / 1000).toFixed(1).replace('.', ',') + '\u00A0s';
  }

  function renderBars(el, bars, scheme) {
    if (!el) return;
    el.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'flex h-full w-full items-end gap-[2px]';
    bars.forEach(function (b) {
      var d = document.createElement('div');
      var color = scheme.gap;
      if (b.kind === 'voice') color = scheme.voice;
      if (b.kind === 'filler') color = scheme.filler;
      d.className = 'w-[3px] flex-shrink-0 rounded-sm ' + color;
      d.style.height = b.h + '%';
      wrap.appendChild(d);
    });
    el.appendChild(wrap);
    var head = document.createElement('div');
    head.className = 'playhead absolute top-0 bottom-0 left-0 w-[2px] bg-amber';
    el.appendChild(head);
  }

  function init() {
    var Engine = window.AudioEngine;

    EXAMPLES.forEach(function (ex, i) {
      var schV = Engine.buildSchedule(ex.vorher);
      var schN = Engine.buildSchedule(ex.nachher);
      ex._schV = schV;
      ex._schN = schN;

      renderBars(document.getElementById('ex' + i + '-vorher-bars'), Engine.computeBars(schV, 45), schemeGrey);
      renderBars(document.getElementById('ex' + i + '-nachher-bars'), Engine.computeBars(schN, 45), schemeTeal);

      var vDur = document.getElementById('ex' + i + '-vorher-dur');
      var nDur = document.getElementById('ex' + i + '-nachher-dur');
      if (vDur) vDur.textContent = fmt(schV.total);
      if (nDur) nDur.textContent = fmt(schN.total);

      var badgeEl = document.getElementById('ex' + i + '-badge');
      if (badgeEl) {
        if (ex.metric === 'noise') {
          var pct = Math.round((1 - ex.nachher.noise / ex.vorher.noise) * 100);
          badgeEl.textContent = 'Rauschen \u2212' + pct + '%';
        } else if (ex.metric === 'duration') {
          var dpct = Math.round((1 - schN.total / schV.total) * 100);
          badgeEl.textContent = '\u2212' + dpct + '% tote Luft';
        } else if (ex.metric === 'loudness') {
          var db = Math.round(20 * Math.log10(ex.nachher.gain / ex.vorher.gain));
          badgeEl.textContent = '+' + db + ' dB, gleichmäßig';
        }
      }
    });

    function resetIcons(btn) {
      var p = btn.querySelector('[data-icon="play"]');
      var s = btn.querySelector('[data-icon="stop"]');
      if (p) p.classList.remove('hidden');
      if (s) s.classList.add('hidden');
    }

    function stopAllVisuals() {
      document.querySelectorAll('.playhead').forEach(function (p) {
        p.style.transition = 'none';
        p.style.left = '0%';
      });
      document.querySelectorAll('[data-play]').forEach(function (b) {
        b.classList.remove('is-playing');
        resetIcons(b);
      });
    }

    function playExample(idx, variant, btn) {
      var ex = EXAMPLES[idx];
      var cfg = ex[variant];
      var schedule = variant === 'vorher' ? ex._schV : ex._schN;

      Engine.stopCurrent(stopAllVisuals);
      stopAllVisuals();

      var container = document.getElementById('ex' + idx + '-' + variant + '-bars');
      var head = container ? container.querySelector('.playhead') : null;

      Engine.play(cfg, schedule, stopAllVisuals);

      if (head) {
        head.style.transition = 'none';
        head.style.left = '0%';
        void head.offsetWidth;
        head.style.transition = 'left linear ' + schedule.total + 'ms';
        head.style.left = '100%';
      }

      btn.classList.add('is-playing');
      var p = btn.querySelector('[data-icon="play"]');
      var s = btn.querySelector('[data-icon="stop"]');
      if (p) p.classList.add('hidden');
      if (s) s.classList.remove('hidden');
    }

    document.querySelectorAll('[data-play]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var parts = btn.getAttribute('data-play').split(':');
        playExample(Number(parts[0]), parts[1], btn);
      });
    });
  }

  return { init: init };
})();
