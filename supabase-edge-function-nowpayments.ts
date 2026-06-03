// Supabase Edge Function: nowpayments-checkout
// Déployez via : supabase.com → Edge Functions → Create new function

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const PACK_PRICES: Record<string, number> = {
  '100': 9.00,
  '450': 29.00,
  '1300': 79.00
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
    const price = PACK_PRICES[amount.toString()];

    if (!price || !userId) {
      return new Response(
        JSON.stringify({ error: 'Paramètres invalides. Fournissez amount (100, 450, 1300) et userId.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('NOWPAYMENTS_API_KEY') ?? '';
    const maskedKey = apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : 'VIDE';
    console.log(`[Diagnostic] Clé API chargée : ${maskedKey} | Longueur : ${apiKey.length} caractères`);

    const nowpaymentsRes = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: price,
        price_currency: 'usd',
        order_id: `vltx_${userId}_${Date.now()}`,
        order_description: `Pack Veltrix : ${amount} Crédits`,
        success_url: `https://www.getveltrix.com/dashboard?payment=success`,
        cancel_url: `https://www.getveltrix.com/dashboard?payment=cancel`,
      }),
    });

    const data = await nowpaymentsRes.json();
    console.log('[Diagnostic] Réponse brute NOWPayments :', JSON.stringify(data));

    if (data.invoice_url) {
      return new Response(
        JSON.stringify({ url: data.invoice_url }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: data.message || data.error || 'Impossible de créer la facture NOWPayments' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (err) {
    console.error('[Diagnostic] Erreur attrapée dans l\'Edge Function :', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
