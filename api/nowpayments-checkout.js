// api/nowpayments-checkout.js

const PACK_PRICES = {
  '100': 9.00,    // Pack Entrée
  '450': 29.00,   // Pack Spécialiste
  '1300': 79.00   // Pack Analyste
};

module.exports = async function handler(req, res) {
  // CORS configuration to support local development testing if needed
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(455).json({ error: 'Méthode non autorisée' });
  }
  
  const { amount, userId } = req.body;
  const price = PACK_PRICES[amount.toString()];
  
  if (!price || !userId) {
    return res.status(400).json({ error: 'Paramètres invalides. Fournissez amount (100, 450, 1300) et userId.' });
  }

  try {
    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        price_amount: price,
        price_currency: 'usd',
        order_id: `vltx_${userId}_${Date.now()}`,
        order_description: `Pack Veltrix : ${amount} Crédits`,
        ipn_callback_url: `https://${req.headers.host}/api/nowpayments-webhook`,
        success_url: `https://${req.headers.host}/dashboard?payment=success`,
        cancel_url: `https://${req.headers.host}/dashboard?payment=cancel`
      })
    });

    const data = await response.json();
    if (data.invoice_url) {
      return res.status(200).json({ url: data.invoice_url });
    } else {
      return res.status(500).json({ error: data.message || 'Échec de la création de la facture' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
