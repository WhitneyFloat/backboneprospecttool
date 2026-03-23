import { useState } from 'react';
import { Mail, MessageSquare, XCircle, Edit3, Send, Calendar, AlertCircle, Inbox, User } from 'lucide-react';


import type { LeadReply } from '../types';

interface LeadInboxProps {

  replies: LeadReply[];
  onApprove: (replyId: string) => void;
  onIgnore: (replyId: string) => void;
  onEdit: (replyId: string, newDraft: string) => void;
}

export function LeadInbox({ replies, onApprove, onIgnore, onEdit }: LeadInboxProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const pendingReplies = replies.filter(r => r.status === 'pending');

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'interest': return '#00d4ff';
      case 'objection': return '#ffcc00';
      default: return 'var(--on-surface-variant)';
    }
  };

  const getIntentIcon = (intent: string) => {
    switch (intent) {
      case 'interest': return <Calendar size={14} />;
      case 'objection': return <AlertCircle size={14} />;
      default: return <MessageSquare size={14} />;
    }
  };

  return (
    <section className="glass-card" style={{ padding: '32px', borderRadius: '16px', position: 'relative', overflow: 'hidden', minHeight: '600px' }}>
      <div className="hud-corner-tl"></div>
      <div className="hud-corner-br"></div>

      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--primary)', letterSpacing: '0.2em', marginBottom: '8px' }}>AI_INBOX // INCOMING_REPLIES</div>
          <h2 className="hero-display" style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Inbox size={24} color="var(--primary)" />
            CONVERSATION COMMAND
          </h2>
        </div>
        <div className="glass-card" style={{ padding: '8px 16px', background: 'rgba(158, 202, 255, 0.05)', border: '1px solid rgba(158, 202, 255, 0.1)' }}>
          <span style={{ fontSize: '10px', color: 'var(--on-surface-variant)', letterSpacing: '0.1em' }}>PENDING ACTIONS: </span>
          <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{pendingReplies.length}</span>
        </div>
      </header>

      {pendingReplies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 0', opacity: 0.5 }}>
          <Mail size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
          <div className="font-headline" style={{ color: 'var(--on-surface-variant)' }}>ALL CLEAR // NO PENDING REPLIES</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {pendingReplies.map((reply) => (
            <div key={reply.id} className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={16} color="rgba(255,255,255,0.4)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', color: '#fff', fontSize: '14px' }}>{reply.leadName.toUpperCase()}</div>
                    <div style={{ fontSize: '10px', color: 'var(--on-surface-variant)', opacity: 0.6 }}>RECEIVED {reply.timestamp.toUpperCase()}</div>
                  </div>
                </div>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  background: `${getIntentColor(reply.intent)}10`, 
                  border: `1px solid ${getIntentColor(reply.intent)}30`,
                  color: getIntentColor(reply.intent),
                  fontSize: '10px',
                  fontWeight: '800',
                  letterSpacing: '0.05em'
                }}>
                  {getIntentIcon(reply.intent)}
                  {reply.intent.toUpperCase()}
                </div>
              </div>

              <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', lineHeight: '1.5', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>

                "{reply.content}"
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: '9px', color: 'var(--primary)', letterSpacing: '0.1em', marginBottom: '8px' }}>AI_SUGGESTED_RESPONSE</div>
                {editingId === reply.id ? (
                  <textarea 
                    className="glass-input"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={{ width: '100%', height: '120px', fontSize: '12px', padding: '16px', background: 'rgba(255,255,255,0.03)' }}
                  />
                ) : (
                  <div style={{ padding: '16px', background: 'rgba(158, 202, 255, 0.03)', borderRadius: '8px', border: '1px dashed rgba(158, 202, 255, 0.2)', fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
                    {reply.aiDraft}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button className="glass-btn-secondary" style={{ padding: '8px 16px', color: '#ff4b4b' }} onClick={() => onIgnore(reply.id)}>
                  <XCircle size={14} style={{ marginRight: '8px' }} /> IGNORE
                </button>
                {editingId === reply.id ? (
                  <button className="glass-btn-primary" onClick={() => { onEdit(reply.id, editContent); setEditingId(null); }}>
                    SAVE DRAFT
                  </button>
                ) : (
                  <button className="glass-btn-secondary" onClick={() => { setEditingId(reply.id); setEditContent(reply.aiDraft); }}>
                    <Edit3 size={14} style={{ marginRight: '8px' }} /> EDIT
                  </button>
                )}
                <button className="glass-btn-primary" style={{ padding: '8px 20px' }} onClick={() => onApprove(reply.id)}>
                  <Send size={14} style={{ marginRight: '8px' }} /> APPROVE & SEND
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
