// Returns current TURN credentials from admin-configured Metered accounts
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const accounts = JSON.parse(process.env.METERED_ACCOUNTS || '[]');
    if (accounts.length === 0) {
      // Default fallback
      return res.status(200).json({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          {
            urls: ['turn:a.relay.metered.ca:80','turn:a.relay.metered.ca:443','turns:a.relay.metered.ca:443?transport=tcp'],
            username: 'bdd71e02060e1c9aec7db3b3',
            credential: 'FvAwsOkY/+2FLFJ0'
          }
        ]
      });
    }

    // Build ICE servers from all accounts for maximum coverage
    const iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];
    for (const acc of accounts) {
      iceServers.push({
        urls: ['turn:a.relay.metered.ca:80','turn:a.relay.metered.ca:443','turns:a.relay.metered.ca:443?transport=tcp'],
        username: acc.username,
        credential: acc.password
      });
    }
    return res.status(200).json({ iceServers });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
