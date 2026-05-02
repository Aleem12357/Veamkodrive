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
    const { order_id, type, action } = await req.json()
    
    // Create Supabase client with the user's auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Verify user is Admin
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) throw new Error('Not authenticated')

    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (roleError || roleData.role !== 'admin') throw new Error('Not authorized')

    // Admin verified. Use service role to bypass RLS for fetching the payment intent ID
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const table = type === 'rental' ? 'rental_bookings' : 'orders'
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from(table)
      .select('payment_intent_id, payment_status')
      .eq('id', order_id)
      .single()

    if (orderError || !orderData) throw new Error('Order not found')
    
    if (!orderData.payment_intent_id) {
      // It might be a cash payment or manually handled.
      // We just update the DB status.
      const newStatus = action === 'capture' ? (type === 'rental' ? 'active' : 'completed') : 'cancelled'
      await supabaseAdmin.from(table).update({ status: newStatus }).eq('id', order_id)
      return new Response(JSON.stringify({ success: true, message: "Updated local status (no Stripe intent found)" }), { headers: corsHeaders, status: 200 })
    }

    if (action === 'capture') {
      if (orderData.payment_status === 'held') {
        await stripe.paymentIntents.capture(orderData.payment_intent_id)
      }
      const newStatus = type === 'rental' ? 'active' : 'completed'
      await supabaseAdmin.from(table).update({ status: newStatus, payment_status: 'paid' }).eq('id', order_id)
    } 
    else if (action === 'cancel') {
      if (orderData.payment_status === 'held') {
        await stripe.paymentIntents.cancel(orderData.payment_intent_id)
      } else if (orderData.payment_status === 'paid') {
        // If it was somehow captured already, we refund it
        await stripe.refunds.create({ payment_intent: orderData.payment_intent_id })
      }
      await supabaseAdmin.from(table).update({ status: 'cancelled', payment_status: 'refunded' }).eq('id', order_id)
    }

    return new Response(JSON.stringify({ success: true }), {
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
