// Vercel function — serves a dynamic HTML page for call link previews
// When WhatsApp/iMessage scrapes the link, they get this page with custom OG tags
// When a real user opens it, they get redirected to the actual call page

export default async function handler(req, res) {
  const { room, host } = req.query;

  // Check if this is a bot/scraper (WhatsApp, iMessage, Twitter etc)
  const ua = req.headers['user-agent'] || '';
  const isBot = /facebookexternalhit|WhatsApp|Twitterbot|Slackbot|TelegramBot|LinkedInBot|Googlebot|Discordbot|iMessage|Applebot|Viber|SkypeUriPreview/i.test(ua);

  const hostName = host ? decodeURIComponent(host) : 'Someone';
  const roomId   = room || '';
  const joinURL  = `https://${req.headers.host}/?room=${roomId}`;
  const logoURL  = 'https://i.ibb.co/rRRSr4kH/IMG-0734.jpg';
  const previewURL = 'https://i.ibb.co/xqjrGVsD/IMG-0732.jpg';

  if (isBot) {
    // Serve rich preview HTML for scrapers
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-cache');
    return res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${hostName} is inviting you to a video call</title>

  <!-- Open Graph — WhatsApp, Facebook, iMessage -->
  <meta property="og:title"       content="📹 ${hostName} is inviting you to a call" />
  <meta property="og:description" content="Tap to join ${hostName}'s WaveMeet video call instantly. No download or account needed." />
  <meta property="og:image"       content="${previewURL}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url"         content="${joinURL}" />
  <meta property="og:type"        content="website" />
  <meta property="og:site_name"   content="WaveMeet" />

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="📹 ${hostName} is inviting you to a call" />
  <meta name="twitter:description" content="Tap to join ${hostName}'s WaveMeet video call. No download needed." />
  <meta name="twitter:image"       content="${previewURL}" />

  <!-- iMessage / Apple -->
  <meta name="apple-mobile-web-app-title" content="${hostName}'s WaveMeet Call" />

  <!-- Redirect bots to join URL after tags are read -->
  <meta http-equiv="refresh" content="0;url=${joinURL}" />
</head>
<body>
  <p><a href="${joinURL}">Join ${hostName}'s call</a></p>
</body>
</html>`);
  } else {
    // Real user — redirect straight to the call
    res.setHeader('Location', joinURL);
    return res.status(302).end();
  }
}
