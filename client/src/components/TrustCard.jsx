import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Info, CheckCircle2, XCircle, Award } from 'lucide-react';

export default function TrustCard({ scanResult, isLoading }) {
  if (!scanResult && !isLoading) {
    return (
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Award size={32} className="text-muted" style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
        <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>GuardX Trust Card Inactive</h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          Scan a prompt to generate AI Trust Score & Threat Explainability breakdown.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--cyan-neon)' }} className="pulsing-indicator">
          Evaluating GuardX Risk Matrix & Trust Index...
        </div>
      </div>
    );
  }

  const { trust_score, threat_level, detected_threats, confidence_score, explanation } = scanResult;

  // Determine colors based on score / risk
  let scoreColor = 'var(--emerald-neon)';
  let riskTagClass = 'bg-emerald-tag';
  let RiskIcon = ShieldCheck;

  if (trust_score < 50 || threat_level === 'Critical' || threat_level === 'High') {
    scoreColor = 'var(--crimson-neon)';
    riskTagClass = 'bg-crimson-tag';
    RiskIcon = ShieldAlert;
  } else if (trust_score < 85 || threat_level === 'Medium') {
    scoreColor = 'var(--gold-neon)';
    riskTagClass = 'bg-gold-tag';
    RiskIcon = AlertTriangle;
  }

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RiskIcon size={20} style={{ color: scoreColor }} />
          <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.5px' }}>
            GUARDX TRUST & EXPLAINABILITY
          </span>
        </div>
        <span className={riskTagClass} style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
          {threat_level.toUpperCase()} RISK
        </span>
      </div>

      {/* Trust Score Visual Meter */}
      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '10px', marginBottom: '16px', border: '1px solid var(--border-glass)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI TRUST SCORE</span>
            <div className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
              {trust_score}<span style={{ fontSize: '1.2rem', opacity: 0.7 }}>/100</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CONFIDENCE</span>
            <div className="font-mono text-cyan" style={{ fontSize: '0.95rem', fontWeight: 700 }}>
              {confidence_score}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            width: `${trust_score}%`,
            height: '100%',
            background: scoreColor,
            borderRadius: '4px',
            boxShadow: `0 0 10px ${scoreColor}`,
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>
      </div>

      {/* Flagged Threat Categories */}
      {detected_threats && detected_threats.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--crimson-neon)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={14} /> FLAGGED THREAT VECTORS ({detected_threats.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {detected_threats.map((threat, idx) => (
              <span key={idx} className="bg-crimson-tag" style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px' }}>
                ⚠️ {threat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Natural Language Reasoning Breakdown */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Info size={14} className="text-cyan" /> EXPLAINABILITY BREAKDOWN
        </div>

        <div style={{
          background: 'rgba(5, 8, 15, 0.7)',
          border: '1px solid var(--border-glass)',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '0.82rem',
          color: 'var(--text-main)',
          lineHeight: '1.5',
          overflowY: 'auto',
          maxHeight: '180px',
          whiteSpace: 'pre-line'
        }}>
          {explanation}
        </div>
      </div>

    </div>
  );
}
