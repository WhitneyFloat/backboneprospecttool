import { LayoutDashboard, Users, Zap, Settings, Database, FileText, Inbox } from 'lucide-react';

interface SidebarProps {
  onShowLeads?: () => void;
  activeView: 'DASHBOARD' | 'INBOX';
  onViewChange: (view: 'DASHBOARD' | 'INBOX') => void;
}

export function Sidebar({ onShowLeads, activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="glass-card" style={{ width: '280px', margin: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px', height: 'calc(100vh - 32px)', position: 'sticky', top: '16px', borderRadius: '16px' }}>
      <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="logo-placeholder" style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '10px', 
          background: 'linear-gradient(135deg, var(--primary), var(--primary-container))', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--on-primary-container)',
          boxShadow: '0 0 15px rgba(158, 202, 255, 0.3)'
        }}>
          <Zap size={20} fill="currentColor" />
        </div>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0, letterSpacing: '0.05em', color: '#fff' }}>BACKBONE</h3>
          <p style={{ fontSize: '10px', margin: 0, opacity: 0.6, letterSpacing: '0.1em' }}>PROSPECT FINDER</p>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <NavItem 
          icon={<LayoutDashboard size={18} />} 
          label="Overview" 
          active={activeView === 'DASHBOARD'} 
          onClick={() => onViewChange('DASHBOARD')}
        />
        <NavItem 
          icon={<Inbox size={18} />} 
          label="Replies" 
          active={activeView === 'INBOX'} 
          onClick={() => onViewChange('INBOX')}
        />
        <NavItem 
          icon={<Users size={18} />} 
          label="Leads" 
          onClick={(e) => {
            e.preventDefault();
            onShowLeads?.();
          }} 
        />
        <NavItem icon={<Zap size={18} />} label="Campaigns" />
        <NavItem icon={<Database size={18} />} label="Network" />
        <NavItem icon={<FileText size={18} />} label="Archives" />
        <NavItem icon={<Settings size={18} />} label="Settings" />
      </nav>

      
      <div style={{ marginTop: 'auto' }}>
        <div className="glass-card" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(158, 202, 255, 0.05)', border: '1px solid rgba(158, 202, 255, 0.1)' }}>
          <p className="font-headline" style={{ fontSize: '10px', marginBottom: '8px', color: 'var(--primary)', letterSpacing: '0.1em' }}>CORE ENGINE STATUS</p>
          <div style={{ background: 'rgba(255,255,255,0.05)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
            <div className="animate-pulse" style={{ width: '75%', background: 'var(--primary)', height: '100%', boxShadow: '0 0 8px var(--primary)' }}></div>
          </div>
          <p style={{ fontSize: '9px', marginTop: '8px', textAlign: 'right', opacity: 0.5 }}>ACTIVE NODES: 12</p>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: (e: React.MouseEvent) => void }) {
  return (
    <a href="#" onClick={onClick} className={`nav-item ${active ? 'active' : ''}`} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      color: active ? '#fff' : 'var(--on-surface-variant)',
      textDecoration: 'none',
      fontSize: '11px',
      fontWeight: active ? '700' : '500',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      background: active ? 'rgba(158, 202, 255, 0.15)' : 'transparent',
      borderRight: active ? '2px solid var(--primary)' : '2px solid transparent',
      transition: 'all 0.3s ease',
      fontFamily: 'Space Grotesk'
    }}>
      {icon}
      <span>{label}</span>
    </a>
  );
}

