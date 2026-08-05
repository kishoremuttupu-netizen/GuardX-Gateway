import React, { useState } from 'react';
import { Eye, Copy, Check, ShieldCheck, ShieldAlert, Sparkles, HelpCircle, Info } from 'lucide-react';

export default function LiveOutputPanel({ scanResult, isLoading }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('sanitized'); // 'sanitized' | 'original'
  const [activeTooltip, setActiveTooltip] = useState(null);

  if (!scanResult && !isLoading) {
    return (
      <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0,240,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1px dashed rgba(0,240,255,0.2)' }}>
          <Sparkles size={28} className="text-cyan" />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>GuardX Live Visualizer</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '320px' }}>
          Select a scenario or paste custom text to view real-time side-by-side sanitization diff and interactive tooltips.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    if (!scanResult) return;
    const textToCopy = activeTab === 'sanitized' ? scanResult.sanitized_text : scanResult.original_text;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper map for redaction detail lookup
  const getRedactionInfo = (tag) => {
    if (!scanResult || !scanResult.redaction_details) return null;
    return scanResult.redaction_details.find(d => d.tag === tag) || {
      type: tag.replace('[REDACTED_', '').replace(']', ''),
      reason: 'Identified sensitive personal or credential pattern',
      original_value: 'Hidden by GuardX Shield'
    };
  };

  // Render text with Interactive Hover Tooltips over redacted elements
  const renderInteractiveSanitizedText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\[REDACTED_[A-Z_]+\])/g);

    return parts.map((part, index) => {
      if (part.startsWith('[REDACTED_') && part.endsWith(']')) {
        const info = getRedactionInfo(part);
        const isHovered = activeTooltip === index;

        return (
          <span
            key={index}
            style={{ position: 'relative', display: 'inline-block', cursor: 'pointer', margin: '0 2px' }}
            onMouseEnter={() => setActiveTooltip(index)}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <span className="redacted-highlight" style={{
              background: isHovered ? 'rgba(0, 240, 255, 0.25)' : 'rgba(255, 51, 102, 0.25)',
              color: isHovered ? 'var(--cyan-neon)' : '#ff85a2',
              borderColor: isHovered ? 'var(--cyan-neon)' : 'rgba(255, 51, 102, 0.6)',
              boxShadow: isHovered ? '0 0 12px rgba(0, 240, 255, 0.5)' : 'none',
              transition: 'all 0.2s ease'
            }}>
              {part}
            </span>

            {/* Interactive Tooltip Card */}
            {isHovered && (
              <div style={{
                position: 'absolute',
                bottom: '125%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '280px',
                background: '#0a101d',
                border: '1px solid var(--cyan-neon)',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 10px 30px rgba(0, 240, 255, 0.3)',
                zIndex: 100,
                pointerEvents: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                color: 'var(--text-main)',
                lineHeight: '1.4'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', pb: '6px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 800, color: 'var(--cyan-neon)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} /> GUARDX REDACTION
                  </span>
                  <span className="bg-cyan-tag" style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px' }}>
                    {info?.type || 'PII'}
                  </span>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Why it was hidden:</strong>
                  <div style={{ color: 'var(--text-main)', marginTop: '2px' }}>{info?.reason}</div>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>Masked Value:</strong>
                  <div className="font-mono text-emerald" style={{ fontSize: '0.75rem', marginTop: '2px', wordBreak: 'break-all' }}>
                    {info?.original_value || 'Confidential Data'}
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid var(--cyan-neon)' }} />
              </div>
            )}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {isLoading && <div className="scanner-beam" />}

      {/* Header Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px' }}>
          <button
            onClick={() => setActiveTab('sanitized')}
            style={{
              background: activeTab === 'sanitized' ? 'rgba(0, 255, 157, 0.15)' : 'transparent',
              color: activeTab === 'sanitized' ? 'var(--emerald-neon)' : 'var(--text-muted)',
              border: activeTab === 'sanitized' ? '1px solid rgba(0, 255, 157, 0.3)' : 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <ShieldCheck size={14} /> Sanitized & Masked
          </button>
          <button
            onClick={() => setActiveTab('original')}
            style={{
              background: activeTab === 'original' ? 'rgba(255, 51, 102, 0.15)' : 'transparent',
              color: activeTab === 'original' ? 'var(--crimson-neon)' : 'var(--text-muted)',
              border: activeTab === 'original' ? '1px solid rgba(255, 51, 102, 0.3)' : 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Eye size={14} /> Raw Unsanitized
          </button>
        </div>

        {scanResult && (
          <button onClick={handleCopy} className="btn-secondary" style={{ fontSize: '0.78rem', padding: '5px 10px' }}>
            {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
        )}
      </div>

      {/* Visualizer Helper Tip */}
      <div style={{ fontSize: '0.74rem', color: 'var(--cyan-neon)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Info size={13} /> Hover over any <span className="redacted-highlight" style={{ fontSize: '0.7rem', padding: '1px 4px' }}>[REDACTED]</span> badge below for GuardX redaction details.
      </div>

      {/* Output Content Display */}
      <div
        className="font-mono"
        style={{
          flexGrow: 1,
          minHeight: '220px',
          background: 'rgba(4, 7, 13, 0.85)',
          border: '1px solid var(--border-glass)',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '0.88rem',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowY: 'auto',
          maxHeight: '350px'
        }}
      >
        {isLoading ? (
          <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="text-cyan">⚡ GuardX Threat & PII Inspection in Progress...</span>
          </div>
        ) : scanResult ? (
          activeTab === 'sanitized' ? (
            renderInteractiveSanitizedText(scanResult.sanitized_text)
          ) : (
            <span style={{ color: '#ffb3c1' }}>{scanResult.original_text}</span>
          )
        ) : null}
      </div>

      {/* Redaction Details List */}
      {scanResult && scanResult.redaction_details && scanResult.redaction_details.length > 0 && (
        <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-glass)', pt: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Redaction Inventory ({scanResult.redaction_details.length} masked):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '60px', overflowY: 'auto' }}>
            {scanResult.redaction_details.map((detail, idx) => (
              <span key={idx} className="bg-cyan-tag" style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                🔒 <strong>{detail.type}</strong>: {detail.reason}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
