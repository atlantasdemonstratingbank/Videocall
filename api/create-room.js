export default async function handler(req, res) {
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
res.setHeader(‘Access-Control-Allow-Methods’, ‘POST, OPTIONS’);
res.setHeader(‘Access-Control-Allow-Headers’, ‘Content-Type’);
res.setHeader(‘Permissions-Policy’, ’camera=*, microphone=*, display-capture=*’);

if (req.method === ‘OPTIONS’) return res.status(200).end();
if (req.method !== ‘POST’) return res.status(405).json({ error: ‘Method not allowed’ });

try {
const exp = Math.floor(Date.now() / 1000) + (6 * 60 * 60);
const response = await fetch(‘https://api.daily.co/v1/rooms’, {
method: ‘POST’,
headers: {
‘Content-Type’: ‘application/json’,
‘Authorization’: `Bearer 004181d7ab0376ffbc4614272780d4be5182a62a45ea8fc992e2d9d307a8a42b`
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

} catch(e) {
return res.status(500).json({ error: e.message });
}
}