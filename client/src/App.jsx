import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DemoPresets from './components/DemoPresets';
import InputTerminal from './components/InputTerminal';
import LiveOutputPanel from './components/LiveOutputPanel';
import TrustCard from './components/TrustCard';
import PrivacyControls from './components/PrivacyControls';
import AuditLogModal from './components/AuditLogModal';
import LoginPage from './components/LoginPage';
import DeepfakeInspector from './components/DeepfakeInspector';
import DeepfakeFaceScanner from './components/DeepfakeFaceScanner';
import ScamMessageDetector from './components/ScamMessageDetector';
import { Terminal, Eye, Film, ShieldAlert } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('scam'); // 'scam' | 'facescan' | 'deepfake' | 'prompt'



  // User Authentication state
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('guardx_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [text, setText] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zeroLogMode, setZeroLogMode] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Session history state
  const [history, setHistory] = useState(() => {
    try {
      const saved = sessionStorage.getItem('guardx_audit_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Calculate live stats
  const stats = history.reduce(
    (acc, item) => {
      acc.scanned += 1;
      acc.piiRedacted += item.redaction_details ? item.redaction_details.length : (item.detected_pii ? item.detected_pii.length : 0);
      acc.threatsBlocked += item.detected_threats ? item.detected_threats.length : 0;
      return acc;
    },
    { scanned: 0, piiRedacted: 0, threatsBlocked: 0 }
  );

  useEffect(() => {
    if (user) {
      localStorage.setItem('guardx_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('guardx_user');
    }
  }, [user]);

  useEffect(() => {
    if (!zeroLogMode) {
      sessionStorage.setItem('guardx_audit_history', JSON.stringify(history));
    } else {
      sessionStorage.removeItem('guardx_audit_history');
    }
  }, [history, zeroLogMode]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAnalyze = async (overrideText) => {
    const textToScan = typeof overrideText === 'string' ? overrideText : text;
    if (!textToScan.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/shield/analyze', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': user?.token ? `Bearer ${user.token}` : ''
        },
        body: JSON.stringify({
          text: textToScan,
          zeroLogMode,
          clientOnly: false,
          userEmail: user?.email || 'anonymous',
          userRole: user?.role || 'Analyst'
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      setScanResult(data);

      if (!zeroLogMode) {
        setHistory(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Scan execution error:', error);
      alert('Scanning request error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (presetContent) => {
    setText(presetContent);
    handleAnalyze(presetContent);
  };

  const handleClearHistory = () => {
    setHistory([]);
    sessionStorage.removeItem('guardx_audit_history');
  };

  const handleExportAuditLog = () => {
    if (history.length === 0) return;
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guardx_audit_log_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // If user is not authenticated, render LoginPage
  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 20px 40px 20px' }}>
      
      {/* Header Bar */}
      <Header
        stats={stats}
        zeroLogMode={zeroLogMode}
        setZeroLogMode={setZeroLogMode}
        onOpenAuditLog={() => setIsAuditModalOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Section Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid #E4E4E7', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveSection('scam')}
          style={{
            background: activeSection === 'scam' ? 'rgba(37, 99, 235, 0.1)' : '#FAFAFA',
            border: activeSection === 'scam' ? '1px solid #2563EB' : '1px solid #E4E4E7',
            color: activeSection === 'scam' ? '#2563EB' : '#52525B',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ShieldAlert style={{ width: '18px', height: '18px' }} />
          AI Scam Message Detector 🛡️
        </button>

        <button
          onClick={() => setActiveSection('facescan')}
          style={{
            background: activeSection === 'facescan' ? 'rgba(37, 99, 235, 0.1)' : '#FAFAFA',
            border: activeSection === 'facescan' ? '1px solid #2563EB' : '1px solid #E4E4E7',
            color: activeSection === 'facescan' ? '#2563EB' : '#52525B',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Film style={{ width: '18px', height: '18px' }} />
          Deepfake Face Scanner 🎭
        </button>

        <button
          onClick={() => setActiveSection('deepfake')}
          style={{
            background: activeSection === 'deepfake' ? 'rgba(37, 99, 235, 0.1)' : '#FAFAFA',
            border: activeSection === 'deepfake' ? '1px solid #2563EB' : '1px solid #E4E4E7',
            color: activeSection === 'deepfake' ? '#2563EB' : '#52525B',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Eye style={{ width: '18px', height: '18px' }} />
          Image & Media Inspector
        </button>

        <button
          onClick={() => setActiveSection('prompt')}
          style={{
            background: activeSection === 'prompt' ? 'rgba(37, 99, 235, 0.1)' : '#FAFAFA',
            border: activeSection === 'prompt' ? '1px solid #2563EB' : '1px solid #E4E4E7',
            color: activeSection === 'prompt' ? '#2563EB' : '#52525B',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Terminal style={{ width: '18px', height: '18px' }} />
          AI Prompt Security Gateway
        </button>
      </div>

      {activeSection === 'scam' ? (
        <ScamMessageDetector onScanComplete={(data) => {
          setHistory(prev => [data, ...prev]);
        }} />
      ) : activeSection === 'facescan' ? (
        <DeepfakeFaceScanner onScanComplete={(data) => {
          setHistory(prev => [data, ...prev]);
        }} />
      ) : activeSection === 'deepfake' ? (
        <DeepfakeInspector onScanComplete={(data) => {
          setHistory(prev => [data, ...prev]);
        }} />
      ) : (


        <>
          {/* Judge Mode Attack Simulator */}
          <DemoPresets onSelectPreset={handleSelectPreset} />

          {/* Main Scanner Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.1fr) minmax(320px, 1.1fr) minmax(280px, 0.8fr)',
            gap: '20px',
            alignItems: 'stretch'
          }}>
            <InputTerminal
              text={text}
              setText={setText}
              onAnalyze={() => handleAnalyze()}
              isLoading={isLoading}
            />
            <LiveOutputPanel
              scanResult={scanResult}
              isLoading={isLoading}
            />
            <TrustCard
              scanResult={scanResult}
              isLoading={isLoading}
            />
          </div>
        </>
      )}


      {/* Data Governance & Privacy Controls */}
      <PrivacyControls
        zeroLogMode={zeroLogMode}
        setZeroLogMode={setZeroLogMode}
        onClearHistory={handleClearHistory}
        historyCount={history.length}
        onExportAuditLog={handleExportAuditLog}
      />

      {/* Audit Log Modal */}
      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onExportAuditLog={handleExportAuditLog}
      />

      {/* Footer */}
      <footer style={{ marginTop: '40px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
        GuardX • AI Security, Privacy & Trust Gateway • Authenticated Analyst Session ({user.email})
      </footer>

    </div>
  );
}
