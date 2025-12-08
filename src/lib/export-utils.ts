import type { AnalysisResult, BulkScanItem } from '@/types/analysis';

export async function generatePdfReport(result: AnalysisResult): Promise<void> {
  // Create a printable HTML document
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Could not open print window');
  }

  const threatColors: Record<string, string> = {
    safe: '#22c55e',
    low: '#22c55e',
    medium: '#eab308',
    high: '#f97316',
    critical: '#ef4444',
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>PhishGuard AI - Security Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
          color: #1a1a1a;
        }
        .header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e5e5;
        }
        .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .date { color: #666; font-size: 14px; }
        .threat-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          color: white;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 14px;
        }
        .section { margin: 25px 0; }
        .section-title { 
          font-size: 16px; 
          font-weight: 600; 
          color: #444;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .url-box {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
          font-family: monospace;
          word-break: break-all;
          font-size: 14px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }
        .stat-box {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        .stat-value { font-size: 32px; font-weight: bold; }
        .stat-label { color: #666; font-size: 12px; margin-top: 5px; }
        .warning-list { list-style: none; }
        .warning-item {
          background: #fef2f2;
          border-left: 4px solid #ef4444;
          padding: 10px 15px;
          margin: 8px 0;
          border-radius: 0 8px 8px 0;
        }
        .analysis-text {
          line-height: 1.7;
          color: #333;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          text-align: center;
          color: #999;
          font-size: 12px;
        }
        @media print {
          body { padding: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🛡️ PhishGuard AI</div>
        <div class="date">Report generated: ${new Date().toLocaleString()}</div>
      </div>

      <div class="section">
        <div class="section-title">Scanned URL</div>
        <div class="url-box">${result.url}</div>
      </div>

      <div class="section">
        <div class="stats-grid">
          <div class="stat-box">
            <div class="threat-badge" style="background: ${threatColors[result.threatLevel]}">
              ${result.threatLevel.toUpperCase()}
            </div>
            <div class="stat-label" style="margin-top: 10px">Threat Level</div>
          </div>
          <div class="stat-box">
            <div class="stat-value" style="color: ${threatColors[result.threatLevel]}">${result.riskScore}</div>
            <div class="stat-label">Risk Score</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${result.confidence}%</div>
            <div class="stat-label">Confidence</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">AI Analysis</div>
        <p class="analysis-text">${result.aiAnalysis}</p>
      </div>

      ${result.warnings.length > 0 ? `
        <div class="section">
          <div class="section-title">Detected Issues (${result.warnings.length})</div>
          <ul class="warning-list">
            ${result.warnings.map(w => `<li class="warning-item">${w}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${result.virusTotalResult ? `
        <div class="section">
          <div class="section-title">VirusTotal Results</div>
          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-value" style="color: #ef4444">${result.virusTotalResult.malicious}</div>
              <div class="stat-label">Malicious</div>
            </div>
            <div class="stat-box">
              <div class="stat-value" style="color: #f97316">${result.virusTotalResult.suspicious}</div>
              <div class="stat-label">Suspicious</div>
            </div>
            <div class="stat-box">
              <div class="stat-value" style="color: #22c55e">${result.virusTotalResult.harmless}</div>
              <div class="stat-label">Harmless</div>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="footer">
        <p>This report was generated by PhishGuard AI</p>
        <p>Scan ID: ${result.id || 'N/A'} | Timestamp: ${result.timestamp}</p>
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

export function exportToJson(data: AnalysisResult | AnalysisResult[], filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadBlob(blob, filename);
}

export function exportToCsv(items: BulkScanItem[], filename: string): void {
  const headers = [
    'URL',
    'Status',
    'Threat Level',
    'Risk Score',
    'Confidence',
    'Warnings',
    'Scanned At',
  ];

  const rows = items.map(item => [
    item.url,
    item.status,
    item.result?.threatLevel || 'N/A',
    item.result?.riskScore?.toString() || 'N/A',
    item.result?.confidence?.toString() || 'N/A',
    item.result?.warnings?.join('; ') || '',
    item.result?.timestamp || 'N/A',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
}

export async function copyReportToClipboard(result: AnalysisResult): Promise<void> {
  const text = `
PhishGuard AI Analysis Report
=============================
URL: ${result.url}
Threat Level: ${result.threatLevel.toUpperCase()}
Risk Score: ${result.riskScore}/100
Confidence: ${result.confidence}%
Analyzed: ${new Date(result.timestamp).toLocaleString()}

AI Analysis:
${result.aiAnalysis}

Warnings:
${result.warnings.map(w => `• ${w}`).join('\n')}
  `.trim();

  await navigator.clipboard.writeText(text);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
