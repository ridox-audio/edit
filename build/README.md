# Tailwind-Build neu erzeugen

Die Website nutzt kein Tailwind-CDN mehr (Datenschutzgründe — siehe
Datenschutzerklärung, Abschnitt 10). Stattdessen liegt eine fertig
kompilierte, minimierte CSS-Datei unter `css/tailwind-built.css`.

**Wann neu bauen?** Nur wenn du index.html, impressum.html,
datenschutz.html oder eine js/-Datei um neue Tailwind-Klassen
erweiterst, die vorher nirgendwo auf der Seite vorkamen. Reine
Text-Änderungen (content-de.js) brauchen KEINEN Rebuild.

## So geht's

Einmalig (im `build/`-Ordner):
```
npm install
```

Nach jeder Änderung, die neue Tailwind-Klassen einführt:
```
npx tailwindcss -i input.css -o ../css/tailwind-built.css --minify
```

Das scannt automatisch `index.html`, `impressum.html`,
`datenschutz.html` und alle `js/*.js`-Dateien nach genutzten Klassen
(siehe `content` in `tailwind.config.js`) und schreibt eine neue,
nur die tatsächlich gebrauchten Klassen enthaltende CSS-Datei.

## Falls eine neue Klasse im Build fehlt

Manche Klassen werden nur als zusammengesetzter String in JavaScript
gebaut (z. B. `'text-' + farbe`) und werden vom Scanner dann nicht
erkannt. Trag solche Klassen in die `safelist` in
`tailwind.config.js` ein, dann landen sie garantiert im Build.

## Design-Tokens ändern (Farben, Schriften)

Die Farben/Schriften stehen doppelt: einmal hier in
`tailwind.config.js` (für den Build) — eine Änderung dort erfordert
danach den Rebuild-Befehl oben.
