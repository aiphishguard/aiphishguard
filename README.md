# AI Phish Guard

**See the phish before you click.**

A rebuilt, SOC-grade phishing detection console. Ten specialized models vote on every URL — lexical structure, homographs, typosquats, brand impersonation, kit patterns, entropy, shorteners, TLD risk, and live DNS — then explain the score in language a human can brief.

Originally an academic project at The Islamia University of Bahawalpur. This version restores the missing application (the first commit shipped configs only) and pushes the product into a real operations surface: bulk IR, email lure analysis, an academy, and a threat-intel wire.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

## What is new in v2

- **On-device ensemble** of 10 named detectors with independent verdicts, confidence, and reasoning
- **Homograph + punycode folding** against 40+ high-value brands (banks, Big Tech, crypto, shipping)
- **Live DNS** over Cloudflare DoH (A/AAAA/MX/NS/TXT, SPF/DMARC)
- **Email & SMS analyzer** — urgency, BEC, OTP harvest, Reply-To mismatch, then fan-out URL scans
- **Bulk scanner** (up to 50 URLs) with JSON/CSV export
- **Dashboard & history** persisted locally (optional Supabase sync)
- **Academy** — interactive “spot the phish” drills
- **Threat wire** — campaign-pattern intelligence feed
- **Command palette** (`Ctrl/⌘ K`) and `/` to focus the scanner
- Privacy-first: analysis runs in the browser; history never leaves the device unless you export it

## Surfaces

| Route | Purpose |
|---|---|
| `/` | Hero scanner, gauge, radar, ensemble, DNS |
| `/dashboard` | Risk over time, distribution, recent activity |
| `/history` | Search, filter, export, re-open a report |
| `/bulk` | Batch IR |
| `/email` | Message lure analysis |
| `/intel` | Campaign feed |
| `/learn` | Academy |
| `/feedback` | Product signal |
| `/privacy` | Policy |

## Stack

React 18, TypeScript, Vite 5, Tailwind, shadcn/ui, Recharts, TanStack Query, React Router, optional Supabase.

## Run

```bash
npm install
cp .env.example .env   # optional — app runs fully without Supabase
npm run dev            # http://localhost:8080
```

Production build:

```bash
npm run build
npm run preview
```

## How the engine scores a URL

1. Canonicalize and block dangerous protocols (`javascript:`, `data:`, …)
2. Extract 40+ lexical / structural features
3. Fold homoglyphs, measure Levenshtein distance to watched brands
4. Probe DNS (skipped for IP literals and large bulk jobs)
5. Ten weighted models vote benign / suspicious / malicious
6. Map the weighted score to **safe · low · medium · high · critical** and emit an explainable brief

This is a heuristic ensemble, not a hosted LLM and not a replacement for a full secure-email gateway. It is designed to be *legible* — every point on the gauge maps to a named factor.

## Team

Basit Ali · Ali Hassan · Hassam Mehmood  
Supervisor: Engr. Farhan Hassan  
Department of Cyber Security and Digital Forensics, The Islamia University of Bahawalpur

## License

Academic / research use. See the in-app privacy policy for data handling.
