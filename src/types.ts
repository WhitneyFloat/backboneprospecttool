export interface Lead {
  id: string;
  name: string;
  website: string;
  contact: string;
  owner?: string;
  phone: string;
  email: string;
  score: number;
  description?: string;
  status: string;
  outreachStage: number;
  archiveReason?: string;
  source?: string;
}

export interface LeadReply {
  id: string;
  leadId: string;
  leadName: string;
  content: string;
  intent: 'objection' | 'interest' | 'other';
  aiDraft: string;
  status: 'pending' | 'sent' | 'ignored';
  timestamp: string;
}

export interface EmailTemplate {
  id: number;
  name: string;
  subjects: string[];
  body: string;
  cadenceDays: number;
}

export interface TemplateData {
  name?: string;
  industry?: string;
  source?: string;
}
