import React from 'react';
import { Shield, Lock, FileText, User, LogOut } from 'lucide-react';

export default function Header({ stats, zeroLogMode, setZeroLogMode, onOpenAuditLog, user, onLogout }) {
  return (
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="glow-cyan" style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(0,240,255,0.2) 0%, rgba(0,255,157,0.1) 100%)',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={26} className="text-cyan" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                Guard<span className="text-cyan">X</span>
              </h1>
              <span className="bg-emerald-tag pulsing-indicator" style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                GATEWAY ACTIVE
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Privacy-First AI Gateway • Real-Time Threat Identification & PII Redaction
            </p>
          </div>
        </div>

        {/* Live Counters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(0,0,0,0.25)', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SCANNED</div>
            <div className="font-mono text-cyan" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{stats.scanned}</div>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-glass)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PII MASKED</div>
            <div className="font-mono text-emerald" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{stats.piiRedacted}</div>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-glass)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>THREATS BLOCKED</div>
            <div className="font-mono text-crimson" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{stats.threatsBlocked}</div>
          </div>
        </div>

        {/* Header Actions & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* User Profile Badge */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)', padding: '5px 10px', borderRadius: '8px' }}>
              <User size={15} className="text-cyan" />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, lineHeight: 1 }}>{user.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{user.role}</div>
              </div>
            </div>
          )}

          {/* Zero Log Toggle */}
          <button 
            onClick={() => setZeroLogMode(!zeroLogMode)}
            className="btn-secondary"
            style={{ 
              borderColor: zeroLogMode ? 'var(--emerald-neon)' : 'var(--border-glass)',
              background: zeroLogMode ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 255, 255, 0.05)'
            }}
            title="Toggle Zero-Server Memory Mode"
          >
            <Lock size={15} className={zeroLogMode ? 'text-emerald' : 'text-muted'} />
            <span style={{ fontSize: '0.82rem' }}>
              Zero-Log: <strong className={zeroLogMode ? 'text-emerald' : 'text-muted'}>{zeroLogMode ? 'ON' : 'OFF'}</strong>
            </span>
          </button>

          {/* Audit Log Trigger */}
          <button onClick={onOpenAuditLog} className="btn-secondary">
            <FileText size={15} />
            <span style={{ fontSize: '0.82rem' }}>Audit Log</span>
          </button>

          {/* Logout Button */}
          {user && (
            <button onClick={onLogout} className="btn-secondary" style={{ padding: '6px 10px', color: 'var(--crimson-neon)' }} title="Sign Out">
              <LogOut size={15} />
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
