function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID');
    return res.status(500).json({ success: false, error: 'Telegram no está configurado' });
  }

  const { nombre, contacto, tipo, idea, _honey } = req.body || {};

  // Campo trampa anti-bots. Para un usuario real siempre llega vacío.
  if (_honey) return res.status(200).json({ success: true });

  if (!nombre || !contacto || !tipo || !idea) {
    return res.status(400).json({ success: false, error: 'Completa todos los campos' });
  }

  if ([nombre, contacto, tipo].some(v => String(v).length > 180) || String(idea).length > 2500) {
    return res.status(400).json({ success: false, error: 'La información es demasiado larga' });
  }

  const message = [
    '🚀 <b>Nueva solicitud desde apps.enla.mx</b>',
    '',
    `👤 <b>Nombre:</b> ${escapeHtml(nombre)}`,
    `📲 <b>Contacto:</b> ${escapeHtml(contacto)}`,
    `📱 <b>Tipo de app:</b> ${escapeHtml(tipo)}`,
    '',
    '💡 <b>Idea:</b>',
    escapeHtml(idea),
    '',
    `🕒 <i>${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</i>`
  ].join('\n');

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const telegramData = await telegramResponse.json();
    if (!telegramResponse.ok || !telegramData.ok) {
      console.error('Telegram API:', telegramData);
      return res.status(502).json({ success: false, error: 'No se pudo enviar a Telegram' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error enviando a Telegram:', error);
    return res.status(500).json({ success: false, error: 'Error interno' });
  }
};
