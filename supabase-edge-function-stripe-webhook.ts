// Supabase Edge Function: stripe-webhook
// Déployez via : supabase.com → Edge Functions → Create new function
// Nommez-la : stripe-webhook

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "npm:stripe@^14";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2023-10-16",
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
    
    let event;
    if (webhookSecret) {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      );
    } else {
      console.warn("ATTENTION : STRIPE_WEBHOOK_SECRET non configuré. Mode développement sans signature.");
      event = JSON.parse(body);
    }

    console.log(`[Stripe Webhook] Événement reçu : ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.client_reference_id;
      const amountCredits = session.metadata?.amount;

      if (!userId || !amountCredits) {
        console.error("[Stripe Webhook] userId ou amount manquant dans la session checkout.");
        return new Response("Missing metadata", { status: 400 });
      }

      const credits = parseInt(amountCredits);
      
      // Connexion Admin Supabase (service_role)
      const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // 1. Récupérer le solde actuel de l'utilisateur
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();

      if (fetchError) {
        console.error("[Stripe Webhook] Erreur lors de la récupération du profil :", fetchError);
        return new Response("Profile fetch error", { status: 500 });
      }

      const newBalance = (profile.credits || 0) + credits;

      // 2. Mettre à jour le solde
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ credits: newBalance })
        .eq("id", userId);

      if (updateError) {
        console.error("[Stripe Webhook] Erreur mise à jour crédits :", updateError);
        return new Response("Database update error", { status: 500 });
      }

      // 3. Enregistrer la transaction
      const { error: txError } = await supabase
        .from("transactions")
        .insert({
          user_id: userId,
          amount: credits,
          type: "purchase",
          details: `Recharge de ${credits} crédits via Stripe (Session: ${session.id})`
        });

      if (txError) {
        console.error("[Stripe Webhook] Erreur insertion transaction :", txError);
      }

      console.log(`[Stripe Webhook Succès] ${credits} crédits ajoutés avec succès à l'utilisateur ${userId}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("[Stripe Webhook Erreur] :", err.message);
    return new Response(`Error: ${err.message}`, { status: 400 });
  }
});
