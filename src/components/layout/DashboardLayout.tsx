import React from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onShowLeads?: () => void;
  activeView: 'DASHBOARD' | 'INBOX';
  onViewChange: (view: 'DASHBOARD' | 'INBOX') => void;
}

export function DashboardLayout({ children, onShowLeads, activeView, onViewChange }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        onShowLeads={onShowLeads} 
        activeView={activeView} 
        onViewChange={onViewChange} 
      />

      <main className="main-content" style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {children}
      </main>
    </div>
  );
}
