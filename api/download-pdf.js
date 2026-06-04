// api/download-pdf.js
const { createClient } = require('@supabase/supabase-js');
const { PDFDocument, StandardFonts, rgb, degrees } = require('pdf-lib');



function wrapText(text, width, font, fontSize) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (testWidth > width) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[\u2018\u2019]/g, "'") // curly single quotes/apostrophes
    .replace(/[\u201C\u201D]/g, '"') // curly double quotes
    .replace(/[\u2013\u2014]/g, '-') // en-dash and em-dash
    .replace(/[\u2026]/g, '...') // ellipsis
    .replace(/[^\x00-\xFF]/g, '?'); // replace any other non-latin1 characters with '?'
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

  // Initialisation dynamique du client Supabase
  const DEFAULT_SUPABASE_URL = "https://cphzzxxrvfaqxgyzzebo.supabase.co";
  const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwaHp6eHhydmZhcXhneXp6ZWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNjQzODksImV4cCI6MjA5NTc0MDM4OX0.4xolo6bSh2td55h0dGxRlzxGdeCaIKK8Q13eDke--Cw";

  const supabaseUrl = process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SUPABASE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });

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

  // 3. Récupérer les paramètres du body
  const { topic, history } = req.body;
  if (!topic || !Array.isArray(history)) {
    return res.status(400).json({ error: 'Paramètres topic et history (array) requis.' });
  }

  try {
    // 4. Générer le document PDF
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const pageWidth = 595.27; // A4
    const pageHeight = 841.89; // A4
    const margin = 50;
    const printableWidth = pageWidth - 2 * margin;

    let currentPage = null;
    let currentY = 0;

    // Helper pour créer une nouvelle page
    function addNewPage() {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      currentY = pageHeight - margin;
      
      // En-tête de page discret
      currentPage.drawText('GETVELTRIX - TRANSCRIPTION OFFICIELLE', {
        x: margin,
        y: pageHeight - 35,
        size: 8,
        font: fontBold,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      currentPage.drawLine({
        start: { x: margin, y: pageHeight - 40 },
        end: { x: pageWidth - margin, y: pageHeight - 40 },
        thickness: 0.5,
        color: rgb(0.8, 0.8, 0.8),
      });
    }

    addNewPage();

    // Titre
    currentPage.drawText('Transcription du Débat', {
      x: margin,
      y: currentY - 10,
      size: 22,
      font: fontBold,
      color: rgb(0.07, 0.09, 0.15), // getveltrix dark card color representation
    });
    currentY -= 40;

    // Sujet du Débat (encadré)
    const wrappedTopic = wrapText(sanitizeText(`Sujet : ${topic}`), printableWidth - 20, fontOblique, 12);
    
    // Dessiner le fond de l'encadré du sujet
    const boxHeight = wrappedTopic.length * 15 + 20;
    currentPage.drawRectangle({
      x: margin,
      y: currentY - boxHeight,
      width: printableWidth,
      height: boxHeight,
      color: rgb(0.96, 0.97, 0.98),
      borderColor: rgb(0.88, 0.90, 0.92),
      borderWidth: 1,
    });

    let topicY = currentY - 15;
    for (const line of wrappedTopic) {
      currentPage.drawText(line, {
        x: margin + 10,
        y: topicY,
        size: 11,
        font: fontOblique,
        color: rgb(0.2, 0.2, 0.2),
      });
      topicY -= 15;
    }
    currentY -= (boxHeight + 25);

    // Historique des messages
    for (const msg of history) {
      const speakerName = sanitizeText(msg.sender || 'Expert');
      const speakerText = sanitizeText(msg.text || '');

      // Calculer la hauteur estimée requise
      const wrappedLines = wrapText(speakerText, printableWidth, font, 10);
      const neededHeight = 20 + wrappedLines.length * 14 + 15;

      // Ajouter une page si on dépasse
      if (currentY - neededHeight < margin + 20) {
        addNewPage();
      }

      // Nom de l'émetteur
      currentPage.drawText(speakerName, {
        x: margin,
        y: currentY,
        size: 11,
        font: fontBold,
        color: rgb(0.53, 0.69, 0.0), // Accent vert olive / neonGreenDim
      });
      currentY -= 15;

      // Lignes de texte
      for (const line of wrappedLines) {
        currentPage.drawText(line, {
          x: margin,
          y: currentY,
          size: 10,
          font: font,
          color: rgb(0.15, 0.15, 0.15),
          lineHeight: 14,
        });
        currentY -= 14;
      }
      currentY -= 15; // Espace entre répliques
    }

    // 5. Appliquer les Watermarks sur toutes les pages si Tier < ANALYST / PRO
    if (tier !== 'ANALYST' && tier !== 'PRO') {
      const pages = pdfDoc.getPages();
      for (const page of pages) {
        // Filigrane diagonal central
        page.drawText('Créé avec GetVeltrix', {
          x: 130,
          y: 320,
          size: 40,
          font: fontBold,
          color: rgb(0.85, 0.85, 0.85),
          opacity: 0.14,
          rotate: degrees(45),
        });

        // Filigrane en pied de page récurrent
        page.drawText('Créé avec GetVeltrix - getveltrix.com', {
          x: margin,
          y: 25,
          size: 8,
          font: font,
          color: rgb(0.5, 0.5, 0.5),
          opacity: 0.6,
        });
        
        page.drawText('Document non professionnel. Passez au plan Analyste pour supprimer ce filigrane.', {
          x: pageWidth - margin - 350,
          y: 25,
          size: 7,
          font: fontOblique,
          color: rgb(0.6, 0.6, 0.6),
          opacity: 0.6,
        });
      }
    } else {
      // Document propre pour le tier Analyst : ajouter simplement le numéro de page discret
      const pages = pdfDoc.getPages();
      for (let idx = 0; idx < pages.length; idx++) {
        const page = pages[idx];
        page.drawText(`Page ${idx + 1} / ${pages.length}`, {
          x: pageWidth - margin - 50,
          y: 25,
          size: 8,
          font: font,
          color: rgb(0.5, 0.5, 0.5),
        });
      }
    }

    // 6. Sauvegarder et envoyer le PDF
    const pdfBytes = await pdfDoc.save();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="getveltrix-transcript.pdf"');
    return res.status(200).send(Buffer.from(pdfBytes));

  } catch (err) {
    console.error("Erreur de génération PDF :", err);
    return res.status(500).json({ error: 'Erreur lors de la génération du fichier PDF.' });
  }
}
