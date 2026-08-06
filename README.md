# 🛡️ GuardX — Privacy-First AI Security & Trust Gateway

> **AI Security, Privacy & Threat Mitigation Gateway**  
> *Real-time threat identification, automated PII redaction, explainable trust scoring, and zero-log data governance.*

---

## 🌟 Overview & Core Features

Organizations using AI face serious risks from credential leaks, prompt injections, and privacy non-compliance. **GuardX** serves as an intelligent security gateway that inspects user prompts, code snippets, logs, or files before they reach LLM models:

1. **Threat Identification (Security)**: Scans for Prompt Injections, Jailbreak payloads, Exfiltration links, Phishing vectors, and Malicious Code.
2. **Safeguarding Sensitive Information (Privacy)**: Automatically redacts PII including Emails, Credit Cards, SSNs, Phone Numbers, AWS Keys, OpenAI Secret Tokens, GitHub PATs, JWTs, and Passwords (`[REDACTED_TYPE]`).
3. **Improving Transparency & Trust (Explainability)**: Displays a **GuardX Trust & Explainability Card** for every scan with a 0-100 Trust Gauge, Risk Rating, Confidence Score, and natural-language explanations.
4. **Responsible & Ethical Execution (Governance)**: Built-in **Zero-Log Memory Mode** toggle, local audit cache purges, and exportable JSON compliance audit logs.
5. **Enterprise Authentication Portal**: Sign In, Sign Up (Registration), and Password Reset powered by Supabase Auth and Express.

---

## 📁 Repository Structure

```
gx/
├── server/
│   ├── server.js            # GuardX Express API Server (/api/shield/analyze, /api/auth/login, /api/auth/signup)
│   ├── securityEngine.js    # Threat detection, PII regex redactor, Gemini AI integration
│   ├── supabaseClient.js    # Supabase database integration & auth client
│   ├── supabase_schema.sql  # SQL schema script for security_logs table
│   ├── package.json         # Node.js Express server dependencies
│   └── .env                 # Environment variables for Gemini & Supabase
├── client/
│   ├── index.html           # HTML entry template with Google Fonts (Outfit & JetBrains Mono)
│   ├── package.json         # React + Vite frontend dependencies
│   ├── vite.config.js       # Vite server configuration with API proxy (port 5000)
│   └── src/
│       ├── main.jsx         # React entry point
│       ├── App.jsx          # GuardX SPA Dashboard container
│       ├── index.css        # Cybersecurity Dark Design System (Glassmorphism & Neon Accents)
│       └── components/
│           ├── Header.jsx           # GuardX branding, stats counter, zero-log toggle
│           ├── LoginPage.jsx        # Sign In, Sign Up, and Forgot Password Auth Portal
│           ├── DemoPresets.jsx      # Attack simulator test scenarios
│           ├── InputTerminal.jsx    # Textarea + File dropzone (.txt, .json, .csv, .log)
│           ├── LiveOutputPanel.jsx  # Split view with interactive hover tooltips
│           ├── TrustCard.jsx        # GuardX trust gauge, risk badges, explainability
│           ├── PrivacyControls.jsx  # Zero-log toggle, purge cache, export audit log
│           └── AuditLogModal.jsx    # Full compliance audit log modal & filter
└── README.md                # GuardX Project Documentation & Run Guide
```

---

## 🚀 Local Run Instructions

### 1. Start Backend API
```bash
cd server
cmd /c "npm run dev"
```
*Backend runs on `http://localhost:5000`.*

### 2. Start Frontend Web App
```bash
cd client
cmd /c "npm run dev"
```
*Frontend runs on `http://localhost:3000`.*

---

## 🌐 Deploying to Vercel

GuardX is fully pre-configured for **1-Click Serverless Deployment on Vercel** (serving both the React frontend and Express serverless API endpoints).

### 🚀 Direct Vercel Links
- **[Deploy Project to Vercel](https://vercel.com/new)**
- **[Vercel Dashboard](https://vercel.com/dashboard)**
- **[Vercel CLI & Docs](https://vercel.com/docs)**

### 🛠️ How to Deploy

#### Option A: Vercel Web Dashboard (Recommended)
1. Push this project repository to **GitHub** / **GitLab** / **Bitbucket**.
2. Open **[Vercel Import Project](https://vercel.com/new)**.
3. Select your repository.
4. Keep the default settings (Vercel automatically detects `vercel.json` and `package.json`).
5. Add the following **Environment Variables** under Project Settings:
   - `GEMINI_API_KEY`: *(Optional)* Your Gemini API key for AI security explainability.
   - `SUPABASE_URL`: *(Optional)* Your Supabase project URL.
   - `SUPABASE_SERVICE_ROLE_KEY`: *(Optional)* Your Supabase service role key.
   - `SUPABASE_ANON_KEY`: *(Optional)* Your Supabase anon key.
6. Click **Deploy**!

#### Option B: Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy to Vercel preview
vercel

# Deploy to Production
vercel --prod
```

