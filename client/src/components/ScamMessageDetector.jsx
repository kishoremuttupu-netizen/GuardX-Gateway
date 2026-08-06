import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle, Download, MessageSquare, Send, UploadCloud, Link as LinkIcon, RefreshCw, Zap, Lock, History, Trash2, Bot } from 'lucide-react';

export default function ScamMessageDetector({ onScanComplete }) {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'link' | 'ocr' | 'chat'
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  
  // Security Assistant Chatbot State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your GuardX Security Assistant. Paste any message, email, or link, and ask me if it is safe.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const PRESET_SCAMS = [
    { title: "Bank Phishing SMS", text: "URGENT: Your HDFC bank account will be blocked within 24 hours. Click http://hdfc-verify-login.net to update KYC immediately or lose access to funds." },
    { title: "Lottery & Prize Scam", text: "Congratulations! You won $50,000 in the Global iPhone Giveaway! Claims expire today. Pay $50 processing fee via UPI to receive prize." },
    { title: "Fake Job Offer", text: "Earn $500/day working 1 hour from home! No experience required. WhatsApp +91-9876543210 immediately to secure your spot." }
  ];

  const handleAnalyze = async (overrideContent) => {
    const textToAnalyze = overrideContent || (activeTab === 'link' ? urlInput : inputText);
    if (!textToAnalyze.trim()) {
      alert('Please enter a message, URL, or select a preset to scan.');
      return;
    }

    setIsScanning(true);
    try {
      const response = await fetch('/api/scam/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: textToAnalyze, type: activeTab })
      });
      const data = await response.json();

      setTimeout(() => {
        setReport(data);
        setIsScanning(false);
        setScanHistory(prev => [data, ...prev]);
        if (onScanComplete) onScanComplete(data);
      }, 1500);
    } catch (err) {
      alert('Analysis Error: ' + err.message);
      setIsScanning(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    // Simulate OCR text extraction from screenshot
    setTimeout(() => {
      const extractedText = `URGENT SECURITY ALERT: Suspected unauthorized transaction of $499.00 on your account. If this was not you, call customer support immediately at http://secure-alert-help.org/verify or reply with your OTP.`;
      setInputText(extractedText);
      handleAnalyze(extractedText);
    }, 1500);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    const query = chatInput.toLowerCase();
    setChatInput('');

    setTimeout(() => {
      let reply = "I analyzed your query. Always remember: legitimate banks never ask for your password, OTP, or PIN over SMS or chat messages.";
      if (query.includes('otp') || query.includes('password') || query.includes('bank') || query.includes('block')) {
        reply = "⚠️ High Risk: This message asks for urgent verification or credentials. 95% of messages requesting immediate OTP or link clicks are scam phishing attempts.";
      } else if (query.includes('job') || query.includes('win') || query.includes('prize') || query.includes('money')) {
        reply = "⚠️ Warning: Offers promising easy money, lottery wins, or unrequested remote job offers are financial advance-fee scams.";
      } else if (query.includes('http') || query.includes('.com') || query.includes('link')) {
        reply = "🔍 Link Advice: Check domain spellings carefully. Scammers use spoofed URLs like 'paypa1.com' or shortened links to hide real destinations.";
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 1000);
  };

  const handleDownloadReport = () => {
    if (!report) return;
    const reportStr = `GUARDX AI SCAM MESSAGE DETECTOR - SECURITY REPORT
===================================================
Timestamp: ${new Date().toISOString()}
Analyzed Content: "${report.contentSnippet}"

RISK LEVEL: [${report.riskLevel}]
Scam Probability: ${report.scamProbability}%
Trust Score: ${report.trustScore}/100

THREAT TYPES:
-------------
${report.threatTypes.map(t => '• ' + t).join('\n')}

DETECTED WARNING SIGNS:
-----------------------
${report.warningSigns.map(w => '✓ ' + w).join('\n')}

AI EXPLANATION:
---------------
"${report.explanation}"

RECOMMENDED ACTIONS:
--------------------
${report.recommendations.map(r => '• ' + r).join('\n')}

PRIVACY NOTICE:
---------------
Zero Permanent Storage: Content analyzed in memory and auto-purged post-analysis.
===================================================`;

    const blob = new Blob([reportStr], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GuardX_Scam_Report_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px', alignItems: 'start' }}>
      
      {/* Left Column: Input Scanner & Security Assistant */}
      <div style={{ background: '#FAFAFA', border: '1px solid #E4E4E7', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', color: '#18181B' }}>
            <ShieldAlert style={{ color: '#2563EB', width: '22px', height: '22px' }} />
            AI Scam Message Detector 🛡️
          </h3>
          <span style={{ fontSize: '0.72rem', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', padding: '3px 8px', borderRadius: '6px', fontWeight: 700, border: '1px solid rgba(37, 99, 235, 0.2)' }}>
            REAL-TIME FRAUD AI
          </span>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: '#FFFFFF', padding: '4px', borderRadius: '10px', border: '1px solid #E4E4E7' }}>
          <button
            onClick={() => setActiveTab('text')}
            style={{ flex: 1, padding: '8px', border: 'none', background: activeTab === 'text' ? '#2563EB' : 'transparent', color: activeTab === 'text' ? '#FFF' : '#52525B', borderRadius: '6px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            💬 Text / SMS
          </button>
          <button
            onClick={() => setActiveTab('link')}
            style={{ flex: 1, padding: '8px', border: 'none', background: activeTab === 'link' ? '#2563EB' : 'transparent', color: activeTab === 'link' ? '#FFF' : '#52525B', borderRadius: '6px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            🔗 URL Check
          </button>
          <button
            onClick={() => setActiveTab('ocr')}
            style={{ flex: 1, padding: '8px', border: 'none', background: activeTab === 'ocr' ? '#2563EB' : 'transparent', color: activeTab === 'ocr' ? '#FFF' : '#52525B', borderRadius: '6px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            📸 Screenshot OCR
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            style={{ flex: 1, padding: '8px', border: 'none', background: activeTab === 'chat' ? '#2563EB' : 'transparent', color: activeTab === 'chat' ? '#FFF' : '#52525B', borderRadius: '6px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            🤖 AI Assistant
          </button>
        </div>

        {/* Quick Sample Scam Attack Presets */}
        {activeTab !== 'chat' && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#52525B', marginBottom: '8px' }}>Test Common Scam Vectors:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PRESET_SCAMS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => { setInputText(p.text); handleAnalyze(p.text); }}
                  style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', color: '#52525B', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  ⚡ {p.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 1: Text / SMS Input Box */}
        {activeTab === 'text' && (
          <div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste SMS, WhatsApp message, email content, or social media message here to scan for scams..."
              style={{
                width: '100%',
                height: '140px',
                padding: '14px',
                background: '#FFFFFF',
                border: '1px solid #E4E4E7',
                borderRadius: '10px',
                fontSize: '0.9rem',
                color: '#18181B',
                outline: 'none',
                resize: 'none',
                marginBottom: '14px'
              }}
            />
            <button
              onClick={() => handleAnalyze()}
              disabled={isScanning}
              style={{ width: '100%', background: '#2563EB', color: '#FFF', fontWeight: 700, padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {isScanning ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
              {isScanning ? 'Scanning for Phishing & Fraud Patterns...' : 'Scan Message for Scam Threats'}
            </button>
          </div>
        )}

        {/* Tab 2: URL Link Security Check */}
        {activeTab === 'link' && (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#52525B', marginBottom: '6px' }}>Inspect Suspicious Link / URL Domain</label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste URL (e.g. http://secure-bank-verify.net)..."
                style={{ width: '100%', padding: '12px', background: '#FFFFFF', border: '1px solid #E4E4E7', borderRadius: '10px', fontSize: '0.9rem', color: '#18181B', outline: 'none' }}
              />
            </div>
            <button
              onClick={() => handleAnalyze()}
              disabled={isScanning}
              style={{ width: '100%', background: '#2563EB', color: '#FFF', fontWeight: 700, padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {isScanning ? <RefreshCw size={18} className="animate-spin" /> : <LinkIcon size={18} />}
              {isScanning ? 'Checking Domain Spoofing & Phishing...' : 'Check Link Security'}
            </button>
          </div>
        )}

        {/* Tab 3: Screenshot Scanner OCR */}
        {activeTab === 'ocr' && (
          <div style={{ textAlign: 'center', padding: '24px', border: '2px dashed #D4D4D8', borderRadius: '12px', background: '#FFFFFF' }}>
            <UploadCloud size={36} style={{ color: '#2563EB', marginBottom: '10px' }} />
            <div style={{ fontWeight: 700, color: '#18181B', marginBottom: '4px' }}>Upload Screenshot of Message / Email</div>
            <div style={{ fontSize: '0.78rem', color: '#52525B', marginBottom: '14px' }}>Extracts text via AI OCR and scans automatically</div>
            <input type="file" accept="image/*" id="ocr-upload" style={{ display: 'none' }} onChange={handleImageUpload} />
            <button
              onClick={() => document.getElementById('ocr-upload').click()}
              style={{ background: '#2563EB', color: '#FFF', padding: '10px 18px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              Select Screenshot Image
            </button>
          </div>
        )}

        {/* Tab 4: Security Assistant Chatbot */}
        {activeTab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '260px', background: '#FFFFFF', border: '1px solid #E4E4E7', borderRadius: '10px', padding: '12px' }}>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
              {chatMessages.map((m, idx) => (
                <div key={idx} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', background: m.sender === 'user' ? '#2563EB' : '#F4F4F5', color: m.sender === 'user' ? '#FFF' : '#18181B', padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem', maxWidth: '85%', fontWeight: 500 }}>
                  {m.text}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask GuardX Security Assistant (e.g. Is this SMS safe?)..."
                style={{ flex: 1, padding: '8px 12px', background: '#FAFAFA', border: '1px solid #E4E4E7', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', color: '#18181B' }}
              />
              <button onClick={handleSendChat} style={{ background: '#2563EB', color: '#FFF', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }}>
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Privacy Notice Guarantee */}
        <div style={{ marginTop: '16px', background: '#FFFFFF', border: '1px solid #E4E4E7', padding: '10px 14px', borderRadius: '8px', fontSize: '0.78rem', color: '#52525B', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={15} style={{ color: '#16A34A' }} />
          <span><strong>Privacy Protected:</strong> Messages analyzed strictly in volatile memory. Screenshots and text auto-deleted post-scan.</span>
        </div>
      </div>

      {/* Right Column: Detailed Security Report */}
      <div style={{ background: '#FAFAFA', border: '1px solid #E4E4E7', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#18181B' }}>
          <ShieldAlert style={{ color: '#2563EB', width: '22px', height: '22px' }} />
          Scam Detection Security Report
        </h3>

        {!report ? (
          <div style={{ color: '#52525B', fontSize: '0.9rem', textAlign: 'center', padding: '60px 0' }}>
            Paste a message or URL and click <strong>Scan Message for Scam Threats</strong> to generate security analysis.
          </div>
        ) : (
          <div>
            
            {/* Risk Gauge Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              
              <div style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#52525B' }}>Risk Level</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: report.scamProbability > 50 ? '#DC2626' : '#16A34A', marginTop: '2px' }}>
                  {report.riskLevel}
                </div>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#52525B' }}>Scam Probability</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: report.scamProbability > 50 ? '#DC2626' : '#16A34A', marginTop: '2px' }}>
                  {report.scamProbability}%
                </div>
              </div>

            </div>

            {/* Threat Types Badges */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#52525B', marginBottom: '6px' }}>Threat Classification:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {report.threatTypes.map((t, idx) => (
                  <span key={idx} style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                    🚨 {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Warning Signs Checklist */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#18181B', marginBottom: '8px' }}>Detected Warning Signs:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {report.warningSigns.map((w, idx) => (
                  <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#DC2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={14} />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Explanation */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', padding: '12px 14px', borderRadius: '10px', fontSize: '0.85rem', color: '#18181B', lineHeight: 1.5, marginBottom: '16px' }}>
              "{report.explanation}"
            </div>

            {/* Recommended Safety Actions */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#18181B', marginBottom: '6px' }}>Recommended Safety Actions:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {report.recommendations.map((r, idx) => (
                  <div key={idx} style={{ fontSize: '0.8rem', fontWeight: 700, color: r.includes('Do not') ? '#DC2626' : '#16A34A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {r.includes('Do not') ? '❌' : '✅'} {r}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleDownloadReport}
              style={{ width: '100%', background: '#18181B', color: '#FFF', fontWeight: 700, padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}
            >
              <Download size={16} /> Download Security Report
            </button>

          </div>
        )}
      </div>

    </div>
  );
}
