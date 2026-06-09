// Vercel Serverless Function — creates a Daily.co room
// Called by the frontend so the API key stays server-side

export default async function handler(req, res) {
// Allow CORS from any origin (your Vercel domain)
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
res.setHeader(‘Access-Control-Allow-Methods’, ‘POST, OPTIONS’);
res.setHeader(‘Access-Control-Allow-Headers’, ‘Content-Type’);

if (req.method === ‘OPTIONS’) return res.status(200).end();
if (req.method !== ‘POST’) return res.status(405).json({ error: ‘Method not allowed’ });

const DAILY_API_KEY = process.env.DAILY_API_KEY;
if (!DAILY_API_KEY) return res.status(500).json({ error: ‘API key not configured’ });

try {
const exp = Math.floor(Date.now() / 1000) + (6 * 60 * 60); // 6 hours
const response = await fetch(‘https://api.daily.co/v1/rooms’, {
method: ‘POST’,
headers: {
‘Content-Type’: ‘application/json’,
‘Authorization’: `Bearer ${DAILY_API_KEY}`
},
body: JSON.stringify({
properties: {
exp,
enable_chat: true,
enable_screenshare: true,
start_video_off: false,
start_audio_off: false,
max_participants: 10,
}
})
});

```
if (!response.ok) {
  const err = await response.text();
  return res.status(500).json({ error: 'Daily API error', detail: err });
}

const room = await response.json();
return res.status(200).json({ name: room.name });
```

} catch (e) {
return res.status(500).json({ error: e.message });
}
}