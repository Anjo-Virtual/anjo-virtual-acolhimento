
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt_id, user_input } = await req.json();

    // Validate required fields
    if (!prompt_id || !user_input) {
      throw new Error('Missing required fields: prompt_id and user_input are required');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the prompt from the database
    const { data: promptData, error: promptError } = await supabaseClient
      .from('chat_prompts')
      .select('*')
      .eq('id', prompt_id)
      .single();

    if (promptError || !promptData) {
      throw new Error('Failed to fetch prompt');
    }

    // Get the integration details
    const { data: integrationData, error: integrationError } = await supabaseClient
      .from('integrations')
      .select('*')
      .eq('id', promptData.integration_id)
      .single();

    if (integrationError || !integrationData) {
      throw new Error('Failed to fetch integration details');
    }

    // For now, we'll just echo back a response
    // In a real implementation, this would call the specific AI service
    const assistant_response = `Echo: ${user_input}`;

    // Store the chat interaction
    const { error: historyError } = await supabaseClient
      .from('chat_history')
      .insert({
        prompt_id,
        user_input,
        assistant_response,
        metadata: {}
      });

    if (historyError) {
      throw new Error('Failed to store chat history');
    }

    return new Response(
      JSON.stringify({
        success: true,
        response: assistant_response
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
