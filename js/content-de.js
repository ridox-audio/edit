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
 * ---------------------------------------------------------------
 */
window.CONTENT = {

  meta: {
    title: "RiDoX Studio — Podcast-Editing für Coaches & Berater",
    description: "Professionelle Podcast-Bearbeitung für Coaches, Berater und Selbstständige: Schnitt, Restauration, Mastering, Shownotes. Kostenlose Probefolge sichern."
  },

  nav: {
    leistungen: "Leistungen",
    beispiele: "Beispiele",
    ablauf: "Ablauf",
    preise: "Preise",
    faq: "FAQ",
    cta: "Probefolge sichern"
  },

  hero: {
    eyebrow: "Podcast-Editing für Coaches, Berater:innen & Selbstständige",
    headline: "Du sprichst. Ich schneide. Fertig ist deine Folge.",
    sub: "Für Coaches, Berater:innen und Selbstständige, die lieber ins Gespräch investieren als in Audio-Software. Du schickst die Rohaufnahme, ich liefere die sendefertige Folge zurück.",
    ctaPrimary: "Kostenlose Probefolge sichern",
    ctaSecondary: "Beispiele anhören",
    microtrust: "Unverbindlich · ohne Abo · deine erste Folge ist kostenlos"
  },

  nutzen: {
    eyebrow: "Warum auslagern",
    heading: "Du bringst die Stimme. Ich liefere die fertige Folge.",
    items: [
      { icon: "clock", title: "Zeit zurück", desc: "Kein Wochenende mehr mit Audioschnitt. Du nimmst auf, ich erledige den Rest." },
      { icon: "waveform", title: "Klingt professionell", desc: "Sauberer, druckvoller Klang – auf Kopfhörern genauso wie im Auto." },
      { icon: "scissors", title: "Ohne tote Luft", desc: "Denkpausen, Versprecher und Ähs verschwinden, ohne dass man den Schnitt hört." },
      { icon: "calendar", title: "Planbar", desc: "Feste Bearbeitungszeit, feste Abgabe. Dein Redaktionsplan bleibt stabil." },
      { icon: "sliders", title: "Passend zu deinem Format", desc: "Solo-Folge, Interview oder Rückblick: Der Schnitt folgt deinem Stil, nicht Schema F." },
      { icon: "chat", title: "Ein fester Ansprechpartner", desc: "Kein wechselnder Freelancer-Pool. Du schreibst mir, ich antworte." }
    ]
  },

  ueber: {
    eyebrow: "Warum mit mir",
    heading: "Kein Agentur-Fließband. Eine feste Person, die deinen Podcast kennt.",
    p1: "Ich schneide nicht nebenbei vierzig Podcasts gleichzeitig. Ich arbeite bewusst nur mit einer kleinen Zahl an Kund:innen, damit jede Folge die Aufmerksamkeit bekommt, die sie braucht – und Rückmeldungen wirklich schnell umgesetzt werden.",
    p2: "Mein Fokus liegt auf Coaches, Berater:innen und Selbstständigen, deren Podcast ein echtes Aushängeschild ihres Business ist, kein Hobby-Projekt nebenbei. Entsprechend diskret behandle ich alles, was in deinen Rohaufnahmen zu hören ist.",
    p3: "Du bekommst keine Weiterleitung an wechselnde Freelancer, sondern eine feste Ansprechperson, die nach der zweiten oder dritten Folge genau weiß, wie deine Show klingen soll.",
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
    intro: "Dieselbe Aufnahme, einmal roh und einmal fertig bearbeitet — direkt zum Anhören. Deine eigene Probefolge bekommst du kostenlos.",
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

  ablauf: {
    eyebrow: "So läuft es ab",
    heading: "Von der Rohaufnahme zur fertigen Folge – in drei Schritten",
    steps: [
      { time: "00:01", title: "Probefolge anfordern", desc: "Du schickst mir eine Rohaufnahme, ich mache eine komplett bearbeitete Folge daraus. Kostenlos und unverbindlich." },
      { time: "00:02", title: "Ergebnis hören", desc: "Du bekommst deine fertige Probefolge zurück und hörst, ob Klang und Stil zu dir passen. Keine Kosten, keine Verpflichtung." },
      { time: "00:03", title: "Laufender Betrieb", desc: "Gefällt dir das Ergebnis, legen wir los – mit festen Abgabeterminen und einem eingespielten Workflow." }
    ]
  },

  leistungen: {
    eyebrow: "Leistungen",
    heading: "Was in jeder Folge steckt",
    items: [
      { icon: "scissors", title: "Schnitt & Feinschnitt", desc: "Versprecher, Wiederholungen und Denkpausen raus, ohne dass der Redefluss verloren geht." },
      { icon: "shield", title: "Audio-Restauration", desc: "Rauschunterdrückung, Klick- und Popfilter, Reduktion von Raumhall und Echo." },
      { icon: "knob", title: "Mixing & Mastering", desc: "Lautheitsnormalisierung nach Sendestandard, EQ und Kompression für konstante Lautstärke." },
      { icon: "note", title: "Intro, Outro & Sounddesign", desc: "Einbindung deiner Jingles, saubere Übergänge, optionale Musikbetten." },
      { icon: "bookmark", title: "Kapitelmarken & Shownotes", desc: "Timecodes, kurze Zusammenfassung und Titel-Vorschläge für jede Folge." },
      { icon: "upload", title: "Multi-Plattform-Export", desc: "Passende Formate für Spotify, Apple Podcasts, YouTube und Co." }
    ]
  },

  preise: {
    eyebrow: "Preise",
    heading: "Zwei klare Wege — kein Baukasten mit versteckten Kosten",
    riskBanner: "Bei beiden Paketen gilt: Deine erste Folge bearbeite ich kostenlos. Du hörst das Ergebnis, bevor du dich entscheidest — kein Risiko.",
    // ACHTUNG: "price" ist ein Platzhalter-Wert zur Veranschaulichung.
    // Bitte durch deinen tatsächlichen Einstiegspreis ersetzen.
    tiers: [
      {
        name: "Mono",
        subtitle: "Der faire Einstieg für Solo-Folgen.",
        priceNote: "Alles, was eine Folge braucht — ohne Schnickschnack.",
        price: "ab 149 €",
        priceUnit: "pro Folge",
        features: ["Schnitt & Feinschnitt", "Basis-Restauration", "Lautheitsnormalisierung", "1 Korrekturschleife", "Erste Folge kostenlos"],
        cta: "Kostenlose Probefolge sichern",
        highlighted: false
      },
      {
        name: "Stereo",
        subtitle: "Wenn dein Podcast mehr braucht als den Standard.",
        priceNote: "Abgestimmt auf deine Ziele — du zahlst nur für das, was du wirklich brauchst.",
        price: "Individuelles Angebot",
        priceUnit: "",
        features: ["Alles aus Mono", "Vollständige Restauration & Mastering", "Kapitelmarken & Shownotes", "Sounddesign & Musikbetten", "Multi-Format-Export", "Priorisierte Bearbeitungszeit", "Erste Folge kostenlos"],
        cta: "Kostenlose Probefolge sichern",
        secondaryCta: "Oder individuelles Angebot besprechen",
        highlighted: true,
        badge: "Für mehr Umfang"
      }
    ]
  },

  faq: {
    eyebrow: "Fragen & Antworten",
    heading: "Bevor du schreibst, vielleicht schon beantwortet",
    items: [
      { q: "Wie schnell bekomme ich meine Folge zurück?", a: "Für die meisten wöchentlichen Formate liegt die Bearbeitungszeit bei wenigen Werktagen. Der genaue Rahmen wird nach deiner Probefolge gemeinsam festgelegt." },
      { q: "Muss ich mich langfristig binden?", a: "Nein. Wir starten mit deiner kostenlosen Probefolge, danach entscheidest du von Monat zu Monat weiter. Keine Mindestlaufzeit, keine versteckte Kündigungsfrist." },
      { q: "Was, wenn mir das Ergebnis nicht gefällt?", a: "Dann kostet dich das nichts. Deine erste Folge ist kostenlos — gefällt sie dir nicht, sind wir quitt. Gefällt sie dir, sprechen wir über die weitere Zusammenarbeit." },
      { q: "Welche Dateiformate brauchst du von mir?", a: "Am liebsten unkomprimiertes WAV, idealerweise als Einzelspuren pro Sprecher. Aufnahmen aus gängigen Videocall- und Aufnahme-Tools funktionieren aber ebenso." },
      { q: "Bearbeitest du auch Video-Podcasts?", a: "Der Fokus liegt auf Audio. Bei Bedarf spreche ich mich mit deiner Videoschnitt-Person ab, damit Schnittpunkte in Ton und Bild zusammenpassen." },
      { q: "Wie läuft die Kommunikation ab?", a: "Direkt per E-Mail oder Chat, ohne Ticketsystem und ohne wechselnde Ansprechpersonen. Dateien tauschen wir über einen gemeinsamen Cloud-Ordner aus." },
      { q: "Was kostet die Bearbeitung dauerhaft?", a: "Das Mono-Paket startet bei 149 € pro Folge. Brauchst du mehr Umfang, bekommst du im Anschluss an deine Probefolge ein individuelles Stereo-Angebot — du zahlst nie für Leistungen, die du nicht brauchst." }
    ]
  },

  cta: {
    eyebrow: "Kein Risiko",
    heading: "Bereit, den Unterschied selbst zu hören?",
    sub: "Schick mir deine Rohaufnahme und bekomm eine komplett bearbeitete Probefolge zurück — kostenlos, unverbindlich, ohne Risiko.",
    button: "Kostenlose Probefolge sichern",
    microtrust: "Antwort in der Regel innerhalb eines Werktags.",
    // Platzhalter-Adresse — bitte durch die echte Kontaktadresse ersetzen.
    mailTo: "hallo@ridox-studio.de",
    mailSubject: "Kostenlose Probefolge",
    mailBody: "Hi, ich würde gerne eine kostenlose Probefolge für meinen Podcast anfragen."
  },

  footer: {
    tagline: "Podcast-Editing für Coaches, Berater:innen und Selbstständige, die kein eigenes Studio aufbauen wollen — sondern eine fertige Folge im Feed.",
    navHeading: "Navigation",
    legalHeading: "Rechtliches",
    impressum: "Impressum",
    datenschutz: "Datenschutz",
    copyright: "© 2026 RiDoX Studio · Alle Rechte vorbehalten.",
    cta: "Kostenlose Probefolge sichern"
  }
};
