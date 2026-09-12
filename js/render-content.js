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
 *
 * Preise: jeder Paket-Button öffnet dieselbe Mail-Vorlage, aber mit
 * dem jeweiligen Paket automatisch markiert (siehe
 * buildTierMailBody). Die allgemeinen CTA-Buttons (Hero, Nav,
 * Footer, Schluss-CTA) öffnen dieselbe Vorlage ohne Markierung.
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

    // [data-key-attr="attributname:pfad.zum.text"] -> setzt ein Attribut
    // (z. B. alt-Text von Bildern) statt textContent. So bleiben auch
    // Alt-Texte zentral in content-de.js editier- und übersetzbar.
    document.querySelectorAll('[data-key-attr]').forEach(function (node) {
      var raw = node.getAttribute('data-key-attr');
      var sep = raw.indexOf(':');
      if (sep === -1) return;
      var attr = raw.slice(0, sep);
      var path = raw.slice(sep + 1);
      var value = get(path);
      if (value === undefined) {
        console.warn('[content] fehlender Key (attr):', path);
        return;
      }
      node.setAttribute(attr, value);
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

  // ---------- Warum-mit-uns Kennzahlen ----------
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
  // Baut die Kartenstruktur inkl. echtem <audio>-Element pro Zeile.
  // audio-examples.js übernimmt danach Wellenform, Wiedergabe und Dauer
  // über dieselben IDs — das Badge ist reiner Text aus content-de.js.
  function renderBeispiele() {
    var data = CONTENT.beispiele;
    var list = document.getElementById('examples-list');
    if (!list) return;

    function playButton(idx, variant, extraClass) {
      var btn = document.createElement('button');
      btn.setAttribute('data-play', idx + ':' + variant);
      btn.setAttribute('aria-label', 'Abspielen');
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

    function row(idx, variant, label, labelClass, btnClass, src) {
      var wrap = el('div', 'flex items-center gap-4');
      wrap.appendChild(playButton(idx, variant, btnClass));
      wrap.appendChild(el('div', 'w-16 font-mono text-xs uppercase tracking-wide ' + labelClass, label));

      var bars = el('div', 'relative h-12 flex-1 cursor-pointer overflow-hidden rounded-lg bg-bgsoft');
      bars.id = 'ex' + idx + '-' + variant + '-bars';
      wrap.appendChild(bars);

      var dur = el('div', 'w-14 flex-shrink-0 text-right font-mono text-xs text-mute', '—');
      dur.id = 'ex' + idx + '-' + variant + '-dur';
      wrap.appendChild(dur);

      var audio = document.createElement('audio');
      audio.id = 'ex' + idx + '-' + variant + '-audio';
      audio.setAttribute('data-role', 'example');
      audio.preload = 'metadata';
      audio.src = src;
      audio.className = 'hidden';
      wrap.appendChild(audio);

      return wrap;
    }

    data.items.forEach(function (item, idx) {
      var card = el('div', 'rounded-2xl border border-edge bg-surface p-6 sm:p-8');

      var head = el('div', 'flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between');
      var headText = el('div');
      headText.appendChild(el('h3', 'font-display text-xl font-medium', item.title));
      headText.appendChild(el('p', 'mt-1 text-sm text-mute', item.desc));
      head.appendChild(headText);
      head.appendChild(el('span', 'mt-2 inline-flex w-fit items-center rounded-full border border-teal/40 bg-teal/10 px-3 py-1 font-mono text-xs text-teal sm:mt-0', item.badge));
      card.appendChild(head);

      var rows = el('div', 'mt-6 space-y-4');
      rows.appendChild(row(idx, 'vorher', data.labelVorher, 'text-mute', 'border-edge hover:border-mute', item.vorherSrc));
      rows.appendChild(row(idx, 'nachher', data.labelNachher, 'text-teal', 'border-teal/50 hover:bg-teal/10', item.nachherSrc));
      card.appendChild(rows);

      list.appendChild(card);
    });
  }

  // ---------- Preise: drei Pakete ----------
  function featureList(features) {
    var ul = el('ul', 'mt-6 flex-1 space-y-3 text-sm text-mute');
    features.forEach(function (f) {
      var li = el('li', 'flex gap-2');
      li.appendChild(el('span', 'text-teal', '✓'));
      li.appendChild(document.createTextNode(f));
      ul.appendChild(li);
    });
    return ul;
  }

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

      card.appendChild(el('h3', 'font-display text-xl font-medium', tier.name));
      card.appendChild(el('p', 'mt-1 text-sm text-mute', tier.subtitle));

      var priceRow = el('div', 'mt-5 flex items-baseline gap-2');
      priceRow.appendChild(el('span', 'font-display text-3xl font-semibold text-ink', tier.price));
      priceRow.appendChild(el('span', 'font-mono text-xs text-mute', tier.priceUnit));
      card.appendChild(priceRow);
      card.appendChild(el('p', 'mt-1 font-mono text-xs text-mute', tier.extraNote));

      if (tier.includesNote) {
        card.appendChild(el('p', 'mt-5 text-sm font-medium text-ink', tier.includesNote));
      }

      card.appendChild(featureList(tier.features));

      var ctaBtn = el('a', 'mt-8 block rounded-full px-5 py-3 text-center text-sm font-medium transition ' +
        (tier.highlighted ? 'bg-amber text-bg hover:bg-amber/90' : 'border border-edge text-ink hover:border-mute'), tier.cta);
      ctaBtn.href = '#kontakt';
      ctaBtn.setAttribute('data-cta-tier', tier.key);
      card.appendChild(ctaBtn);

      // Zweiter, gleichwertiger Button: Paket + Publishing-Upgrade
      // zusammen anfragen (markiert in der Mail-Vorlage beide Zeilen).
      var addon = CONTENT.preise.addon;
      var addonLinkText = addon.tierLinkPattern.replace('{tier}', tier.name);
      var addonLink = el('a', 'mt-4 block rounded-full border border-edge px-5 py-3 text-center text-sm font-medium text-ink transition hover:border-mute', addonLinkText);
      addonLink.href = '#kontakt';
      addonLink.setAttribute('data-cta-tier', tier.key + ',' + addon.key);
      card.appendChild(addonLink);

      grid.appendChild(card);
    });
  }

  // ---------- Preise: Publishing-Upgrade (Add-on, kein eigenes Paket) ----------
  // Wird unterhalb aller Tiers als informative Übersicht ohne eigenen
  // Button gezeigt — Publishing wird ausschließlich über die zweiten
  // "inkl. Publishing-Upgrade"-Buttons in den jeweiligen Tier-Karten
  // bestellt (siehe renderPreise).
  function renderPreiseAddon() {
    var addon = CONTENT.preise.addon;
    var wrap = document.getElementById('preise-addon');
    if (!wrap || !addon) return;

    var card = el('div', 'flex flex-col gap-6 rounded-2xl border border-edge bg-surface p-7 lg:flex-row lg:items-center lg:gap-12');

    var left = el('div', 'lg:max-w-sm');
    left.appendChild(el('span', 'font-mono text-[11px] uppercase tracking-wide text-teal', 'Zusatzleistung'));
    left.appendChild(el('h3', 'mt-2 font-display text-xl font-medium', addon.name));
    left.appendChild(el('p', 'mt-2 text-sm text-mute', addon.subtitle));
    var priceRow = el('div', 'mt-4 flex items-baseline gap-2');
    priceRow.appendChild(el('span', 'font-display text-2xl font-semibold text-ink', addon.price));
    priceRow.appendChild(el('span', 'font-mono text-xs text-mute', addon.priceUnit));
    left.appendChild(priceRow);
    card.appendChild(left);

    var mid = el('ul', 'grid flex-1 grid-cols-1 gap-x-6 gap-y-3 text-sm text-mute sm:grid-cols-2');
    addon.features.forEach(function (f) {
      var li = el('li', 'flex gap-2');
      li.appendChild(el('span', 'text-teal', '✓'));
      li.appendChild(document.createTextNode(f));
      mid.appendChild(li);
    });
    card.appendChild(mid);

    wrap.appendChild(card);
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
  // Baut die Paket-Checkliste für die Mail-Vorlage. selectedKeys ist ein
  // Array von Keys, die als "[x]" markiert werden (leeres Array/null ->
  // nichts markiert, z. B. bei den allgemeinen CTAs Hero/Nav/Footer).
  // Für die "Paket inkl. Veröffentlichung"-Links stehen hier zwei Keys
  // drin (Paket + "publishing").
  function buildTierChecklist(selectedKeys) {
    var keys = selectedKeys || [];
    var lines = CONTENT.preise.tiers.map(function (t) {
      return (keys.indexOf(t.key) !== -1 ? '[x] ' : '[ ] ') + t.name + ' – ' + t.price;
    });
    lines.push((keys.indexOf(CONTENT.preise.addon.key) !== -1 ? '[x] ' : '[ ] ') + CONTENT.preise.addon.name + ' – ' + CONTENT.preise.addon.price);
    lines.push((keys.indexOf('custom') !== -1 ? '[x] ' : '[ ] ') + 'Individuelles Angebot – ich habe andere Anforderungen');
    return lines.join('\n');
  }

  function buildMailtoHref(selectedKeys) {
    var c = CONTENT.cta;
    var body = c.mailBodyIntro + buildTierChecklist(selectedKeys) + c.mailBodyOutro;
    return 'mailto:' + c.mailTo +
      '?subject=' + encodeURIComponent(c.mailSubject) +
      '&body=' + encodeURIComponent(body);
  }

  function wireMailtoCtas() {
    document.querySelectorAll('[data-cta="primary"]').forEach(function (a) {
      a.setAttribute('href', buildMailtoHref(null));
    });
    document.querySelectorAll('[data-cta-tier]').forEach(function (a) {
      var keys = a.getAttribute('data-cta-tier').split(',').map(function (k) { return k.trim(); });
      a.setAttribute('href', buildMailtoHref(keys));
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
    renderBeispiele();
    renderPreise();
    renderPreiseAddon();
    renderFaq();
    renderFooterLinks();
    wireMailtoCtas();
  }

  return { renderAll: renderAll };
})();
