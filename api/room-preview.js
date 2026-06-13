// Vercel serverless function
// Generates dynamic link preview for call invites
// Works on WhatsApp, Telegram, iMessage, Signal, Discord etc

export default async function handler(req, res) {
  const { room, host } = req.query;
  const ua = req.headers['user-agent'] || '';

  // Detect ALL bots/scrapers — cast a very wide net
  const isBot = /facebookexternalhit|whatsapp|twitterbot|slackbot|telegrambot|linkedinbot|googlebot|discordbot|applebot|viber|skype|msnbot|bingbot|duckduckbot|pinterestbot|redditbot|snapchat|line|kakaotalk|naver|curl|python|java|go-http|okhttp|httpclient|axios|node-fetch|preview|scraper|spider|crawler|bot/i.test(ua);

  const hostName = host ? decodeURIComponent(host).slice(0, 30) : 'Someone';
  const roomId   = room || '';
  const siteHost = req.headers.host || 'wavemeet-wine.vercel.app';
  const joinURL  = `https://${siteHost}/?room=${roomId}`;
  const imageURL = `https://${siteHost}/api/invite-image?host=${encodeURIComponent(hostName)}`;

  if (isBot) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    return res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${hostName} is inviting you to a video call</title>
<meta property="og:title"        content="${hostName} is inviting you to a video call 🎦" />
<meta property="og:description"  content="Tap to join ${hostName}'s WaveMeet call instantly. No app or account needed." />
<meta property="og:image"        content="${imageURL}" />
<meta property="og:image:width"  content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type"   content="image/png" />
<meta property="og:url"          content="${joinURL}" />
<meta property="og:type"         content="website" />
<meta property="og:site_name"    content="WaveMeet" />
<meta name="twitter:card"        content="summary_large_image" />
<meta name="twitter:title"       content="${hostName} is inviting you to a video call 🎦" />
<meta name="twitter:description" content="Tap to join ${hostName} on WaveMeet. No app needed." />
<meta name="twitter:image"       content="${imageURL}" />
<meta name="description"         content="${hostName} is inviting you to a video call. Tap to join." />
<meta name="theme-color"         content="#8338EC" />
<meta http-equiv="refresh"       content="0;url=${joinURL}" />
</head>
<body style="margin:0;background:#0A0A0F;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="text-align:center;padding:40px;">
    <div style="font-size:72px;margin-bottom:20px;">🎦</div>
    <h1 style="font-size:28px;margin-bottom:12px;font-weight:800;">${hostName} is inviting you to a video call</h1>
    <p style="color:#9090B0;margin-bottom:32px;">Tap the button to join instantly — no app or account needed</p>
    <a href="${joinURL}" style="display:inline-block;background:linear-gradient(135deg,#8338EC,#FF006E);color:#fff;text-decoration:none;padding:18px 48px;border-radius:50px;font-size:20px;font-weight:800;box-shadow:0 8px 30px rgba(131,56,236,0.4);">🎦 Join Call Now</a>
  </div>
</body>
</html>`);
  } else {
    res.setHeader('Location', joinURL);
    return res.status(302).end();
  }
}
