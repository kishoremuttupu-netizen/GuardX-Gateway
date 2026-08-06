import React, { useState } from 'react';
import { Eye, ShieldCheck, ShieldAlert, UploadCloud, Link as LinkIcon, Film, Image as ImageIcon, CheckCircle, AlertTriangle, Cpu, Sparkles } from 'lucide-react';

export default function DeepfakeInspector({ onScanComplete }) {
  const [socialUrl, setSocialUrl] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const presets = [
    {
      id: 'df_synthetic_avatar',
      label: '🎭 Synthetic AI Video',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'df_authentic_photo',
      label: '📸 Authentic DSLR Photo',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'df_social_viral',
      label: '📱 Viral X/Twitter Reel',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const handleRunAnalysis = async (payload) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/deepfake/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setResult(data);
      if (onScanComplete) onScanComplete(data);
    } catch (err) {
      alert('Analysis Error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.id);
    setMediaPreview(preset.url);
    handleRunAnalysis({ presetId: preset.id });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      setMediaPreview(evt.target.result);
      handleRunAnalysis({ fileName: file.name, fileType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleSocialInspect = () => {
    if (!socialUrl.trim()) return;
    setMediaPreview('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
    handleRunAnalysis({ url: socialUrl });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px', alignItems: 'start' }}>
      
      {/* Left Column: Input Card */}
      <div style={{ background: '#FAFAFA', border: '1px solid #E4E4E7', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#18181B' }}>
          <Eye style={{ color: '#2563EB', width: '22px', height: '22px' }} />
          Deepfake & Synthetic Media Inspector
        </h3>

        {/* Demo Attack Presets */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#52525B', marginBottom: '8px' }}>Demo Attack Scenarios</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {presets.map(p => (
              <button
                key={p.id}
                onClick={() => handlePresetSelect(p)}
                style={{
                  background: selectedPreset === p.id ? 'rgba(37, 99, 235, 0.1)' : '#FFFFFF',
                  border: selectedPreset === p.id ? '1px solid #2563EB' : '1px solid #E4E4E7',
                  color: selectedPreset === p.id ? '#2563EB' : '#52525B',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* File Upload Dropzone */}
        <div
          onClick={() => document.getElementById('deepfake-file-input').click()}
          style={{
            border: '2px dashed #D4D4D8',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            cursor: 'pointer',
            background: '#FFFFFF',
            transition: '0.2s',
            marginBottom: '20px'
          }}
        >
          <UploadCloud style={{ width: '32px', height: '32px', color: '#2563EB', marginBottom: '8px' }} />
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#18181B' }}>Drop Image or Video Media File Here</div>
          <div style={{ fontSize: '0.78rem', color: '#52525B', marginTop: '4px' }}>Supports .jpg, .png, .webp, .mp4, .mov</div>
          <input id="deepfake-file-input" type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFileUpload} />
        </div>

        {/* Social Media Link Input */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#52525B', marginBottom: '6px' }}>
            Social Media Link Inspector
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="url"
              value={socialUrl}
              onChange={(e) => setSocialUrl(e.target.value)}
              placeholder="Paste URL from X/Twitter, Instagram, TikTok, YouTube Shorts..."
              style={{
                flex: 1,
                padding: '12px 14px',
                background: '#FFFFFF',
                border: '1px solid #E4E4E7',
                borderRadius: '10px',
                color: '#18181B',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSocialInspect}
              disabled={isLoading}
              style={{
                background: '#2563EB',
                color: '#FFF',
                fontWeight: 700,
                padding: '12px 18px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                whitespace: 'nowrap'
              }}
            >
              Inspect Link
            </button>
          </div>
        </div>

      </div>

      {/* Right Column: Output Trust Card & Visual Highlights */}
      <div style={{ background: '#FAFAFA', border: '1px solid #E4E4E7', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#18181B' }}>
          <ShieldAlert style={{ color: '#2563EB', width: '22px', height: '22px' }} />
          GuardX Deepfake Trust Card
        </h3>


        {!result ? (
          <div style={{ color: '#52525B', fontSize: '0.9rem', textAlign: 'center', padding: '50px 0' }}>
            Upload media or select a preset scenario to run Deepfake & Synthetic Media Detection.
          </div>
        ) : (
          <div>
            {/* Visual Highlight Frame Overlay */}
            {mediaPreview && (
              <div style={{ position: 'relative', width: '100%', background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E4E4E7', marginBottom: '16px', minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={mediaPreview} alt="Media preview" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                
                {/* SVG Bounding Boxes Overlay */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none">
                  {result.detection_boxes && result.detection_boxes.map((box, idx) => (
                    <g key={idx}>
                      <rect x={box.x} y={box.y} width={box.width} height={box.height} fill="rgba(239,68,68,0.15)" stroke={box.color || '#EF4444'} strokeWidth="1.5" strokeDasharray="3 3" />
                      <text x={box.x + 2} y={box.y + 8} fill={box.color || '#EF4444'} fontSize="4" fontWeight="bold">{box.label}</text>
                    </g>
                  ))}
                </svg>
              </div>
            )}

            {/* Authenticity Gauge & Bold Result Declaration */}
            {(() => {
              const isAi = result.isAiGenerated !== undefined ? result.isAiGenerated : (result.classification ? !result.classification.includes('Authentic') : false);
              const scoreToDisplay = isAi ? (result.aiScore || 94) : (result.authenticityScore || result.authenticity_score || 98);
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.5rem',
                    background: '#FFFFFF',
                    border: `4px solid ${isAi ? '#DC2626' : '#16A34A'}`,
                    boxShadow: `0 0 15px ${isAi ? 'rgba(220,38,38,0.2)' : 'rgba(22,163,74,0.2)'}`
                  }}>
                    <span style={{ color: isAi ? '#DC2626' : '#16A34A' }}>{scoreToDisplay}%</span>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.8, color: isAi ? '#DC2626' : '#16A34A' }}>{isAi ? 'AI' : 'Real'}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: isAi ? '#DC2626' : '#16A34A', marginBottom: '4px' }}>
                      {isAi
                        ? `This is an AI-generated ${result.media_type === 'video' ? 'Video' : 'Image'}`
                        : `This is a Real ${result.media_type === 'video' ? 'Video' : 'Image'}`}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', background: isAi ? '#FEE2E2' : '#DCFCE7', color: isAi ? '#DC2626' : '#16A34A', border: `1px solid ${isAi ? '#FCA5A5' : '#86EFAC'}` }}>
                        {isAi ? 'AI-Generated / Synthetic' : 'Authentic Media / Verified Real'}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#52525B' }}>Risk Level: {result.risk_level}</span>
                    </div>
                  </div>
                </div>
              );
            })()}


            {/* Explanation */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', padding: '12px 16px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600, color: '#18181B', lineHeight: 1.5, marginBottom: '16px' }}>
              {result.explanation}
            </div>

            {/* Suspected Tools / Generators Breakdown */}
            {result.suspected_tools && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#52525B', marginBottom: '6px' }}>
                  Suspected AI Generators / Hardware Engine:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.suspected_tools.map((tool, tIdx) => (
                    <span key={tIdx} style={{ background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.2)', color: '#2563EB', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                      ⚡ {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Artifact Breakdown Checklist */}
            <div style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '10px', color: '#18181B' }}>Why It Was Flagged (Simple Reasons Checklist):</div>


            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {result.findings && result.findings.map((f, i) => (
                <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#18181B', fontSize: '0.88rem' }}>{f.rule}</div>
                    <div style={{ fontSize: '0.78rem', color: '#52525B' }}>{f.detail}</div>
                  </div>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', background: f.severity === 'Pass' ? '#DCFCE7' : '#FEE2E2', color: f.severity === 'Pass' ? '#16A34A' : '#DC2626' }}>
                    {f.severity}
                  </span>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

    </div>
  );
}

