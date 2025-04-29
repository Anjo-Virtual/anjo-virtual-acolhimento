
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookData {
  name: string
  email: string
  phone: string
  message?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get request body
    const body = await req.json()
    const { webhookUrl, data } = body as { webhookUrl: string; data: WebhookData }

    console.log('Received data:', { webhookUrl, data })
    
    if (!webhookUrl || !data) {
      return new Response(
        JSON.stringify({ error: 'Missing webhook URL or data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Save lead data to database first
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Save contact data (lead)
    if (data) {
      const { error: contactError } = await supabase
        .from('contact_messages')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message || 'Contato via chat'
        })

      if (contactError) {
        console.error('Error saving contact:', contactError)
      }
    }

    // Send data to n8n webhook
    try {
      console.log('Sending to webhook:', webhookUrl)
      const n8nResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!n8nResponse.ok) {
        throw new Error(`n8n webhook responded with status ${n8nResponse.status}`)
      }

      const responseData = await n8nResponse.text()
      console.log('n8n webhook response:', responseData)

      return new Response(
        JSON.stringify({ success: true, message: 'Data sent to n8n webhook' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      console.error('Error sending to n8n webhook:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to send to n8n webhook', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Unhandled error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
