// Supabase Edge Function: nowpayments-webhook
// Déployez via : supabase.com → Edge Functions → Create new function
// Nommez-la : nowpayments-webhook

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Fonction de vérification de la signature IPN de NOWPayments
async function verifyNowPaymentsSignature(
  rawBody: string, 
  signature: string, 
  ipnSecret: string
): Promise<boolean> {
  try {
    const data = JSON.parse(rawBody);
    
    // 1. Trier les clés par ordre alphabétique
    const sortedData = Object.keys(data).sort().reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {} as Record<string, any>);

    // 2. Transformer en chaîne JSON compacte (sans espace)
    const sortedJsonString = JSON.stringify(sortedData);

    // 3. Générer le HMAC-SHA512
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(ipnSecret),
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"]
    );

    const hmacBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(sortedJsonString)
    );

    // 4. Convertir en chaîne hexadécimale
    const hashArray = Array.from(new Uint8Array(hmacBuffer));
    const generatedSignature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return generatedSignature === signature;
  } catch (e) {
    console.error("[NOWPayments Webhook] Erreur de parsing lors de la signature :", e);
    return false;
  }
}

const PACK_PRICES: Record<string, number> = {
  '9': 100,
  '29': 450,
  '79': 1300
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  const signature = req.headers.get("x-nowpayments-sig");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  try {
    const rawBody = await req.text();
    const ipnSecret = Deno.env.get("NOWPAYMENTS_IPN_SECRET") ?? "";

    // Validation signature si le secret est configuré
    if (ipnSecret) {
      const isValid = await verifyNowPaymentsSignature(rawBody, signature, ipnSecret);
      if (!isValid) {
        console.error("[NOWPayments Webhook] Signature invalide détectée.");
        return new Response("Invalid signature", { status: 400 });
      }
    } else {
      console.warn("ATTENTION : NOWPAYMENTS_IPN_SECRET non configuré. Mode développement.");
    }

    const data = JSON.parse(rawBody);
    console.log(`[NOWPayments Webhook] Paiement reçu | Statut : ${data.payment_status} | ID : ${data.payment_id}`);

    // Nous créditons uniquement si le statut est "finished"
    if (data.payment_status === "finished") {
      const orderId = data.order_id; // Format: vltx_userId_timestamp
      if (!orderId || !orderId.startsWith("vltx_")) {
        console.error("[NOWPayments Webhook] Format d'order_id invalide :", orderId);
        return new Response("Invalid order_id format", { status: 400 });
      }

      // Extraire le userId
      const parts = orderId.split("_");
      const userId = parts[1];

      // Déterminer le montant des crédits achetés
      const priceStr = Math.round(data.price_amount).toString();
      const credits = PACK_PRICES[priceStr] || 100; // Fallback à 100 crédits

      if (!userId) {
        console.error("[NOWPayments Webhook] userId introuvable dans order_id.");
        return new Response("User ID not found", { status: 400 });
      }

      // Connexion Admin Supabase (service_role)
      const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // 1. Récupérer le profil utilisateur
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();

      if (fetchError) {
        console.error("[NOWPayments Webhook] Erreur profil :", fetchError);
        return new Response("Profile fetch error", { status: 500 });
      }

      const newBalance = (profile.credits || 0) + credits;

      // 2. Créditer les crédits
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ credits: newBalance })
        .eq("id", userId);

      if (updateError) {
        console.error("[NOWPayments Webhook] Erreur mise à jour crédits :", updateError);
        return new Response("Database update error", { status: 500 });
      }

      // 3. Enregistrer la transaction
      const { error: txError } = await supabase
        .from("transactions")
        .insert({
          user_id: userId,
          amount: credits,
          type: "purchase",
          details: `Recharge de ${credits} crédits via NOWPayments (Payment ID: ${data.payment_id})`
        });

      if (txError) {
        console.error("[NOWPayments Webhook] Erreur insertion transaction :", txError);
      }

      console.log(`[NOWPayments Webhook Succès] ${credits} crédits ajoutés avec succès à l'utilisateur ${userId}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("[NOWPayments Webhook Erreur] :", err.message);
    return new Response(`Error: ${err.message}`, { status: 400 });
  }
});
