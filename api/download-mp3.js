// api/download-mp3.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const VOICE_MAPPING = {
  "KronoPol-9": "pNInz6ob9g9j9YGCt834",
  "NexoFin-X": "ErXwobaYiN019tU2b10X",
  "MètKonsey": "IKne3meq5aBnO1rMsExF",
  "KèKontan": "EXAVITQu4vr4xnSDOCMa"
};
const DEFAULT_VOICE = "21m00Tcm4TlvDq8ikWAM"; // Rachel

async function generateSpeech(text, voiceId, apiKey) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey
    },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.85
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs Error (${response.status}): ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(455).json({ error: 'Méthode non autorisée' });
  }

  // 1. Authentifier l'utilisateur via son token Bearer
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'En-tête Authorization manquant ou invalide.' });
  }

  const token = authHeader.split(' ')[1];
  let activeUser = null;
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Session invalide ou expirée.' });
    }
    activeUser = user;
  } catch (err) {
    return res.status(401).json({ error: 'Échec de la validation de session.' });
  }

  // 2. Récupérer le profil et le tier de l'utilisateur
  let tier = 'STANDARD';
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', activeUser.id)
      .single();
    
    if (!profileError && profile) {
      tier = (profile.tier || 'STANDARD').toUpperCase();
    }
  } catch (err) {
    console.error("Erreur de lecture du profil :", err);
  }

  // 3. Valider l'accès au téléchargement audio (MP3)
  // Seuls les tiers SPECIALIST et ANALYST (ou PRO) sont autorisés
  if (tier !== 'SPECIALIST' && tier !== 'ANALYST' && tier !== 'PRO') {
    return res.status(403).json({
      error: 'Accès interdit. Le téléchargement MP3 est réservé aux abonnements Spécialiste ($29) ou Analyste ($79).'
    });
  }

  const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
  if (!elevenLabsApiKey) {
    return res.status(500).json({ error: 'Le moteur audio ElevenLabs est indisponible (clé API manquante au serveur).' });
  }

  // 4. Récupérer les paramètres du body
  const { topic, history } = req.body;
  if (!topic || !Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: 'Paramètres topic et history (array non-vide) requis.' });
  }

  try {
    // 5. Lancer la génération vocale en parallèle pour optimiser la performance
    const speechPromises = history.map(async (turn) => {
      const speakerName = turn.sender || 'Expert';
      const voiceId = VOICE_MAPPING[speakerName] || DEFAULT_VOICE;
      const text = turn.text || '';
      if (!text) return Buffer.from([]);
      
      const buffer = await generateSpeech(text, voiceId, elevenLabsApiKey);
      return buffer;
    });

    // Optionnel : Générer la signature vocale en parallèle pour le tier SPECIALIST
    let watermarkPromise = Promise.resolve(Buffer.from([]));
    if (tier === 'SPECIALIST') {
      watermarkPromise = generateSpeech("Contenu protégé par GetVeltrix.", DEFAULT_VOICE, elevenLabsApiKey)
        .catch(err => {
          console.warn("Échec de génération du filigrane audio, poursuite sans filigrane :", err);
          return Buffer.from([]);
        });
    }

    const [speechBuffers, watermarkBuffer] = await Promise.all([
      Promise.all(speechPromises),
      watermarkPromise
    ]);

    // 6. Concaténer les buffers MP3
    const finalBuffers = [];
    
    // Si SPECIALIST, prépendre le watermark au début
    if (tier === 'SPECIALIST' && watermarkBuffer.length > 0) {
      finalBuffers.push(watermarkBuffer);
      
      // Ajouter une petite pause de silence représentée par un buffer vide (ou laisser tel quel pour la transition directe)
      // La concaténation directe de MP3 fonctionne très bien pour introduire l'émission
    }

    // Ajouter toutes les répliques
    speechBuffers.forEach(buf => {
      if (buf.length > 0) {
        finalBuffers.push(buf);
      }
    });

    const finalMp3Buffer = Buffer.concat(finalBuffers);

    // 7. Renvoyer le fichier MP3
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="getveltrix-broadcast.mp3"');
    return res.status(200).send(finalMp3Buffer);

  } catch (err) {
    console.error("Erreur de génération audio MP3 :", err);
    return res.status(500).json({ error: err.message || 'Erreur lors de la composition audio de la table ronde.' });
  }
}
