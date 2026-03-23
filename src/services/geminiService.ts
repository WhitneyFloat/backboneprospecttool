import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

export async function enrichLeadWithGemini(companyName: string, websiteUrl: string = '', companyDescription: string = '', ownerName: string = '') {
  if (!ai) {
    throw new Error('Gemini API key not configured. Please add to your .env file.');
  }

  const prompt = `
  You are an expert sales strategist for a custom mobile app development service.
  Analyze the following prospect business:
  Company Name: ${companyName}
  Owner Name: ${ownerName}
  Website / Description: ${websiteUrl} ${companyDescription}

  Your tasks:
  1. Determine an "AI Fit Score" from 0-100 indicating how likely this business is to need a custom mobile app.
  2. Draft a personalized 3-sentence outreach hook addressing their likely pain points.
  3. Based on the Company Name (${companyName}) and Owner Name (${ownerName}), predict the 3 most likely professional email addresses. 
     Use common patterns: first@company.com, first.last@company.com, info@company.com. 
     Assume the domain is derived from the company name or provided website.

  Respond strictly in JSON format:
  {
    "fitScore": number,
    "pitch": "string",
    "suggestedEmails": ["string", "string", "string"]
  }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let text = response.text || "{}";
    
    if (text.startsWith('```json')) {
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Enrichment Error:", error);
    throw error;
  }
}

/**
 * Specifically derives emails based on the "Unicorn Method" patterns
 */
export async function deriveProfessionalEmail(companyName: string, ownerName: string, websiteUrl: string = '') {
  return enrichLeadWithGemini(companyName, websiteUrl, '', ownerName);
}
