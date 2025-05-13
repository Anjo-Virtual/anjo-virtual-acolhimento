
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    
    // Create a Supabase client for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Parse request body
    const { priceId, mode, planType } = await req.json();
    
    if (!priceId || !mode) {
      throw new Error("Missing required parameters: priceId and mode are required");
    }
    
    logStep("Request parameters", { priceId, mode, planType });

    // Authentication is now optional for all plans
    let user = null;
    let customerEmail = null;
    
    // Try to get user from auth header if available
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
        
        if (!userError && userData?.user) {
          user = userData.user;
          customerEmail = user.email;
          logStep("User authenticated", { userId: user.id, email: user.email });
        }
      } catch (error) {
        // Just log the error but continue without authentication
        logStep("Authentication failed, continuing as guest", { error: error.message });
      }
    } else {
      logStep("No authentication header, continuing as guest");
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check if customer exists or prepare for customer creation
    let customerId;
    
    if (customerEmail) {
      // For authenticated users, try to find existing Stripe customer
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Found existing Stripe customer", { customerId });
      }
    }

    // Get domain for success/cancel URLs
    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    const FREE_PLAN_PRICE_ID = "price_1RLo8HPEI2ekVLFOBEJ5lP8w";
    const isFreePlan = priceId === FREE_PLAN_PRICE_ID;
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: !customerId ? customerEmail : undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode as "payment" | "subscription",
      success_url: `${origin}/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}&plan=${planType}`,
      cancel_url: `${origin}/pagamento-cancelado`,
      locale: "pt-BR",
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      ...(isFreePlan ? {
        custom_fields: [
          {
            key: 'phone',
            label: {
              type: 'custom',
              custom: 'Número de WhatsApp (com DDD)',
            },
            type: 'text',
            text: {
              maximum_length: 20,
            },
          }
        ],
      } : {
        payment_method_types: ["card"]
      }),
    });

    logStep("Created checkout session", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in create-checkout function:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
