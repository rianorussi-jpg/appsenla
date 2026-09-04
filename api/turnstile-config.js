module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const siteKey = process.env.TURNSTILE_SITE_KEY;
  if (!siteKey) {
    return res.status(500).json({ error: 'Turnstile no está configurado' });
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ siteKey });
};
