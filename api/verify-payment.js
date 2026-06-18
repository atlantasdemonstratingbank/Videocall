export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { transaction_id, uid } = req.body || {};
  if (!transaction_id || !uid) {
    return res.status(400).json({ error: 'Missing transaction_id or uid' });
  }

  const FW_SECRET = 'FLWSECK-fa0a4592ae8bc75eba79bf225b40d25b-19eb0785121vt-X';

  const SERVICE_ACCOUNT = {
    type: "service_account",
    project_id: "wave-220b6",
    private_key_id: "1ca9ba3d841acbaee0abdfc50794b37ed339db88",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC4+icNsqnOLUx4\nJ9ZYJiC2FGqGvj3v/+z6bA5akagPt+GggFA8Nzg+1fDuABL9xjmiQHuLmEbZ9xbm\nsZuZOZcWiuomUspWgWbQ45JZyUg/usgVyxsVXZOOmMaGN/o6gidPh4dSoCv0u2Am\nReH2USezsaJvxGLmKR6WzlV3lRaQW5KqEQ2Z0Q53uLmEgQLrRH+Gy2n7orcPVVXX\nxIuNbv5yXi4e0PqviB9h45TZ1ZSNlUM3HH5YoqFDFcrWSvOzspyeoFn4iFc7Ozip\n5iLw6j5cdFMLQJYHCgslhGdk8NvJrbrcxIk5qnN7+6HvyrY0WClmNEmZMEs3hGYu\njuBT3uQ3AgMBAAECggEAAIXJ9cwYhujWOVeH9OKw5dKzWYMF4xctMfM9e9tZuwCk\n9NqejAUBjmryPlqHSCcyPCsLGGZY25CzurOLwN8o2h3tr1+m3WesPl/FAzzwvjjd\n3vLWXRT70k79/c8wk0EIq/mCFAhBmu4o8meVdJyNlWViDozWSKWD0NMoINLn+1zF\nNBYStrxgW6QgNWZaffS5IQT2ZmgWk3ILxgQKzeM1YhGcs/pAWg2EZhTz83J3CPgZ\nzSxWIhVU4TxkBfzLDaQgBhDnad277moaJLOPa7FTkv5/bVCI9pOGYxFr/2BFXHmx\nfoQ6j3YIAcSz83itgJzWgOgvztkj5NzDcZmU7t9twQKBgQDj/Vki//BcDYC1e1YZ\nTLPLsOXp5UScT/VM7sHsfCkOkhtnUCdJ49HOWQRuS2f5sun0AG1rEHd/8KC/wpN5\nD2lIplX0LWuJL3J6IJUklW9qHmxL/3LyRO29Ds/hdS5XjuBWk5XpfcIeVYuRojGD\nLg+SDm1NKHVNEqLNpn/rIZWL9wKBgQDPs/2T3xQ/G752yuHedj558m+Bb/EY5Bz2\nLTmt25LWMx83UmxZ8mzwYpFNsiosC5i8R+0j8A8I+Zbkq92w4j9o1HB0jqHGdEt1\n/wPtkllqlZ8FwnLwfRTivRjqvgnrXXRxB5uIQKfMNTSJE2s7tMobxjNSfUDwtWDO\nVudafmTZwQKBgQDAjuISJYiktuLWZO07QQU6LJaDDhj8zKup5p3zVop2vABZKeGF\nDt3NInITlayjwPDIHPRNUQMdE+cxDu3veYy6x4IhUZtZqrFNZOeSloQbZMajCYXU\nCVOiMjhxe79ARHRFqzEanBSv+iB/SDX5TZXpDjZSzLEF/49xkgbIWP0t0QKBgCO5\nSXwNemYAV5oG+yJQJB7FW/hfUJB/a5vL24fTpEXDNTNGsewmjiYqTeOXKTm6JOL9\nXAQ6XdulUhaymMa7ozxcjZr+jUSc6/23hu1tpoN2iIttDmfem6ED9S0q0nnw8P4f\n2Nhuhm3RGOAavu7eAYUVae5eLLU5/RSATfp6ks4BAoGBAMim4tATwYCqEkgXDz+n\nQqOGtfAHNy079DBYdEJMG7gLnyeIG7k2F8yeuCFDp6gqzzq+7EHyTKhA2/sf4BcP\nllkoReJ430buwikgC4cVjUcy+vF/DQ2+jsduM0tzyTG3g76LwWl/LkNevte6hR4t\nMLquVbkKu1cOAa3JYj6yzlhO\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-fbsvc@wave-220b6.iam.gserviceaccount.com",
    client_id: "104857462681156410134",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40wave-220b6.iam.gserviceaccount.com"
  };

  try {
    // Step 1 — Verify with Flutterwave
    console.log(`Verifying transaction ${transaction_id} for user ${uid}`);
    const fwRes = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
      headers: { Authorization: `Bearer ${FW_SECRET}` }
    });

    if (!fwRes.ok) {
      const errTxt = await fwRes.text();
      console.error('Flutterwave API error:', errTxt);
      return res.status(500).json({ error: 'Flutterwave verification failed', detail: errTxt });
    }

    const fwData = await fwRes.json();
    console.log('Flutterwave response:', JSON.stringify(fwData));

    if (fwData.status !== 'success' || fwData.data?.status !== 'successful') {
      return res.status(400).json({ 
        error: 'Payment not successful',
        fw_status: fwData.status,
        tx_status: fwData.data?.status
      });
    }

    const { amount, currency, customer } = fwData.data;

    // Step 2 — Init Firebase Admin
    const { initializeApp, getApps, cert } = await import('firebase-admin/app');
    const { getFirestore }                  = await import('firebase-admin/firestore');

    let adminApp;
    try {
      adminApp = getApps().find(a => a.name === 'admin-verify') || 
                 initializeApp({ credential: cert(SERVICE_ACCOUNT) }, 'admin-verify');
    } catch(e) {
      // App already exists with different name
      adminApp = getApps()[0];
    }

    const db = getFirestore(adminApp);

    // Step 3 — Get subscription config (months, etc)
    let months = 3;
    try {
      const cfgSnap = await db.collection('config').doc('subscription').get();
      if (cfgSnap.exists) months = cfgSnap.data().months || 3;
    } catch(e) { console.log('Could not read config, using default 3 months'); }

    // Step 4 — Calculate expiry
    const now    = new Date();
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + months);

    // Step 5 — Update user to Pro
    const userRef = db.collection('users').doc(uid);
    await userRef.set({
      subscribed:   true,
      plan:         'pro',
      subscribedAt: now.toISOString(),
      expiresAt:    expiry.toISOString(),
      lastPayment: {
        transaction_id,
        amount,
        currency,
        customer_email: customer?.email || '',
        paidAt: now.toISOString()
      }
    }, { merge: true });

    // Step 6 — Log payment to admin payments collection (admin can see all payments)
    await db.collection('payments').add({
      uid,
      transaction_id,
      amount,
      currency,
      customer_email: customer?.email || '',
      months,
      subscribedAt:  now.toISOString(),
      expiresAt:     expiry.toISOString(),
      status:        'success',
      verifiedAt:    now.toISOString()
    });

    console.log(`User ${uid} upgraded to Pro until ${expiry.toISOString()}`);

    return res.status(200).json({ 
      success: true, 
      expiresAt: expiry.toISOString(),
      months
    });

  } catch(e) {
    console.error('verify-payment error:', e);
    return res.status(500).json({ error: e.message, stack: e.stack });
  }
}
