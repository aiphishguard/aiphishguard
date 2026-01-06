# 🛡️ PhishGuard AI

<div align="center">

**AI-Powered Phishing Detection System**

An advanced machine learning-based phishing URL detection system that leverages Ensemble Of 10+ ML Models Trained on real world dataset, multi-vector analysis, and real-time threat intelligence to protect users from malicious websites.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=flat&logo=supabase)](https://supabase.com/)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Edge Functions](#-edge-functions)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [ML/AI Approach](#-mlai-approach)
- [Security Features](#-security-features)
- [Screenshots](#-screenshots)
- [Team](#-team)
- [License](#-license)

---

## ✨ Features

### Core Analysis Engine
- **🤖 AI-Powered Threat Assessment** - Ensemble Of 10+ ML Models Trained on real world dataset for intelligent URL classification with confidence scoring
- **📊 Multi-Vector Analysis** - Combines 30+ URL features for comprehensive threat detection
- **⚡ Real-Time Scanning** - Instant analysis with detailed threat breakdown

### Advanced Detection Capabilities
- **📄 Content Analysis** - Deep webpage inspection for suspicious forms, scripts, iframes, and hidden elements
- **🌐 Language Detection** - Identifies language mismatches between domain TLD and page content (phishing indicator)
- **🔒 SSL Certificate Analysis** - Validates certificate chain, expiration, and issuer authenticity
- **🔍 DNS Analysis** - Verifies SPF, DKIM, and DMARC records for email authentication
- **🔗 Redirect Chain Tracking** - Follows and analyzes URL redirect paths for suspicious behavior
- **🦠 VirusTotal Integration** - Scans URLs against 70+ antivirus engines for known threats

### User Features
- **📦 Bulk URL Scanning** - Scan multiple URLs simultaneously with batch processing
- **📜 Scan History** - Persistent storage with search, filtering, and pagination
- **📤 Export Options** - Download reports in PDF, JSON, or CSV formats
- **📈 Dashboard Analytics** - Visual statistics, charts, and threat distribution graphs
- **💬 Feedback System** - Submit bug reports, feature requests, and suggestions

### Visualization & UX
- **🎯 Animated Risk Gauge** - Dynamic circular risk score visualization
- **📊 Threat Radar Chart** - Visual breakdown of threat factors
- **⏱️ Analysis Timeline** - Step-by-step analysis progress tracking
- **💡 Smart Recommendations** - AI-generated security advice based on findings

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI component library |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Accessible component library |
| **Recharts** | Data visualization |
| **React Query** | Server state management |
| **React Router** | Client-side routing |

### Backend
| Technology | Purpose |
|------------|---------|
| **Supabase Edge Functions** | Serverless TypeScript functions |
| **Deno Runtime** | Secure JavaScript runtime |
| **PostgreSQL** | Relational database |
| **Row Level Security** | Database access control |

### AI & APIs
| Service | Purpose |
|---------|---------|
| **VirusTotal API** | Malware reputation scanning |
| **SSL Labs API** | Certificate validation |
| **Cloudflare DNS** | DNS record analysis |

---

## 📁 Project Structure

```
phishguard-ai/
├── public/                     # Static assets
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/             # React UI components
│   │   ├── ui/                 # shadcn/ui base components
│   │   ├── AnalysisResults.tsx # Main results display
│   │   ├── AnalysisTimeline.tsx
│   │   ├── AnimatedRiskScore.tsx
│   │   ├── BulkUrlScanner.tsx
│   │   ├── ContentAnalysisCard.tsx
│   │   ├── DNSAnalysisCard.tsx
│   │   ├── ExportOptions.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── LanguageDetectionCard.tsx
│   │   ├── Navbar.tsx
│   │   ├── RedirectChainCard.tsx
│   │   ├── RiskGauge.tsx
│   │   ├── ScanHistoryCard.tsx
│   │   ├── SmartRecommendations.tsx
│   │   ├── SSLAnalysisCard.tsx
│   │   ├── ThreatLevelBadge.tsx
│   │   ├── ThreatRadarChart.tsx
│   │   ├── UrlFeaturesGrid.tsx
│   │   ├── UrlScanner.tsx
│   │   └── VirusTotalCard.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAnalysis.ts      # URL analysis logic
│   │   ├── useBulkAnalysis.ts  # Bulk scanning logic
│   │   └── useScanHistory.ts   # History management
│   ├── lib/                    # Utility functions
│   │   ├── export-utils.ts     # PDF/CSV/JSON export
│   │   ├── url-analyzer.ts     # URL feature extraction
│   │   ├── url-validation.ts   # Client-side validation
│   │   └── utils.ts            # General utilities
│   ├── pages/                  # Application pages
│   │   ├── Index.tsx           # Home page
│   │   ├── Dashboard.tsx       # Analytics dashboard
│   │   ├── History.tsx         # Scan history
│   │   ├── BulkScanner.tsx     # Bulk scanning
│   │   ├── Feedback.tsx        # Feedback form
│   │   └── NotFound.tsx        # 404 page
│   ├── types/                  # TypeScript definitions
│   │   └── analysis.ts         # Analysis result types
│   ├── integrations/           # External integrations
│   │   └── supabase/           # Supabase client & types
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── supabase/
│   ├── functions/              # Edge functions
│   │   ├── _shared/            # Shared utilities
│   │   │   └── url-validator.ts
│   │   ├── analyze-url/        # Main AI analysis
│   │   ├── content-analysis/   # Webpage analysis
│   │   ├── ssl-analysis/       # SSL validation
│   │   ├── dns-analysis/       # DNS record checks
│   │   ├── redirect-analysis/  # Redirect tracking
│   │   └── virustotal-scan/    # VirusTotal API
│   └── migrations/             # Database migrations
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

---

## 🗄️ Database Schema

### `scan_history`
Stores all URL scan results with comprehensive analysis data.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `url` | TEXT | Scanned URL |
| `threat_level` | TEXT | safe, low, medium, high, critical |
| `risk_score` | INTEGER | 0-100 risk score |
| `confidence` | INTEGER | AI confidence percentage |
| `analysis` | TEXT | AI-generated analysis summary |
| `url_features` | JSONB | Extracted URL features |
| `content_analysis` | JSONB | Webpage content analysis |
| `language_detection` | JSONB | Language detection results |
| `ssl_analysis` | JSONB | SSL certificate data |
| `dns_analysis` | JSONB | DNS record analysis |
| `redirect_analysis` | JSONB | Redirect chain data |
| `virustotal_result` | JSONB | VirusTotal scan results |
| `threat_factors` | JSONB | Individual threat scores |
| `warnings` | TEXT[] | Warning messages |
| `analysis_steps` | JSONB | Processing timeline |
| `bulk_scan_id` | UUID | FK to bulk_scans (optional) |
| `scanned_at` | TIMESTAMP | Scan timestamp |

### `bulk_scans`
Manages bulk scanning batches.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Batch name (optional) |
| `status` | TEXT | pending, processing, completed |
| `total_urls` | INTEGER | Total URLs in batch |
| `completed` | INTEGER | Completed scans count |
| `summary` | JSONB | Aggregated results |
| `created_at` | TIMESTAMP | Creation timestamp |

### `feedback`
User feedback and suggestions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | User name |
| `email` | TEXT | User email |
| `feedback_type` | TEXT | bug, feature, improvement, other |
| `subject` | TEXT | Feedback subject |
| `message` | TEXT | Feedback content |
| `created_at` | TIMESTAMP | Submission timestamp |

---

## ⚡ Edge Functions

### `analyze-url`
Main AI-powered threat assessment endpoint.
- Extracts 30+ URL features
- Calls Google Gemini for classification
- Aggregates results from other analysis functions
- Returns threat level, risk score, and recommendations

### `content-analysis`
Deep webpage content inspection.
- Fetches and parses webpage HTML
- Detects suspicious forms, scripts, iframes
- Performs language detection
- Identifies hidden elements and obfuscation

### `ssl-analysis`
SSL/TLS certificate validation.
- Validates certificate chain
- Checks expiration dates
- Verifies issuer authenticity
- Detects self-signed certificates

### `dns-analysis`
DNS record security analysis.
- Queries SPF records
- Validates DKIM configuration
- Checks DMARC policies
- Identifies DNS anomalies

### `redirect-analysis`
URL redirect chain tracking.
- Follows up to 10 redirects
- Detects suspicious redirect patterns
- Identifies cross-domain redirects
- Flags redirect loops

### `virustotal-scan`
VirusTotal API integration.
- Scans URLs against 70+ engines
- Returns malicious/suspicious counts
- Provides vendor-specific results
- Caches results for efficiency

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **bun** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/phishguard-ai.git
   cd phishguard-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
# Output in dist/ directory
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/public key |
| `VIRUSTOTAL_API_KEY` | Yes | VirusTotal API key for malware scanning |
| `LOVABLE_API_KEY` | Yes | Lovable AI gateway key for Gemini access |

> **Note:** Edge function secrets are managed separately in the Supabase dashboard or Lovable Cloud settings.

---

## 🧠 ML/AI Approach

PhishGuard AI uses an **ensemble approach** combining multiple analysis vectors:

### 1. URL Feature Extraction (30+ Features)
- Protocol analysis (HTTP vs HTTPS)
- Domain entropy calculation
- Subdomain depth counting
- Path length and complexity
- Query parameter analysis
- Special character detection
- IP address detection
- TLD risk scoring

### 2. Client-Side Validation (18+ Checks)
- URL format validation
- Private IP blocking
- Suspicious TLD detection
- Punycode/IDN detection
- URL shortener detection
- Brand impersonation patterns
- Excessive subdomain detection
- Suspicious keyword matching

### 3. AI Classification
- Google Gemini 2.5 Flash model
- Multi-class threat classification
- Confidence scoring
- Natural language explanations
- Context-aware recommendations

### 4. External Intelligence
- VirusTotal reputation (70+ engines)
- SSL certificate validation
- DNS security analysis
- Redirect behavior analysis
- Content-based heuristics

---

## 🔒 Security Features

### Input Validation
- Comprehensive URL sanitization
- Private IP range blocking (SSRF protection)
- Protocol whitelisting (HTTP/HTTPS only)
- Maximum URL length enforcement

### Database Security
- Row Level Security (RLS) policies
- Public read access for scan history
- Write-only feedback table
- No direct user data exposure

### Edge Function Security
- CORS header validation
- Request rate limiting (via Supabase)
- API key protection for external services
- Error message sanitization

### Frontend Security
- No sensitive data in client storage
- HTTPS-only external requests
- XSS prevention via React
- CSP headers (when deployed)

---

## 📸 Screenshots

<div align="center">

### Home Page
*AI-powered phishing detection interface with hero section and URL scanner*

![Home Page](public/screenshots/home-page.png)

### Dashboard
*Real-time analytics with scan activity charts and threat distribution*

![Dashboard](public/screenshots/dashboard.png)

### Scan History
*Browse and search all previously scanned URLs with threat levels*

![Scan History](public/screenshots/history.png)

### Bulk Scanner
*Multi-URL scanning interface with file upload and batch processing*

![Bulk Scanner](public/screenshots/bulk-scanner.png)

</div>

> Add screenshots by placing images in a `/screenshots` directory and updating the paths above.

---

## 👥 Team

### Core Development Team

<table>
  <tr>
    <td align="center">
      <strong>Basit Ali</strong><br>
      <sub>ML Engineer</sub>
    </td>
    <td align="center">
      <strong>Ali Hassan</strong><br>
      <sub>Full Stack Developer</sub>
    </td>
    <td align="center">
      <strong>Hassam Mehmood</strong><br>
      <sub>Backend Developer</sub>
    </td>
  </tr>
</table>

### Academic Supervision

**Engr. Farhan Hassan**  
*Project Supervisor*  
Department of Cyber Security And Digital Forensics  
The Islamia University of Bahawalpur

---

## 📄 License

This project is developed as part of an academic program at The Islamia University of Bahawalpur.

---

<div align="center">

**Built with ❤️ By Basit Ali(Anon)**

</div>
