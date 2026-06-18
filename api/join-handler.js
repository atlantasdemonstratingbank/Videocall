// Join handler:
// - Real users -> instant redirect straight into the call (no extra click).
// - Link-preview crawlers (WhatsApp/Telegram/iMessage/Discord/Slack/etc.)
//   -> served a small HTML page with Open Graph tags so the shared link
//      shows a clean "Call link / Join call" preview card instead of a
//      bare, suspicious-looking URL.

const BOT_UA_PATTERNS = [
  'whatsapp', 'facebookexternalhit', 'facebot', 'telegrambot',
  'twitterbot', 'slackbot', 'slack-imgproxy', 'discordbot',
  'linkedinbot', 'pinterest', 'skypeuripreview', 'viber',
  'line\\.me', 'snapchat', 'redditbot', 'vkshare', 'embedly',
  'quora link preview', 'outbrain', 'w3c_validator',
  'iframely', 'tumblr', 'bot', 'crawler', 'spider', 'preview'
];

function isBotRequest(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_UA_PATTERNS.some(p => new RegExp(p).test(ua));
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

export default async function handler(req, res) {
  const { room } = req.query;
  const roomId   = room || '';
  const siteHost = req.headers.host || 'wavemeet-wine.vercel.app';
  const joinURL  = `https://${siteHost}/?room=${encodeURIComponent(roomId)}`;
  const pageURL  = `https://${siteHost}/join?room=${encodeURIComponent(roomId)}`;
  const imageURL = 'https://i.ibb.co/N6xZXDdH/IMG-0876.png';
  const userAgent = req.headers['user-agent'] || '';

  if (isBotRequest(userAgent)) {
    const title = 'Call link';
    const description = 'You are invited to join a video call';

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(title)}</title>
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${imageURL}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${pageURL}">
<meta property="og:site_name" content="WaveMeet">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${imageURL}">
<meta http-equiv="refresh" content="0; url=${joinURL}">
</head>
<body>
<p>${escapeHtml(title)} — <a href="${joinURL}">${escapeHtml(description)}</a></p>
</body>
</html>`);
  }

  // Real user: skip the preview page entirely, go straight into the call.
  res.setHeader('Location', joinURL);
  return res.status(302).end();
}
