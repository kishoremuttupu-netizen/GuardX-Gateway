import React, { useRef } from 'react';
import { Terminal, Upload, Trash2, Shield, Loader2, FileText } from 'lucide-react';

export default function InputTerminal({ text, setText, onAnalyze, isLoading }) {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setText(content);
      }
    };
    reader.readAsText(file);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="glass-panel" style={{ padding: '20px', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={18} className="text-cyan" />
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>RAW INPUT TERMINAL</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* File Upload Hidden Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".txt,.json,.csv,.log,.md" 
            style={{ display: 'none' }} 
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '5px 10px' }}
          >
            <Upload size={14} /> Upload File
          </button>

          {text && (
            <button 
              type="button"
              onClick={() => setText('')}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '5px 10px', color: 'var(--crimson-neon)' }}
            >
              <Trash2 size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Textarea Input */}
      <div style={{ position: 'relative', flexGrow: 1, minHeight: '220px', display: 'flex', flexDirection: 'column' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste prompt, confidential code, logs, or customer ticket here for real-time security scanning & PII redaction..."
          className="font-mono"
          style={{
            width: '100%',
            flexGrow: 1,
            minHeight: '220px',
            background: 'rgba(5, 8, 15, 0.7)',
            border: '1px solid var(--border-glass)',
            borderRadius: '8px',
            padding: '14px',
            color: 'var(--text-main)',
            fontSize: '0.88rem',
            lineHeight: '1.5',
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--cyan-neon)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
        />
      </div>

      {/* Footer Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Stats: <span className="font-mono text-cyan">{charCount}</span> chars | <span className="font-mono text-cyan">{wordCount}</span> words
        </div>

        <button
          onClick={onAnalyze}
          disabled={!text.trim() || isLoading}
          className="btn-primary"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="pulsing-indicator" style={{ animation: 'spin 1s linear infinite' }} />
              Scanning Payload...
            </>
          ) : (
            <>
              <Shield size={16} />
              SHIELD SCAN & SANITIZE
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
