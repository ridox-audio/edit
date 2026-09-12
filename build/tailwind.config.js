/** Build-Konfiguration für den lokal kompilierten Tailwind-Build.
 *  Entspricht js/tailwind-config.js (Design-Tokens), scannt aber
 *  zusätzlich alle Quelldateien nach tatsächlich genutzten Klassen. */
module.exports = {
  content: [
    "../index.html",
    "../impressum.html",
    "../datenschutz.html",
    "../js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        bg: '#12141A',
        bgsoft: '#181B22',
        surface: '#1E222B',
        surface2: '#252A35',
        edge: '#2A2F3A',
        ink: '#EEF0F3',
        mute: '#8A8F9C',
        amber: '#E8A33D',
        teal: '#45C4B0',
        coral: '#E2604C',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    }
  },
  safelist: [
    // Klassen, die nur dynamisch per JS zusammengesetzt werden
    // (render-content.js) und daher vom Content-Scanner ggf. nicht
    // als vollständige Strings erkannt werden.
    'bg-mute/70', 'bg-teal', 'bg-edge', 'bg-coral/70',
    'border-edge', 'border-mute', 'border-teal/50', 'hover:border-mute', 'hover:bg-teal/10',
    'text-mute', 'text-teal', 'text-ink', 'text-bg', 'text-amber',
    'bg-amber', 'hover:bg-amber/90', 'border-2', 'border-amber',
    'hidden', 'block'
  ]
}
