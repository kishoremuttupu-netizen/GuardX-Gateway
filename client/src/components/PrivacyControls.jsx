import React from 'react';
import { Lock, HardDrive, Trash2, Download, ShieldCheck, UserCheck } from 'lucide-react';

export default function PrivacyControls({ zeroLogMode, setZeroLogMode, onClearHistory, historyCount, onExportAuditLog }) {
  return (
    <div className="glass-panel" style={{ padding: '20px', marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} className="text-emerald" />
          <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.5px' }}>
            DATA GOVERNANCE & ETHICAL PRIVACY CONTROLS
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          User-Controlled Data Governance
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        
        {/* Zero-Log Memory Mode */}
        <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem' }}>
              <Lock size={16} className={zeroLogMode ? 'text-emerald' : 'text-muted'} /> Zero-Server Memory
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '42px', height: '22px' }}>
              <input
                type="checkbox"
                checked={zeroLogMode}
                onChange={(e) => setZeroLogMode(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: zeroLogMode ? 'var(--emerald-neon)' : 'rgba(255,255,255,0.2)',
                transition: '0.3s',
                borderRadius: '22px'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '16px',
                  width: '16px',
                  left: zeroLogMode ? '22px' : '3px',
                  bottom: '3px',
                  backgroundColor: '#040810',
                  transition: '0.3s',
                  borderRadius: '50%'
                }} />
              </span>
            </label>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            When enabled, prompts are analyzed strictly in-memory and instantly purged. Zero persistence on backend storage.
          </p>
        </div>

        {/* Local Session Retention */}
        <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem' }}>
              <HardDrive size={16} className="text-cyan" /> Local Audit History
            </div>
            <span className="font-mono text-cyan" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              {historyCount} items
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '10px' }}>
            Scan records stored locally in browser session storage for compliance auditing.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onClearHistory}
              disabled={historyCount === 0}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px', color: 'var(--crimson-neon)' }}
            >
              <Trash2 size={12} /> Purge Local Cache
            </button>
            <button
              onClick={onExportAuditLog}
              disabled={historyCount === 0}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              <Download size={12} /> Export Audit Log
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
