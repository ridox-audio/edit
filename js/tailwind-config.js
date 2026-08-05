/**
 * tailwind-config.js
 * ---------------------------------------------------------------
 * Design-Tokens: Farben & Schriften. Muss NACH dem Tailwind-CDN-
 * Script geladen werden (Reihenfolge in index.html beachten).
 * ---------------------------------------------------------------
 */
tailwind.config = {
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
  }
};
