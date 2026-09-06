/**
 * content-de.js
 * ---------------------------------------------------------------
 * Sämtliche Texte der Website, gebündelt an einem Ort.
 *
 * - Änderungen an Formulierungen: nur hier editieren, nie in
 *   index.html oder den js/-Dateien suchen.
 * - Für eine englische Version: diese Datei nach content-en.js
 *   kopieren, übersetzen, und in index.html den <script>-Tag von
 *   "js/content-de.js" auf "js/content-en.js" ändern. Sonst ist
 *   nichts anzupassen.
 * - "icon"-Werte referenzieren Keys aus js/icons.js.
 * - Alle E-Mail-Buttons öffnen ein mailto: an cta.mailTo. Bei den
 *   Preis-Paketen wird automatisch das jeweilige Paket in der
 *   Mail-Vorlage markiert (siehe render-content.js).
 * ---------------------------------------------------------------
 */
window.CONTENT = {

  meta: {
    title: "RiDoX Studio — Podcast-Editing für Coaches & Berater",
    description: "Professionelle Podcast-Bearbeitung für Coaches, Berater und Selbstständige: Schnitt, Restauration, Mastering, Shownotes. Jetzt anfragen."
  },

  nav: {
    leistungen: "Leistungen",
    beispiele: "Beispiele",
    preise: "Preise",
    faq: "FAQ",
    cta: "Podcast großartig machen"
  },

  hero: {
    eyebrow: "Podcast-Editing für Coaches, Berater:innen & Selbstständige",
    headline: "Du sprichst, wir erledigen den Rest.",
    sub: "Für Coaches, Berater:innen und Selbstständige, die lieber ins Gespräch investieren als in Audio-Software. Du schickst die Rohaufnahme, wir liefern die sendefertige Folge zurück.",
    ctaPrimary: "Meinen Podcast großartig machen",
    ctaSecondary: "Beispiele anhören",
    microtrust: "Transparente Festpreise · keine versteckten Kosten"
  },

  nutzen: {
    eyebrow: "Warum auslagern",
    heading: "Du bringst die Stimme. Wir liefern die fertige Folge.",
    items: [
      { icon: "clock", title: "Zeit zurück", desc: "Kein Wochenende mehr mit Audioschnitt. Du nimmst auf, wir erledigen den Rest." },
      { icon: "waveform", title: "Klingt professionell", desc: "Sauberer, druckvoller Klang – auf Kopfhörern genauso wie im Auto." },
      { icon: "scissors", title: "Ohne Leerlauf", desc: "Denkpausen, Versprecher und Ähs verschwinden, ohne dass man den Schnitt hört." },
      { icon: "calendar", title: "Planbar", desc: "Feste Bearbeitungszeit, feste Abgabe. Dein Redaktionsplan bleibt stabil." },
      { icon: "sliders", title: "Passend zu deinem Format", desc: "Solo-Folge, Interview oder Rückblick: Der Schnitt folgt deinem Stil, nicht Schema F." },
      { icon: "chat", title: "Direkter Draht zu uns", desc: "Kein wechselnder Freelancer-Pool. Du schreibst uns, wir antworten." }
    ]
  },

  ueber: {
    eyebrow: "Warum mit uns",
    heading: "Kein Agentur-Fließband. Ein festes Team, das deinen Podcast kennt.",
    p1: "Wir schneiden nicht nebenbei vierzig Podcasts gleichzeitig. Wir arbeiten bewusst nur mit einer kleinen Zahl an Kund:innen, damit jede Folge die Aufmerksamkeit bekommt, die sie braucht – und Rückmeldungen wirklich schnell umgesetzt werden.",
    p2: "Unser Fokus liegt auf Coaches, Berater:innen und Selbstständigen, deren Podcast ein echtes Aushängeschild ihres Business ist, kein Hobby-Projekt nebenbei. Entsprechend diskret behandeln wir alles, was in deinen Rohaufnahmen zu hören ist.",
    p3: "Du bekommst keine Weiterleitung an wechselnde Freelancer, sondern ein festes Team, das nach der zweiten oder dritten Folge genau weiß, wie deine Show klingen soll.",
    photoAlt: "Portrait im Tonstudio von RiDoX Studio",
    photoCaption: "Deine feste Ansprechperson bei RiDoX Studio",
    statsLabel: "Auf einen Blick",
    stats: [
      { value: "6+ Jahre", label: "Erfahrung", desc: "Audio-Bearbeitung für Interviews, Solo-Formate & Business-Podcasts.", fill: 78 },
      { value: "max. 6", label: "Kapazität", desc: "Podcasts gleichzeitig betreut – für gleichbleibende Qualität.", fill: 55 },
      { value: "< 24 Std.", label: "Reaktion", desc: "Übliche Antwortzeit an Werktagen.", fill: 90 }
    ]
  },

  beispiele: {
    eyebrow: "Rein gehört",
    heading: "Hör den Unterschied, bevor du dich entscheidest",
    intro: "Dieselbe Aufnahme, einmal roh und einmal fertig bearbeitet — direkt zum Anhören.",
    labelVorher: "Vorher",
    labelNachher: "Nachher",
    // Jedes Beispiel braucht zwei echte Audiodateien im /audio/-Ordner
    // (Pfade unten). "badge" ist freier Text, keine Berechnung — bewusst
    // in einfacher Sprache, ohne Fachbegriffe wie dB oder SNR.
    items: [
      {
        title: "Rohes Intro ohne Sounddesign",
        desc: "Nur die Original-Aufnahme, ganz ohne Musik oder Übergänge.",
        badge: "Musik & Übergänge ergänzt",
        vorherSrc: "audio/01-intro-vorher.mp3",
        nachherSrc: "audio/01-intro-nachher.mp3"
      },
      {
        title: "Sprache mit Störgeräuschen",
        desc: "Rauschen, Brummen oder Nebengeräusche in der Originalaufnahme.",
        badge: "Störgeräusche weg",
        vorherSrc: "audio/02-stoergeraeusche-vorher.mp3",
        nachherSrc: "audio/02-stoergeraeusche-nachher.mp3"
      },
      {
        title: "Lautstärke zu leise",
        desc: "Deutlich leiser aufgenommen als der übliche Podcast-Standard.",
        badge: "Lautstärke passt jetzt genau",
        vorherSrc: "audio/03-lautstaerke-vorher.mp3",
        nachherSrc: "audio/03-lautstaerke-nachher.mp3"
      }
    ]
  },

  leistungen: {
    eyebrow: "Leistungen",
    heading: "Was in jeder Folge steckt",
    items: [
      { icon: "scissors", title: "Schnitt & Feinschnitt", desc: "Versprecher, Wiederholungen und Denkpausen raus, ohne dass der Redefluss verloren geht." },
      { icon: "shield", title: "Audio-Restauration", desc: "Rauschunterdrückung, Klick- und Popfilter, Reduktion von Raumhall und Echo." },
      { icon: "knob", title: "Mixing & Mastering", desc: "Lautheitsnormalisierung nach Streaming-Standard, EQ und Kompression für konstante Lautstärke." },
      { icon: "note", title: "Intro, Outro & Sounddesign", desc: "Einbindung deiner Jingles, saubere Übergänge, optionale Musikbetten." },
      { icon: "bookmark", title: "Kapitelmarken & Shownotes", desc: "Timecodes, kurze Zusammenfassung und Titel-Vorschläge für jede Folge." },
      { icon: "upload", title: "Multi-Plattform-Export", desc: "Passende Formate für Spotify, Apple Podcasts, YouTube und Co." }
    ]
  },

  preise: {
    eyebrow: "Preise",
    heading: "Drei klare Pakete — plus Publishing, wenn du willst",
    intro: "Alle Preise gelten für Folgen bis 60 Minuten. Für jede weitere angefangene 30 Minuten kommt ein fester, vorher bekannter Aufschlag dazu — keine versteckten Kosten.",
    // Jeder "key" wird auch für die Mail-Vorlage gebraucht (siehe
    // render-content.js) — beim Ändern eines Namens den key stabil
    // lassen oder an beiden Stellen anpassen.
    tiers: [
      {
        key: "core",
        name: "Core",
        subtitle: "Der solide Grundschnitt für jede Folge.",
        price: "89 €",
        priceUnit: "bis 60 Min.",
        extraNote: "+ 24 € je weitere 30 Min.",
        features: [
          "Grober Schnitt (Versprecher & lange Pausen)",
          "Lautstärkeanpassung & Normalisierung",
          "Intro/Outro einfügen",
          "Rauschreduktion",
          "Loudness-Normalisierung nach Streaming-Standard",
          "1 Korrekturschleife"
        ],
        cta: "Core anfragen",
        highlighted: false
      },
      {
        key: "studio",
        name: "Studio",
        subtitle: "Für Podcasts, die feinen Schliff brauchen.",
        price: "159 €",
        priceUnit: "bis 60 Min.",
        extraNote: "+ 42 € je weitere 30 Min.",
        includesNote: "Alles aus Core, plus:",
        features: [
          "Füllwörter entfernen",
          "Versprecher & Wiederholungen entfernen",
          "Sprachfluss/Pacing optimieren",
          "Transkript",
          "Kapitelmarken/Timestamps",
          "Shownotes-Entwurf",
          "2 Korrekturschleifen"
        ],
        cta: "Studio anfragen",
        highlighted: true,
        badge: "Meistgewählt"
      },
      {
        key: "signature",
        name: "Signature",
        subtitle: "Für hohe Ansprüche und schwieriges Rohmaterial.",
        price: "329 €",
        priceUnit: "bis 60 Min.",
        extraNote: "+ 65 € je weitere 30 Min.",
        includesNote: "Alles aus Studio, plus:",
        features: [
          "Rettung schwieriger Aufnahmen (starkes Rauschen/Hall/Klicks)",
          "Integration mehrerer Sounds/Werbung/Zwischenaudios (bis 5 Elemente)",
          "Unbegrenzte Korrekturschleifen",
          "Express-Lieferung (Priorität, 48 Std.)",
          "1 Social-Media-Clip (bis 60 Sek.)"
        ],
        cta: "Signature anfragen",
        highlighted: false
      }
    ],
    addon: {
      key: "publishing",
      name: "Publishing-Upgrade",
      subtitle: "„Wir übernehmen alles von den Rohdaten bis zur Veröffentlichung\u201c — buchbar zu jedem der drei Pakete.",
      price: "129 €",
      priceUnit: "pro Folge",
      features: [
        "Upload auf Hosting-Plattform",
        "Titel & Beschreibung einpflegen",
        "Cover hochladen & prüfen",
        "Kapitelmarken in der Plattform einpflegen",
        "Tags/Kategorien setzen",
        "Terminierung/Veröffentlichungsplanung"
      ],
      cta: "Upgrade dazu buchen"
    },
    customNote: "Passt keins der Pakete genau?",
    customCta: "Individuelles Angebot anfragen"
  },

  faq: {
    eyebrow: "Fragen & Antworten",
    heading: "Bevor du schreibst, vielleicht schon beantwortet",
    items: [
      { q: "Wie schnell bekomme ich meine Folge zurück?", a: "Für die meisten Folgen liegt die Bearbeitungszeit bei wenigen Werktagen. Beim Signature-Paket lässt sich zusätzlich eine Express-Lieferung mit 48 Stunden Priorität dazubuchen." },
      { q: "Muss ich mich langfristig binden?", a: "Nein. Du buchst pro Folge, ganz ohne Abo oder Mindestlaufzeit." },
      { q: "Was, wenn mir das Ergebnis nicht gefällt?", a: "Jedes Paket enthält Korrekturschleifen — beim Signature-Paket sogar unbegrenzt. Wir passen die Folge an, bis sie zu deiner Show passt." },
      { q: "Welche Dateiformate braucht ihr von mir?", a: "Am liebsten unkomprimiertes WAV, idealerweise als Einzelspuren pro Sprecher. Aufnahmen aus gängigen Videocall- und Aufnahme-Tools funktionieren aber ebenso." },
      { q: "Bearbeitet ihr auch Video-Podcasts?", a: "Der Fokus liegt auf Audio. Bei Bedarf sprechen wir uns mit deiner Videoschnitt-Person ab, damit Schnittpunkte in Ton und Bild zusammenpassen." },
      { q: "Wie läuft die Kommunikation ab?", a: "Direkt per E-Mail, ohne Ticketsystem und ohne wechselnde Ansprechpersonen. Dateien tauschen wir über einen gemeinsamen Cloud-Ordner aus." },
      { q: "Was kostet die Bearbeitung?", a: "Core startet bei 89 €, Studio bei 159 € und Signature bei 329 € — jeweils für Folgen bis 60 Minuten, danach ein fester Aufschlag je weitere 30 Minuten. Das Publishing-Upgrade für 129 € pro Folge lässt sich zu jedem Paket dazubuchen." },
      { q: "Was, wenn keins der Pakete genau passt?", a: "Kein Problem — schreib uns einfach, welche Anforderungen du hast, dann erstellen wir dir ein individuelles Angebot." }
    ]
  },

  cta: {
    eyebrow: "Bereit loszulegen?",
    heading: "Zeit für eine Folge, die beeindruckt.",
    sub: "Schreib uns, welches Paket zu dir passt, oder frag ein individuelles Angebot an — wir melden uns in der Regel innerhalb eines Werktags.",
    button: "Meinen Podcast großartig machen",
    microtrust: "Antwort in der Regel innerhalb eines Werktags.",
    mailTo: "podcast@ridox.studio",
    mailSubject: "Anfrage: Podcast-Editing bei RiDoX Studio",
    // mailBodyIntro/-Outro umschließen die automatisch generierte
    // Paket-Checkliste (siehe render-content.js: buildTierMailBody).
    mailBodyIntro: "Hallo RiDoX Studio Team,\n\nich interessiere mich für folgendes Paket:\n",
    mailBodyOutro: "\n\nKurz zu meinem Podcast:\n- Ungefähre Folgenlänge:\n- Veröffentlichungsrhythmus:\n- Sonstiges:\n\nViele Grüße"
  },

  footer: {
    tagline: "Podcast-Editing für Coaches, Berater:innen und Selbstständige, die kein eigenes Studio aufbauen wollen — sondern eine fertige Folge im Feed.",
    navHeading: "Navigation",
    legalHeading: "Rechtliches",
    impressum: "Impressum",
    datenschutz: "Datenschutz",
    copyright: "© 2026 RiDoX Studio · Alle Rechte vorbehalten.",
    cta: "Podcast großartig machen"
  }
};
