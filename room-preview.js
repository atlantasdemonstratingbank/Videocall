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
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${hostName} is inviting you to a video call 🎦</title>

<!-- NO og:image tag — removes image from ALL previews -->

<!-- Open Graph -->
<meta property="og:title"       content="🎦 ${hostName} is inviting you to a video call" />
<meta property="og:description" content="Tap to join ${hostName}'s WaveMeet call instantly — no app or account needed." />
<meta property="og:url"         content="${joinURL}" />
<meta property="og:type"        content="website" />
<meta property="og:site_name"   content="WaveMeet" />

<!-- Twitter -->
<meta name="twitter:card"        content="summary" />
<meta name="twitter:title"       content="🎦 ${hostName} is inviting you to a video call" />
<meta name="twitter:description" content="Tap to join ${hostName}'s WaveMeet call. No app needed." />

<!-- iMessage / Apple -->
<meta name="apple-mobile-web-app-title" content="🎦 ${hostName}'s Call" />

<!-- General -->
<meta name="description" content="${hostName} is inviting you to a video call. Tap to join instantly." />
<meta name="theme-color" content="#8338EC" />

<meta http-equiv="refresh" content="0;url=${joinURL}" />
</head>
<body style="margin:0;background:#0A0A0F;color:#fff;font-family:-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="text-align:center;padding:40px;max-width:400px;">
    <div style="font-size:72px;margin-bottom:20px;">🎦</div>
    <h1 style="font-size:26px;font-weight:800;margin-bottom:10px;letter-spacing:-.02em;">${hostName} is inviting you to a video call</h1>
    <p style="color:#9090B0;margin-bottom:32px;font-size:15px;line-height:1.6;">Tap the button below to join instantly — no app or account needed.</p>
    <a href="${joinURL}" style="display:inline-block;background:linear-gradient(135deg,#8338EC,#FF006E);color:#fff;text-decoration:none;padding:16px 40px;border-radius:50px;font-size:18px;font-weight:800;box-shadow:0 8px 30px rgba(131,56,236,0.4);">Join Call Now</a>
    <div style="margin-top:24px;font-size:12px;color:#505070;">Powered by WaveMeet</div>
  </div>
</body>
</html>`);
  } else {
    res.setHeader('Location', joinURL);
    return res.status(302).end();
  }
}
