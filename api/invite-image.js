// Generates a dynamic PNG invite card image with the host name
// Used as the OG image in link previews

export default async function handler(req, res) {
  const { host } = req.query;
  const hostName = host ? decodeURIComponent(host).slice(0, 30) : 'Someone';

  // Escape for SVG
  const safe = hostName.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":"&#39;"}[c]));

  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A0A0F"/>
      <stop offset="100%" stop-color="#1A0A2E"/>
    </linearGradient>
    <linearGradient id="btn" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#8338EC"/>
      <stop offset="100%" stop-color="#FF006E"/>
    </linearGradient>
    <linearGradient id="orb1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8338EC" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#8338EC" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="orb2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FF006E" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#FF006E" stop-opacity="0"/>
    </linearGradient>
    <filter id="f1"><feGaussianBlur stdDeviation="70"/></filter>
    <filter id="f2"><feGaussianBlur stdDeviation="90"/></filter>
    <filter id="sh"><feDropShadow dx="0" dy="6" stdDeviation="18" flood-color="#8338EC" flood-opacity="0.5"/></filter>
    <filter id="sh2"><feDropShadow dx="0" dy="0" stdDeviation="30" flood-color="#8338EC" flood-opacity="0.3"/></filter>
  </defs>

  <!-- BG -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Orbs -->
  <circle cx="150" cy="150" r="320" fill="url(#orb1)" filter="url(#f1)"/>
  <circle cx="1050" cy="480" r="280" fill="url(#orb2)" filter="url(#f2)"/>
  <circle cx="900" cy="100" r="180" fill="#3A86FF" opacity="0.08" filter="url(#f1)"/>

  <!-- Subtle grid -->
  <g stroke="rgba(255,255,255,0.03)" stroke-width="1">
    <line x1="0" y1="126" x2="1200" y2="126"/>
    <line x1="0" y1="252" x2="1200" y2="252"/>
    <line x1="0" y1="378" x2="1200" y2="378"/>
    <line x1="0" y1="504" x2="1200" y2="504"/>
    <line x1="200" y1="0" x2="200" y2="630"/>
    <line x1="400" y1="0" x2="400" y2="630"/>
    <line x1="600" y1="0" x2="600" y2="630"/>
    <line x1="800" y1="0" x2="800" y2="630"/>
    <line x1="1000" y1="0" x2="1000" y2="630"/>
  </g>

  <!-- Main card -->
  <rect x="80" y="60" width="1040" height="510" rx="36"
    fill="rgba(255,255,255,0.03)"
    stroke="rgba(255,255,255,0.08)"
    stroke-width="1.5"/>

  <!-- Camera icon bg circle -->
  <circle cx="600" cy="190" r="80" fill="rgba(131,56,236,0.12)" stroke="rgba(131,56,236,0.3)" stroke-width="1.5" filter="url(#sh2)"/>

  <!-- Camera icon (SVG path) -->
  <!-- Body -->
  <rect x="556" y="165" width="64" height="50" rx="9" fill="white" opacity="0.92"/>
  <!-- Lens outer -->
  <circle cx="583" cy="190" r="16" fill="rgba(131,56,236,0.5)"/>
  <!-- Lens inner -->
  <circle cx="583" cy="190" r="9" fill="white" opacity="0.9"/>
  <!-- Video arm -->
  <polygon points="622,170 622,210 650,190" fill="white" opacity="0.92"/>

  <!-- INVITE label -->
  <text x="600" y="315"
    text-anchor="middle"
    font-family="system-ui,-apple-system,Helvetica,Arial,sans-serif"
    font-size="18"
    font-weight="600"
    fill="rgba(255,255,255,0.4)"
    letter-spacing="4">VIDEO CALL INVITE</text>

  <!-- Host name line -->
  <text x="600" y="385"
    text-anchor="middle"
    font-family="system-ui,-apple-system,Helvetica,Arial,sans-serif"
    font-size="54"
    font-weight="800"
    fill="white"
    letter-spacing="-1">${safe} is inviting you</text>

  <!-- Subtitle -->
  <text x="600" y="430"
    text-anchor="middle"
    font-family="system-ui,-apple-system,Helvetica,Arial,sans-serif"
    font-size="22"
    font-weight="400"
    fill="rgba(255,255,255,0.45)">to a video call · No app or account needed</text>

  <!-- Join button -->
  <rect x="380" y="463" width="440" height="70" rx="35" fill="url(#btn)" filter="url(#sh)"/>
  <!-- Button highlight -->
  <rect x="380" y="463" width="440" height="35" rx="35" fill="rgba(255,255,255,0.08)"/>

  <!-- Button text -->
  <text x="600" y="507"
    text-anchor="middle"
    font-family="system-ui,-apple-system,Helvetica,Arial,sans-serif"
    font-size="26"
    font-weight="800"
    fill="white">Join Call Now</text>

  <!-- WaveMeet brand -->
  <text x="600" y="588"
    text-anchor="middle"
    font-family="system-ui,-apple-system,Helvetica,Arial,sans-serif"
    font-size="15"
    font-weight="600"
    fill="rgba(255,255,255,0.2)"
    letter-spacing="4">WAVEMEET</text>
</svg>`;

  // Serve as SVG image — all major platforms accept SVG for OG images
  // WhatsApp and Telegram accept SVG just fine
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.status(200).send(svg);
}
