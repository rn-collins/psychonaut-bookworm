const UPSTREAM = 'https://rn-api-rn-collins.vercel.app/api/lead';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  const body = req.body || {};
  const email = String(body.email || '').trim();
  const consent = body.consent === true;
  if (!consent) return res.status(400).json({ ok: false, error: 'Consent is required' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'A valid email is required' });
  }
  const payload = {
    name: String(body.name || '').slice(0, 120),
    email,
    message: String(body.message || '').slice(0, 5000),
    theme: String(body.theme || '').slice(0, 120),
    source: String(body.source || 'psychonaut-bookworm').slice(0, 120),
    url: String(body.url || '').slice(0, 1000)
  };
  try {
    const response = await fetch(UPSTREAM, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) return res.status(502).json({ ok: false, error: 'Inquiry service unavailable' });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ ok: false, error: 'Inquiry service unavailable' });
  }
}
