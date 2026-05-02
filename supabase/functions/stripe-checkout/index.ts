import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "https://esm.sh/stripe@12.0.0"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { order_id, type } = await req.json()
    
    // Create Supabase client with the user's auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Fetch the correct amount from the database securely
    let amount = 0;
    let description = '';

    if (type === 'rental') {
      const { data, error } = await supabaseClient.from('rental_bookings').select('total_amount').eq('id', order_id).single()
      if (error || !data) throw new Error('Booking not found or access denied')
      amount = Math.round(parseFloat(data.total_amount) * 100)
      description = `Rental Booking: ${order_id}`
    } else {
      const { data, error } = await supabaseClient.from('orders').select('total_amount').eq('id', order_id).single()
      if (error || !data) throw new Error('Order not found or access denied')
      amount = Math.round(parseFloat(data.total_amount) * 100)
      description = `Order: ${order_id}`
    }

    // Create PaymentIntent (Auth only, NO capture yet)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      capture_method: 'manual', // Admin captures this later!
      description: description,
      metadata: { order_id, type },
    })

    // Update the database with the tracking ID using a service role key to bypass RLS for this specific update
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const table = type === 'rental' ? 'rental_bookings' : 'orders'
    await supabaseAdmin.from(table).update({ 
      payment_intent_id: paymentIntent.id 
    }).eq('id', order_id)

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
