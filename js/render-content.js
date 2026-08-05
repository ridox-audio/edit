/**
 * render-content.js
 * ---------------------------------------------------------------
 * Füllt index.html mit den Texten aus window.CONTENT.
 *
 * Zwei Mechanismen:
 * 1) [data-key="pfad.zum.text"] auf einem Element -> textContent
 *    wird aus CONTENT gelesen (Punkt-Pfad, z. B. "hero.headline").
 * 2) Wiederholende Bereiche (Karten, Listen, FAQ, Preise) werden
 *    komplett aus den Arrays in content-de.js gebaut und in einen
 *    leeren Container (id="...-slot") eingehängt.
 *
 * audio-examples.js baut NICHT die Beispiel-Karten selbst — das
 * übernimmt renderBeispiele() hier. audio-examples.js füllt danach
 * nur noch die Wellenformen/Badges in die schon vorhandenen
 * Container (ex0-vorher-bars usw.).
 * ---------------------------------------------------------------
 */
window.RenderContent = (function () {

  function get(path) {
    return path.split('.').reduce(function (acc, key) {
      return (acc !== undefined && acc !== null) ? acc[key] : undefined;
    }, window.CONTENT);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function iconSlot(name, className) {
    var span = document.createElement('span');
    span.className = 'icon-slot ' + (className || '');
    span.innerHTML = window.ICONS[name] || '';
    return span;
  }

  // ---------- 1) einfache Text-Keys ----------
  function renderSimpleKeys() {
    document.querySelectorAll('[data-key]').forEach(function (node) {
      var value = get(node.getAttribute('data-key'));
      if (value === undefined) {
        console.warn('[content] fehlender Key:', node.getAttribute('data-key'));
        return;
      }
      node.textContent = value;
    });
  }

  // ---------- Nutzen (Vorteile) ----------
  function renderNutzen() {
    var data = CONTENT.nutzen;
    var grid = document.getElementById('nutzen-grid');
    if (!grid) return;
    data.items.forEach(function (item) {
      var card = el('div', 'card-hover rounded-2xl border border-edge bg-surface p-6');
      card.appendChild(iconSlot(item.icon, 'text-teal'));
      card.appendChild(el('h3', 'mt-4 font-display text-lg font-medium', item.title));
      card.appendChild(el('p', 'mt-2 text-sm leading-relaxed text-mute', item.desc));
      grid.appendChild(card);
    });
  }

  // ---------- Leistungen ----------
  function renderLeistungen() {
    var data = CONTENT.leistungen;
    var grid = document.getElementById('leistungen-grid');
    if (!grid) return;
    data.items.forEach(function (item) {
      var card = el('div', 'bg-surface p-7');
      card.appendChild(iconSlot(item.icon, 'text-amber'));
      card.appendChild(el('h3', 'mt-4 font-display text-base font-medium', item.title));
      card.appendChild(el('p', 'mt-2 text-sm leading-relaxed text-mute', item.desc));
      grid.appendChild(card);
    });
  }

  // ---------- Ablauf ----------
  function renderAblauf() {
    var data = CONTENT.ablauf;
    var grid = document.getElementById('ablauf-grid');
    if (!grid) return;
    data.steps.forEach(function (step) {
      var card = el('div', 'relative rounded-2xl border border-edge bg-surface p-7');
      card.appendChild(el('span', 'font-mono text-sm text-amber', step.time));
      card.appendChild(el('h3', 'mt-3 font-display text-lg font-medium', step.title));
      card.appendChild(el('p', 'mt-2 text-sm leading-relaxed text-mute', step.desc));
      grid.appendChild(card);
    });
  }

  // ---------- Warum-mit-mir Kennzahlen ----------
  function renderUeberStats() {
    var data = CONTENT.ueber;
    var wrap = document.getElementById('ueber-stats');
    if (!wrap) return;
    data.stats.forEach(function (stat) {
      var block = el('div');
      var top = el('div', 'flex items-baseline justify-between');
      top.appendChild(el('span', 'font-display text-3xl font-semibold text-ink', stat.value));
      top.appendChild(el('span', 'font-mono text-xs text-mute', stat.label));
      block.appendChild(top);

      var track = el('div', 'mt-2 h-1.5 w-full overflow-hidden rounded-full bg-edge');
      var fill = el('div', 'h-full rounded-full bg-teal');
      fill.style.width = stat.fill + '%';
      track.appendChild(fill);
      block.appendChild(track);

      block.appendChild(el('p', 'mt-2 text-sm text-mute', stat.desc));
      wrap.appendChild(block);
    });
  }

  // ---------- Beispiele (Vorher/Nachher-Karten) ----------
  // Baut die Kartenstruktur; audio-examples.js füllt anschließend
  // Wellenformen, Dauer und Badge in dieselben IDs.
  function renderBeispiele() {
    var data = CONTENT.beispiele;
    var list = document.getElementById('examples-list');
    if (!list) return;

    function playButton(idx, variant, extraClass) {
      var btn = document.createElement('button');
      btn.setAttribute('data-play', idx + ':' + variant);
      btn.className = 'play-btn flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border text-mute hover:text-ink ' + extraClass;
      var playIcon = document.createElement('span');
      playIcon.setAttribute('data-icon', 'play');
      playIcon.className = 'h-3.5 w-3.5 translate-x-[1px] block';
      playIcon.innerHTML = window.ICONS.play;
      var stopIcon = document.createElement('span');
      stopIcon.setAttribute('data-icon', 'stop');
      stopIcon.className = 'h-3 w-3 hidden block';
      stopIcon.innerHTML = window.ICONS.stop;
      btn.appendChild(playIcon);
      btn.appendChild(stopIcon);
      return btn;
    }

    function row(idx, variant, label, labelClass, btnClass) {
      var wrap = el('div', 'flex items-center gap-4');
      wrap.appendChild(playButton(idx, variant, btnClass));
      wrap.appendChild(el('div', 'w-16 font-mono text-xs uppercase tracking-wide ' + labelClass, label));
      var bars = el('div', 'relative h-12 flex-1 overflow-hidden rounded-lg bg-bgsoft');
      bars.id = 'ex' + idx + '-' + variant + '-bars';
      wrap.appendChild(bars);
      var dur = el('div', 'w-14 flex-shrink-0 text-right font-mono text-xs text-mute', '—');
      dur.id = 'ex' + idx + '-' + variant + '-dur';
      wrap.appendChild(dur);
      return wrap;
    }

    data.items.forEach(function (item, idx) {
      var card = el('div', 'rounded-2xl border border-edge bg-surface p-6 sm:p-8');

      var head = el('div', 'flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between');
      var headText = el('div');
      headText.appendChild(el('h3', 'font-display text-xl font-medium', item.title));
      headText.appendChild(el('p', 'mt-1 text-sm text-mute', item.desc));
      head.appendChild(headText);
      var badge = el('span', 'mt-2 inline-flex w-fit items-center rounded-full border border-teal/40 bg-teal/10 px-3 py-1 font-mono text-xs text-teal sm:mt-0', '—');
      badge.id = 'ex' + idx + '-badge';
      head.appendChild(badge);
      card.appendChild(head);

      var rows = el('div', 'mt-6 space-y-4');
      rows.appendChild(row(idx, 'vorher', data.labelVorher, 'text-mute', 'border-edge hover:border-mute'));
      rows.appendChild(row(idx, 'nachher', data.labelNachher, 'text-teal', 'border-teal/50 hover:bg-teal/10'));
      card.appendChild(rows);

      card.appendChild(el('p', 'mt-4 font-mono text-[11px] text-mute/70', data.caption));

      list.appendChild(card);
    });
  }

  // ---------- Preise ----------
  function renderPreise() {
    var data = CONTENT.preise;
    var grid = document.getElementById('preise-grid');
    if (!grid) return;

    data.tiers.forEach(function (tier) {
      var card = el('div', 'relative flex flex-col rounded-2xl bg-surface p-7 ' +
        (tier.highlighted ? 'border-2 border-amber' : 'border border-edge'));

      if (tier.badge) {
        card.appendChild(el('span', 'absolute -top-3 left-7 rounded-full bg-amber px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-bg', tier.badge));
      }

      var head = el('div', 'flex items-start justify-between gap-4');
      var headText = el('div');
      headText.appendChild(el('h3', 'font-display text-xl font-medium', tier.name));
      headText.appendChild(el('p', 'mt-1 text-sm text-mute', tier.subtitle));
      head.appendChild(headText);
      head.appendChild(fader(tier));
      card.appendChild(head);

      var featureList = el('ul', 'mt-6 flex-1 space-y-3 text-sm text-mute');
      tier.features.forEach(function (f) {
        var li = el('li', 'flex gap-2');
        var mark = el('span', 'text-teal', '✓');
        li.appendChild(mark);
        li.appendChild(document.createTextNode(f));
        featureList.appendChild(li);
      });
      card.appendChild(featureList);

      var bottom = el('div', 'mt-8 border-t border-edge pt-6');
      bottom.appendChild(el('p', 'text-sm text-mute', tier.priceNote));
      var priceRow = el('div', 'mt-2 flex items-baseline gap-2');
      priceRow.appendChild(el('span', 'font-display text-2xl font-semibold text-ink', tier.price));
      if (tier.priceUnit) priceRow.appendChild(el('span', 'font-mono text-xs text-mute', tier.priceUnit));
      bottom.appendChild(priceRow);

      var ctaBtn = el('a', 'mt-5 block rounded-full px-5 py-3 text-center text-sm font-medium transition ' +
        (tier.highlighted ? 'bg-amber text-bg hover:bg-amber/90' : 'border border-edge text-ink hover:border-mute'), tier.cta);
      ctaBtn.href = '#kontakt';
      ctaBtn.setAttribute('data-cta', 'primary');
      bottom.appendChild(ctaBtn);

      if (tier.secondaryCta) {
        var secLink = el('a', 'mt-3 block text-center text-xs text-mute underline underline-offset-4 hover:text-ink', tier.secondaryCta);
        secLink.href = '#kontakt';
        bottom.appendChild(secLink);
      }

      card.appendChild(bottom);
      grid.appendChild(card);
    });
  }

  function fader(tier) {
    // Visuelle Mono/Stereo-Metapher: ein Kanal vs. zwei Kanäle.
    var wrap = el('div', 'flex flex-shrink-0 gap-1');
    var barCount = tier.name === 'Stereo' ? 2 : 1;
    var color = tier.highlighted ? 'bg-amber' : 'bg-mute';
    for (var i = 0; i < barCount; i++) {
      var col = el('div', 'h-16 w-1.5 overflow-hidden rounded-full bg-edge');
      var fill = el('div', color + ' w-full');
      var pct = tier.highlighted ? (80 - i * 8) : 45;
      fill.style.height = pct + '%';
      fill.style.marginTop = (100 - pct) + '%';
      col.appendChild(fill);
      wrap.appendChild(col);
    }
    return wrap;
  }

  // ---------- FAQ ----------
  function renderFaq() {
    var data = CONTENT.faq;
    var wrap = document.getElementById('faq-list');
    if (!wrap) return;
    data.items.forEach(function (item) {
      var details = el('details', 'group py-5');
      var summary = el('summary', 'flex items-center justify-between gap-4');
      summary.appendChild(el('span', 'font-display text-base font-medium', item.q));
      var chevron = el('span', 'faq-chevron-bg flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-edge text-mute');
      chevron.appendChild(el('span', 'faq-icon', '＋'));
      summary.appendChild(chevron);
      details.appendChild(summary);
      details.appendChild(el('p', 'mt-3 max-w-2xl text-sm leading-relaxed text-mute', item.a));
      wrap.appendChild(details);
    });
  }

  // ---------- Footer-Links ----------
  function renderFooterLinks() {
    var nav = document.getElementById('footer-nav-links');
    if (nav) {
      [
        ['#leistungen', CONTENT.nav.leistungen],
        ['#beispiele', CONTENT.nav.beispiele],
        ['#preise', CONTENT.nav.preise],
        ['#faq', CONTENT.nav.faq]
      ].forEach(function (pair) {
        var li = document.createElement('li');
        var a = el('a', 'text-mute hover:text-ink', pair[1]);
        a.href = pair[0];
        li.appendChild(a);
        nav.appendChild(li);
      });
    }
    var legal = document.getElementById('footer-legal-links');
    if (legal) {
      [
        ['impressum.html', CONTENT.footer.impressum],
        ['datenschutz.html', CONTENT.footer.datenschutz]
      ].forEach(function (pair) {
        var li = document.createElement('li');
        var a = el('a', 'text-mute hover:text-ink', pair[1]);
        a.href = pair[0];
        li.appendChild(a);
        legal.appendChild(li);
      });
    }
  }

  // ---------- mailto-CTAs verdrahten ----------
  function wireMailtoCtas() {
    var c = CONTENT.cta;
    var href = 'mailto:' + c.mailTo +
      '?subject=' + encodeURIComponent(c.mailSubject) +
      '&body=' + encodeURIComponent(c.mailBody);
    document.querySelectorAll('[data-cta="primary"]').forEach(function (a) {
      a.setAttribute('href', href);
    });
  }

  function renderAll() {
    document.title = CONTENT.meta.title;
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', CONTENT.meta.description);

    renderSimpleKeys();
    renderNutzen();
    renderUeberStats();
    renderLeistungen();
    renderAblauf();
    renderBeispiele();
    renderPreise();
    renderFaq();
    renderFooterLinks();
    wireMailtoCtas();
  }

  return { renderAll: renderAll };
})();
