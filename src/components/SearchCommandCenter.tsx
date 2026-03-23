import { useState } from 'react';
import { Search, MapPin, Database, Briefcase, FileText, Loader2, Zap, Facebook } from 'lucide-react';
import { scrapeGoogleMaps, scrapeLinkedInProfiles, scrapeWebsiteContacts, scrapeYelp, scrapeFacebook } from '../services/apifyService';

interface SearchCommandCenterProps {
  onResultsFetched: (results: any[]) => void;
}

export function SearchCommandCenter({ onResultsFetched }: SearchCommandCenterProps) {
  const [query, setQuery] = useState('HVAC Denver');
  const [resultsCount, setResultsCount] = useState(25);
  const [activeSource, setActiveSource] = useState('maps');
  const [isScraping, setIsScraping] = useState(false);

  const sources = [
    { id: 'maps', label: 'Google Maps', icon: MapPin },
    { id: 'linkedin', label: 'LinkedIn', icon: Briefcase },
    { id: 'website', label: 'Website', icon: FileText },
    { id: 'yelp', label: 'Yelp', icon: Database },
    { id: 'facebook', label: 'Facebook', icon: Facebook },
    { id: 'licenses', label: 'State Licenses', icon: FileText },
  ];

  const handleStartScrape = async () => {
    setIsScraping(true);
    try {
      let results: any[] = [];
      if (activeSource === 'maps') {
        results = await scrapeGoogleMaps(query, resultsCount);
      } else if (activeSource === 'linkedin') {
        // LinkedIn Profile URL entry would ideally be another input, 
        // using query as a search term for now (or comma separated URLs)
        const urls = query.includes('http') ? query.split(',').map(u => u.trim()) : [];
        if (urls.length === 0) throw new Error('Please enter LinkedIn profile URLs separated by commas.');
        results = await scrapeLinkedInProfiles(urls);
      } else if (activeSource === 'website') {
        const urls = query.includes('http') ? query.split(',').map(u => u.trim()) : [];
        if (urls.length === 0) throw new Error('Please enter website URLs separated by commas.');
        results = await scrapeWebsiteContacts(urls);
      } else if (activeSource === 'yelp') {
        // Extract location from query if possible, or use a default
        const [searchTerm, location] = query.includes(' in ') ? query.split(' in ') : [query, 'USA'];
        results = await scrapeYelp(searchTerm.trim(), location.trim(), resultsCount);
      } else if (activeSource === 'facebook') {
        const queries = query.split(',').map(q => q.trim());
        results = await scrapeFacebook(queries, resultsCount);
      } else {
        // Other sources placeholder
        console.log(`Scraping from ${activeSource}...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        results = [];
      }
      onResultsFetched(results);
    } catch (error: any) {
      console.error("Scrape failed:", error);
      alert(error.message || "Scrape failed. Check console or .env configuration.");
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <section className="glass-card" style={{ padding: '32px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
      <div className="hud-corner-tl"></div>
      <div className="hud-corner-br"></div>
      
      <div style={{ position: 'absolute', top: '16px', right: '16px', opacity: 0.4 }} className="font-headline text-[10px] tracking-[0.2em] text-primary">
        PR_SCAN // 0xAF4
      </div>

      <h3 className="font-headline text-lg font-bold" style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', letterSpacing: '0.05em' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(158, 202, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Search size={18} color="var(--primary)" />
        </div>
        SEARCH COMMAND CENTER
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <label className="font-headline" style={{ display: 'block', marginBottom: '10px', color: 'var(--on-surface-variant)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {activeSource === 'maps' ? 'Search Query' : 'Target URLs (Comma Separated)'}
            </label>
            <input 
              type="text" 
              className="glass-input" 
              style={{ width: '100%' }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={activeSource === 'maps' ? "e.g. HVAC Denver" : "https://linkedin.com/in/user1, ..."}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label className="font-headline" style={{ color: 'var(--on-surface-variant)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Result Count</label>
              <span className="font-headline" style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '12px' }}>{resultsCount}</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={resultsCount}
              onChange={(e) => setResultsCount(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary)' }}
            />
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <label className="font-headline" style={{ display: 'block', marginBottom: '12px', color: 'var(--on-surface-variant)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Data Source</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {sources.map(source => (
                <button 
                  key={source.id}
                  onClick={() => setActiveSource(source.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '12px 8px',
                    borderRadius: '12px',
                    background: activeSource === source.id ? 'rgba(158, 202, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${activeSource === source.id ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)'}`,
                    color: activeSource === source.id ? '#fff' : 'var(--on-surface-variant)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <source.icon size={16} />
                  <span className="font-headline" style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '0.05em' }}>{source.label.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            className="glass-btn-primary" 
            onClick={handleStartScrape}
            disabled={isScraping}
            style={{ 
              marginTop: 'auto', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '16px',
              opacity: isScraping ? 0.7 : 1,
              cursor: isScraping ? 'not-allowed' : 'pointer',
              fontSize: '13px'
            }}
          >
            {isScraping ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                INITIALIZING...
              </>
            ) : (
              <>
                <Zap size={18} fill="currentColor" />
                INITIALIZE SCRAPE
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

