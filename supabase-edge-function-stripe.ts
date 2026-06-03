// Supabase Edge Function: stripe-checkout
// Déployez via : supabase.com → Edge Functions → Create new function
// Nommez-la : stripe-checkout

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "npm:stripe@^14";

const PACK_PRICES: Record<string, number> = {
  '100': 900,   // 9.00 $ en centimes
  '450': 2900,  // 29.00 $ en centimes
  '1300': 7900  // 79.00 $ en centimes
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, userId } = await req.json();
    const priceCents = PACK_PRICES[amount.toString()];

    if (!priceCents || !userId) {
      return new Response(
        JSON.stringify({ error: 'Paramètres invalides. Fournissez amount (100, 450, 1300) et userId.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: 'Clé secrète Stripe non configurée dans les Secrets Supabase.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialisation du client Stripe compatible Deno / Edge
    const stripe = new Stripe(stripeSecretKey, {
      httpClient: Stripe.createFetchHttpClient(),
      apiVersion: "2023-10-16",
    });

    // Création de la Session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Pack Veltrix : ${amount} Crédits`,
              description: `Recharge de ${amount} crédits d'échanges d'intelligence artificielle.`,
            },
            unit_amount: priceCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      client_reference_id: userId,
      metadata: {
        userId: userId,
        amount: amount.toString(),
      },
      success_url: `https://www.getveltrix.com/dashboard?payment=success`,
      cancel_url: `https://www.getveltrix.com/dashboard?payment=cancel`,
    });

    if (session.url) {
      return new Response(
        JSON.stringify({ url: session.url }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Impossible de générer l\'URL Stripe Checkout.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (err) {
    console.error('Erreur Stripe Checkout :', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
