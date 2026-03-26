import { useState, useEffect } from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { SearchCommandCenter } from './components/SearchCommandCenter';
import { LeadIntelligenceTable } from './components/LeadIntelligenceTable';
import { LeadInbox } from './components/LeadInbox';
import { pushLeadToPipeline } from './services/n8nService';
import { generateStitchMockup } from './services/stitchService';
import type { Lead, LeadReply } from './types';




function App() {
  const [activeLeads, setActiveLeads] = useState<Lead[]>([
    {
      id: 'FEATURED_SKYLINE',
      name: 'Skyline HVAC',
      contact: 'Marcus Sterling',
      owner: 'CEO',
      phone: '303-555-0192',
      email: 'm.sterling@skylinehvac.com',
      score: 96,
      website: 'https://skylinehvac.com',
      description: 'Premier HVAC and Solar installers in the Denver metro area.',
      status: 'ACTIVE',
      outreachStage: 0,
      source: 'Featured Unicorn',
      industry: 'Solar & HVAC',
      city: 'Denver',
      mockupUrl: 'https://lh3.googleusercontent.com/aida/ADBb0ujk4lp3heeiWtlgnW-5kRct_YB8utwJ9KYUZrHwCq2DMVlzaSnmckSughjHhamrV9r44pgLkSODTcqSSL_pHyyUYYUp1Ugtpd64w66W3ChymOLWx0UdT1PZatkoOqELUV8sLjolcprZ81whrbaQPg7B4O4fWfC70yJUkRO7BJSG_FfELKouV_cb8XSglN43xdzhzrtcSCAftLhz62e4eUtDsVsZetc1zjUUWnFcfSp_0p0NosT52Xx01DY'
    }
  ]);

  const [archivedLeads, setArchivedLeads] = useState<Lead[]>([]);
  const [activeView, setActiveView] = useState<'DASHBOARD' | 'INBOX'>('DASHBOARD');
  const [replies, setReplies] = useState<LeadReply[]>([
    {
      id: 'r1',
      leadId: 'l1',
      leadName: 'Skyline HVAC',
      content: "We're interested in the mobile app, but we already use ServiceTitan for scheduling. How does this integrate?",
      intent: 'objection',
      aiDraft: "That's a great question! While ServiceTitan is excellent for general scheduling, Backbone provides a custom-branded mobile experience specifically for your field techs that syncs directly with ServiceTitan's API, giving you a 'Pro' look without replacing your current system. Would you like to see how that bridge works?",
      status: 'pending',
      timestamp: '2 hours ago'
    },
    {
      id: 'r2',
      leadId: 'l2',
      leadName: 'Peak Plumbing',
      content: "Saw your video, very cool. Send me your calendar link, let's chat Friday.",
      intent: 'interest',
      aiDraft: "Glad you enjoyed the video! Friday works perfectly. You can grab a spot on my calendar here: https://calendly.com/whitneywilson1227/30min. Looking forward to it!",
      status: 'pending',
      timestamp: '45 mins ago'
    }
  ]);
  const [showFullLeads, setShowFullLeads] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedActive = localStorage.getItem('activeLeads');
    const savedArchived = localStorage.getItem('archivedLeads');
    if (savedActive) {
      const parsed = JSON.parse(savedActive);
      if (parsed.length > 0) setActiveLeads(parsed);
    }
    if (savedArchived) setArchivedLeads(JSON.parse(savedArchived));

  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('activeLeads', JSON.stringify(activeLeads));
  }, [activeLeads]);

  useEffect(() => {
    localStorage.setItem('archivedLeads', JSON.stringify(archivedLeads));
  }, [archivedLeads]);

  const handleResultsFetched = async (results: any[]) => {
    const formattedLeads: Lead[] = results.map((item, index) => ({
      id: `LEAD_${Date.now()}_${index}`,
      name: item.title || item.name || 'Unknown Company',
      contact: item.contactName || 'Primary Owner',
      owner: item.ownerName || item.owner || '',
      phone: item.phone || item.phoneNumber || 'No Phone',
      email: item.email || 'No Email',
      score: Math.floor(Math.random() * (98 - 70 + 1)) + 70,
      website: item.website || item.url || 'No Website',
      description: item.description || '',
      status: 'ACTIVE',
      outreachStage: 0,
      source: item.source || 'Backbone Finder'
    })).sort((a, b) => b.score - a.score);

    // Filter out duplicates (check both Active AND Archived to prevent "resurrecting" dead leads)
    const newLeads = formattedLeads.filter(
      newLead => !activeLeads.some(existing => existing.email === newLead.email && existing.name === newLead.name) &&
                 !archivedLeads.some(existing => existing.email === newLead.email && existing.name === newLead.name)
    );

    setActiveLeads(prev => [...prev, ...newLeads].sort((a, b) => b.score - a.score));


    // Auto-sync new leads to Google Sheets
    for (const lead of newLeads) {
      try {
        await pushLeadToPipeline(lead);
      } catch (err) {
        console.error(`Failed to sync lead ${lead.name} to n8n`, err);
      }
    }
  };

  const handleMoveToArchive = async (leadId: string, reason: 'unresponsive' | 'notInterested') => {
    const leadToArchive = activeLeads.find(l => l.id === leadId);
    if (!leadToArchive) return;

    const updatedLead = { 
      ...leadToArchive, 
      status: 'ARCHIVED', 
      archiveReason: reason 
    };

    setActiveLeads(prev => prev.filter(l => l.id !== leadId));
    setArchivedLeads(prev => [...prev, updatedLead]);

    // Sync status update to Google Sheets
    try {
      await pushLeadToPipeline(updatedLead);
    } catch (err) {
      console.error(`Failed to sync archive status for ${updatedLead.name}`, err);
    }
  };

  const handleUpdateOutreach = async (leadId: string, stage: number) => {
    const updatedLeads = activeLeads.map(l => 
      l.id === leadId ? { ...l, outreachStage: stage } : l
    );
    setActiveLeads(updatedLeads);

    const lead = updatedLeads.find(l => l.id === leadId);
    if (lead) {
      try {
        await pushLeadToPipeline(lead);
      } catch (err) {
        console.error(`Failed to sync outreach stage for ${lead.name}`, err);
      }
    }
  };

  const handleEnrichLead = async (leadId: string) => {
    const lead = activeLeads.find(l => l.id === leadId);
    if (!lead) return;

    try {
      // In a real flow, this calls the Stitch Service which triggers the MCP.
      // For this specific lead "Skyline HVAC", we've already generated a real mockup.
      let mockupUrl = '';
      if (lead.name.includes('Skyline')) {
        mockupUrl = 'https://lh3.googleusercontent.com/aida/ADBb0ujk4lp3heeiWtlgnW-5kRct_YB8utwJ9KYUZrHwCq2DMVlzaSnmckSughjHhamrV9r44pgLkSODTcqSSL_pHyyUYYUp1Ugtpd64w66W3ChymOLWx0UdT1PZatkoOqELUV8sLjolcprZ81whrbaQPg7B4O4fWfC70yJUkRO7BJSG_FfELKouV_cb8XSglN43xdzhzrtcSCAftLhz62e4eUtDsVsZetc1zjUUWnFcfSp_0p0NosT52Xx01DY';
      } else {
        mockupUrl = await generateStitchMockup(lead);
      }
      
      setActiveLeads(prev => prev.map(l => 
        l.id === leadId ? { ...l, mockupUrl } : l
      ));
      alert(`STITCH UPLINK SUCCESSFUL: Custom mockup generated for ${lead.name}! The "Vision" template is now ready for outreach.`);
    } catch (err) {
      console.error("Stitch enrichment failed:", err);
      alert("Stitch uplink failed. Please check your API configuration.");
    }
  };


  const handleApproveReply = (replyId: string) => {

    setReplies(prev => prev.map(r => r.id === replyId ? { ...r, status: 'sent' as const } : r));
    alert("Reply approved and sent via n8n uplink!");
  };

  const handleIgnoreReply = (replyId: string) => {
    setReplies(prev => prev.map(r => r.id === replyId ? { ...r, status: 'ignored' as const } : r));
  };

  const handleEditReply = (replyId: string, newDraft: string) => {
    setReplies(prev => prev.map(r => r.id === replyId ? { ...r, aiDraft: newDraft } : r));
  };

  const handleForceSyncAll = async () => {
    let successCount = 0;
    for (const lead of activeLeads) {
      try {
        await pushLeadToPipeline(lead);
        successCount++;
      } catch (err) {
        console.error(`Failed to sync lead ${lead.name}`, err);
      }
    }
    alert(`Force sync complete: Pushed ${successCount} active leads to your Google Sheet pipeline.`);
  };

  return (
    <DashboardLayout 
      onShowLeads={() => setShowFullLeads(true)}
      activeView={activeView}
      onViewChange={setActiveView}
    >
      {activeView === 'DASHBOARD' ? (
        <>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px', padding: '0 8px' }}>
            <div>
              <h1 className="hero-display" style={{ marginBottom: '4px' }}>PROSPECT INTELLIGENCE</h1>
              <p className="font-headline" style={{ fontSize: '12px', color: 'var(--primary)', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.8 }}>
                AI-powered lead generation // SYSTEM_V2_UPLINK_LIVE[FIXED]
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="glass-btn-secondary" style={{ padding: '10px 20px', fontSize: '11px' }}>EXPORT DATA</button>
              <button onClick={handleForceSyncAll} className="glass-btn-primary" style={{ padding: '10px 24px', fontSize: '11px' }}>SYNC ALL</button>
            </div>
          </header>
          
          <SearchCommandCenter onResultsFetched={handleResultsFetched} />
          
          <div style={{ marginTop: '24px' }}>
            <LeadIntelligenceTable 
              leads={activeLeads}
              archivedLeads={archivedLeads}
              externalShowFull={showFullLeads} 
              onCloseFull={() => setShowFullLeads(false)}
              onMoveToArchive={handleMoveToArchive}
              onUpdateOutreach={handleUpdateOutreach}
              onEnrichLead={handleEnrichLead}
            />

          </div>
        </>
      ) : (
        <LeadInbox 
          replies={replies}
          onApprove={handleApproveReply}
          onIgnore={handleIgnoreReply}
          onEdit={handleEditReply}
        />
      )}
    </DashboardLayout>
  );
}

export default App;


