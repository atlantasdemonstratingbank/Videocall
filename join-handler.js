// Smart join handler
// Bots (WhatsApp, Telegram etc) → custom OG preview with host name
// Real users → serve the app

export default async function handler(req, res) {
  const { room, host } = req.query;
  const ua = req.headers['user-agent'] || '';

  const isBot = /facebookexternalhit|whatsapp|twitterbot|slackbot|telegrambot|linkedinbot|googlebot|discordbot|applebot|viber|skype|msnbot|bingbot|duckduckbot|pinterestbot|redditbot|snapchat|line|kakaotalk|curl|python|java|go-http|okhttp|httpclient|axios|node-fetch|preview|scraper|spider|crawler|bot/i.test(ua);

  const hostName = host ? decodeURIComponent(host).slice(0, 30) : 'Someone';
  const roomId   = room || '';
  const siteHost = req.headers.host || 'wavemeet-wine.vercel.app';
  const joinURL  = `https://${siteHost}/?room=${roomId}`;

  if (isBot) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${hostName} is inviting you to a video call 🎦</title>
<meta property="og:title"       content="🎦 ${hostName} is inviting you to a video call" />
<meta property="og:description" content="Tap to join ${hostName} on WaveMeet instantly — no app or account needed." />
<meta property="og:url"         content="${joinURL}" />
<meta property="og:type"        content="website" />
<meta property="og:site_name"   content="WaveMeet" />
<meta name="twitter:card"        content="summary" />
<meta name="twitter:title"       content="🎦 ${hostName} is inviting you to a video call" />
<meta name="twitter:description" content="Tap to join ${hostName} on WaveMeet. No app needed." />
<meta name="description"         content="${hostName} is inviting you to a video call. Tap to join instantly." />
<meta name="theme-color"         content="#8338EC" />
<meta http-equiv="refresh"       content="0;url=${joinURL}" />
</head>
<body style="margin:0;background:#0A0A0F;color:#fff;font-family:-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="text-align:center;padding:40px;max-width:400px;">
    <div style="font-size:72px;margin-bottom:20px;">🎦</div>
    <h1 style="font-size:26px;font-weight:800;margin-bottom:10px;">${hostName} is inviting you to a video call</h1>
    <p style="color:#9090B0;margin-bottom:32px;font-size:15px;line-height:1.6;">Tap the button to join instantly — no app or account needed.</p>
    <a href="${joinURL}" style="display:inline-block;background:linear-gradient(135deg,#8338EC,#FF006E);color:#fff;text-decoration:none;padding:16px 40px;border-radius:50px;font-size:18px;font-weight:800;">Join Call Now</a>
  </div>
</body>
</html>`);
  } else {
    // Real user — serve the app directly
    res.setHeader('Location', joinURL);
    return res.status(302).end();
  }
}
