import { useState } from 'react';
import { Sparkles, Link, ExternalLink, Activity, Archive, ThumbsDown, CheckCircle2, Send, Users, Calendar, Mail } from 'lucide-react';
import { ComponentPreviewModal } from './ComponentPreviewModal';
import { populateTemplate } from '../services/templateService';


import type { Lead } from '../types';

interface LeadIntelligenceTableProps {

  leads: Lead[];
  archivedLeads: Lead[];
  externalShowFull?: boolean;
  onCloseFull?: () => void;
  onMoveToArchive: (leadId: string, reason: 'unresponsive' | 'notInterested') => void;
  onUpdateOutreach: (leadId: string, stage: number) => void;
}

export function LeadIntelligenceTable({ 
  leads, 
  archivedLeads, 
  externalShowFull, 
  onCloseFull,
  onMoveToArchive,
  onUpdateOutreach
}: LeadIntelligenceTableProps) {
  const [activeModalLead, setActiveModalLead] = useState<Lead | null>(null);
  const [previewingLead, setPreviewingLead] = useState<Lead | null>(null);

  const [viewLimit, setViewLimit] = useState<number>(10);
  const [currentTab, setCurrentTab] = useState<'active' | 'archived'>('active');

  const displayLeads = (currentTab === 'active' ? leads : archivedLeads).slice(0, viewLimit);

  // Stats calculation
  const totalSent = leads.reduce((acc, l) => acc + (l.outreachStage || 0), 0);
  const totalLeads = leads.length + archivedLeads.length;
  const activeConversations = leads.filter(l => l.outreachStage > 0).length;

  const renderOutreachTracker = (lead: any) => (
    <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((stage) => (
        <button
          key={stage}
          onClick={() => onUpdateOutreach(lead.id, stage)}
          title={`Touch ${stage}`}
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '4px',
            border: '1px solid',
            borderColor: lead.outreachStage >= stage ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
            background: lead.outreachStage >= stage ? 'rgba(158, 202, 255, 0.2)' : 'transparent',
            color: lead.outreachStage >= stage ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
            fontSize: '9px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {lead.outreachStage >= stage ? <CheckCircle2 size={10} /> : stage}
        </button>
      ))}
    </div>
  );

  const renderTable = (data: any[], isFullView = false) => (
    <div className="glass-table-container" style={{ maxHeight: isFullView ? '70vh' : 'none', overflowY: isFullView ? 'auto' : 'visible' }}>
      <table className="glass-table">
        <thead>
          <tr>
            <th className="font-headline">Company Name</th>
            <th className="font-headline">Campaign Status</th>
            <th className="font-headline">AI Fit Score</th>
            <th className="font-headline" style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                No records found. // SCANNING...
              </td>
            </tr>
          ) : (
            data.map((lead) => (
              <tr key={lead.id} style={{ opacity: currentTab === 'archived' ? 0.7 : 1 }}>
                <td>
                  <div style={{ fontWeight: '700', marginBottom: '4px', color: '#fff', fontSize: '14px' }}>{lead.name.toUpperCase()}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--on-surface-variant)', opacity: 0.7 }}>
                    <Link size={10} /> {lead.website}
                  </div>
                  {lead.status === 'ARCHIVED' && (
                    <div style={{ fontSize: '10px', color: '#ff4b4b', fontWeight: '800', marginTop: '6px', letterSpacing: '0.1em' }}>
                      ARCHIVED // {lead.archiveReason?.toUpperCase()}
                    </div>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--on-surface-variant)', letterSpacing: '0.05em' }}>
                      {lead.outreachStage === 8 ? 'CAMPAIGN COMPLETE' : `TOUCH ${lead.outreachStage} OF 8`}
                    </div>
                    {renderOutreachTracker(lead)}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      padding: '4px 10px', 
                      borderRadius: '6px', 
                      background: lead.score > 90 ? 'rgba(158, 202, 255, 0.1)' : 'rgba(255, 214, 10, 0.05)',
                      border: `1px solid ${lead.score > 90 ? 'var(--primary)' : 'rgba(255, 214, 10, 0.2)'}`,
                      color: lead.score > 90 ? 'var(--primary)' : '#ffd60a',
                      fontWeight: '700',
                      fontSize: '12px',
                      fontFamily: 'Space Grotesk'
                    }}>
                      <Sparkles size={12} fill="currentColor" />
                      {lead.score}%
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {currentTab === 'active' ? (
                      <>
                        <button 
                          className="glass-btn-primary" 
                          title="Preview Next Message"
                          style={{ padding: '8px 12px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
                          onClick={() => setPreviewingLead(lead)}
                        >
                          <Send size={14} /> SEND TOUCH {Math.min(lead.outreachStage + 1, 8)}
                        </button>
                        <button 
                          className="glass-btn-secondary" 
                          title="Not Interested"
                          style={{ padding: '8px', borderRadius: '8px', color: '#ff4b4b' }}
                          onClick={() => onMoveToArchive(lead.id, 'notInterested')}
                        >
                          <ThumbsDown size={14} />
                        </button>
                        <button 
                          className="glass-btn-secondary" 
                          title="Archive (Non-responsive)"
                          style={{ padding: '8px', borderRadius: '8px', opacity: lead.outreachStage >= 8 ? 1 : 0.4 }}
                          onClick={() => onMoveToArchive(lead.id, 'unresponsive')}
                        >
                          <Archive size={14} />
                        </button>
                      </>
                    ) : (
                      <div style={{ fontSize: '10px', color: 'var(--on-surface-variant)' }}>
                        NO FURTHER ACTIONS
                      </div>
                    )}
                    <button 
                      className="glass-btn-secondary" 
                      style={{ padding: '8px', borderRadius: '8px' }}
                      onClick={() => setActiveModalLead(lead)}
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {/* Campaign Stats Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
        {[
          { label: 'TOTAL LEADS', value: totalLeads, icon: Users, color: 'var(--primary)' },
          { label: 'ACTIVE CAMPAIGNS', value: activeConversations, icon: Activity, color: '#00d4ff' },
          { label: 'TOTAL TOUCHES', value: totalSent, icon: Send, color: '#7000ff' },
          { label: 'MEETINGS BOOKED', value: '4', icon: Calendar, color: '#ffd60a' },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${stat.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={20} color={stat.color} />
            </div>

            <div>
              <div style={{ fontSize: '10px', color: 'var(--on-surface-variant)', letterSpacing: '0.1em' }}>{stat.label}</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <section className="glass-card" style={{ padding: '32px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
        <div className="hud-corner-tl"></div>
        <div className="hud-corner-br"></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <h3 className="font-headline text-lg font-bold" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', letterSpacing: '0.05em' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(158, 202, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={18} color="var(--primary)" />
              </div>
              PROSPECT INTELLIGENCE
            </h3>

            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <button 
                onClick={() => setCurrentTab('active')}
                style={{
                  padding: '6px 16px',
                  borderRadius: '8px',
                  fontSize: '10px',
                  fontWeight: '700',
                  letterSpacing: '0.05em',
                  background: currentTab === 'active' ? 'rgba(158, 202, 255, 0.1)' : 'transparent',
                  color: currentTab === 'active' ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                ACTIVE LEADS ({leads.length})
              </button>
              <button 
                onClick={() => setCurrentTab('archived')}
                style={{
                  padding: '6px 16px',
                  borderRadius: '8px',
                  fontSize: '10px',
                  fontWeight: '700',
                  letterSpacing: '0.05em',
                  background: currentTab === 'archived' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  color: currentTab === 'archived' ? '#fff' : 'rgba(255,255,255,0.4)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                ARCHIVES ({archivedLeads.length})
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label className="font-headline" style={{ fontSize: '10px', color: 'var(--on-surface-variant)', opacity: 0.6, letterSpacing: '0.1em' }}>VIEW LIMIT:</label>
              <select 
                className="glass-input" 
                value={viewLimit}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'all') {
                    setViewLimit(9999);
                  } else {
                    setViewLimit(parseInt(val));
                    onCloseFull?.();
                  }
                }}
                style={{ padding: '4px 8px', fontSize: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <option value={10}>10 RECORDS</option>
                <option value={25}>25 RECORDS</option>
                <option value="all">SHOW ALL</option>
              </select>
            </div>
          </div>
        </div>

        {renderTable(displayLeads)}
      </section>

      {/* Message Preview Modal */}
      {previewingLead && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 200, 
          background: 'rgba(6, 20, 35, 0.8)', 
          backdropFilter: 'blur(15px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '40px', position: 'relative' }}>
            <div className="hud-corner-tl"></div>
            <div className="hud-corner-br"></div>
            
            <header style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '10px', color: 'var(--primary)', letterSpacing: '0.2em', marginBottom: '8px' }}>MESSAGING_UPLINK // TOUCH {Math.min(previewingLead.outreachStage + 1, 8)}</div>
              <h2 className="hero-display" style={{ fontSize: '20px' }}>PREVIEW OUTREACH</h2>
            </header>

            {(() => {
              const nextStage = Math.min(previewingLead.outreachStage + 1, 8);
              const template = populateTemplate(nextStage, previewingLead);
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '9px', color: 'var(--on-surface-variant)', letterSpacing: '0.1em' }}>EMAIL SUBJECT</label>
                    <div className="glass-input" style={{ marginTop: '8px', padding: '12px', fontSize: '13px', color: '#fff' }}>{template.subject}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '9px', color: 'var(--on-surface-variant)', letterSpacing: '0.1em' }}>MESSAGE BODY</label>
                    <textarea 
                      readOnly 
                      className="glass-input" 
                      style={{ marginTop: '8px', width: '100%', height: '250px', fontSize: '12px', lineHeight: '1.6', background: 'rgba(255,255,255,0.02)' }}
                      value={template.body}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button 
                      className="glass-btn-secondary" 
                      onClick={() => setPreviewingLead(null)}
                      style={{ flex: 1 }}
                    >
                      CANCEL
                    </button>
                    <button 
                      className="glass-btn-primary" 
                      onClick={() => {
                        onUpdateOutreach(previewingLead.id, nextStage);
                        setPreviewingLead(null);
                      }}
                      style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <Mail size={16} /> TRIGGER SEND VIA n8n
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {(externalShowFull || viewLimit === 9999) && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 100, 
          background: 'rgba(6, 20, 35, 0.8)', 
          backdropFilter: 'blur(20px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '40px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '1200px', maxHeight: '90vh', padding: '40px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div className="hud-corner-tl"></div>
            <div className="hud-corner-br"></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 className="hero-display" style={{ fontSize: '24px' }}>FULL DATABASE // {currentTab.toUpperCase()}</h2>
              <button 
                className="glass-btn-secondary" 
                onClick={() => {
                  onCloseFull?.();
                  setViewLimit(10);
                }}
                style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>
            
            {renderTable(currentTab === 'active' ? leads : archivedLeads, true)}
          </div>
        </div>
      )}

      {activeModalLead && (
        <ComponentPreviewModal 
          lead={activeModalLead} 
          onClose={() => setActiveModalLead(null)} 
        />
      )}
    </>
  );
}

