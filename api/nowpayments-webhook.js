// api/nowpayments-webhook.js
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const PACK_CREDITS = {
  9.00: 100,
  29.00: 450,
  79.00: 1300
};

module.exports = async function handler(req, res) {
  // Configurer les en-têtes CORS pour autoriser NOWPayments
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-nowpayments-sig');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(455).send('Méthode non autorisée');
  }

  const receivedSig = req.headers['x-nowpayments-sig'];
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;

  if (!receivedSig || !ipnSecret) {
    console.error("Signature IPN ou IPN Secret manquant.");
    return res.status(401).send('Signature manquante ou non configurée');
  }

  try {
    // 1. Validation de la Signature IPN NOWPayments (Tri alphabétique obligatoire)
    const sortedParams = {};
    Object.keys(req.body).sort().forEach(key => {
      sortedParams[key] = req.body[key];
    });
    
    const hmac = crypto.createHmac('sha512', ipnSecret);
    hmac.update(JSON.stringify(sortedParams));
    const calculatedSig = hmac.digest('hex');

    if (calculatedSig !== receivedSig) {
      console.warn("Échec de la validation de la signature IPN !");
      return res.status(403).send('Signature invalide - Usurpation détectée');
    }

    const { payment_status, price_amount, order_id } = req.body;

    // 2. Traiter uniquement les paiements confirmés ou complétés
    if (payment_status === 'finished' || payment_status === 'confirmed') {
      // Extraire l'ID de l'utilisateur (format: vltx_USERID_TIMESTAMP)
      const matches = order_id.match(/^vltx_(.*?)_\d+$/);
      if (!matches) {
        console.error(`ID de commande non reconnu : ${order_id}`);
        return res.status(400).send('ID de commande non reconnu');
      }
      
      const userId = matches[1];
      const creditsToAward = PACK_CREDITS[parseFloat(price_amount)];

      if (userId && creditsToAward) {
        console.log(`Paiement valide de ${price_amount} USD reçu. Attribution de ${creditsToAward} crédits pour l'utilisateur ${userId}`);

        // Récupérer le solde actuel de l'utilisateur de manière sécurisée
        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('credits, tier')
          .eq('id', userId)
          .single();

        if (fetchError || !profile) {
          console.error("Impossible de récupérer le profil de l'utilisateur :", fetchError);
          return res.status(500).send("Erreur de récupération du profil");
        }

        const newCredits = (profile.credits || 0) + creditsToAward;
        
        // Déterminer le nouveau tier
        let nextTier = profile.tier || 'STANDARD';
        if (creditsToAward === 1300) nextTier = 'ANALYST';
        else if (creditsToAward === 450) nextTier = 'SPECIALIST';

        // Mettre à jour le profil de l'utilisateur
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            credits: newCredits,
            tier: nextTier
          })
          .eq('id', userId);

        if (updateError) {
          console.error("Erreur lors de la mise à jour des crédits :", updateError);
          return res.status(500).send("Erreur de mise à jour");
        }

        // Enregistrer le log de transaction dans Supabase
        const { error: txError } = await supabase
          .from('transactions')
          .insert({
            user_id: userId,
            amount: creditsToAward,
            type: 'purchase',
            details: `Achat via NOWPayments (Crypto) : +${creditsToAward} Crédits`
          });

        if (txError) {
          console.error("Erreur lors de la création du log de transaction :", txError);
        }

        console.log(`Compte crédité avec succès pour l'utilisateur ${userId}.`);
      } else {
        console.error("Identifiant de l'utilisateur ou crédits non définis.");
      }
    } else {
      console.log(`Paiement IPN ignoré avec statut : ${payment_status}`);
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error("Erreur serveur lors de la validation du Webhook :", err);
    res.status(500).send(err.message);
  }
}
