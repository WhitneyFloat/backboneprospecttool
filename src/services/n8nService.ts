const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

import type { Lead } from '../types';



export async function pushLeadToPipeline(lead: Lead) {

  if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL === 'your_n8n_webhook_url_here') {
    throw new Error('n8n Webhook URL not configured in .env file.');
  }

  // Map lead data to Google Sheet columns
  const payload = {
    "ID": lead.id,
    "Company Name": lead.name,
    "Website": lead.website,
    "Contact Person": lead.contact,
    "Phone": lead.phone,
    "Email": lead.email,
    "AI Fit Score": lead.score,
    "Outreach Stage": lead.outreachStage || 0,
    "Status": lead.status || "ACTIVE",
    "Source": lead.source || "Backbone Finder",
    "Timestamp": new Date().toISOString()
  };


  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to push to pipeline: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("n8n Webhook Error:", error);
    throw error;
  }
}
