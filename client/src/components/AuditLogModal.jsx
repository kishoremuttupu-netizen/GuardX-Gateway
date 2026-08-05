import React, { useState } from 'react';
import { X, Download, ShieldCheck, ShieldAlert, FileText, Trash2, Calendar } from 'lucide-react';

export default function AuditLogModal({ isOpen, onClose, history, onClearHistory, onExportAuditLog }) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'PII' | 'THREAT'

  if (!isOpen) return null;

  const filteredHistory = history.filter(item => {
    if (filter === 'PII') return item.detected_pii && item.detected_pii.length > 0;
    if (filter === 'THREAT') return item.detected_threats && item.detected_threats.length > 0;
    return true;
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(3, 6, 12, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '850px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
      }}>
        
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText className="text-cyan" size={20} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>SECURITY & COMPLIANCE AUDIT LOG</h2>
            <span className="font-mono text-cyan" style={{ fontSize: '0.8rem' }}>({history.length} records)</span>
          </div>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '6px 8px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setFilter('ALL')}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px', background: filter === 'ALL' ? 'rgba(0,240,255,0.15)' : 'transparent', color: filter === 'ALL' ? 'var(--cyan-neon)' : 'var(--text-muted)' }}
            >
              All Scans ({history.length})
            </button>
            <button
              onClick={() => setFilter('PII')}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px', background: filter === 'PII' ? 'rgba(0,255,157,0.15)' : 'transparent', color: filter === 'PII' ? 'var(--emerald-neon)' : 'var(--text-muted)' }}
            >
              PII Redacted ({history.filter(h => h.detected_pii?.length > 0).length})
            </button>
            <button
              onClick={() => setFilter('THREAT')}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px', background: filter === 'THREAT' ? 'rgba(255,51,102,0.15)' : 'transparent', color: filter === 'THREAT' ? 'var(--crimson-neon)' : 'var(--text-muted)' }}
            >
              Threats Blocked ({history.filter(h => h.detected_threats?.length > 0).length})
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onExportAuditLog} disabled={history.length === 0} className="btn-primary" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
              <Download size={13} /> Export .JSON
            </button>
            <button onClick={onClearHistory} disabled={history.length === 0} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px', color: 'var(--crimson-neon)' }}>
              <Trash2 size={13} /> Clear
            </button>
          </div>
        </div>

        {/* Log List */}
        <div style={{ padding: '20px', overflowY: 'auto', flexGrow: 1 }}>
          {filteredHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No audit logs match selected filter criteria.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredHistory.map((item, index) => {
                const isHighRisk = item.threat_level === 'High' || item.threat_level === 'Critical';
                return (
                  <div key={index} style={{
                    background: 'rgba(6, 10, 18, 0.7)',
                    border: `1px solid ${isHighRisk ? 'rgba(255, 51, 102, 0.3)' : 'var(--border-glass)'}`,
                    borderRadius: '8px',
                    padding: '12px 16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className={isHighRisk ? 'bg-crimson-tag' : 'bg-emerald-tag'} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                          {item.threat_level.toUpperCase()} RISK
                        </span>
                        <span className="font-mono text-cyan" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                          Trust Score: {item.trust_score}/100
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> {new Date(item.timestamp).toLocaleTimeString()}
                      </div>
                    </div>

                    <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: '4px', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.sanitized_text}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', flexWrap: 'wrap' }}>
                      {item.detected_pii?.length > 0 && (
                        <span style={{ color: 'var(--emerald-neon)' }}>
                          🔒 {item.detected_pii.length} PII Masked
                        </span>
                      )}
                      {item.detected_threats?.length > 0 && (
                        <span style={{ color: 'var(--crimson-neon)' }}>
                          ⚠️ Threat: {item.detected_threats.map(t => t.name).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
