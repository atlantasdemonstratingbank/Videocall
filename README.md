# WaveMeet — Main App

Deploy this to Vercel. This is the public-facing website.

## Structure
```
├── index.html        — the app (UI + call logic)
├── manifest.json      — PWA manifest
├── sw.js               — service worker (offline caching)
├── vercel.json         — routing & security headers
├── api/
│   ├── verify-payment.js   — verifies Flutterwave payment, unlocks subscription
│   └── join-handler.js     — /join?room=... : shows a "Call link / Join call"
│                             preview card to WhatsApp/Telegram/iMessage/etc.,
│                             redirects real users straight into the call
└── public/
    └── call-preview.png    — branded image used in the share preview card
```

## Deploy
1. Push to a PRIVATE GitHub repo
2. Import to Vercel → Deploy
3. Your URL: yourname.vercel.app
